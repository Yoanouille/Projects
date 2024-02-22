const canvas = document.getElementById("cvs");
const ctx = canvas.getContext("2d");

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

let intervalID;


const scl = 20;
const ligne = Math.floor(height / scl);
const colonne = Math.floor(width / scl);
const colorSnake = "white";

let snake;
let skip = 10;
let time = 0;
let moves = [];

/**********
 * OBJETS *
 **********/

function Snake() {
    this.x = randomInt(0,colonne);
    this.y = randomInt(0,ligne);

    this.vx = 1;
    this.vy = 0;

    this.len = 5;
    this.tail = [];

    this.dead = false;

    this.show = function() {
        ctx.fillStyle = colorSnake;
        ctx.fillRect(this.x * scl + 1, this.y * scl + 1, scl - 1, scl - 1);

        for(let i = 0; i < this.tail.length; i++) {
            let x = this.tail[i][0];
            let y = this.tail[i][1];
            ctx.fillRect(x * scl + 1, y * scl + 1, scl - 1, scl - 1);
        }
    }

    this.update = function() {
        if(moves.length != 0) {
            if(this.vy != -moves[0][1] && this.vx != -moves[0][0]) {
                this.vx = moves[0][0];
                this.vy = moves[0][1];
            }
            moves.splice(0,1);
        }
        this.tail.push([this.x,this.y]);
        while(this.tail.length > this.len) {
            this.tail.splice(0,1);
        }
        this.x += this.vx;
        this.y += this.vy;
        if(this.touch() || this.edge()) {
            this.dead = true;
        }
    }

    this.touch = function() {
        for(let i = 0; i < this.tail.length; i++) {
            if(this.tail[i][0] == this.x && this.tail[i][1] == this.y) {
                return true;
            }
        }
        return false;
    }

    this.edge = function() {
        return (this.x < 0 || this.x >= colonne || this.y < 0 || this.y >= ligne);
    }
}

function Apple(x,y) {
    this.x = x;
    this.y = y;
    
}


/*****************
 * FONCTION MAIN *
 *****************/

function setup() {
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,width,height);
    snake = new Snake();
    //draw();
    intervalID = setInterval(draw, 1000 / 60);
}
setup();

function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,width,height);

    snake.show();
    if(time % skip == 0) {
        snake.update();
        time = 0;
    }

    if(snake.dead) {
        stop();
    }

    time++;
}

/*************************
 * FONCTIONS AUXILIAIRES *
 *************************/

function randomInt(a,b) {
    return Math.floor(Math.random() * (b - a) + a);
}

function stop() {
    clearInterval(intervalID);
}

/*********************************************
 * FONCTIONS INTERAGISANT AVEC L'UTILISATEUR *
 *********************************************/

document.addEventListener("keydown", keyDown);
function keyDown(evt) {
    
    switch(evt.keyCode) {
        case 40:
            if(moves.length != 0 && moves[moves.length - 1][0] == 0 && moves[moves.length - 1][1] == 1) return;
            moves.push([0,1]);
            break;
            
        case 38:
            if(moves.length != 0 && moves[moves.length - 1][0] == 0 && moves[moves.length - 1][1] == -1) return;
            moves.push([0,-1]);
            break;
        
        case 37:
            if(moves.length != 0 && moves[moves.length - 1][0] == -1 && moves[moves.length - 1][1] == 0) return;
            moves.push([-1,0]);
            break;
        
        case 39:
            if(moves.length != 0 && moves[moves.length - 1][0] == 1 && moves[moves.length - 1][1] == 0) return;
            moves.push([1,0]); 
            break;
    }
}