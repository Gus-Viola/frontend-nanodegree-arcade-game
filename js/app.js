// Enemies our Player must avoid
// canvas.width = 505;
// canvas.height = 606;

//Global Variables
let player; //instantiation of Player objectr;
let allEnemies; //future array of ladybugs;
let playerCollisionSound, bugCollisionSound, myMusic; //sound variables
let soundOn, musicOn; //sound controls


const Enemy = function() {
  this.x = -100; //ladybugs are gentle creatures, they do not just pop up
  this.y = 55; //is randomized upon instatiation from 55 to 350
  this.yDelta = 0;
  this.speed = 100; //is randomized upon instatiation from 100 to 200
  this.sprite = "images/enemy-bug.png";
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {

  //function checkCollision checks ladybug vs enemies; nudges ensue
  checkBugCollision(this);

  if (this.y < 55) { //ladybugs must be between 55 and 350
    this.y = 55;
    this.yDelta = 10;
  }

  if (this.y > 350) { //ladybugs must be between 55 and 350
    this.y = 350;
    this.yDelta = -10;
  }

  if (this.x > 500) { //ladybug gently leaves the screen...
    this.x = -100; //..then the ladybug gently enters the screen
    // this.yDelta = 0; //interesting difficult setting
  }

  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
  this.x += (this.speed * dt);
  this.y = (this.y + (this.yDelta) / 60); //bumps

};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

function checkBugCollision(ladybug) {

  for (let enemy of allEnemies) {
    if (ladybug === enemy) { //no changing yDelta if self
      break;
    }

    if (
      ladybug.y + 142 >= enemy.y + 78 && //131-90
      ladybug.x + 2 <= enemy.x + 97 && //25 - 88
      ladybug.y + 78 <= enemy.y + 142 && //73 - 135
      ladybug.x + 97 >= enemy.x + 2) { //76 - 11

      if (soundOn) {
        bugCollisionSound.play();
      }

      if (ladybug > enemy) {
        ladybug.yDelta++;
        enemy.yDelta--;
      } else {
        ladybug.yDelta--;
        enemy.yDelta++;
      } //end of else
    } //end of if ladybug > enemy
  } //end of for loop

  return null;

} //end of checkBugCollision()


// Gus: Can I do this Player class with shorthand?

const Player = function() {
  this.x = 200; //starting position
  this.y = 445;
  this.sprite = "images/char-cat-girl.png";
};


Player.prototype.update = function() {
  checkPlayerCollision();
  checkPlayerOffCanvas(); //just to avoid function complexity
  return null;
}; // end of Player update function

function checkPlayerCollision() {

  for (let enemy of allEnemies) {

    if (
      player.y + 138 >= enemy.y + 78 && //131-90
      player.x + 18 <= enemy.x + 78 && //25 - 88
      player.y + 63 <= enemy.y + 142 && //73 - 135
      player.x + 83 >= enemy.x + 2) { //76 - 11

      player.x = 200; //back to starting position
      player.y = 445;

      if (soundOn) {
        playerCollisionSound.play();
      }

    } //end of if ladybug > enemy
  } //end of for loop

  return null;

} //end of checkPlayerCollision()

checkPlayerOffCanvas = function() {

  if (player.x > 420) { //barrier to the right
    player.x = 420;
  }
  if (player.x < -17) { //barrier to the left
    player.x = -17;
  }

  if (player.y > 445) { //barrier down
    player.y = 445;
  }
  if (player.y < -11) { //barrier up
    player.y = -11;
  } //end of ifs that check player within canvas

} //end of checkPlayerOffCanvas()

Player.prototype.render = function() { //draws Player on screen
  // console.log(this.sprite);
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//How can player move diagonally?
Player.prototype.handleInput = function(direction) { //handles the key inputs for Player movement
  switch (direction) {
    case "left":
      this.x -= 8;
      break;
    case "right":
      this.x += 8;
      break;
    case "up":
      this.y -= 8;
      break;
    case "down":
      this.y += 8;
      break;
    default:
      return null;
  }

  console.log(direction);
  return null;
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the Player object in a variable called Player
allEnemies = [];

for (i = 0; i < 5; i++) {
  let enemyOne = new Enemy;
  enemyOne.speed = ((Math.floor(Math.random() * 101)) + 100); //speed from 100 to 200
  enemyOne.y = ((Math.floor(Math.random() * 296)) + 55); //351-55 = 296
  allEnemies.push(enemyOne);
}
// let enemyOne = new Enemy;
// enemyOne.speed = ((Math.floor(Math.random() * 101)) + 100); //speed from 100 to 200
// enemyOne.y = ((Math.floor(Math.random() * 196)) + 55); //351-55 = 296

player = new Player;
playerCollisionSound = new Audio("sounds/zapsplat_cartoon_impact_strings.mp3");
bugCollisionSound = new Audio("sounds/zapsplat_cartoon_punch.mp3");
myMusic = new Audio("sounds/gametheme.mp3");

soundOn = false;
musicOn = false;

if (musicOn) {
  // https://stackoverflow.com/questions/3273552/html5-audio-looping  //loops the mp3
  myMusic.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
  }, false);

  myMusic.play();
}




$(".volume").click(function() {//turns on-off the bumping sounds
  if (soundOn) {
    soundOn = false;
  } else {
    soundOn = true;
  }
  return null;
});

$(".music").click(function() {//turns on-off the music
  if (musicOn) {
    musicOn = false;
    myMusic.pause();
  } else {
    musicOn = true;
    myMusic.play();
  }
  return null;
});

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
//Changed event listener to keydown - player movement is much smoother
document.addEventListener("keydown", function(e) {
  var allowedKeys = {
    37: "left",
    38: "up",
    39: "right",
    40: "down"
  };
  player.handleInput(allowedKeys[e.keyCode]);
});

//https://www.w3schools.com/graphics/game_sound.asp
function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function() {
    this.sound.play();
  }
  this.stop = function() {
    this.sound.pause();
  }
}

//sounds from zapsplat
//music from https://www.w3schools.com/graphics/gametheme.mp3
