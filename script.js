
var mainCanvas = document.getElementById("mainMenuCanvas") ;
var ctx = mainCanvas.getContext("2d") ;
/*
var x = mainCanvas.width/2;
var y = mainCanvas.height-30;
var dx = 2;
var dy = -2;

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function draw() {
  console.log('drew') ;
    ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
    drawBall();
    x += dx;
    y += dy;
}

setInterval(draw, 10);

*/

//______________________________________________________________________________
//______________________________________________________________________________

function Snake() {
  this.initLength = 20 ;
  this.direction = -1 ;
  this.points = [] ;

  for (var i=0 ; i<this.initLength ; i++) {
    this.points[i] = [250,290-i*10,10,10] ;
  }

  this.setDirection = function (direction) {
    if (this.direction!=direction && this.direction!=-direction) this.direction = direction ;
  } ;

  this.grow = function () {
    this.points.push(this.points[-1]) ;
  } ;

  this.move = function () {

    this.points.pop() ;
    var x = this.points[0] ;

    if (this.direction==1) {this.points.unshift([x[0],x[1]-10,x[2],x[3]]) ;}
    if (this.direction==-1) {this.points.unshift([x[0],x[1]+10,x[2],x[3]]) ;}
    if (this.direction==2) {this.points.unshift([x[0]+10,x[1],x[2],x[3]]) ;}
    if (this.direction==-2) {this.points.unshift([x[0]-10,x[1],x[2],x[3]]) ;}
  } ;

  this.remove = function (index) {
    while (this.points.length != index+1) {this.points.pop();}
  } ;
}

function Food() {
  this.x = Math.floor(Math.random() * (mainCanvas.height -1));
  this.y = Math.floor(Math.random() * (mainCanvas.height -1));
  this.width = 10 ;
  this.height = 10 ;
  this.pos = [this.x,this.y,this.width,this.height] ;
}

function gameLogic() {
  this.snake = new Snake() ;
  this.food = new Food() ;
  this.score = snake.points.length - snake.initLength ;

  this.updateState = function () {
    this.snake.move() ;

    head = this.snake.points[0] ;
    if (head==this.food.pos) {
      this.snake.grow() ;
      this.food = new Food() ;
      this.score++ ;
    }
  } ;

  this.isSnakeDead = function() {
    var status = self.didSnakeHitBorder() || self.didSnakeHitSelf() ;
    return (status) ;
  } ;

  this.didSnakeHitBorder = function() {
    var head = this.snake.points[0] ;
    if (head.x <= 0) return true ;
    if (head.y <= 0) return true ;
    if (head.x >= mainCanvas.width) return true ;
    if (head.y >= mainCanvas.height) return true ;
    return false ;
  } ;

  this.didSnakeHitSelf = function() {
    length = this.snake.points.length ;
    var i = 1 ;
    while (i<temp) {
      if (this.snake.points[0]==this.snake.points[i]) return true ;
      i++ ;
      length = this.snake.points.length ;
    }
    return false ;
  } ;
}

function gameMenu() {}


//______________________________________________________________________________
//______________________________________________________________________________


function drawSnake() {
  console.log('ran') ;

  ctx.clearRect(0,0,mainCanvas.width,mainCanvas.height) ;
  ctx.beginPath() ;

  for (var i=0 ; i<s.points.length ; i++) {
    ctx.strokeStyle = "white" ;
    ctx.strokeRect(s.points[i][0],s.points[i][1],s.points[i][2],s.points[i][3]) ;
  }
  ctx.closePath() ;
  s.move() ;
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, 35, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
    x+=10;
    y+=10;
}

var s = new Snake() ;
var x = 200;
var y = 200 ;
setInterval(drawSnake,250) ;
setInterval(drawBall,200) ;
