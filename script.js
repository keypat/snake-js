var menuCanvas = document.getElementById("menuCanvas");
var instrCanvas = document.getElementById("instrCanvas");
var gameCanvas = document.getElementById("gameCanvas");
var pauseCanvas = document.getElementById("pauseCanvas");
var lostCanvas = document.getElementById("lostCanvas");
var hyperCanvas = document.getElementById("hyperCanvas");


function setSizes() {
  menuCanvas.width = window.innerWidth;
  menuCanvas.height = window.innerHeight;
  instrCanvas.width = window.innerWidth;
  instrCanvas.height = window.innerHeight;
  gameCanvas.width = window.innerWidth;
  gameCanvas.height = window.innerHeight;
  pauseCanvas.width = window.innerWidth;
  pauseCanvas.height = window.innerHeight;
  lostCanvas.width = window.innerWidth;
  lostCanvas.height = window.innerHeight;
  hyperCanvas.width = window.innerWidth;
  hyperCanvas.height = window.innerHeight;
}
setSizes();
window.onload = window.onresize = function() {
  setSizes();
};

var ctxMenu = menuCanvas.getContext("2d");
var ctxInstr = instrCanvas.getContext("2d");
var ctxGame = gameCanvas.getContext("2d");
var ctxPause = pauseCanvas.getContext("2d");
var ctxLost = lostCanvas.getContext("2d");
var ctxHyper = hyperCanvas.getContext("2d");


//______________________________________________________________________________
//______________________________________________________________________________
function PointRect(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
}
PointRect.prototype.toString = function(){
    return String([this.x,this.y,this.width,this.height]);
};
PointRect.prototype.inspect = function(){ return String([this.x,this.y,this.width,this.height]); };

function Snake() {
  this.initLength = 20;
  this.direction = -1;
  this.points = [];

  for (var i = 0; i < this.initLength; i++) {
    this.points[i] = new PointRect(250, y = 290 - i * 10, 10, 10);
  }

  this.setDirection = function(direction) {
    if (this.direction != direction && this.direction != -direction) this.direction = direction;
  };

  this.grow = function() {

    var temp = new PointRect(this.points[this.points.length - 1].x, this.points[this.points.length - 1].y, this.points[this.points.length - 1].width, this.points[this.points.length - 1].height);
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

  this.x = (Math.floor(Math.random() * (gameCanvas.width / 10 + 1))) * 10;
  this.y = (Math.floor(Math.random() * (gameCanvas.height / 10 + 1))) * 10;
  this.width = 10;
  this.height = 10;
  this.pos = [this.x, this.y, this.width, this.height];
}

function GameLogic() {
  this.snake = new Snake();
  this.food = new Food();
  this.score = this.snake.points.length - this.snake.initLength;

  this.updateState = function() {
    this.snake.move();

    var head = this.snake.points[0];
    if (this.didSnakeEatFood()) {
      this.snake.grow();
      this.food = new Food();
      this.score++;
    }
  };

  this.isSnakeDead = function() {
    var status = this.didSnakeHitBorder() || this.didSnakeHitSelf();
    return (status);
  };

  this.didSnakeHitBorder = function() {
    var head = this.snake.points[0];
    if (head.x <= 0) return true;
    if (head.y <= 0) return true;
    if (head.x >= gameCanvas.width) return true;
    if (head.y >= gameCanvas.height) return true;
    return false;
  };

  this.didSnakeHitSelf = function() {
    length = this.snake.points.length;
    var head = this.snake.points[0].toString() ;
    var i = 1;
    while (i < length) {
      if (head == this.snake.points[i].toString()) return true;
      i++;
    }
    return false;
  };

  this.didSnakeEatFood = function() {
    return (intersectRect(s.points[0], f));
  };
}

function GameMenu() {
  this.startGameButton = document.createElement('startGameButton');
  this.startGameButton.type = 'button';
  //this.startGameButton.value = ID;
  this.startGameButton.style = 'width: 100';
  document.body.appendChild(this.startGameButton);
}

function intersectRect(r1, r2) {
  return !(r2.x > r1.x + r1.width - 1 ||
    r2.x + r2.width - 1 < r1.x ||
    r2.y > r1.y + r1.height - 1 ||
    r2.y + r2.height - 1 < r1.y);
}

function GamePause() {}

function GameOver() {}

function Instructions() {}

function StateManager() {
  this.STATES = ['menu', 'instr', 'game', 'pause', 'lost', 'hyper'];
  this.logic = 'default';
  this.menu = 'default';
  this.pause = 'default';
  this.instruction = 'default';
  this.gameOver = 'default';

  this.gamePaused = false;
  this.currentState = 'menu';

  this.setState = function(state) {
    this.currentState = state;
    this.update();
  };

  this.update = function() {
    switch (this.currentState) {
      case this.STATES[0]:
        this.menu = new GameMenu();
        break;
      case this.STATES[1]:
        this.menu = new Instructions();
        break;
      case this.STATES[2]:
        if (!(this.gamePaused)) {
          this.logic = new GameLogic();
        }
        break;
      case this.STATES[3]:
        this.gamePaused = true;
        this.pause = new GamePause();
        break;
      case this.STATES[4]:
        this.lost = new GameOver();
        break;
      case this.STATES[5]:
        this.hyper = new HyperLogic();
        break;
    }
    if (this.currentState != this.STATES[3]) this.gamePaused = false;
  };

  this.getCurrentState = function() {
    return this.currentState;
  };

  this.updateCurrentState = function() {
    if (this.currentState == this.STATES[2]) {
      this.logic.updateState() ;
    }
  } ;

}


//______________________________________________________________________________
//______________________________________________________________________________

var aPressed, wPressed, sPressed, dPressed, enterPressed, escapePressed, spacePressed = false;
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
  // controller for left direction
  if (e.keyCode == 65 || e.keyCode == 37) {
    aPressed = true;
  }
  // controller for right direction
  if (e.keyCode == 68 || e.keyCode == 39) {
    dPressed = true;
  }
  // controller for up direction
  if (e.keyCode == 87 || e.keyCode == 38) {
    wPressed = true;
  }
  // controller for down direction
  if (e.keyCode == 83 || e.keyCode == 40) {
    sPressed = true;
  }
  // controller for Enter button
  if (e.keyCode == 13) {
    enterPressed = true;
  }
  // controller for Escape button
  if (e.keyCode == 27) {
    escapePressed = true;
  }
  // controller for Space button
  if (e.keyCode == 32) {
    spacePressed = true;
  }
}

function keyUpHandler(e) {
  // controller for left direction
  if (e.keyCode == 65 || e.keyCode == 37) {
    aPressed = false;
  }
  // controller for right direction
  if (e.keyCode == 68 || e.keyCode == 39) {
    dPressed = false;
  }
  // controller for up direction
  if (e.keyCode == 87 || e.keyCode == 38) {
    wPressed = false;
  }
  // controller for down direction
  if (e.keyCode == 83 || e.keyCode == 40) {
    sPressed = false;
  }
  // controller for Enter button
  if (e.keyCode == 13) {
    enterPressed = false;
  }
  // controller for Escape button
  if (e.keyCode == 27) {
    escapePressed = false;
  }
  // controller for Space button
  if (e.keyCode == 32) {
    spacePressed = false;
  }
}

//______________________________________________________________________________
//______________________________________________________________________________

function GUI() {
  this.STATES = ['menu', 'instr', 'game', 'pause', 'lost', 'hyper'];
  var buttonSpace = new Image();
  var buttonEnter = new Image();
  var buttonEsc = new Image();
  var buttonW = new Image();
  var buttonA = new Image();
  var buttonS = new Image();
  var buttonD = new Image();
  var buttonUp = new Image();
  var buttonDown = new Image();
  var buttonRight = new Image();
  var buttonLeft = new Image();

  buttonEnter.src = "./img/keyboard keys/bonus/entrée en.png";
  buttonSpace.src = "./img/keyboard keys/clavier/espace.png";
  buttonEsc.src = "./img/keyboard keys/clavier/esc.png";
  buttonW.src = "./img/keyboard keys/clavier/w.png";
  buttonA.src = "./img/keyboard keys/clavier/a.png";
  buttonS.src = "./img/keyboard keys/clavier/s.png";
  buttonD.src = "./img/keyboard keys/clavier/d.png";
  buttonUp.src = "./img/keyboard keys/clavier/haut.png";
  buttonLeft.src = "./img/keyboard keys/clavier/gauche.png";
  buttonDown.src = "./img/keyboard keys/clavier/bas.png";
  buttonRight.src = "./img/keyboard keys/clavier/droite.png";


  var stateMgr = new StateManager();
  var menuTimer,instrTimer,gameTimer,pauseTimer,lostTimer,hyperTimer ;
  this.f = stateMgr.logic.food ;
  this.s = stateMgr.logic.snake ;
  var loopSet = false ;

  setInterval(draw, 100);

  function drawFood() {
    this.f = stateMgr.logic.food ;
    ctxGame.beginPath();
    ctxGame.fillStyle = 'white';
    ctxGame.fillRect(f.x, f.y, f.width, f.height);
    ctxGame.closePath();
  }

  function drawSnake() {
    this.s = stateMgr.logic.snake ;
    ctxGame.beginPath();
    ctxGame.fillStyle = "white";
    var max = this.s.points.length;
    for (var i = 0; i < max; i++) {
      ctxGame.fillRect(this.s.points[i].x, this.s.points[i].y, this.s.points[i].width, this.s.points[i].height);
    }
    ctxGame.closePath();
  }

  function drawBall() {
    ctxLost.clearRect(0, 0, hyperCanvas.width, hyperCanvas.height);
    ctxLost.beginPath();
    ctxLost.arc(x, y, 10, 0, Math.PI * 2);
    ctxLost.fillStyle = "#0095DD";
    ctxLost.fill();
    ctxLost.closePath();
    x += 5;
    y += 5;
  }

  function clearMenu(canvas) {
    switch (canvas) {
      case this.STATES[0]:
        ctxMenu.beginPath();
        ctxMenu.clearRect(0, 0, menuCanvas.width, menuCanvas.height);
        ctxMenu.closePath();
        break;
      case this.STATES[1]:
        ctxInstr.beginPath();
        ctxInstr.clearRect(0, 0, instrCanvas.width, instrCanvas.height);
        ctxInstr.closePath();
        break;
      case this.STATES[2]:
        ctxGame.beginPath();
        ctxGame.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        ctxGame.closePath();
        break;
      case this.STATES[3]:
        ctxPause.beginPath();
        ctxPause.clearRect(0, 0, pauseCanvas.width, pauseCanvas.height);
        ctxPause.closePath();
        break;
      case this.STATES[4]:
        ctxLost.beginPath();
        ctxLost.clearRect(0, 0, lostCanvas.width, lostCanvas.height);
        ctxLost.closePath();
        break;
      case this.STATES[5]:
        ctxHyper.beginPath();
        ctxHyper.clearRect(0, 0, hyperCanvas.width, hyperCanvas.height);
        ctxHyper.closePath();
        break;
    }
  }

  function drawMenu() {
    console.log('drewMenu') ;
    ctxMenu.fillStyle = 'pink' ;
    ctxMenu.font = '60px Arial' ;
    ctxMenu.beginPath() ;
    ctxMenu.fillRect(0,0,menuCanvas.width,menuCanvas.height) ;
    ctxMenu.fillStyle = 'black' ;
    ctxMenu.fillText("Snake",menuCanvas.width/2-100,menuCanvas.height/2) ;
    ctxMenu.closePath() ;
    ctxMenu.drawImage(buttonEnter,menuCanvas.width/2,menuCanvas.height/2+200) ;
  }

  function drawInstr() {
    console.log('drewInstr') ;
    ctxInstr.fillStyle = 'beige' ;
    ctxInstr.font = '60px Papyrus' ;
    ctxInstr.beginPath() ;
    ctxInstr.fillRect(0,0,instrCanvas.width,instrCanvas.height) ;
    ctxInstr.fillStyle = 'black' ;
    ctxInstr.fillText("Instructions",instrCanvas.width/2-100,instrCanvas.height/2) ;

    ctxInstr.font = '30px Arial' ;
    ctxInstr.fillText("Start Game",instrCanvas.width/2+35,instrCanvas.height/2+320) ;
    ctxInstr.fillText("Pause [in game]",instrCanvas.width/4-350,instrCanvas.height/4+150) ;

    ctxInstr.closePath() ;
    ctxInstr.drawImage(buttonSpace,instrCanvas.width/2,instrCanvas.height/2+200) ;
    ctxInstr.drawImage(buttonEsc,instrCanvas.width/4-300,instrCanvas.height/4) ;

    ctxInstr.drawImage(buttonW,instrCanvas.width/2-225,instrCanvas.height/4-150) ;
    ctxInstr.drawImage(buttonA,instrCanvas.width/2-300,instrCanvas.height/4-50) ;
    ctxInstr.drawImage(buttonS,instrCanvas.width/2-190,instrCanvas.height/4-50) ;
    ctxInstr.drawImage(buttonD,instrCanvas.width/2-80,instrCanvas.height/4-50) ;

    ctxInstr.drawImage(buttonUp,instrCanvas.width/2+175,instrCanvas.height/4-150) ;
    ctxInstr.drawImage(buttonLeft,instrCanvas.width/2+100,instrCanvas.height/4-50) ;
    ctxInstr.drawImage(buttonDown,instrCanvas.width/2+210,instrCanvas.height/4-50) ;
    ctxInstr.drawImage(buttonRight,instrCanvas.width/2+320,instrCanvas.height/4-50) ;
  }

  function drawGame() {
    ctxGame.fillStyle = 'black' ;
    ctxGame.font = '40px Century Gothic' ;
    ctxGame.beginPath() ;
    ctxGame.fillRect(0,0,gameCanvas.width,gameCanvas.height) ;
    ctxGame.fillStyle = 'purple' ;
    ctxGame.fillText(stateMgr.logic.score ,gameCanvas.width/2-100,50) ;
    ctxGame.closePath() ;
    drawSnake() ;
    drawFood() ;
    stateMgr.updateCurrentState() ;

    if (stateMgr.logic.isSnakeDead()) {
      stateMgr.setState(this.STATES[4]) ;
      loopSet = false ;
    }
  }

  function drawPause() {
    console.log('drewPause') ;
    ctxPause.fillStyle = 'blue' ;
    ctxPause.font = '60px Papyrus' ;
    ctxPause.beginPath() ;
    ctxPause.fillRect(0,0,pauseCanvas.width,pauseCanvas.height) ;
    ctxPause.fillStyle = 'black' ;
    ctxPause.fillText("Paused",pauseCanvas.width/2-100,pauseCanvas.height/2) ;
    ctxPause.closePath() ;
  }
  function drawLost() {
    console.log('drewLost') ;
    ctxLost.fillStyle = 'yellow' ;
    ctxLost.font = '60px Papyrus' ;
    ctxLost.beginPath() ;
    ctxLost.fillRect(0,0,instrCanvas.width,instrCanvas.height) ;
    ctxLost.fillStyle = 'black' ;
    ctxLost.fillText("Lost",instrCanvas.width/2-100,instrCanvas.height/2) ;
    ctxLost.closePath() ;
  }

  function draw() {
    if (stateMgr.getCurrentState() == 'game') {
      if (aPressed) this.s.setDirection(-2);
      if (dPressed) this.s.setDirection(2);
      if (wPressed) this.s.setDirection(1);
      if (sPressed) this.s.setDirection(-1);
    }
    if (stateMgr.getCurrentState() == this.STATES[0] && enterPressed) {
      stateMgr.setState('instr') ;
      clearMenu(this.STATES[0]) ;
    }
    if (stateMgr.getCurrentState() == this.STATES[1] && spacePressed) {
      clearMenu(this.STATES[1]) ;
      stateMgr.setState('game') ;
      loopSet = false ;

    }
    if (stateMgr.getCurrentState() == this.STATES[2] && escapePressed) {
      stateMgr.setState(this.STATES[3]);
      clearInterval(gameTimer) ;
      loopSet = false ;
    }
    if (stateMgr.getCurrentState() == this.STATES[3]) {
      loopSet = false ;
      if (enterPressed) stateMgr.setState(this.STATES[2]);
      if (spacePressed) stateMgr.setState(this.STATES[0]);
    }
    if (stateMgr.getCurrentState() == this.STATES[0]) {
      clearMenu(this.STATES[3]) ;
      clearMenu(this.STATES[4]) ;
      drawMenu() ;
    }
    if (stateMgr.getCurrentState() == this.STATES[1]) {
      ///clearInterval(menuTimer) ;
      drawInstr() ;
    }
    if (stateMgr.getCurrentState() == this.STATES[2] && !loopSet) {
      //clearInterval(instrTimer) ;
      loopSet = true ;
      clearMenu(this.STATES[1]) ;
      clearMenu(this.STATES[3]) ;
      gameTimer = setInterval(drawGame,60) ;
    }
    if (stateMgr.getCurrentState() == this.STATES[3] && !loopSet) {
      clearInterval(gameTimer) ;
      loopSet = true ;
      clearMenu(this.STATES[2]) ;
      drawPause() ;
    }
    if (stateMgr.getCurrentState() == this.STATES[4] && !loopSet) {
      //clearInterval(instrTimer) ;
      loopSet = true ;
      clearMenu(this.STATES[2]) ;
      drawLost() ;
    }


  }
}

GUI();
