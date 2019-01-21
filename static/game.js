const GAME_WIDTH = 1280;
const GAME_HEIGHT = 720;

class Bird {
    constructor(){
        this.birdDisplay = document.getElementById('bird');
        this.position = {
            x: 50,
            y: 150,
        }
    }
    // move bird up
    moveUp() {
        if(this.position.y >= 32){
            this.position.y -= 50;
            this.birdDisplay.style.top = this.position.y+'px';
        }
    }
    // move bird down
    moveDown() {
        if(this.position.y <= GAME_HEIGHT-64-5){
            this.position.y += 5;
            this.birdDisplay.style.top = this.position.y+'px';
        }
    }
}

class Wall {
    constructor(wallID){
        // get div elements
        this.wallDisplayU = document.getElementById('wall-upper-'+wallID);
        this.wallDisplayL = document.getElementById('wall-lower-'+wallID);
        // store coordinates
        this.upperPosition = {
            x: 1280,
            y: 0,
        };
        this.lowerPosition = {
            x: 1280,
            y: 450,
        };
    }
    // move wall left by n pixel
    move() {
        this.lowerPosition.x -= 50;
        this.upperPosition.x -= 50;
        this.wallDisplayU.style.left = this.lowerPosition.x+'px';
        this.wallDisplayL.style.left = this.lowerPosition.x+'px';
    }
}


// get general elements
let gameWindow = document.getElementById('game-window');

// create bird
let bird = new Bird();
// create container for walls
let newWall = 1;
let walls = [];



// move the bird down every x millisecond
let birdTimer = window.setInterval(function a(){
    bird.moveDown();
}, 35);

// spawn a new wall every x millisecond
let wallSpawnTimer = setInterval(function a(){
    let wall = new Wall(newWall);
    walls.push(wall);
}, 5000);

// move all walls every x millisecond
let wallTimer = setInterval(function a(){
    for(wall of walls)
        wall.move();
}, 200);

// move wall left every x millisecond
// window.setInterval(function a(){
//     wall.move();
// }, 500);

document.getElementById("bird-up").addEventListener('click',function () {
    bird.moveUp();
});