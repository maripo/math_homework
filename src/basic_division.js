class BasicDivision {
  constructor () {
  }
  _generatePage (denominator, result, remainder, maxRemainder, problemsPerPage, option) {
    let problems = [];
    for (let problemIndex=0; problemIndex<problemsPerPage ; problemIndex++) {
      const denominatorValue = denominator.pick();
      const resultValue = result.pick();
      let remainderValue = 0;
      if (remainder && denominatorValue > 1) {
        if (maxRemainder > 0) {
          remainderValue = Math.ceil(Math.random() * Math.min(denominatorValue - 1, maxRemainder));
        } else {
          // Remainder range not specified
          remainderValue = Math.ceil(Math.random() * (denominatorValue - 1));
        }
        // TODO remove it
        remainderValue = 2;
        
      }
      const numeratorValue = denominatorValue * resultValue + remainderValue;
      let items = [];
      items.push(new ItemIndex(problemIndex));
      items.push(new ItemNumber(numeratorValue));
      items.push(new ItemOperand('÷'));
      items.push(new ItemNumber(denominatorValue));
      items.push(new ItemOperand('='));
      items.push(new ItemBox(resultValue, !option.box));
      if (remainderValue > 0) {
        items.push(new ItemOperand('...'));
        items.push(new ItemBox(remainderValue, !option.box));
      }
      problems.push(items);
    }
    return problems;
  }
  generate (pages, problemsPerPage, option) {
    if (option.remainder && option.denominator.from <= 1) {
      option.denominator.from = 2;
    }
    if (option.remainder && option.denominator.to <= 1) {
      option.denominator.to = 2;
    }
    let result = new WeighedRandom(option.result, (option.result.resetRandom)? problemsPerPage:problemsPerPage*pages);
    let suite = [];
    if (option.randomizeDenominator) {
      let denominator = new WeighedRandom(option.denominator);
      for (let pageIndex=0; pageIndex<pages; pageIndex++) {
        const pageContent = this._generatePage(denominator, result, option.remainder, option.maxRemainder, problemsPerPage, option);
        suite.push(pageContent);
        if (option.denominator.resetRandom) {
          denominator.reset();
        }
      }
    } else {
      const denominatorRand = new WeighedRandom(option.denominator);
      for (let pageIndex=0; pageIndex<pages; pageIndex++) {
        let denominatorVal = denominatorRand.pick();
        let denominator = new WeighedRandom({from:denominatorVal, to:denominatorVal});
        const pageContent = this._generatePage(denominator, result, option.remainder, option.maxRemainder, problemsPerPage, option);
        suite.push(pageContent);
        if (option.denominator.resetRandom) {
          denominator.reset();
        }
      }
    }
    return suite;
  }
}