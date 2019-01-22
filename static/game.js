const GAME_WIDTH = 1280;
const GAME_HEIGHT = 720;


class Bird {
    constructor(){
        // get birds div element
        this.birdDisplay = document.getElementById('bird');
        // store it's current location
        this.position = {
            x: 50,
            y: 150,
            fall: 1,
            fallReset: 120
        };
        // store size of bird
        this.size = {
            height: 45,
            width: 64,
        }
    }
    // move bird up
    moveUp() {
        if(this.position.y >= 50){
            this.position.y -= 50;
            this.birdDisplay.style.top = this.position.y+'px';
            this.position.fall = 1;
        }
        else{hit()}
    }
    // move bird down
    moveDown() {
        if(this.position.y <= GAME_HEIGHT-64-this.position.fall){
            this.position.y += this.position.fall;
            this.birdDisplay.style.top = this.position.y+'px';
            this.position.fallReset++;
            if(this.position.fall < 10 && this.position.fallReset > 4){
                this.position.fall++;
                this.position.fallReset = 0;
            }
        }
        else{hit()}
    }
}

class Wall {
    constructor(wallID, upperHeight, lowerHeight , lowerPosY){
        // get div elements
        this.wallDisplayU = document.getElementById('wall-upper-'+wallID);
        this.wallDisplayL = document.getElementById('wall-lower-'+wallID);
        // store walls own id
        this.wallID = wallID;
        // store coordinates
        this.upperPosition = {
            x: 1280,
            y: 0,
            height: upperHeight,
            width: 20,
        };
        this.lowerPosition = {
            x: 1280,
            y: lowerPosY,
            height: lowerHeight,
            width: 20,
        };
    }
    // move wall left by n pixel
    move() {
        // move walls x position
        this.lowerPosition.x -= 2;
        this.upperPosition.x -= 2;
        // display changes on page
        this.wallDisplayU.style.cssText = 'left: '+this.upperPosition.x+'px;height: '+this.upperPosition.height+'px;';
        this.wallDisplayL.style.cssText = 'top: '+this.lowerPosition.y+'px;left: '+this.lowerPosition.x+'px;height: '+this.lowerPosition.height+'px;';
        this.hitBox();
    }
    // check if wall's been hit
    hitBox() {
        if(bird.position.x+bird.size.width >= this.lowerPosition.x && bird.position.x+bird.size.width < this.lowerPosition.x+this.lowerPosition.width)
            if(bird.position.y < this.upperPosition.height || bird.position.y+bird.size.height > this.lowerPosition.y)
                hit();
    }
}

function hit(){
    window.removeEventListener('keypress', jump);
    clearInterval(wallTimer);
    clearInterval(wallSpawnTimer);
    clearInterval(birdFlaps);
    console.log('Wall hit!')
}

// get general elements
let gameWindow = document.getElementById('game-window');

// create bird
let birdObject = document.createElement('img');
birdObject.setAttribute("id", "bird");
birdObject.setAttribute("class", "bird");
birdObject.setAttribute("height", "45");
birdObject.setAttribute("width", "64");
birdObject.setAttribute("src", "/static/yellowbird-midflap.png");
gameWindow.appendChild(birdObject);
let bird = new Bird();
// walls individual id
let newWallID = 0;
// create container for walls
let walls = [];

// move the bird down every x millisecond
let birdTimer = window.setInterval(function a(){
    bird.moveDown();
}, 25);

let birdFlaps = window.setInterval(function a() {
    if(bird.birdDisplay.src.endsWith('downflap.png'))
        bird.birdDisplay.src = '/static/yellowbird-midflap.png';
    else if(bird.birdDisplay.src.endsWith('midflap.png'))
        bird.birdDisplay.src = '/static/yellowbird-upflap.png';
    else if(bird.birdDisplay.src.endsWith('upflap.png'))
        bird.birdDisplay.src = '/static/yellowbird-downflap.png';
}, 50);

// //////////////////////////////////////////
//           experimental stuff
// //////////////////////////////////////////
// spawn a new wall every x millisecond
let wallSpawnTimer = setInterval(function a(){
    let upperHeight = Math.floor(Math.random()*500);
    let lowerHeight = 720-upperHeight-200;
    let lowerPositionY = upperHeight+200;
    let newWallDiv = document.createElement('div');
    newWallDiv.setAttribute("id", "wall-upper-"+newWallID);
    newWallDiv.setAttribute("class", "wall-upper");
    gameWindow.appendChild(newWallDiv);
    newWallDiv = document.createElement('div');
    newWallDiv.setAttribute("id", "wall-lower-"+newWallID);
    newWallDiv.setAttribute("class", "wall-lower");
    gameWindow.appendChild(newWallDiv);
    walls.push(new Wall(newWallID, upperHeight, lowerHeight, lowerPositionY));
    newWallID += 1;
}, 3000);

// move all walls every x millisecond
let wallTimer = setInterval(function a(){
    let deleteCommand = 0;
    for(wall of walls){
        wall.move();
        // check if wall reached it's end
        if(wall.lowerPosition.x < -20){
            deleteCommand++;
            document.getElementById('wall-upper-'+wall.wallID).remove();
            document.getElementById('wall-lower-'+wall.wallID).remove();
        }
    }
    if(deleteCommand){
        walls.splice(0,deleteCommand);
    }
}, 10);


window.addEventListener("keypress", jump);

function jump() {
    bird.moveUp();
}