const DEFAULT_PAGES = 2;
const PROBLEMS_PER_PAGE = 8;

class HtmlRenderer {
  constructor () {
    this.root = document.body;//document.getElementById("pages");
  }
  createElement(value, className) {
    const element = document.createElement("div");
    element.className = className;
    element.innerHTML = value;
    return element;
  }
  renderSuiteHeader () {
    this.root.innerHTML = "";
  }
  renderSuiteFooter () {
  }
  renderPageHeader (content) {
    this.page = this.createElement("", "page");
    if (content!=null) {
      const header = this.createElement("", "page__header");
      const numRef = this.createElement("", "num-ref");
      let i = content.from;
      while (i <= content.to) {
        numRef.appendChild(this.createElement(i, "num-ref__num"));
        i += 1;
      }
      header.appendChild(numRef);
      this.page.appendChild(header);
      
    }
    this.pageBody = this.createElement("", "page__body");
    this.page.appendChild(this.pageBody);
  }
  renderPageFooter(content) {
    this.root.appendChild(this.page);
  }
  renderProblem(items, pageIndex, problemIndex) {
    /*
    {
      index: problemIndex+1,
      first: first,
      second: second
    }
    */
    const compact = false; //option.hasHeader || option.hasFooter;
    const element = this.createElement("", "problem" + ((compact) ? " problem--compact":" problem--normal"));
    items.forEach((item, index)=>{
      let classes = ["problem__item"];
      classes.push("problem__item--" + item.classId());
      classes.push("c-" + pageIndex + "-" +index);
      classes.push("a-" + item.align());
      element.appendChild(this.createElement(item.content(), classes.join(" ")));
    });
    this.pageBody.appendChild(element);
  }
  resetGrid () {
    document.getElementById("style").innerHTML = "";
  }
  setGrid (pageIndex, maxWidths) {
    maxWidths.forEach((width, colIndex)=>{
      const emValue = width * 0.70;
      const className = "c-" + pageIndex + "-" + colIndex;
      const line = "." + className + "{width:" + emValue + "em;}"
      document.getElementById("style").innerHTML += line;
    });
  }
}

const shuffle = (array, randCoeff) => {
  let shuffler = [];
  for (let index=0; index<array.length; index++) {
    shuffler.push({val:array[index], rand:randCoeff*Math.random()+(1-randCoeff)*(index/array.length)});
  }
  shuffler.sort((a,b)=>{return a.rand-b.rand});
  return shuffler.map((obj)=>{return obj.val});
};
const randomPick = (array, count) => {
  let indeces = [];
  for (let i=0; i<array.length; i++) {
    indeces.push(i);
  }
  indeces = shuffle(indeces, 1);
  indeces.splice(count);
  indeces = indeces.sort((a,b)=>{return a-b});
  let newArray = [];
  for (let i=0; i<count; i++) {
    newArray.push(array[indeces[i]]);
  }
  return newArray;
};

class WeighedRandom {
  constructor (range, outputCount) {
    this.range = range;
    this.outputCount = outputCount;
    this.reset()
  }
  reset () {
    var nums = [];
    this.size = this.range.to - this.range.from + 1;
    const randCoeff = (this.range.randCoeff >= 0) ? this.range.randCoeff : 1;
    for (let i=this.range.from; i<=this.range.to; i++) {
      nums.push(i);
    }
    nums = shuffle(nums, randCoeff);
    if (this.outputCount > 0 && this.outputCount < nums.length) {
      // Pick random
      nums = randomPick(nums, this.outputCount);
      this.fullRange = true;
    }
    this.nums = nums;
  }
  nextIndex () {
    const from = Math.floor(this.nums.length/2);
    const to = this.nums.length - 1;
    if (from == to) {
      return from;
    }
    return from + Math.floor(Math.random() * (to + 1 - from));
  }
  pick () {
    let num = this.nums[0];
    // Insert to random index in the 
    const nextIndex = this.nextIndex();
    this.nums.splice(0,1);
    if (this.fullRange) {
      console.log(this.nums.join(","))
    } else {
      this.nums.splice(nextIndex, 0, num);
      
    }
    return num;
  }
}


/* Items */
class ItemIndex {
  constructor (index) {
    this.index = index;
    this.label = "(" + (index+1) + ")";
  }
  align () {
    return 'center';
  }
  relativeWidth () {
    return this.label.length;
  }
  content () {
    return this.label;
  }
  classId () {
    return "index";
  }
}
class ItemOperand {
  constructor (character) {
    this.character = character;
  }
  align () {
    return 'center';
  }
  relativeWidth () {
    return 1.1;
  }
  content () {
      return this.character;
  }
  classId () {
    return "operand";
  }
}
class ItemNumber {
  constructor (value) {
    // this.value = value;
    this.value = value;
  }
  align () {
    return 'right';
  }
  relativeWidth () {
    return this.content().length;
  }
  content () {
    return ''+ this.value;
  }
  classId () {
    return "number";
  }
}
class ItemBox {
  constructor (answer) {
    this.size = (''+answer).length;
  }
  align () {
    return 'center';
  }
  relativeWidth () {
    return this.size * 1.1 + 0.5;
  }
  content () {
    return " ";
  }
  classId () {
    return "box";
  }
}

const generateSuite = (option, generator, renderer) => {
  const pages = option.pages || DEFAULT_PAGES;
  renderer.renderSuiteHeader();
  const content = generator.generate(pages, option);
  
  renderer.resetGrid();
  content.forEach((page, pageIndex)=>{
    renderer.renderPageHeader(option.header);
    // Gemetry
    let maxWidths = [];
    page.forEach((problem, problemIndex)=>{
      problem.forEach((item, colIndex)=>{
        if (maxWidths.length < colIndex+1) {
          maxWidths.push(0);
        }
        maxWidths[colIndex] = Math.max(maxWidths[colIndex], item.relativeWidth());
      });
    });
    console.log(maxWidths);
    renderer.setGrid(pageIndex, maxWidths);
    // Geometry -> Stylesheet
    
    page.forEach((problem, problemIndex)=>{
      renderer.renderProblem(problem, pageIndex, problemIndex);
    });
    renderer.renderPageFooter(option.footer);
  });
  
  renderer.renderSuiteFooter();
};

const initGenerator = (problemGenerator, uiPrefix, storageKey)=>{
  let saved = localStorage.getItem(storageKey);
  if (saved) {
    document.getElementById(uiPrefix + "_conf").value = saved;
  }
  document.getElementById(uiPrefix + "_generate").addEventListener('click', ()=>{
    const str = document.getElementById(uiPrefix + "_conf").value;
    let option;
    try {
      option = JSON.parse(str);
    } catch (e) {
      return;
    }
    generateSuite(option, problemGenerator, new HtmlRenderer());
    localStorage.setItem(storageKey, str);
  });
  document.getElementById(uiPrefix + "_reset").addEventListener('click', ()=>{
    localStorage.removeItem(storageKey);
    location.reload();
  });
}
initGenerator(new BasicAddition(), 'addition', 'mathHomework');
initGenerator(new BasicSubtraction(), 'subtraction', 'mathHomeworkSubtraction');