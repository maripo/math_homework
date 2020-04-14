const DEFAULT_PAGES = 2;
const PROBLEMS_PER_PAGE = 8;

class PugRenderer {
  constructor () {
  }
  renderSuiteHeader () {
    console.log("extends ./layout");
    console.log("block pages");
  }
  renderSuiteFooter () {
  }
  renderPageHeader () {
    console.log("  .page");
  }
  renderPageFooter() {
    
  }
  renderProblem(number, first, second) {
    const indent = "    ";
    console.log("%s.problem", indent);
    console.log("%s  .problem__number (%d)", indent, number);
    console.log("%s  .problem__first %d", indent, first);
    console.log("%s  .problem__mark +", indent);
    console.log("%s  .problem__second %d", indent, second);
    console.log("%s  .problem__mark =", indent);
  }
}

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
  renderPageHeader () {
    this.page = this.createElement("", "page");
  }
  renderPageFooter() {
    this.root.appendChild(this.page);
  }
  renderProblem(number, first, second) {
    const element = this.createElement("", "problem");
    element.appendChild(this.createElement(("("+number+")"), "problem__number"));
    element.appendChild(this.createElement(first, "problem__first"));
    element.appendChild(this.createElement("+", "problem__mark"));
    element.appendChild(this.createElement(second, "problem__second"));
    element.appendChild(this.createElement("=", "problem__mark"));
    this.page.appendChild(element);
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

const generatePage = (first, second, renderer) => {
  renderer.renderPageHeader();
  for (let problemIndex=0; problemIndex<PROBLEMS_PER_PAGE; problemIndex++) {
    const valFirst = first.pick();
    const valSecond = second.pick();
    renderer.renderProblem(problemIndex+1, valFirst, valSecond);
  }
  renderer.renderPageFooter();
};
const generateSuite = (option, renderer) => {
  const pages = option.pages || DEFAULT_PAGES;
  renderer.renderSuiteHeader();
  let first = new WeighedRandom(option.first, (option.first.resetRandom)?PROBLEMS_PER_PAGE:PROBLEMS_PER_PAGE*pages);
  if (option.randomizeSecond) {
    let second = new WeighedRandom(option.second);
    for (let pageIndex=0; pageIndex<pages; pageIndex++) {
      generatePage(first, second, renderer);
      if (option.first.resetRandom) {
        first.reset();
      }
    }
  } else {
    const secondRand = new WeighedRandom(option.second);
    for (let pageIndex=0; pageIndex<pages; pageIndex++) {
      let secondVal = secondRand.pick();
      let second = new WeighedRandom({from:secondVal, to:secondVal});
      generatePage(first, second, renderer);
      if (option.first.resetRandom) {
        first.reset();
      }
    }
  }
  renderer.renderSuiteFooter();
};

const generatePug = () => {
  const option =  {
    first : {from:1, to:20},
    second : {from:4, to:4},
    randomizeSecond : false,
    pages : 4
  };
  generateSuite(option, new PugRenderer());
};
const generateHtml = () => {
  const str = document.getElementById("conf").value;
  try {
    const option = JSON.parse(str);
    generateSuite(option, new HtmlRenderer());
    localStorage.setItem('mathHomework', str);
  } catch (e) {
  }
}
const reset = () => {
  localStorage.removeItem('mathHomework');
  location.reload();
};
window.onload = () => {
  console.log("onload");
  let saved = localStorage.getItem('mathHomework');
  if (saved) {
    document.getElementById("conf").value = saved;
  }
}
// generatePug();
//generateHtml();