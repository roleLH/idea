let rotate = function(x,y,rot) {
  let rotx = cos(rot) * x - sin(rot) * y;
  let roty = sin(rot) * x + cos(rot) * y; 
  return [flr(rotx), flr(roty)];
}
 
   
     
 let Polygon = function(points) {
  this.points = points || {};
   this.draw = function(x, y, c) {
      for(let i = 0; i < this.points.length; ++i) {
        let point = this.points[i];
        let next = i + 1 == this.points.length ? 0 : i + 1;
        let next_point = this.points[next];
        
        line(point[0] + x, point[1] + y, next_point[0] + x, next_point[1] + y, c);
      }
   }
   this.rotate = function(rot) {
    let points = [];
    this.points.forEach((point)=> {
      points.push(rotate(point[0], point[1], rot))
    });
    return points;
   }
   return this;
}

var p = new Polygon([
[-12, -12], [12, -12], [12, 12], [-12, 12]
]);
var p2 = new Polygon([
[-22, -39], [22, -39], [22, 39], [-22, 39]
]);//
let x = 1;
let y = 1;
let rot = 0;
let rot2 = 0.78;
let tickforrotate = 0.07;

function move() {
  if(btn(0)) {
    x--;
  }
  if(btn(1)) {
    x++;
  }
  if(btn(2)) {
    y--;
  }
  if(btn(3)) {
    y++;
  }
}
// 0 = a
// 1 = d
// 2 = w
// 3 = s
// 4 = x
// 5 = c
// 6 = v
// 7 = b

function update() {
  cls();
  
  p2.draw(x, y, 6);
  let rotateP = new Polygon(p.rotate(rot));
  rotateP.draw(x, y, 5);
  let rotateP2 = new Polygon(p.rotate(rot2));
  rotateP2.draw(x, y, 5);
  circ(x, y, 18, 2);
  circ(x, y, 20, 2);
  circ(x, y, 11, 3);
  
  move();
  let s = "[" + x + "," + y + "]";
  print(0, 0, s, 3);


  
  rot += tickforrotate;
  rot2 += tickforrotate;
}



export default {
  update,
}