"use strict"; //per Udacity reviewer suggestion - great tip, btw
/*To Do:
Player moves diagonally
Player moves faster with shift
Jewels for extra lives
*/

// canvas.width = 505;
// canvas.height = 606;

//Global Variables
let player; //instantiation of Player objectr;
let allEnemies; //future array of ladybugs;
let playerCollisionSound, bugCollisionSound, myMusic; //sound variables
let soundOn, musicOn; //sound controls
let scoreStars = document.querySelectorAll(".fa-star");
const modal = document.querySelector(".modal");
const modalContent = document.getElementsByClassName("modal-content");
let span = document.getElementsByClassName("close")[0];


const Enemy = function(y, speed) {
  this.x = -100; //ladybugs are gentle creatures, they do not just pop up
  this.y = y; //is randomized upon instatiation from 55 to 350
  this.yDelta = 0;
  this.speed = speed; //is randomized upon instatiation from 100 to 200
  this.sprite = "images/enemy-bug.png";
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {

  //function checkBugCollision checks ladybug vs enemies; nudges ensue
  this.checkBugCollision();

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


Enemy.prototype.checkBugCollision = function() {

  for (let enemy of allEnemies) {
    if (this === enemy) { //no changing yDelta if self
      break;
    }
    if (
      this.y + 142 >= enemy.y + 78 &&
      this.x + 2 <= enemy.x + 97 &&
      this.y + 78 <= enemy.y + 142 &&
      this.x + 97 >= enemy.x + 2) {

      if (soundOn) {
        bugCollisionSound.play();
      }

      if (this > enemy) {
        this.yDelta++;
        enemy.yDelta--;
      } else {
        this.yDelta--;
        enemy.yDelta++;
      } //end of else
    } //end of if this > enemy
  } //end of for loop

  return null;

}; //end of checkBugCollision()

// Udacity reviewer: Can I do this Player class with shorthand? I failed

const Player = function() {
  this.x = 200; //starting position
  this.y = 445;
  this.sprite = "images/char-cat-girl.png";
  this.lives = 3;
};


Player.prototype.update = function() {
  this.checkPlayerCollision();

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
  } //end of ifs that check player within canvas

  return null;
}; // end of Player update function

Player.prototype.checkPlayerCollision = function() {

  if (this.y < -10) { //winning condition
    displayWinModal();
    this.x = 200; //back to starting position
    this.y = 445;
    return null;
  }


  for (let enemy of allEnemies) {

    if (
      this.y + 138 >= enemy.y + 78 &&
      this.x + 18 <= enemy.x + 78 &&
      this.y + 63 <= enemy.y + 142 &&
      this.x + 83 >= enemy.x + 2) {

      if (soundOn) {
        playerCollisionSound.play();
      }

      this.lives--;
      changeStarScore();

      if (this.lives === 0) {
        displayFailModal();
        return null;
      } else {
        this.x = 200; //back to starting position
        this.y = 445;
      } //end of if life-check

    } //end of if this > enemy
  } //end of for loop

  return null;

}; //end of checkthisCollision()


Player.prototype.render = function() { //draws Player on screen
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

for (let i = 0; i < 5; i++) {

  let enemy = new Enemy(
    ((Math.floor(Math.random() * 296)) + 55), //y parameter 351-55 = 296
    ((Math.floor(Math.random() * 101)) + 100) //speed parameter from 100 to 200
  );

  allEnemies.push(enemy);
} //end of for loop

player = new Player;
playerCollisionSound = new Audio("sounds/zapsplat_cartoon_impact_strings.mp3");
bugCollisionSound = new Audio("sounds/zapsplat_cartoon_punch.mp3");
myMusic = new Audio("sounds/gametheme.mp3");

soundOn = false;
musicOn = false;

if (musicOn) {
  // https://stackoverflow.com/questions/3273552/html5-audio-looping  //loops the mp3
  myMusic.addEventListener("ended", function() {
    this.currentTime = 0;
    this.play();
  }, false);

  myMusic.play();
}

$(".volume").click(function() { //turns on-off the bumping sounds
  if (soundOn) {
    soundOn = false;
  } else {
    soundOn = true;
  }
  $(".volume").animateCss("flipInX");
  return null;
});

$(".music").click(function() { //turns on-off the music
  if (musicOn) {
    musicOn = false;
    myMusic.pause();
  } else {
    musicOn = true;
    myMusic.play();
  }
  $(".music").animateCss("flipInX");
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

// When the user clicks on <span> (x), close the modal
function toggleModal() {
  $(modal).toggleClass("show-modal");
}

span.onclick = function() {
  toggleModal();
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    toggleModal();
  }
}

function displayWinModal() {
  const displayString = `You have succesfully entered the stream!`;
  $(modalContent).html(`<span class="close">&times;</span>
  <h1>Congratulations, you have won!</h1>
    <ul>${displayString}</ul>
    <ul><li><h1><i class="fa fa-trophy"></i></h1></li></ul>`);

  $(modalContent).removeClass("failure").addClass("success");
  $(modal).animateCss("bounceInUp");

  $(modal).toggleClass("show-modal");
  span = document.getElementsByClassName("close")[0];
  span.onclick = function() {
    toggleModal();
  }
  return null;
} //end of displayWinModal()

function displayFailModal() {
  $(modalContent).html(`<span class="close">&times;</span>
    <h1>Sorry, you died three times!</h1>
    <ul><li>
    <h1><i class="fa fa-bomb"></i></h1>
    </li></ul>`);
  $(modalContent).removeClass("success").addClass("failure");
  $(modal).animateCss("bounceInUp");
  $(modal).toggleClass("show-modal");
  let span = document.getElementsByClassName("close")[0];
  span.onclick = function() {
    toggleModal();
  }
  player.x = 200; //back to starting position
  player.y = 445;
} //end of displayFailModal();

function changeStarScore() {
  let obj = scoreStars[player.lives];
  $(obj).removeClass("checked");
  $(obj).animateCss("flipInX");
  return null;
} //end of changeStarScore()


// code from https://github.com/daneden/animate.css/#usage
$.fn.extend({
  animateCss: function(animationName, callback) {
    var animationEnd = (function(el) {
      var animations = {
        animation: 'animationend',
        OAnimation: 'oAnimationEnd',
        MozAnimation: 'mozAnimationEnd',
        WebkitAnimation: 'webkitAnimationEnd',
      };

      for (var t in animations) {
        if (el.style[t] !== undefined) {
          return animations[t];
        }
      }
    })(document.createElement('div'));

    this.addClass('animated ' + animationName).one(animationEnd, function() {
      $(this).removeClass('animated ' + animationName);

      if (typeof callback === 'function') callback();
    });

    return this;
  },
}); //end of jQuery extention for animation


//sounds from zapsplat
//music from https://www.w3schools.com/graphics/gametheme.mp3
