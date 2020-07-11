class BasicSubtraction {
  constructor () {
  }
  _generatePage (first, second, option/*, renderer, header, footer, box*/) {
    let problems = [];
    for (let problemIndex=0; problemIndex<PROBLEMS_PER_PAGE; problemIndex++) {
      const valFirst = first.pick();
      const valSecond = second.pick();
      const answer = valFirst - valSecond;
      
      let items = [];
      items.push(new ItemIndex(problemIndex));
      items.push(new ItemNumber(valFirst));
      items.push(new ItemOperand('&#xFF0D'));
      items.push(new ItemNumber(valSecond));
      items.push(new ItemOperand('='));
      if (option.box) {
        items.push(new ItemBox(answer));
      }
      problems.push(items);
    }
    return problems;
  }
  generate (pages, option) {
    let first = new WeighedRandom(option.first, (option.first.resetRandom)?PROBLEMS_PER_PAGE:PROBLEMS_PER_PAGE*pages);
    let suite = [];
    if (option.randomizeSecond) {
      let second = new WeighedRandom(option.second);
      for (let pageIndex=0; pageIndex<pages; pageIndex++) {
        const pageContent = this._generatePage(first, second, option);
        suite.push(pageContent);
        if (option.first.resetRandom) {
          first.reset();
        }
      }
    } else {
      const secondRand = new WeighedRandom(option.second);
      for (let pageIndex=0; pageIndex<pages; pageIndex++) {
        let secondVal = secondRand.pick();
        let second = new WeighedRandom({from:secondVal, to:secondVal});
        const pageContent = this._generatePage(first, second, option);
        suite.push(pageContent);
        if (option.first.resetRandom) {
          first.reset();
        }
      }
    }
    return suite;
  }
}