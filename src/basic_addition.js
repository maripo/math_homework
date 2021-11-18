class BasicAddition {
  constructor () {
  }
  generateProblem (problemIndex, values, option) {
    let items = [];
    const answer = values.first + values.second;
    items.push(new ItemIndex(problemIndex));
    items.push(new ItemNumber(values.first));
    items.push(new ItemOperand('+'));
    items.push(new ItemNumber(values.second));
    items.push(new ItemOperand('='));
    if (option.box) {
      items.push(new ItemBox(answer));
    }
    return items;
  }
}