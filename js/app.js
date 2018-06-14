// Enemies our Player must avoid
// canvas.width = 505;
// canvas.height = 606;

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
  this.y = (this.y + (this.yDelta)/60); //bumps

};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

function checkBugCollision(ladybug) {

  for (enemy of allEnemies) {
    if (ladybug == enemy) { //no changing yDelta if self
      break;
    }

    if (
      ladybug.y + 130 >= enemy.y + 90 &&  //131-90
      ladybug.x + 25 <= enemy.x + 90 &&   //25 - 88
      ladybug.y + 75 <= enemy.y + 135 && //73 - 135
      ladybug.x + 75 >= enemy.x + 10) { //76 - 11

      if (ladybug > enemy) {
        ladybug.yDelta++;
        enemy.yDelta--;
      } else {
        ladybug.yDelta--;
        enemy.yDelta++;
      }//end of else
    }//end of if ladybug > enemy
  }//end of for loop
  
  return null;
  
}//end of checkBugCollision()


// Now write your own Player class
// This class requires an update(), render() and
// a handleInput() method.
// Gus: Can I do this with shorthand?

//let sprite; //attribute of Player class

const Player = function() {
  this.x = 200; //starting position
  this.y = 445;
  this.sprite = "images/char-cat-girl.png";
};


Player.prototype.update = function() {
  // console.log(this);
  
  checkPlayerCollision();
  
    if (this.x > 420) { //barrier to the right
    this.x = 420; 
  }
    if (this.x < -17) { //barrier to the left
    this.x = -17; 
  }
  
    if (this.y > 445) { //barrier down
    this.y = 445; 
  }
    if (this.y < -11) { //barrier up
    this.y = -11; 
  }//end of ifs that check player within canvas
  

  return null;
}; // end of Player update function

function checkPlayerCollision() {
	
	  for (enemy of allEnemies) {

    if (
      player.y + 130 >= enemy.y + 90 &&  //131-90
      player.x + 25 <= enemy.x + 90 &&   //25 - 88
      player.y + 75 <= enemy.y + 135 && //73 - 135
      player.x + 75 >= enemy.x + 10) { //76 - 11
	  
		player.x = 200; //back to starting position
		player.y = 445;
	  
    }//end of if ladybug > enemy
  }//end of for loop
  
  return null;
	
}//end of checkPlayerCollision()


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
let allEnemies = [];

for (i = 0; i < 5; i++) {
  let enemyOne = new Enemy;
  enemyOne.speed = ((Math.floor(Math.random() * 101)) + 100); //speed from 100 to 200
  enemyOne.y = ((Math.floor(Math.random() * 296)) + 55); //351-55 = 296
  allEnemies.push(enemyOne);
}
// let enemyOne = new Enemy;
// enemyOne.speed = ((Math.floor(Math.random() * 101)) + 100); //speed from 100 to 200
// enemyOne.y = ((Math.floor(Math.random() * 196)) + 55); //351-55 = 296

let player = new Player;


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
