
const FRAC_INT_MAX = 12;
const MAX_DENOMINATOR = 20;

function pickRandomFrom (array) {
  return array[Math.floor(Math.random() * array.length)];
}
function createProblem () {
  let pair = pickRandomFrom(pickRandomFrom(relPrimeTable));
  const numerator = pair[1];
  const denominator = pair[0];
  const intg = 1 + Math.floor(Math.random()*FRAC_INT_MAX);
  const origNumerator = denominator * intg + numerator;
  const box = {
    type:Term.Box,
    size: 2.5
  };
  return [
    {
      type:Term.Frac,
      integer: intg,
      numerator: numerator,
      denominator: denominator
  
    },
    "=",
    {
      type:Term.Frac,
      numerator: box,
      denominator: denominator
  
    }
  ];
}
function createProblemJust () {
  let pair = pickRandomFrom(pickRandomFrom(relPrimeTable));
  const numerator = 0;// pair[1];
  const denominator = pair[0];
  const intg = 1 + Math.floor(Math.random()*FRAC_INT_MAX);
  const origNumerator = denominator * intg + numerator;
  return [
    {
      type:Term.Frac,
      numerator: origNumerator,
      denominator: denominator
  
    },
    "=",
    {
      type:Term.Box,
      size: 2
    }
  ];
}
function createProblemReverse () {
  let pair = pickRandomFrom(pickRandomFrom(relPrimeTable));
  const numerator = pair[1];
  const denominator = pair[0];
  const intg = 1 + Math.floor(Math.random()*numerator);
  const origNumerator = denominator * intg + FRAC_INT_MAX;
  return [
    {
      type:Term.Frac,
      numerator: origNumerator,
      denominator: denominator
  
    },
    "=",
    {
      type:Term.Frac,
      integer:{
        type:Term.Box,
        size: 2,
      },
      numerator: {
        type:Term.Box,
        size: 2
      },
      denominator: denominator
  
    }
  ];
}

const generate = ()=>{

  const problemsPerPage = 5;
  const numOfPages = 4;
  for (let i=0; i<numOfPages; i++) {
    let page = document.createElement("div");
    page.className = "page";
    let pageBody = document.createElement("div");
    pageBody.className = "page__body";
    page.appendChild(pageBody);
    document.getElementById("pages").appendChild(page);
    for (let j=0; j<problemsPerPage; j++) {
      pageBody.appendChild(draw (createProblemOne()));
    }
  }
  // Demo
  const rand = new WeighedRandom({from:4, to:19, randCoeff:0.1}, 10);
  for (let i=0; i<10; i++) {
    console.log(rand.pick())
  }

};
class ItemFraction {
  constructor (equation) {
    this.equation = equation;
    this.size = 4;
  }
  align () {
    return 'center';
  }
  relativeWidth () {
    return this.size * 1.1 + 0.5;
  }
  content () {
    if (!this.dom) {
     
      this.dom = draw (this.equation) 
    }
    return this.dom;
  }
  classId () {
    return (this.invisible) ? "space" : "box";
  }
}
// Int to Fraction
class FractionIntTo {
  constructor () {

  }
  _generateProblem (rInt, rDenominator) {
    const vInt = rInt.pick();
    const vDenominator = rDenominator.pick();
    const origNumerator = vDenominator * vInt;
    return [
      vInt,
      "=",
      {
        type:Term.Frac,
        numerator: {
          type:Term.Box,
          size: 2
        },
        denominator: vDenominator
      }
    ];
  }
  _generatePage (problemsPerPage, option) {
    let problems = [];
    let rInt = new WeighedRandom(option.int, problemsPerPage);
    let rDenominator = new WeighedRandom(option.denominator, problemsPerPage);
    for (let i=0; i<problemsPerPage; i++) {
      let problem = [];
      const index = new ItemIndex(i);
      problem.push(index)
      problem.push(new ItemFraction(this._generateProblem(rInt, rDenominator)));
      problems.push(problem);
    }
    return problems;
  }
  generate (pages, problemsPerPage, option) {
    let suite = [];
    for (let pageIndex=0; pageIndex<pages; pageIndex++) {
      const pageContent = this._generatePage(problemsPerPage, option);
      suite.push(pageContent);
    }
    return suite;
  }
}
// Fraction to Int
class FractionToInt {
  constructor () {

  }
  _generateProblem (rInt, rDenominator) {
    const vInt = rInt.pick();
    const vDenominator = rDenominator.pick();
    const vNumerator = vDenominator * vInt;
    return [
      {
        type:Term.Frac,
        numerator: vNumerator,
        denominator: vDenominator
      },
      "=",
      {
        type:Term.Box,
        size: 2
      }
    ];
  }
  _generatePage (problemsPerPage, option) {
    let problems = [];
    let rInt = new WeighedRandom(option.int, problemsPerPage);
    let rDenominator = new WeighedRandom(option.denominator, problemsPerPage);
    for (let i=0; i<problemsPerPage; i++) {
      let problem = [];
      const index = new ItemIndex(i);
      problem.push(index)
      problem.push(new ItemFraction(this._generateProblem(rInt, rDenominator)));
      problems.push(problem);
    }
    return problems;
  }
  generate (pages, problemsPerPage, option) {
    let suite = [];
    for (let pageIndex=0; pageIndex<pages; pageIndex++) {
      const pageContent = this._generatePage(problemsPerPage, option);
      suite.push(pageContent);
    }
    return suite;
  }
}
let relPrimeTable = [];
for (let i=1; i<=MAX_DENOMINATOR; i++) {
  let a = [];
  for (let j=1; j<i; j++) {
    if (relPrime(i, j)) {
      a.push([i, j]);
    }
  }
  if (a.length > 0) {
    relPrimeTable.push(a)
  }
}

initGenerator(new FractionIntTo(), 'fraction_int_to', 'mathHomeworkFrationIntTo');
initGenerator(new FractionToInt(), 'fraction_to_int', 'mathHomeworkFrationToInt');