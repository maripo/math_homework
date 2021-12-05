function pickRandomFrom (array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Mixed to improper
class MixedTo {
  constructor () {
  }
  generateProblem (problemIndex, values, option) {
    console.log(values)
    console.log(option)
    const box = {
      type:Term.Box,
      size: 2.5
    };
    const numerator = (values.numerator - 1) % (values.denominator-1) + 1;
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
  generateProblem (problemIndex, values, option) {
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
  generateProblem (problemIndex, values, option) {
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