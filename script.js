var mainCanvas = document.getElementById("mainMenuCanvas");
var mainCanvas2 = document.getElementById("canvas2");

function setSizes() {
  mainCanvas.width = window.innerWidth;
  mainCanvas.height = window.innerHeight;
  mainCanvas2.width = window.innerWidth;
  mainCanvas2.height = window.innerHeight;
}
setSizes() ;
//window.onload = window.onresize = function() {
//    mainCanvas.width = window.innerWidth;
//    mainCanvas.height = window.innerHeight;
//} ;
var ctx = mainCanvas.getContext("2d");
var ctx2 = mainCanvas2.getContext("2d");



//______________________________________________________________________________
//______________________________________________________________________________
function PointRect(x,y,width,height) {
  this.x = x ;
  this.y = y;
  this.width = width;
  this.height = height;
}

function Snake() {
  this.initLength = 20;
  this.direction = -1;
  this.points = [];

  for (var i = 0; i < this.initLength; i++) {
    this.points[i] = new PointRect(250, y=290 - i * 10, 10, 10);
  }

  this.setDirection = function(direction) {
    if (this.direction != direction && this.direction != -direction) this.direction = direction;
    console.log("dir: ",this.direction) ;
  };

  this.grow = function() {

    var temp = new PointRect(this.points[this.points.length-1].x,this.points[this.points.length-1].y,this.points[this.points.length-1].width,this.points[this.points.length-1].height) ;
    this.points.push(temp);
  };

  this.move = function() {

    this.points.pop();
    var head = this.points[0];

    if (this.direction == 1) {
      this.points.unshift(new PointRect(head.x, head.y - 10, head.width, head.height));
    }
    if (this.direction == -1) {
      this.points.unshift(new PointRect(head.x, head.y + 10, head.width, head.height));
    }
    if (this.direction == 2) {
      this.points.unshift(new PointRect(head.x + 10, head.y, head.width, head.height));
    }
    if (this.direction == -2) {
      this.points.unshift(new PointRect(head.x - 10, head.y, head.width, head.height));
    }
  };

  this.remove = function(index) {
    while (this.points.length != index + 1) {
      this.points.pop();
    }
  };
}

function Food() {

  this.x = (Math.floor(Math.random() * (mainCanvas.width/10+1)))*10 ;
  this.y = (Math.floor(Math.random() * (mainCanvas.height/10+1)))*10 ;
  this.width = 10;
  this.height = 10;
  this.pos = [this.x, this.y, this.width, this.height];
}

function gameLogic() {
  this.snake = new Snake();
  this.food = new Food();
  this.score = snake.points.length - snake.initLength;

  this.updateState = function() {
    this.snake.move();

    head = this.snake.points[0];
    if (head == this.food.pos) {
      this.snake.grow();
      this.food = new Food();
      this.score++;
    }
  };

  this.isSnakeDead = function() {
    var status = self.didSnakeHitBorder() || self.didSnakeHitSelf();
    return (status);
  };

  this.didSnakeHitBorder = function() {
    var head = this.snake.points[0];
    if (head.x <= 0) return true;
    if (head.y <= 0) return true;
    if (head.x >= mainCanvas.width) return true;
    if (head.y >= mainCanvas.height) return true;
    return false;
  };

  this.didSnakeHitSelf = function() {
    length = this.snake.points.length;
    var i = 1;
    while (i < temp) {
      if (this.snake.points[0] == this.snake.points[i]) return true;
      i++;
      length = this.snake.points.length;
    }
    return false;
  };
}

function gameMenu() {
  this.startGameButton = document.createElement('startGameButton');
  startGameButton.type = 'button';
  startGameButton.value = ID;
  startGameButton.style = 'width: 100';
  document.body.appendChild(startGameButton);
}

function intersectRect(r1, r2) {
  return !(r2.x > r1.x+r1.width-1 ||
           r2.x+r2.width-1 < r1.x ||
           r2.y > r1.y+r1.height-1 ||
           r2.y+r2.height-1 < r1.y);
}
//______________________________________________________________________________
//______________________________________________________________________________

var aPressed,wPressed,sPressed,dPressed = false ;
document.addEventListener("keydown",keyDownHandler,false) ;
document.addEventListener("keyup",keyUpHandler,false) ;

function keyDownHandler(e) {
  // controller for left direction
  if(e.keyCode==65 || e.keyCode==37) {
    aPressed=true ;
  }
  // controller for right direction
  if(e.keyCode==68 || e.keyCode==39) {
    dPressed=true ;
  }
  // controller for up direction
  if(e.keyCode==87 || e.keyCode==38) {
    wPressed=true ;
  }
  // controller for down direction
  if(e.keyCode==83 || e.keyCode==40) {
    sPressed=true ;
  }
}
function keyUpHandler(e) {
  // controller for left direction
  if(e.keyCode==65 || e.keyCode==37) {
    aPressed=false ;
  }
  // controller for right direction
  if(e.keyCode==68 || e.keyCode==39) {
    dPressed=false ;
  }
  // controller for up direction
  if(e.keyCode==87 || e.keyCode==38) {
    wPressed=false ;
  }
  // controller for down direction
  if(e.keyCode==83 || e.keyCode==40) {
    sPressed=false ;
  }
}

//______________________________________________________________________________
//______________________________________________________________________________

function drawFood() {
  ctx.beginPath();
  ctx.fillStyle = 'white';
  ctx.fillRect(f.x, f.y, f.width, f.height);
  ctx.closePath();
}

function drawSnake() {

  ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
  ctx.beginPath();
  ctx.fillStyle = "white";
  var max = s.points.length ;
  console.log(max);
  for (var i = 0; i < max; i++) {
    ctx.fillRect(s.points[i].x, s.points[i].y, s.points[i].width, s.points[i].height);
  }
  ctx.closePath();
  s.move();
}

function drawBall() {
  ctx2.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
  ctx2.beginPath();
  ctx2.arc(x, y, 10, 0, Math.PI * 2);
  ctx2.fillStyle = "#0095DD";
  ctx2.fill();
  ctx2.closePath();
  x += 5;
  y += 5;
}

function draw() {
  if (aPressed) s.setDirection(-2) ;
  if (dPressed) s.setDirection(2) ;
  if (wPressed) s.setDirection(1) ;
  if (sPressed) s.setDirection(-1) ;

  drawSnake() ;
  drawFood() ;

  if (intersectRect(s.points[0],f))  {
    f = new Food() ;
    s.grow() ;
    console.log('grew') ;
  }
  console.log("ateFood?:",ateFood) ;

}
var ateFood = false ;
var s = new Snake();
var f = new Food();
var x = 200;
var y = 200;
setInterval(draw, 150);
setInterval(drawBall, 40);
console.log(s.points[0].x) ;
