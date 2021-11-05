const Term = {
  Mark: 1,
  Num: 2,
  Frac: 3,
  Box: 4
};
/*
DEMO_DATA = [
  {
    type:Term.Frac,
    integer:1,
    numerator: 3,
    denominator: {
      type:Term.Frac,
      integer:2,
      numerator:22,
      denominator:[
        3,
        "+",
        5
      ]
    }
  },
  "=",
  {
    type:Term.Box
  }
];
*/
DEMO_DATA = [
  {
    type:Term.Frac,
    numerator: 8,
    denominator: 3

  },
  "=",
  {
    type:Term.Frac,
    integer:{
      type:Term.Box,
      size: 1,
    },
    numerator: {
      type:Term.Box,
      size:1
    },
    denominator: 3

  }
];
const SIZE_BASE = 40;
const MARGIN = 4;

class UnitNumber {
  constructor (data, depth) {
   this.value = data; 
  }
  draw (rect, ctx) {
    drawTextInRect(ctx, rect, SIZE_BASE, this.value);

  }
  addUnits (units) {
    units.push(this);
  }
  calcRect () {
    // TODO
    return {
      heightUpper: SIZE_BASE/2 + MARGIN,
      heightLower: SIZE_BASE/2 + MARGIN,
      width: SIZE_BASE + MARGIN * 2
    };
  }
  calcAbsRect(container) {
    this.absRect = shrinkRect (container, this.calcRect());
    return this.absRect;
  }

}
function drawTextInRect (ctx, rect, size, text) {
  ctx.font = size + "px YuKyokasho"
  let mt = ctx.measureText(text);
  console.log(mt)
  ctx.fillText(text, rect.x + (rect.width-mt.width)/2, rect.y + size);

}
class UnitMark {
  constructor (data, depth) {
    this.value = data; 
  }
  draw (rect, ctx) {
    drawTextInRect(ctx, rect, SIZE_BASE, this.value);
  }
  addUnits (units) {
    units.push(this);
  }
  calcRect () {
    // TODO
    if (!this.rect) {
      this.rect = {
        heightUpper: SIZE_BASE/2 + MARGIN,
        heightLower: SIZE_BASE/2 + MARGIN,
        width: SIZE_BASE + MARGIN * 2
      };
    }
    return this.rect;
  }
  calcAbsRect(container) {
    this.absRect = shrinkRect (container, this.calcRect());
    return this.absRect;
  }

}
class UnitBox {
  constructor (data, depth) {
    this.size = data.size;

  }
  draw (rect, ctx) {
    ctx.beginPath()
    ctx.strokeRect(rect.x+MARGIN*2, rect.y, SIZE_BASE * this.size, SIZE_BASE);
    ctx.stroke()
  }
  addUnits (units) {
    units.push(this);
  }
  calcRect () {
    if (!this.rect) {
      this.rect = {
        heightUpper: SIZE_BASE/2 + MARGIN,
        heightLower: SIZE_BASE/2 + MARGIN,
        width: SIZE_BASE * this.size + MARGIN * 4
      };
    }
    return this.rect;
    
  }
  calcAbsRect(container) {
    this.absRect = shrinkRect (container, this.calcRect());
    return this.absRect;
  }

}
class UnitFraction { 
  constructor (data, depth) {
    if (data.integer) {
      this.integer = toUnit(data.integer);
    }
    if (!data.denominator) {
      throw("No denominator found. " + JSON.stringify(data))
    }
    this.denominator = toUnit(data.denominator);
    if (!data.numerator) {
      throw("No numerator found. " + JSON.stringify(data))
    }
    this.numerator = toUnit(data.numerator);
  }
  draw (rect, ctx) {

    ctx.beginPath()
    let y = rect.y + rect.heightUpper;
    let intWidth = 0;
    if (this.integer) {
      intWidth = this.integer.calcRect().width;
    }
    ctx.moveTo(rect.x + intWidth, y);
    ctx.lineTo(rect.x + rect.width, y);
    console.log(rect)
    ctx.stroke()
  }
  addUnits (units) {
    units.push(this);
    if (this.integer) {
      this.integer.addUnits(units);
    }
    this.denominator.addUnits(units);
    this.numerator.addUnits(units);
  }
  
  calcRect () {;
    if (!this.rect) {
      let width = 0;
      let heightUpper = 0;
      let heightLower = 0;
      if (this.integer) {
        const rect = this.integer.calcRect();
        width += rect.width;
        heightUpper = Math.max(heightUpper, rect.heightUpper);
        heightLower = Math.max(heightLower, rect.heightLower);
      }
      const numeratorRect = this.numerator.calcRect();
      const denominatorRect = this.denominator.calcRect();
      heightUpper = Math.max(heightUpper, numeratorRect.heightUpper + numeratorRect.heightLower);
      heightLower = Math.max(heightLower, denominatorRect.heightUpper + denominatorRect.heightLower);
      width += Math.max(numeratorRect.width, denominatorRect.width);
      this.rect = {
        width:width,
        heightUpper:heightUpper,
        heightLower:heightLower
      };
    }
    return this.rect;
  }
  calcAbsRect(container) {
    // Simply align from left to right
    const rect = shrinkRect(container, this.calcRect());
    let x = rect.x;
    let width = rect.width;
    if (this.integer) {
      let intRect = this.integer.calcRect();
      this.integer.calcAbsRect({
        x:x,
        y:rect.y,
        heightUpper: rect.heightUpper,
        heightLower: rect.heightLower,
        width:intRect.width
      });
      x += intRect.width;
      width -= intRect.width;
    }
    this.numerator.calcAbsRect({
      x:x,
      y:rect.y, 
      width:width,
      height:rect.heightUpper
    });
    this.denominator.calcAbsRect({
      x:x,
      y:rect.y+rect.heightUpper,
      width:width,
      height:rect.heightLower
    });
    this.absRect = rect;
    return this.absRect;
  }
}
class UnitLinear {
  constructor (data, depth) {
    this.terms = data.map(item=>toUnit(item));
  }
  draw (rect, ctx) {

  }
  addUnits (units) {
    units.push(this);
    this.terms.forEach((term)=>{term.addUnits(units)});
  }
  calcRect () {
    if (!this.rect) {
      let width = 0;
      let heightUpper = 0;
      let heightLower = 0;
      this.terms.map(term=>term.calcRect()).forEach((term)=>{
        width += term.width;
        heightUpper = Math.max(heightUpper, term.heightUpper);
        heightLower = Math.max(heightLower, term.heightLower);
      });
      this.rect = {
        width:width,
        heightUpper:heightUpper, heightLower:heightLower
      };
    }
    return this.rect;
  }
  calcAbsRect (container) {
    // Simply align from left to right
    const rect = shrinkRect(container, this.calcRect());
    let x = rect.x;
    for (let term of this.terms) {
      const termRect = term.calcRect();
      term.calcAbsRect({
        x:x, y:rect.y,
        width:termRect.width,
        heightUpper:rect.heightUpper, heightLower:rect.heightLower
      });
      x += termRect.width;
    }
    this.absRect = rect;
    return this.absRect;
  }
}
function shrinkRect (container, content) {
  const x = container.x + (container.width - content.width)/2;
  const width = content.width;
  let y = 0;
  if (container.height) {
    y = container.y + (container.height - content.heightUpper - content.heightLower)/2;
  } else {
    y = container.y + container.heightUpper - content.heightUpper;
  }
  return {
    x:x, y:y,
    heightUpper: content.heightUpper, heightLower: content.heightLower,
    width: content.width
  };
  
}
function toUnit (data, depth) {
  if (typeof(data)=="number") {
    // Raw number
    return new UnitNumber(data, depth);
  }
  if (typeof(data)=="string") {
    // Raw mark
    return new UnitMark(data, depth);
  }
  if (Array.isArray(data)) {
    return new UnitLinear(data, depth);
  }
  if (typeof(data)=="object") {
    if (data.type == Term.Frac) {
      return new UnitFraction(data, depth);

    }
    if (data.type == Term.Box) {
      return new UnitBox(data, depth)
    }
  }
}
function draw () {
  // Turn data to objects
  const equation = toUnit(DEMO_DATA, 0);
  const rect = equation.calcRect();
  const units = [];
  equation.addUnits(units);
  equation.calcAbsRect({x:MARGIN, y:MARGIN, width:rect.width, heightUpper:rect.heightUpper, heightLower:rect.heightLower});
  
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  ctx.lineWidth = style.width;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.strokeStyle = style.color;
  units.forEach((unit)=>{
    const rect = unit.absRect;
    unit.draw(unit.absRect, ctx);
    /*
    ctx.beginPath()
    ctx.strokeRect(rect.x+2, rect.y+2, rect.width-4, rect.heightUpper+rect.heightLower-4);
    ctx.stroke()
    */
  });
  console.log(equation)

}
window.onload = ()=>{
  draw ();
};