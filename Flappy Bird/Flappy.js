var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
const FPS = 60;
const GAP = 100; //100
const MIN_Y_PIPE = 20;
const DIST_BTW_PIPE = 188;
var gravity = 0.40;
var push = false;
var best = 0;

function Bird() {
    this.x = 50;
    this.y = canvas.height / 2;
    this.vy = 0;
    this.r = 10;
    this.score = 0;
    this.brain = new NeuralNetwork(4,4,1);
    this.think = function() {
        var inputs = [];
        inputs[0] = this.y;
        var closestPipe = null;
        for(var i=0; i<pipes.content.length; i++){
            if(pipes.content[i][1]){
                closestPipe = pipes.content[i][0];
                break;
            }
        }
        inputs[1] = closestPipe.x;
        inputs[2] = closestPipe.y;
        inputs[3] = closestPipe.y + GAP;
        var outputs = this.brain.feedForward(inputs);
        if(outputs.data[0] > 0.5){
            this.up();
        }
    }
    this.drawScore = function() {
        ctx.fillStyle = "rgba(255,255,255," + 1 + ")";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "small-caps 40px dejavu sans mono";
        ctx.fillText(this.score, canvas.width - canvas.width/8, canvas.height / 12);
    }
    this.show = function() {
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    };
    this.update = function() {
        this.vy += gravity;
        this.y += this.vy;
        if(this.y > canvas.height - this.r){
            this.y = canvas.height - this.r;
            this.vy = 0;
        }
        if(this.y < this.r){
            this.y = this.r;
            this.vy = 0;
        }
    };
    this.up = function() {
        this.vy = -8;
    }
    this.collision = function() {
        var p = pipes.content[0][0];
        if(this.x + this.r > p.x && this.x - this.r < p.x + p.width && 
            (this.y - this.r < p.y || this.y + this.r > p.y + GAP)){
                newGame();
        }
    };
    this.scoreUp = function() {
        var p = pipes.content[0];
        if(this.x > p[0].x + p[0].width && p[1]){
            this.score++;
            p[1] = false;
        }
        if(this.score > best) best = this.score;
    }
}

function Pipe() {
    this.width = 20;
    this.x = canvas.width + this.width;
    this.y = Math.random() * (canvas.height - MIN_Y_PIPE * 2 - GAP) + MIN_Y_PIPE; 
    this.vx = 200 / FPS;
    this.show = function() {
        ctx.fillStyle = "salmon";
        ctx.fillRect(this.x, 0, this.width, this.y);
        ctx.fillRect(this.x, this.y + GAP, this.width, canvas.height - this.y - GAP);
    }
    this.update = function() {
        this.x -= this.vx;
    }
}

function Pipes() {
    this.content = [[new Pipe(), true]];
    this.index = 0;
    this.show = function() {
        for(var i=0; i<this.content.length; i++){
            this.content[i][0].show();
        }
    }
    this.update = function() {
        if(this.content[this.index][0].x <= DIST_BTW_PIPE){
            this.content.push([new Pipe(), true]);
            this.index ++;
        }
        if(this.content[0][0].x < -this.content[0][0].width){
            this.content.splice(0,1);
            this.index --;
        }
        for(var i=0; i<this.content.length; i++){
            this.content[i][0].update();
        }
    }
}

function newGame() {
    bird = new Bird();
    pipes = new Pipes();
    score = 0;
}

function drawBest() {
    ctx.fillStyle = "rgba(255,255,255," + 1 + ")";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "small-caps 40px dejavu sans mono";
    ctx.fillText("BEST "+best, canvas.width/4, canvas.height / 12);
}

var bird = new Bird();
var pipes = new Pipes();


function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    bird.show();
    pipes.show();
    bird.scoreUp();
    bird.drawScore();
    drawBest();
    bird.update();
    pipes.update();
    bird.collision();
}

function keyDown(evt) {
    if(evt.keyCode == 32){
        if(!push){
            bird.up();
            push = true;
        }
    }
}
function keyUp(evt) {
    if(evt.keyCode == 32){
        if(push){
            push = false;
        }
    }
}
setInterval(draw, 1000 / FPS);
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);
