class BasicDivision {
  constructor () {
  }
  _generatePage (denominator, result, remainder, problemsPerPage, option) {
    let problems = [];
    for (let problemIndex=0; problemIndex<problemsPerPage ; problemIndex++) {
      const denominatorValue = denominator.pick();
      const resultValue = result.pick();
      let remainderValue = 0;
      if (remainder && denominatorValue > 1) {
        remainderValue = Math.ceil(Math.random() * (denominatorValue - 1));
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
    let denominator = new WeighedRandom(option.denominator, (option.denominator.resetRandom)? problemsPerPage:problemsPerPage*pages);
    let suite = [];
    if (option.randomizeResult) {
      let result = new WeighedRandom(option.result);
      for (let pageIndex=0; pageIndex<pages; pageIndex++) {
        const pageContent = this._generatePage(denominator, result, option.remainder, problemsPerPage, option);
        suite.push(pageContent);
        if (option.denominator.resetRandom) {
          denominator.reset();
        }
      }
    } else {
      const resultRand = new WeighedRandom(option.result);
      for (let pageIndex=0; pageIndex<pages; pageIndex++) {
        let resultVal = resultRand.pick();
        let result = new WeighedRandom({from:resultVal, to:resultVal});
        const pageContent = this._generatePage(denominator, result, option.remainder, problemsPerPage, option);
        suite.push(pageContent);
        if (option.denominator.resetRandom) {
          denominator.reset();
        }
      }
    }
    return suite;
  }
}