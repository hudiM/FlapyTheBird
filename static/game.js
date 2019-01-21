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
        // store walls own id
        this.wallID = wallID;
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
        // move walls x position
        this.lowerPosition.x -= 50;
        this.upperPosition.x -= 50;
        // display changes on page
        this.wallDisplayU.style.left = this.lowerPosition.x+'px';
        this.wallDisplayL.style.left = this.lowerPosition.x+'px';
        // check if wall reached it's end
        if(this.lowerPosition.x < 20){
            document.getElementById('wall-upper-'+this.wallID).remove();
            document.getElementById('wall-lower-'+this.wallID).remove();
            deleteWall(this.wallID)
        }
    }
}


// get general elements
let gameWindow = document.getElementById('game-window');

// create bird
let bird = new Bird();
// create container for walls
let newWallID = 0;
let walls = [];



// move the bird down every x millisecond
let birdTimer = window.setInterval(function a(){
    bird.moveDown();
}, 35);

// spawn a new wall every x millisecond
let wallSpawnTimer = setInterval(function a(){
    let newWallDiv = document.createElement('div');
    newWallDiv.setAttribute("id", "wall-lower-"+newWallID);
    newWallDiv.setAttribute("class", "wall-lower");
    gameWindow.appendChild(newWallDiv);
    newWallDiv = document.createElement('div');
    newWallDiv.setAttribute("id", "wall-upper-"+newWallID);
    newWallDiv.setAttribute("class", "wall-upper");
    gameWindow.appendChild(newWallDiv);
    let wall = new Wall(newWallID);
    walls.push(wall);
    newWallID += 1;
}, 5000);

function deleteWall(id){
    walls.pop(id)
}

// move all walls every x millisecond
let wallTimer = setInterval(function a(){
    console.log(walls);
    for(wall of walls)
        wall.move();
}, 100);

// move wall left every x millisecond
// window.setInterval(function a(){
//     wall.move();
// }, 500);

document.getElementById("bird-up").addEventListener('click',function () {
    bird.moveUp();
});