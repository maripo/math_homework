
function randomPick (array, count) {
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
}

function shuffle (array, randCoeff) {
  let shuffler = [];
  for (let index=0; index<array.length; index++) {
    shuffler.push({val:array[index], rand:randCoeff*Math.random()+(1-randCoeff)*(index/array.length)});
  }
  shuffler.sort((a,b)=>{return a.rand-b.rand});
  return shuffler.map((obj)=>{return obj.val});
}
class WeighedRandom {
  constructor (range, outputCount) {
    this.range = range;
    this.outputCount = outputCount;
    this.reset()
  }
  reset () {
    this.value = null;
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
        // console.log(this.nums.join(","))
    } else {
        this.nums.splice(nextIndex, 0, num);
    }
    return num;
  }
  // For new FW
  get () {
    if (!this.value) {
      this.value = this.pick();
    }
    return this.value;
  }
  next () {
    this.value = this.pick();
  }
}
const DEFAULT_PAGES = 2;
const PROBLEMS_PER_PAGE = 8;

class HtmlRenderer {
  constructor () {
    this.root = document.body;//document.getElementById("pages");
  }
  createElement(value, className) {
    if (typeof(value)=='object') {
      return value;
    } else {
      const element = document.createElement("div");
      element.className = className;
      element.innerHTML = value;
      return element;
    }
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
    const element = this.createElement("", "problem problem-" + pageIndex);
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
  setGrid (pageIndex, problemsPerPage, maxWidths) {
    const MIN_LINE_HEIGHT_RATIO = 1.6;
    const MAX_FONT_SIZE = 48;
    maxWidths.forEach((width, colIndex)=>{
      const emValue = width * 0.70;
      const className = "c-" + pageIndex + "-" + colIndex;
      const line = "." + className + "{width:" + emValue + "em;}";
      document.getElementById("style").innerHTML += line;
    });
    // TODO consider footer & header!
    const fontSize = Math.min(MAX_FONT_SIZE, (720-54) / (problemsPerPage * MIN_LINE_HEIGHT_RATIO));
    const line = ".problem-" + pageIndex + "{font-size:" + fontSize + "px;}";
    document.getElementById("style").innerHTML += line;
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
  constructor (value, invisible) {
    this.size = ('' + value).length;
    this.invisible = invisible===true;
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
    return (this.invisible) ? "space" : "box";
  }
}

const generateSuiteLegacy = (option, generator, renderer) => {
  const pages = option.pages || DEFAULT_PAGES;
  const problemsPerPage = option.problemsPerPage || PROBLEMS_PER_PAGE;
  const content = generator.generate(pages, problemsPerPage, option);
  
  renderer.renderSuiteHeader();
  renderer.resetGrid();
  content.forEach((page, pageIndex)=>{
    renderer.renderPageHeader(option.header);
    // Geometry
    let maxWidths = [];
    page.forEach((problem, problemIndex)=>{
      
      problem.forEach((item, colIndex)=>{
        if (maxWidths.length < colIndex+1) {
          maxWidths.push(0);
        }
        maxWidths[colIndex] = Math.max(maxWidths[colIndex], item.relativeWidth());
      });
    });
    // console.log(maxWidths);
    renderer.setGrid(pageIndex, problemsPerPage, maxWidths);
    // Geometry -> Stylesheet
    
    page.forEach((problem, problemIndex)=>{
      renderer.renderProblem(problem, pageIndex, problemIndex);
    });
    renderer.renderPageFooter(option.footer);
  });
  
  renderer.renderSuiteFooter();
};
const generateSuite = (option, generator, renderer) => {
  const keys = Object.keys(option.fields)
  let rands = {};
  let values = {};
  const pages = option.pages || DEFAULT_PAGES;
  const problemsPerPage = option.problemsPerPage || PROBLEMS_PER_PAGE;
  keys.forEach((key)=>{
    // randReset && randNext
    const field = option.fields[key];
    let count;
    if (field.randNext == "page") {
      count = pages;
    } else if (field.randReset == "page") {
      count = problemsPerPage;
    } else {
      count = pages * problemsPerPage;
    }
    rands[key] = new WeighedRandom(field, count);
  });
  // get & next
  let content = [];
  for (let pageIndex = 0; pageIndex<pages; pageIndex++) {
    let problems = [];
    for (let problemIndex = 0; problemIndex<problemsPerPage; problemIndex++) {
      keys.forEach((key)=>{
        values[key] = rands[key].get();
      });
      let problem = generator.generateProblem(problemIndex, values, option);
      problems.push(problem);
      keys.forEach((key)=>{
        if (option.fields[key].randNext != "page") {
          rands[key].next();
        }
      });
    }
    keys.forEach((key)=>{
      if (option.fields[key].randNext == "page") {
        rands[key].next();
      }
      if (option.fields[key].randReset == "page") {
        rands[key].reset();
      }
    });
    content.push(problems);
  }
  renderer.renderSuiteHeader();
  renderer.resetGrid();
  content.forEach((page, pageIndex)=>{
    renderer.renderPageHeader(option.header);
    // Geometry
    let maxWidths = [];
    page.forEach((problem, problemIndex)=>{
      
      problem.forEach((item, colIndex)=>{
        if (maxWidths.length < colIndex+1) {
          maxWidths.push(0);
        }
        maxWidths[colIndex] = Math.max(maxWidths[colIndex], item.relativeWidth());
      });
    });
    // console.log(maxWidths);
    renderer.setGrid(pageIndex, problemsPerPage, maxWidths);
    // Geometry -> Stylesheet
    
    page.forEach((problem, problemIndex)=>{
      renderer.renderProblem(problem, pageIndex, problemIndex);
    });
    renderer.renderPageFooter(option.footer);
  });
  
  renderer.renderSuiteFooter();
}

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
    if (problemGenerator.useLegacyFW && problemGenerator.useLegacyFW()) {
      console.log("Use legacy FW.");
      generateSuiteLegacy(option, problemGenerator, new HtmlRenderer());
    } else {
      console.log("Use new FW.");
      generateSuite(option, problemGenerator, new HtmlRenderer());
    }
    localStorage.setItem(storageKey, str);
  });
  document.getElementById(uiPrefix + "_reset").addEventListener('click', ()=>{
    localStorage.removeItem(storageKey);
    location.reload();
  });
}