Player// Enemies our Player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = "images/enemy-bug.png";
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x *= dt;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own Player class
// This class requires an update(), render() and
// a handleInput() method.
// Gus: Can I do this with shorthand?

//let sprite; //attribute of Player class

var Player = function() {
    this.sprite = "images/char-cat-girl.png";
  };


Player.prototype.update = function() {
  // console.log(this);
    return null;
  };

Player.prototype.render = function() { //draws Player on screen
    console.log(this.sprite);
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  };

Player.prototype.handleInput = function() {//handles the key inputs for Player movement
    return null;
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the Player object in a variable called Player
let allEnemies = [];
let enemyOne = new Enemy;
allEnemies = [enemyOne];
let player = new Player;


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener("keyup", function(e) {
    var allowedKeys = {
        37: "left",
        38: "up",
        39: "right",
        40: "down"
    };

    Player.handleInput(allowedKeys[e.keyCode]);
});
