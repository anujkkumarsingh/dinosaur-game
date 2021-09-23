var canvas = document.getElementById("mycanvas");
var ctx = canvas.getContext("2d");
var width = 700;
var height = 320;
var gravity = 2.08;
var isAlive = true;
var isMusicPlaying = false;
var counter = 0;
var scoreCounter = 0;
var score = 0;
var timer;
var cur_hurdle = {};

// Audio for background and jump
var jumpMusic = new Audio("audio/jump-sound.mp3");
var bgMusic = new Audio("audio/mario-music.mp3");
bgMusic.loop = true;
var deadMusic = new Audio("audio/dead-music.mp3");

// array to store the images of dino
var dinoImages = [];
var dinoImageUrls = [
  "img/trex1.png",
  "img/trex2.png",
  "img/trex3.png",
  "img/trex4.png",
];

// Load dino images in the array dinoImages
for (var i = 0; i < dinoImageUrls.length; i++) {
  var dinoImage = new Image();
  dinoImage.src = dinoImageUrls[i];
  dinoImages.push(dinoImage);
}

var dino = {};

dino.move = function () {
  this.speedY = this.speedY + gravity;
  this.y = this.y + this.speedY;

  if (this.y > 280) {
    this.y = 280;
    this.speedY = 0;
  }
};

// array to contain the clouds present on the screen
var clouds = [];
var cloudImage = new Image();
cloudImage.src = "img/cloud.png";

// function to get a new random cloud
function getCloud() {
  var cloud = {};
  cloud.images = [cloudImage];
  cloud.width = 50;
  cloud.height = 30;
  cloud.x = width;
  cloud.y = 30 + Math.random() * 75;
  cloud.isActive = true;
  cloud.speedX = -4 - Math.random() * 4;
  cloud.speedY = 0;

  cloud.move = function () {
    this.x = this.x + this.speedX;
    if (this.x < -100) {
      this.isActive = false;
    }
  };

  return cloud;
}

// array to store the hurdles present on the screen
var hurdles = [];
var hurdleImage = new Image();
hurdleImage.src = "img/hurdle.png";

// function to get a new random hurdle
function getHurdle() {
  var hurdle = {};
  hurdle.images = [hurdleImage];
  hurdle.width = 30;
  hurdle.height = 70;
  hurdle.x = width;
  hurdle.y = height - hurdle.height / 2 - 15;
  hurdle.isActive = true;
  hurdle.speedX = -9;
  hurdle.speedY = 0;

  hurdle.move = function () {
    this.x = this.x + this.speedX;
    if (this.x < -100) {
      this.isActive = false;
    }
  };

  return hurdle;
}

// image of land/horizon
var landImage = new Image();
landImage.src = "img/horizon.png";
var land = {};

land.move = function () {
  this.x = this.x + this.speedX;
  if (this.x < -this.width / 2) {
    this.x += this.width;
  }
};

// initialization function
function initialize() {
  // reset the canvas
  ctx.clearRect(0, 0, width, height);
  counter = 0;
  scoreCounter = 0;
  score = 0;
  clouds = [];
  hurdles = [];
  cur_hurdle = {};

  // dino
  dino.images = dinoImages;
  dino.width = 50;
  dino.height = 50;
  dino.x = 100;
  dino.y = 280;
  dino.speedX = 0;
  dino.speedY = 0;

  // land
  land.width = 1200;
  land.height = 12;
  land.images = [landImage];
  land.x = land.width / 2;
  land.y = height - 13;
  land.speedX = -4;
  land.speedY = 0;
  land.repeatX = 1;

  // health and music
  isAlive = true;
  isMusicPlaying = false;
  bgMusic.currentTime = 0;
  // bgMusic.play();
  deadMusic.pause();
  deadMusic.currentTime = 0;

  clearInterval(timer);
  timer = setInterval(execute, 50);
}

// function to draw different objects on the canvas
function drawObject(object) {
  //find current index of image to be used.
  var currentImageIndex = counter % object.images.length;
  //access image from array of images
  var currentImage = object.images[currentImageIndex];
  //draw on canvas
  try {
    ctx.drawImage(
      currentImage,
      object.x - object.width / 2,
      object.y - object.height / 2,
      object.width,
      object.height
    );
  } catch (er) {}

  // repeat the image of land
  if (object.repeatX === 1) {
    ctx.drawImage(
      currentImage,
      object.x + object.width / 2,
      object.y - object.height / 2,
      object.width,
      object.height
    );
  }
}

// update the canvas
function update() {
  scoreCounter++;
  counter++;
  score = parseInt(scoreCounter / 10);

  // Increase game speed with time
  if (score > 150) {
    clearInterval(timer);
    timer = setInterval(execute, 10);
  } else if (score > 100) {
    clearInterval(timer);
    timer = setInterval(execute, 20);
  } else if (score > 50) {
    clearInterval(timer);
    timer = setInterval(execute, 30);
  } else if (score > 30) {
    clearInterval(timer);
    timer = setInterval(execute, 40);
  }

  if (counter % 30 == 0) {
    // Create new cloud and store it in the array named clouds
    var cloud = getCloud();
    clouds.push(cloud);
  }

  if (counter % 60 == 0) {
    // create new hurdle and store it in the array named hurdles
    var hurdle = getHurdle();
    hurdles.push(hurdle);
  }

  // clear all background to white and write the score
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.font = "30px Arial";
  ctx.fillStyle = "#000000";
  ctx.fillText("Score: " + score, width - 180, 50);

  // draw Dino on the screen
  dino.move();
  drawObject(dino);

  // draw Clouds
  var cloudsFinal = [];
  for (var i = 0; i < clouds.length; i++) {
    var cloud = clouds[i];
    cloud.move();
    drawObject(cloud);

    if (cloud.isActive == true) {
      cloudsFinal.push(cloud);
    }
  }
  clouds = cloudsFinal;

  // draw Hurdles
  var hurdlesFinal = [];
  cur_hurdle = hurdles[0];
  for (var i = 0; i < hurdles.length; i++) {
    var hurdle = hurdles[i];
    hurdle.move();
    drawObject(hurdle);

    if (hurdle.isActive == true) {
      hurdlesFinal.push(hurdle);
    }
  }
  hurdles = hurdlesFinal;

  // draw land
  land.move();
  drawObject(land);
}

// detect spacebar and play background music
document.addEventListener("keydown", function (event) {
  if (event.code === "Space") {
    // Make dino jump
    if (dino.y == 280) {
      jumpMusic.play();
      dino.speedY = -20;
    }

    // to restart the game
    if (isAlive == false) {
      initialize();
    }
  }

  if (!isMusicPlaying) {
    isMusicPlaying = true;
    bgMusic.play();
  }
});

initialize();

function execute() {
  if (isAlive == true) {
    // update the canvas
    update();

    // collision detection and game over
    try {
      if (cur_hurdle.x < 130 && cur_hurdle.x > 70 && dino.y > 220) {
        ctx.fillText("!! Game Over !!", width / 2 - 100, height / 2);
        ctx.fillText("Press Spacebar to Restart", 175, height / 2 + 35);
        isAlive = false;
        bgMusic.pause();
        deadMusic.play();
      }
    } catch (er) {}
  }
}
