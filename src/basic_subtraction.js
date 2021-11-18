class BasicSubtraction {
  constructor () {
  }
  generateProblem (problemIndex, values, option) {
    let items = [];
    
    items.push(new ItemIndex(problemIndex));
    items.push(new ItemNumber(values.first));
    items.push(new ItemOperand('&#xFF0D'));
    items.push(new ItemNumber(values.second));
    items.push(new ItemOperand('='));
    if (option.box) {
      items.push(new ItemBox(values.first - values.second));
    }
    return items;
  }
}