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
// Mixed to improper
class MixedTo {
  constructor () {
  }
  generateProblem (problemIndex, values) {
    const box = {
      type:Term.Box,
      size: 2.5
    };
    const numerator = Math.floor(Math.random() * (values.denominator-1)) + 1;
    const eq = [
      {
        type:Term.Frac,
        integer: values.int,
        numerator: numerator,
        denominator: values.denominator
    
      },
      "=",
      {
        type:Term.Frac,
        numerator: box,
        denominator: values.denominator
    
      }
    ];
    return [new ItemIndex(problemIndex), new ItemFraction(eq)];
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


initGenerator(new FractionIntTo(), 'fraction_int_to', 'mathHomeworkFrationIntTo');
initGenerator(new FractionToInt(), 'fraction_to_int', 'mathHomeworkFrationToInt');
initGenerator(new MixedTo(), 'fraction_mixed_to', 'mathHomeworkMixedTo');