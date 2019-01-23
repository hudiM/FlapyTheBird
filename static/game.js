const GAME_WIDTH = 1280;
const GAME_HEIGHT = 720;


class Bird {
    constructor(){
        // get birds div element
        this.birdDisplay = document.getElementById('bird');
        // store it's current location and fall speed
        this.position = {
            x: 150,
            y: 150,
            fall: 1,
            fallReset: 120 // variable to slow timer
        };
        // store size of bird
        this.size = {
            height: 45,
            width: 64,
        }
    }
    // move bird up
    moveUp() {
        // check if hit bottom
        if(this.position.y >= 50){
            // move the bird up by x px
            this.position.y -= 50;
            // display on user side
            this.birdDisplay.style.top = this.position.y+'px';
            // reset fall speed
            this.position.fall = 1;
        }
        // if hit bottom end game
        else{hit()}
    }
    // move bird down
    moveDown() {
        // check if hit top of screen
        if(this.position.y <= GAME_HEIGHT-this.size.height-this.position.fall){
            // change y position on JS side by fall speed
            this.position.y += this.position.fall;
            // display on user side
            this.birdDisplay.style.top = this.position.y+'px';
            // trickery to slow down execution time
            this.position.fallReset++;
            if(this.position.fall < 10 && this.position.fallReset > 4){
                // speed up fall
                this.position.fall++;
                // reset execution slower
                this.position.fallReset = 0;
            }
        }
        else{hit()}
    }
    // move bird down when player died
    moveDeath() {
        // pretty much same as move down
        if(this.position.y <= GAME_HEIGHT-this.size.height-this.position.fall){
            this.position.y += this.position.fall;
            this.birdDisplay.style.top = this.position.y+'px';
            this.position.fallReset++;
            if(this.position.fall < 10 && this.position.fallReset > 4){
                this.position.fall++;
                this.position.fallReset = 0;
            }
        }
    }
}

class Wall {
    constructor(wallID, upperHeight, lowerHeight , lowerPosY){
        // get div elements
        this.wallDisplayU = document.getElementById('wall-upper-'+wallID);
        this.debugU = document.getElementById('wall-upper-hitbox-'+wallID);
        this.wallDisplayL = document.getElementById('wall-lower-'+wallID);
        this.debugL = document.getElementById('wall-lower-hitbox-'+wallID);
        // store walls own id
        this.wallID = wallID;
        // store coordinates and sizes
        this.upperPosition = {
            x: 1280,
            y: 0,
            height: upperHeight,
            width: 52,
        };
        this.lowerPosition = {
            x: 1280,
            y: lowerPosY,
            height: lowerHeight,
            width: 52,
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
        // check if bird hit this wall
        this.hitBox();
    }
    // check if wall's been hit
    hitBox() {
        if((bird.position.x > this.lowerPosition.x && bird.position.x < this.lowerPosition.x+this.lowerPosition.width) ||
            (bird.position.x+bird.size.width > this.lowerPosition.x && bird.position.x+bird.size.width < this.lowerPosition.x+this.lowerPosition.width))
            if(bird.position.y < this.upperPosition.height || bird.position.y+bird.size.height > this.lowerPosition.y)
                hit();
    }
}

// get general elements
let gameWindow = document.getElementById('game-window');

// create bird html element
let birdObject = document.createElement('img');
birdObject.setAttribute("id", "bird");
birdObject.setAttribute("class", "bird");
birdObject.setAttribute("height", "45");
birdObject.setAttribute("width", "64");
birdObject.setAttribute("src", "/static/yellowbird-midflap.png");
// add bird to page
gameWindow.appendChild(birdObject);
// create bird JS element
let bird = new Bird();
// walls individual id when spawning
let newWallID = 0;
// create container for walls to store individual walls for deletion
let walls = [];

// move the bird down every x millisecond
let birdTimer = window.setInterval(function a(){
    bird.moveDown();
}, 25);

// animate the bird
let birdFlaps = window.setInterval(function a() {
    if(bird.birdDisplay.src.endsWith('downflap.png'))
        bird.birdDisplay.src = '/static/yellowbird-midflap.png';
    else if(bird.birdDisplay.src.endsWith('midflap.png'))
        bird.birdDisplay.src = '/static/yellowbird-upflap.png';
    else if(bird.birdDisplay.src.endsWith('upflap.png'))
        bird.birdDisplay.src = '/static/yellowbird-downflap.png';
}, 50);

// spawn a new wall every x millisecond
let wallSpawnTimer = setInterval(function a(){
    // variable for wall height generated randomly
    let boxHeight = Math.floor(Math.random()*20);
    // calculate bottom and middle height by the top height
    let upperHeight = boxHeight*26;
    let lowerHeight = (20-boxHeight)*26;
    let lowerPositionY = GAME_HEIGHT-(lowerHeight+upperHeight)+upperHeight;
    // create top wall div
    let newWallDiv = document.createElement('div');
    newWallDiv.setAttribute("id", "wall-upper-"+newWallID);
    newWallDiv.setAttribute("class", "wall-upper");
    // add top wall div to page
    gameWindow.appendChild(newWallDiv);
    // create bottom wall div
    newWallDiv = document.createElement('div');
    newWallDiv.setAttribute("id", "wall-lower-"+newWallID);
    newWallDiv.setAttribute("class", "wall-lower");
    // add bottom wall div to page
    gameWindow.appendChild(newWallDiv);

    // create img blocks
    // check if we have more than just the top block
    if(boxHeight > 1)
        // for every extra block of space spawn a new middle block
        for(i=boxHeight;i>1;i--){
            // create img block element
            let newBlock = document.createElement('img');
            newBlock.setAttribute("src", "/static/pipe-green.png");
            newBlock.setAttribute("class", "image");
            // add the middle img block to the page
            document.getElementById('wall-upper-'+newWallID).appendChild(newBlock);
        }
    // create top img block
    let newTop = document.createElement('img');
    newTop.setAttribute("src", "/static/pipe-green-top.png");
    newTop.setAttribute("style", "transform: scaleY(-1)");
    // add the top img block to the page
    document.getElementById('wall-upper-'+newWallID).appendChild(newTop);
    // add the newly created wall to JS container for later deletion
    walls.push(new Wall(newWallID, upperHeight, lowerHeight, lowerPositionY));
    // increment the wallID for next wall spawning
    newWallID += 1;
}, 3000);

// move all walls every x millisecond
let wallTimer = setInterval(function a(){
    // variable to count how many walls to remove
    let deleteCommand = 0;
    // move every wall that's currently spawned (inside walls container)
    for(wall of walls){
        wall.move();
        // check if wall reached it's end
        if(wall.lowerPosition.x < -20){
            // add one to the number of walls to delete
            deleteCommand++;
            // remove the wall divs from the page
            document.getElementById('wall-upper-'+wall.wallID).remove();
            document.getElementById('wall-lower-'+wall.wallID).remove();
        }
    }
    // if there's a wall or more walls to delete, remove them from JS side
    if(deleteCommand){
        walls.splice(0,deleteCommand);
    }
}, 10);

// create jump event on any keypress
window.addEventListener("keypress", jump);
// function to move the bird up on keypress
function jump() {
    bird.moveUp();
}

// if bird hit any boundary kill
function hit(){
    // remove keypress check
    window.removeEventListener('keypress', jump);
    // clear timers for game events
    clearInterval(birdTimer);
    clearInterval(birdFlaps);
    clearInterval(wallSpawnTimer);
    clearInterval(wallTimer);
    // make a timer that moves the bird to the bottom of the page
    let birdTimerDeath = window.setInterval(function a(){
        bird.moveDeath();
    }, 25);
    // debug string
    console.log('Wall hit!')
}
