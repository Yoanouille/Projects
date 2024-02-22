const canvas = document.getElementById("cvs");
const ctx = canvas.getContext("2d");

const width = canvas.width = 400;
const height = canvas.height = 600;

ctx.textAlign = "center";
ctx.font = "small-caps 36px dejavu sans mono";
ctx.textBaseLine = "middle";

let intervalID;

/***************************
 * INITIALISATION DU GRAPH *
 ***************************/

const canvas2 = document.getElementById("cvs2");
const ctx2 = canvas2.getContext("2d");

const width2 = canvas2.width = 600;
const height2 = canvas2.height = 600;

ctx2.fillStyle = "black";
ctx2.fillRect(0,0,width2,height2);

let cX = 100;
let cY = 100;

let Xlen = 400;
let Ylen = 400;

line2(cX,height - cY,cX + Xlen,height - cY, 3);
line2(cX,height - cY,cX,height - (cY + Ylen), 3);

/**************************************************************
 * INITIALISATION DES CONSTANTES ET DECLERATION DES VARIABLES * 
 **************************************************************/


const BirdRadius = 8
const Gravity = 0.4;
const GAP = 150;
const PipeWidth = 20;
const PipeSpeed = 4;
const PipeInterval = 200;
const ColorPipe = "lightgreen";
const PopSize = 300;

let bestEver = null;
let bestFitnessEver = 0;
let gen = 0;
let score = 0;
let points = [0];

let birds = [];
let pipes = [];
let pipe;


/***********************
 * CREATION DES OBJETS *
 ***********************/

function Bird(x,y) {
    this.x = x;
    this.y = y;
    this.vy = 0;
    this.dead = false;
    this.fitness = 0;
    this.score = 0;
    this.color = "rgba(255,255,255,0.5)";

    this.brain = new NeuralNetwork(3,4,1);

    this.show = function() {
        if(!this.dead) {
            cercle(this.x,this.y,BirdRadius,this.color);
        }
    }

    this.getData = function(pipes) {
        let p;
        for(let i = 0; i < pipes.length; i++) {
            if(!pipes[i].useless) {
                p = pipes[i];
                break;
            }
        }
        let dy = this.y - (p.y + GAP / 2);
        let dx = (this.x - BirdRadius) - (p.x + PipeWidth);
        let vy = this.vy;

        dy /= height;
        dx /= width;
        vy /= 10;

        return [dx,dy,vy];

    }

    this.think = function(pipes) {
        let input = this.getData(pipes);
        let output = this.brain.feedForward(input)[0][0];
        if(output > 0.5) {
            this.up();
        }
    }

    this.update = function() {
        if(!this.dead) {
            this.fitness++;
            this.score = score;
            this.think(pipes);
            this.vy += Gravity;
            this.y += this.vy;
        }
    }

    this.up = function() {
        this.vy = -7;
    }

    this.colosion = function(pipes) {
        if(this.y + BirdRadius < 0 || this.y - BirdRadius > height) {
            this.dead = true;
            return;
        }
        let p;
        for(let i = 0; i < pipes.length; i++) {
            if(!pipes[i].useless) {
                p = pipes[i];
                break;
            }
        }
        if((this.x + BirdRadius > p.x)&&(this.y - BirdRadius < p.y || this.y + BirdRadius > p.y + GAP)) {
            this.dead = true;
        }
    }

    this.mutate = function(rate) {
        this.brain.mutate(rate);
    }
}

function Pipe() {
    this.x = width + PipeWidth;
    this.y = random(0, height - GAP);
    this.useless = false;
    this.hidden = false;

    this.show = function() {
        ctx.fillStyle = ColorPipe;
        ctx.fillRect(this.x,0,PipeWidth,this.y);

        ctx.fillStyle = ColorPipe;
        ctx.fillRect(this.x,this.y + GAP,PipeWidth,height);
    }

    this.update = function() {
        this.x -= PipeSpeed;
        if(this.x < -PipeWidth) {
            this.hidden = true;
        }
        if(this.x + PipeWidth + BirdRadius < width / 8 && !this.useless) {
            this.useless = true;
            score++;
        }
    }
}

/***********************
 * FONCTIONS GENETIQUE *
 ***********************/

function nextGeneration() {
    //NORMALISE SOUS LA FORME D'UN POURCENTAGE LE FITNESS
    let totalFitness = 0;
    let bestFitness = 0;
    let bestGeneration;
    let point;
    for(let i = 0; i < birds.length; i++) {
        birds[i].fitness *= birds[i].score + 1;
        totalFitness += birds[i].fitness;
        if(birds[i].fitness > bestFitness) {
            bestFitness = birds[i].fitness;
            bestGeneration = birds[i];
            point = birds[i].score;
        }
    }
    points.push(point);
    //APPELLE LE GRAPH
    drawGraph();

    for(let i = 0; i < birds.length; i++) {
        birds[i].fitness /= totalFitness;
    }

    //ON SAUVEGARDE LE MEILLEUR DU MEILLEUR
    if(bestFitness > bestFitnessEver) {
        bestFitnessEver = bestFitness;
        bestEver = bestGeneration;
    }

    //CREER UNE NOUVELLE POPULATION A PARTIR DE L'ANCIENNE
    newPop = [];
    newPop[0] = new Bird(width / 8, height / 2);
    newPop[0].brain = bestGeneration.brain.copy();
    newPop[0].color = "rgba(0,0,255,0.7)";
    for(let i = 1; i < PopSize; i++) {
        //CROSSOVER ENTRE DEUX INDIVIDUS DE L'ANCIENNE POPULATION CHOISI EN FONCTION DE LEUR FITNESS
        let p1 = pick(birds);
        let p2 = pick(birds);
        let p = crossOverBird(p1,p2);

        //ON LE FAIT MUTER SELON UN POURCENTAGE
        p.mutate(i / PopSize);
        newPop.push(p);
    }

    birds = newPop;
    gen++;
    
}

function crossOverNeural(nn0,nn1) {
    let nn = new NeuralNetwork(0,0,0);
    nn.weight0 = nn0.weight0.copy();
    nn.weight1 = nn1.weight1.copy();
    nn.bias0 = nn0.bias0.copy();
    nn.bias1 = nn1.bias1.copy();
    return nn;
}

function crossOverBird(b1,b2) {
    let b = new Bird(width / 8, height / 2);
    b.brain = crossOverNeural(b1.brain,b2.brain);
    return b;
}

function pick(pop) {
    let r = random(0,1);
    for(let i = 0; i < pop.length; i++) {
        if(pop[i].fitness >= r) {
            return pop[i];
        }
        r -= pop[i].fitness;
    }

}
/*****************
 * FONCTION MAIN *
 *****************/


function setup() {
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,width,height);

    for(let i = 0; i < PopSize; i++) {
        birds[i] = new Bird(width / 8, height / 2);
    }    
    pipes.push(new Pipe());

    intervalID = setInterval(draw, 1000 / 60);
    //draw();
}
setup()

function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,width,height);

    let x = 0;
    for(let i = 0; i < birds.length; i++) {
        if(!birds[i].dead) {
            birds[i].show();
            birds[i].update();
            birds[i].colosion(pipes);
            x++;
        }
    } 
    if(x == 0) {
        restart();
        return;
    }

    for(let i = pipes.length - 1; i >= 0; i--) {
        if(pipes[i].hidden) {
            pipes.splice(i,1);
        } else {
            pipes[i].show();
            pipes[i].update();
        }
    }
    if(pipes[pipes.length - 1].x < width - PipeInterval) {
        pipes.push(new Pipe());
    }

    ctx.fillStyle = "white";
    ctx.fillText("GEN " + gen, width / 5, height / 14);

    ctx.fillStyle = "white";
    ctx.fillText(score, width - width / 8, height / 14);
}

function restart() {
    nextGeneration();

    pipes = [];
    pipes.push(new Pipe());

    score = 0;
}

/*************************
 * FONCTIONS AUXILIAIRES *
 *************************/

function cercle(x,y,r,c) {
    ctx.beginPath();
    ctx.fillStyle = c;
    ctx.arc(x,y,r,0,Math.PI * 2,true);
    ctx.closePath();
    ctx.fill();
}

function stop() {
    clearInterval(intervalID);
}

function dist(x0,y0,x1,y1) {
    return (x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0);
}

function map(a,b,c,d,e) {
    return ((a - b) / (c - b)) * (e - d) + d;
}

/*********************************************
 * FONCTION INTERAGISSANT AVEC L'UTILISATEUR *
 *********************************************/

document.addEventListener("keydown", keyDown);

function keyDown(evt) {
    //console.log(evt.keyCode);
    if(evt.keyCode == 32) {
        bird.up();
    }

    if(evt.keyCode == 107) {
        clearInterval(intervalID);
        intervalID = setInterval(draw, 1);
    }

    if(evt.keyCode == 109) {
        clearInterval(intervalID);
        intervalID = setInterval(draw, 1000 / 60);
    }
}


/****************
 * LE GRAPHIQUE *
 ****************/

function drawGraph() {
    ctx2.fillStyle = "black";
    ctx2.fillRect(0,0,width2,height2);
    line2(cX,height - cY,cX + Xlen,height - cY, 3);
    line2(cX,height - cY,cX,height - (cY + Ylen), 3);
    let max = 0;
    for(let i = 0; i < points.length; i++) {
        if(points[i] > max) max = points[i];
    }
    for(let i = 0; i < points.length; i++) {
        let x = map(i, 0, points.length - 1, cX, cX + Xlen);
        let y = map(points[i], 0, max, cY + Ylen, cY);

        let x1 = map(i + 1, 0, points.length - 1, cX, cX + Xlen);
        let y1 = map(points[i + 1], 0, max, cY + Ylen, cY);

        line2(x,y,x1,y1, 1);
    }
}


function cercle2(x,y,r,c) {
    ctx2.beginPath();
    ctx2.fillStyle = c;
    ctx2.arc(x,y,r,0,Math.PI * 2,true);
    ctx2.closePath();
    ctx2.fill();
}

function line2(x0,y0,x1,y1,w) {
    ctx2.strokeStyle = "white";
    ctx2.lineWidth = w;
    ctx2.beginPath();
    ctx2.moveTo(x0,y0);
    ctx2.lineTo(x1,y1);
    ctx2.stroke();
}