/**
 * @TODO: 加一个time() 函数
 */
  const CELL_H = 8;
  const CELL_W = 8;


  const EMPTY_CELL_SPR=1
  const DIE1_CELL_SPR=17
  const DIE2_CELL_SPR=16

  const DARKBLUE_CELL_SPR = 3
  const GREEN_CELL_SPR = 4
  const YELLOW_CELL_SPR = 5
  const RED_CELL_SPR = 6
  const BLUE_CELL_SPR = 7
  const BROWN_CELL_SPR = 8
  const LIGHTBLUE_CELL_SPR = 9

 function drawcell(sprid, cx, cy) {
  spr(sprid, CELL_W * cx, CELL_H * cy);
 }

 function printtocell(text, cx, cy, color) {
   print(text, CELL_W * cx, CELL_H * cy + 2, color);
 }


 class Tetrimino {
   constructor(sprid) {
    this.sprid = sprid;
    this.width = 0;
    this.height = 0;
    this.pos = {
        x : 0,
        y : 0,
      };
    this.shapeid = 0;
    this.shapes = {};
    this.wallkickGap = 0;
    this.isFell = false;
   }

   move(x, y) {
    this.pos.x = x;
    this.pos.y = y;
   }


   getShape(shape) {
    return this.shapes[shape];
   }

   draw(cx, cy) {
    let shape = this.getShape(this.shapeid);
    if(shape) {
      for(let y = 0; y < this.height; y++) {
        for(let x = 0; x < this.width; x++) {
          if(shape[y][x] > 0) {
            let posX = cx + x + this.pos.x;
					  let posY = cy + y + this.pos.y;
				    drawcell(this.sprid, posX, posY);
          }
        }
      }
    }
   }

   isCollision(grid, ox, oy) {
    let shape = this.getShape(this.shapeid);
    if(sh) {
      for(let y = 0; y < this.height; y++) {
        for(let x = 0; x < this.width; x++) {
          if(shape[y][x] > 0) {
            let posX = cx + x + ox;
					  let posY = cy + y + oy;
            if(posX < 0 || posX >= grid.width) { return true; }
            else if(posY >= grid.height) { return true; }
            else if(! grid.grid[posY][posX] == EMPTY_CELL_SPR) { return true; }
          }
        }
      }
      return false;
    }
   }

   godown(grid) {
    let x = this.pos.x;
    let y = this.pos.y + 1;
    if(!this.isCollision(grid, x, y)) {
      this.pos.y = y;
    } else {
      this.isFell = true;
    }
   }

   goright(grid) {
    let x = this.pos.x + 1;
    let y = this.pos.y;
    if(!this.isCollision(grid, x, y)) {
      this.pos.x = x;
    }
   }

   goleft(grid) {
    let x = this.pos.x - 1;
    let y = this.pos.y;
    if(!this.isCollision(grid, x, y)) {
      this.pos.x = x;
    }
   }



 }

 const SHAPES = {
    Z : {
      [1] : [[1,1,0], [0,1,1], [0,0,0]],
      [2] : [[0,0,1], [0,1,1], [0,1,0]],
      [3] : [[0,0,0], [1,1,0], [0,1,1]],
      [4] : [[0,1,0], [1,1,0], [1,0,0]]
     },
    S : {
      [1] : [[0,1,1], [1,1,0], [0,0,0]],
      [2] : [[0,1,0], [0,1,1], [0,0,1]],
      [3] : [[0,0,0], [0,1,1], [1,1,0]],
      [4] : [[1,0,0], [1,1,0], [0,1,0]]
    },
    L : {
      [1] : [[0,0,1], [1,1,1], [0,0,0]],
      [2] : [[0,1,0], [0,1,0], [0,1,1]],
      [3] : [[0,0,0], [1,1,1], [1,0,0]],
      [4] : [[1,1,0], [0,1,0], [0,1,0]]
    },
    J : {
      [1] : [[1,0,0], [1,1,1], [0,0,0]],
      [2] : [[0,1,1], [0,1,0], [0,1,0]],
      [3] : [[0,0,0], [1,1,1], [0,0,1]],
      [4] : [[0,1,0], [0,1,0], [1,1,0]]
    },
    T: {
      [1] : [[0,1,0], [1,1,1], [0,0,0]],
      [2] : [[0,1,0], [0,1,1], [0,1,0]],
      [3] : [[0,0,0], [1,1,1], [0,1,0]],
      [4] : [[0,1,0], [1,1,0], [0,1,0]]
    },
    I: {
      [1] : [[0,0,0,0], [1,1,1,1], [0,0,0,0], [0,0,0,0]],
      [2] : [[0,0,1,0], [0,0,1,0], [0,0,1,0], [0,0,1,0]],
      [3] : [[0,0,0,0], [0,0,0,0], [1,1,1,1], [0,0,0,0]],
      [4] : [[0,1,0,0], [0,1,0,0], [0,1,0,0], [0,1,0,0]],
    },
    O: {
      [1] : [[0,1,1,0], [0,1,1,0], [0,0,0,0]],
      [2] : [[0,1,1,0], [0,1,1,0], [0,0,0,0]],
      [3] : [[0,1,1,0], [0,1,1,0], [0,0,0,0]],
      [4] : [[0,1,1,0], [0,1,1,0], [0,0,0,0]],
    },
  }

 class ZTetrimino extends Tetrimino {
   constructor(sprid) {
     super(sprid);
   }

   create() {
     this.width = 3;
     this.height = 3;
     this.shapeid = 1;
     this.wallkickGap = 1;
     this.shapes = SHAPES.Z;
   }
 }

 class STetrimino extends Tetrimino {
  constructor(sprid) {
    super(sprid);
  }

  create() {
    this.width = 3;
    this.height = 3;
    this.shapeid = 1;
    this.wallkickGap = 1;
    this.shapes = SHAPES.S;
  }
 }

 class LTetrimino extends Tetrimino {
  constructor(sprid) {
    super(sprid);
  }

  create() {
    this.width = 3;
    this.height = 3;
    this.shapeid = 1;
    this.wallkickGap = 1;
    this.shapes = SHAPES.L;
  }
 }

 class JTetrimino extends Tetrimino {
  constructor(sprid) {
    super(sprid);
  }

  create() {
    this.width = 3;
    this.height = 3;
    this.shapeid = 1;
    this.wallkickGap = 1;
    this.shapes = SHAPES.J;
  }
 }

 class TTetrimino extends Tetrimino {
  constructor(sprid) {
    super(sprid);
  }

  create() {
    this.width = 3;
    this.height = 3;
    this.shapeid = 1;
    this.wallkickGap = 1;
    this.shapes = SHAPES.T;
  }
 }

 class ITetrimino extends Tetrimino {
  constructor(sprid) {
    super(sprid);
  }

  create() {
    this.width = 4;
    this.height = 4;
    this.shapeid = 1;
    this.wallkickGap = 2;
    this.shapes = SHAPES.I;
  }
 }

 class OTetrimino extends Tetrimino {
  constructor(sprid) {
    super(sprid);
  }

  create() {
    this.width = 4;
    this.height = 3;
    this.shapeid = 1;
    this.wallkickGap = 0;
    this.shapes = SHAPES.O;
  }
 }

 class Spawner {
   constructor() {
     this.items = {};
   }

   init() {
     this.items[1] = {ZTetrimino, RED_CELL_SPR};
     this.items[2] = {STetrimino, GREEN_CELL_SPR};
     this.items[3] = {LTetrimino, YELLOW_CELL_SPR};
     this.items[4] = {JTetrimino, DARKBLUE_CELL_SPR};
     this.items[5] = {TTetrimino, BLUE_CELL_SPR};
     this.items[6] = {ITetrimino, BROWN_CELL_SPR};
     this.items[7] = {OTetrimino, LIGHTBLUE_CELL_SPR};
   }

   spawn() {
     let item = this.items[Math.rnd(this.items.length)]
     return new item[1](item[2]);
   }
 }


 class GameGrid {
   constructor(w, h) {
    this.grid = [[]];
    this.width = w || 10;
    this.height = h || 16;

    this.animDelay = 100;
    this.animTime = 0;
    this.isAnim = false;
   }

   init() {
     for(let y = 0; y < this.height; y++) {
       for(let x = 0; x < this.width; x++) {
         this.grid[y][x] = EMPTY_CELL_SPR;
       }
     }
   }

   draw(cx, cy) {
    for(let y = 0; y < this.height; y++) {
      for(let x = 0; x < this.width; x++) {
        drawcell(this.grid[y][x], cx + x, cy + y);
      }
    }
   }

   set(x, y, sprid) {
     this.grid[y][x] = sprid;
   }

   updateline() {
    let res = 0
    for(let y = 0; y < this.height; y++) {
      let isline = true;
      for(let x = 0; x < this.width; x++) {
        isline = isline || !(this.grid[y][x] == EMPTY_CELL_SPR)
        if(!isline) {
          break;
        }
      }
      if(isline) {
        res++;
        this.isAnim = true;
        this.animTime = time();
        for(let x = 0; x < this.width; x++) {
          this.grid[y][x] = DIE1_CELL_SPR;
        }
      }
    }
     return res
   }

   replace(oldsprid, newsprid) {
    let res = false;
    for(let y = 0; y < this.height; y++) {
      for(let x = 0; x < this.width; x++) {
        if(this.grid[y][x] == oldsprid) {
          this.grid[y][x] = newsprid;
          res = true;
        }
      }
    }
    return res;
   }

   removeline(gridline) {
    for(let k = gridline; k > 0; k++) {
      this.grid[k] = this.grid[k - 1];
    }
    for(let x = 0; x < this.width; x++) {
      this.grid[0][x] = EMPTY_CELL_SPR;
    }
   }

   remove(oldsprid) {
    let process = true;
    while(process) {
      process = false;
      for(let y = 0; y < this.height; y++) {
        if(this.grid[y][0] == oldsprid) {
          this.removeline(y);
          process = true;
          break;
        }
      }
    }
   }

   animationUpdate() {
     if(!this.isAnim) {
       return;
     }
     let now = time();
     if(now > this.animTime + this.animDelay) {
       this.animTime = now;
       this.remove(DIE2_CELL_SPR);
       this.isAnim = this.replace(DIE1_CELL_SPR, DIE2_CELL_SPR);
     }
   }

 }


 class Game {
   constructor() {
     this.grid = new GameGrid();
     this.spawner = new Spawner();
     this.current = null;
     this.next = null;
     this.level = 1;
     this.fallSpeed = 550;
     this.levelSpeed = 45 * 1000;

     this.fallTime = 0;
     this.levelTime = 0;
     this.pauseTime = 0;

     this.isGameOver = false;
   }


   spawn() {
     if(this.current == null && !this.grid.isAnim) {
       this.current = this.next;
       this.current.move(3, 0);
       this.fallTime = time();

       this.next = this.spawner.spawn();
       this.next.create();
     }
   }

   //TODO:
   levelup() {

   }



 }
