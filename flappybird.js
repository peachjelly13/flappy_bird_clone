let board;
let boardwidth = 360;
let boardheight = 640;
let context;

let birdwidth = 34;
let birdheight = 24;
let birdimage;
let gameOver = false;
let score = 0;
//Need 4 parameters to specify the bird on the page 
let birdX = boardwidth/8;
let birdY = boardheight/2;

//Drawing our bird object
let bird = {
    x:birdX,
    y:birdY,
    width:birdwidth,
    height:birdheight
}

//pipes

let pipeArray = [];
let pipewidth = 64;
let pipeheight = 512;
//Here these are the x and y coordinates of my pipe 
let pipeX = boardwidth;
let pipeY = 0;
let toppipeimg;
let bottompipeimg;

//physics
let velocityX = -2; // pipes moving left 
let velocityY = 0; //bird speed there will be a change in the y position
let gravity = 0.4; // this brings it down

window.onload=function(){
    board = document.getElementById("board");
    board.height = boardheight;
    board.width = boardwidth;
    context = board.getContext("2d"); // for drawing on the board do changes here

    //context.fillstyle = "green";
    //context.fillRect(bird.x,bird.y,birdwidth,birdheight);

    //loading the birdimage
    //classic example of how to draw an image using canvas
    birdimage = new Image();
    birdimage.src = "./flappybird.png";
    birdimage.onload=function(){
        context.drawImage(birdimage,bird.x,bird.y,bird.width,bird.height);

    }
    toppipeimg = new Image();
    bottompipeimg = new Image();
    toppipeimg.src = "./toppipe.png";
    bottompipeimg.src = "./bottompipe.png";
    requestAnimationFrame(update);
    setInterval(placepipes,1700);
    document.addEventListener("keydown",movebird);    
    

}

function update(){
    requestAnimationFrame(update);
    if(gameOver){
        return;
    }
    //we want to clear everything on the canvas 
    context.clearRect(0,0,board.width,board.height);
    velocityY+=gravity
    bird.y = Math.max(bird.y+velocityY,0);
    context.drawImage(birdimage,bird.x,bird.y,bird.width,bird.height);
    
    if(bird.y>board.height){
        gameOver = true;
    }
    //pipes
    for(let i =0;i<pipeArray.length;i++){
        let pipe = pipeArray[i];
        pipe.x +=velocityX;
        context.drawImage(pipe.img,pipe.x,pipe.y,pipe.width,pipe.height);
        if(!pipe.passed && bird.x> pipe.x+ pipe.width){
            score+=0.5;
            pipe.passed=true;

        }
        if(detectcollision(bird,pipe)){
            gameOver = true;
        }
    }


    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score,5,45);

}
function placepipes(){
    if(gameOver){
        return;
    }
    let randompipeY = pipeY-pipeheight/4-(Math.random()*(pipeheight/2));
    let spacebetween = board.height/3;
    let toppipe = {
        img: toppipeimg,
        x: pipeX,
        y:randompipeY,
        width:pipewidth,
        height:pipeheight,
        passed:false
    }
    let bottompipe={
        img:bottompipeimg,
        x:pipeX,
        y:randompipeY+pipeheight+spacebetween,
        width:pipewidth,
        height:pipeheight,
        passed:false

    }
    pipeArray.push(toppipe);
    pipeArray.push(bottompipe);
}

//This is a function movebird and it takes a parameter key
function movebird(e){
    if(e.code=="Space" || e.code=="ArrowUp"){
        velocityY = -6;
    }

}
function detectcollision(a,b){
    return a.x<b.x+b.width && a.x+a.width>b.x && a.y<b.y+b.height && a.y+a.height>b.y;
}