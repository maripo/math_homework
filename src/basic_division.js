class BasicDivision {
  constructor () {
  }
  // Format (none/number/box)
  _item (value, format) {
    if (format == "none") {
      return new ItemBox(value, true);
    } else if (format == "number") {
      return new ItemNumber(value);
    } else {
      return new ItemBox(value);
    }
  }
  _generatePage (denominator, result, remainder, problemsPerPage, option) {
    let problems = [];
    for (let problemIndex=0; problemIndex<problemsPerPage ; problemIndex++) {
      const denominatorValue = denominator.pick();
      const resultValue = result.pick();
      let remainderValue = 0;
      if (remainder && denominatorValue > 1) {
        const minRemainder = remainder.from;
        const maxRemainder = Math.min(remainder.to, denominatorValue-1);
        remainderValue = minRemainder + Math.floor((maxRemainder - minRemainder + 1) * Math.random());
      }
      const numeratorValue = denominatorValue * resultValue + remainderValue;
      let items = [];
      
      items.push(new ItemIndex(problemIndex));
      if (!option.subtractionFormat) {
        items.push(new ItemNumber(numeratorValue));
        items.push(new ItemOperand('÷'));
        items.push(new ItemNumber(denominatorValue));
        items.push(new ItemOperand('='));
        items.push(this._item(resultValue, option.result.format));
        if (remainderValue > 0 && option.remainder.format != "none") {
          items.push(new ItemOperand('...'));
          items.push(this._item(remainderValue, option.remainder.format));
        }
      } else {
        items.push(new ItemNumber(numeratorValue));
        items.push(new ItemOperand('&#xFF0D'));
        items.push(new ItemNumber(denominatorValue * resultValue));
        items.push(new ItemOperand('='));
        items.push(this._item(remainderValue, option.remainder.format));
      }
      problems.push(items);
    }
    return problems;
  }
  generate (pages, problemsPerPage, option) {
    if (option.remainder) {
      if (option.denominator.from <= option.remainder.from) {
        option.denominator.from = option.remainder.from + 1;
      }
      if (option.denominator.to <= option.remainder.from) {
        option.denominator.to = option.remainder.from + 1;
      }
    }
    let result = new WeighedRandom(option.result, (option.result.resetRandom)? problemsPerPage:problemsPerPage*pages);
    let suite = [];
    if (option.randomizeDenominator) {
      let denominator = new WeighedRandom(option.denominator);
      for (let pageIndex=0; pageIndex<pages; pageIndex++) {
        const pageContent = this._generatePage(denominator, result, option.remainder, problemsPerPage, option);
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