var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var FPS = 60 * 100;
const GAP = 100; //100
const MIN_Y_PIPE = 50;
const DIST_BTW_PIPE = 188;
const POP_SIZE = 800;
var gravity = 0.25;
var push = false;
var best = 0;
var gene = 0;
var CurrentBest = 0;
var AUTOMATIC = true;
var bestScore = 0;

function slow() {
    clearInterval(intervalID);
    intervalID = setInterval(draw, 1000 / 60);
}

function speed() {
    clearInterval(intervalID);
    intervalID = setInterval(draw, 1);
}

function conti() {
    AUTOMATIC = true;
}

function bestBird() {
    AUTOMATIC = false;
    pipes = new Pipes();
    bird0 = JSON.parse(localStorage.getItem("best"));
    bird = new Bird(0);
    this.bird.brain.weight0.data = bird0.brain.weight0._data;
    this.bird.brain.weight1.data = bird0.brain.weight1._data;
}

// TEST 
/*var nn = new NeuralNetwork(4,4,1);
console.table(nn.weight0.data);
console.table(nn.weight1.data);
nn.mutate(0.5);
console.table(nn.weight0.data);
console.table(nn.weight1.data);*/
// FIN TEST

function Bird(num) {

    this.num = num;
    this.x = 50;
    this.y = canvas.height / 2;
    this.vy = 0;
    this.r = 10;
    this.score = 0;
    this.brain = new NeuralNetwork(4,8,1);
    this.alive = true;
    this.fitness = 0;
    this.think = function() {
        var inputs = [];
        inputs[0] = this.y / canvas.height;
        var closestPipe = null;
        for(var i=0; i<pipes.content.length; i++){
            if(pipes.content[i][1]){
                closestPipe = pipes.content[i][0];
                break;
            }
        }
        inputs[1] = closestPipe.x / canvas.width;
        inputs[2] = closestPipe.y / canvas.height;
        inputs[3] = this.vy / 15;
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
    this.show = function(color) {
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
        /*ctx.fillStyle = "black";
        ctx.font = "small-caps 3px dejavu sans mono";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.num, this.x, this.y);*/
    };
    this.update = function() {
        this.think();
        this.vy += gravity;
        this.y += this.vy;
        if(this.y > canvas.height + this.r){
            this.alive = false;
        }
        if(this.y < - this.r){
            this.alive = false;
        }
    };
    this.up = function() {
        this.vy = -5;
    }
    this.collision = function() {
        var p = pipes.content[0][0];
        if(this.x + this.r > p.x && this.x - this.r < p.x + p.width && 
            (this.y - this.r < p.y || this.y + this.r > p.y + GAP)){
                this.alive = false;
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
    this.vx = 100 / 60;
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

//FONCTION GENETIQUE

function firstGen() {
    for(var i=0; i<POP_SIZE; i++){
        birds[i] = new Bird(i);
    }
}

function trie(birds){
    birds.sort(function(a,b) {
        return b.fitness - a.fitness;
    })
}

function newGeneration(birds) {
    var newBirds = [];
    trie(birds);
    if(birds[0].fitness == best){
        localStorage.setItem("best", JSON.stringify(birds[0]));
        console.log(best);
    }
    var x = 0;
    CurrentBest = 0;
    for(var i=0; i<POP_SIZE/4; i++){
        newBirds[x] = new Bird(x);
        newBirds[x].brain = birds[i].brain.copy();
        x++;
    }
    for(var i=0; i<POP_SIZE/4; i++){
        newBirds[x] = new Bird(x);
        newBirds[x].brain = birds[i].brain.copy();
        newBirds[x].brain.mutate(0.1);
        x++
    }
    for(var i=0; i<POP_SIZE/4; i++){
        newBirds[x] = new Bird(x);
        newBirds[x].brain = birds[i].brain.copy();
        newBirds[x].brain.mutate(0.5);
        x++
    }
    for(var i=0; i<POP_SIZE/4; i++){
        newBirds[x] = new Bird(x);
        x++
    }
    
    return newBirds;
}

//newGeneration
    //trouve les 5 meilleurs
    //copy les 5 meilleurs
    //fais muter les 5 meilleur avec prob de 10%
    //fais muter les 5 meilleur avec prob de 50%
    //genere un totalement aleatoire

//FIN FONCTION GENETIQUE



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
    ctx.fillText("BEST "+bestScore, canvas.width/4, canvas.height / 12);
}

function drawGen() {
    ctx.fillStyle = "rgba(255,255,255," + 1 + ")";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "small-caps 40px dejavu sans mono";
    ctx.fillText("GEN "+gene, canvas.width/4, canvas.height / 12);
}


function maxScore(score) {
    var max = 0;
    for(var i=0; i<score.length; i++){
        if(score[i] > max){
            max = score[i];
        }
    }
    return max;
}

function drawScore(score) {
    ctx.fillStyle = "rgba(255,255,255," + 1 + ")";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "small-caps 40px dejavu sans mono";
    ctx.fillText(score, canvas.width - canvas.width/8, canvas.height / 12);
}

var pipes = new Pipes();

var birds = [];
firstGen();
var bird;

var score = [];
var time = 0;
function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // si tout le monde est mort
    if(AUTOMATIC){
        var fin = true;
        for(var i=0; i<birds.length; i++){
            if(birds[i].alive){
                fin = false;
            }
        }
        if(fin){
            gene ++
            birds = newGeneration(birds);
            pipes = new Pipes();
        }
        for(var i=birds.length - 1; i>=0; i--){
            if(birds[i].alive){
                if(i == 0){
                    birds[i].show("rgba(255,255,255,1)");
                }else{
                    birds[i].show("rgba(255,255,255,0.3)");
                }
                birds[i].fitness++;
                if(birds[i].fitness > CurrentBest) CurrentBest = birds[i].fitness;
                birds[i].scoreUp();
                birds[i].update();
                birds[i].collision();
                score[i] = birds[i].score;
            }
        }
        if(CurrentBest > best) best = CurrentBest;
        pipes.show();
        pipes.update();
        drawScore(CurrentBest);
        drawGen();
    }else{
        bird.show("white");
        bird.update();
        bird.scoreUp();
        pipes.show();
        pipes.update();
        drawBest();
        if(bird.score > bestScore) bestScore = bird.score;
        bird.drawScore();
        bird.collision();
        if(!bird.alive){
            console.log("HEY !!!");
            bestBird();
        }
    }
}

function keyDown(evt) {
    if(evt.keyCode == 32){
        if(!push){
            bird.up();
            push = true;
        }
    }
    if(evt.keyCode == 38){
        console.log(best);
    }
}
function keyUp(evt) {
    if(evt.keyCode == 32){
        if(push){
            push = false;
        }
    }
}
intervalID = setInterval(draw, 1000 / 60);
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);
