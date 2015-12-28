var mainCanvas = document.getElementById("mainMenuCanvas") ;
var ctx = mainCanvas.getContext("2d") ;
//______________________________________________________________________________
//______________________________________________________________________________

function Snake() {
  this.initLength = 20 ;
  this.direction = -1 ;
  this.points = new Array();

  for (var i=0 ; i<this.initLength ; i++) {
    this.points[i] = [250,290-i*10,10,10] ;
    console.log(this.points[i]) ;
  }

  this.setDirection = function (direction) {
    if (this.direction!=direction && this.direction!=-direction) this.direction = direction ;
  } ;

  this.move = function () {
    console.log('move') ;
    this.points.pop() ;
    var x = this.points[0] ;

    if (this.direction==1) {this.points.unshift([x[0],x[1]-10,x[2],x[3]]) ;}
    if (this.direction==-1) {this.points.unshift([x[0],x[1]+10,x[2],x[3]]) ;}
    if (this.direction==2) {this.points.unshift([x[0]+10,x[1],x[2],x[3]]) ;}
    if (this.direction==-2) {this.points.unshift([x[0]-10,x[1],x[2],x[3]]) ;}
    console.log('new point is:',this.points[0]) ;
  } ;

  this.remove = function (index) {
    while (this.points.length != index+1) {this.points.pop();}
  } ;
}

//______________________________________________________________________________
//______________________________________________________________________________


function drawSnake(snakeObj) {
  console.log('ran') ;
  s = snakeObj ;

  ctx.beginPath() ;
  ctx.clearRect(0,0,mainMenuCanvas.width,mainMenuCanvas.height) ;
  for (var i=0 ; i<s.initLength ; i++) {
    ctx.strokeStyle = "green" ;
    ctx.strokeRect(s.points[i][0],s.points[i][1],s.points[i][2],s.points[i][3]) ;
  }
  ctx.closePath() ;
}

var snake = new Snake() ;

setInterval(drawSnake(snake),500) ;
setInterval(snake.move(),1000) ;
