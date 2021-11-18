
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
  generateProblem (problemIndex, values) {
    const eq = [
      values.int,
      "=",
      {
        type:Term.Frac,
        numerator: {
          type:Term.Box,
          size: 2
        },
        denominator: values.denominator
      }
    ];
    return [new ItemIndex(problemIndex), new ItemFraction(eq)];
  }
}
// Fraction to Int
class FractionToInt {
  constructor () {
  }
  generateProblem (problemIndex, values) {
    const eq = [
      {
        type:Term.Frac,
        numerator: values.denominator * values.int,
        denominator: values.denominator
      },
      "=",
      {
        type:Term.Box,
        size: 2
      }
    ];
    return [new ItemIndex(problemIndex), new ItemFraction(eq)];

  }
}

// 
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