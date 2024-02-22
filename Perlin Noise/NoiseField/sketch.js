const canvas = document.getElementById("cvs");
const ctx    = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const RADIUS = 2;
const SPEED = 5;
const NUM = 800;
const OP = 10 / 255;
const REDUCE = 0.5;
const MAXSPEED = 4;

let color = 0;
let time = 0;
let skip = 1;

let particules = [];
for(let i = 0; i < NUM; i++) {
    particules[i] = new Particule();
}

let scl = 10;

let rows = HEIGHT / scl;
let cols = WIDTH / scl;


let incr = 0.1;
let zOff = 0;
let incrZ = 0.0003;

function line(x0,y0,x1,y1) {
    ctx.beginPath();
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = "rgba(255,255,255," + OP + ")";
    ctx.moveTo(x0,y0);
    ctx.lineTo(x1,y1);
    ctx.stroke();
}

function Particule() {
    this.x = Math.random() * WIDTH;
    this.y = Math.random() * HEIGHT;

    this.prevX = this.x;
    this.prevY = this.y;

    this.vx = 0;
    this.vy = 0;

    this.ax = 0;
    this.ay = 0;

    this.drawing = true;

    this.show = function() {
        /*ctx.beginPath();
        ctx.fillStyle = "rgba(255,0,255,0.09)";
        //"hsla(" + color + ",100%,50%,0.5)"
        ctx.arc(this.x, this.y, RADIUS / 2, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();*/

        if(this.drawing) {
            line(this.prevX,this.prevY,this.x,this.y);
        }


        /*ctx.beginPath();
        ctx.fillStyle = "rgba(0,0,0,0.09)";
        ctx.arc(this.x, this.y, RADIUS, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();*/
    }

    this.update = function() {
        this.vx += this.ax;
        this.vy += this.ay;

        this.prevX = this.x;
        this.prevY = this.y;


        this.x += this.vx;
        this.y += this.vy;


        let norm = Math.sqrt(this.vx * this.vx + this.vy * this.vy);

        if(norm > MAXSPEED) {
            this.vx /= norm;
            this.vy /= norm;
            this.vx *= MAXSPEED;
            this.vy *= MAXSPEED;
        }
        this.drawing = true;

        /*this.vx *= FRIXION;
        this.vy *= FRIXION;*/

        if(this.x > WIDTH) {
            this.x = 0;
            this.drawing = false;
        }
        if(this.x < 0) {
            this.x = WIDTH - 1;
            this.drawing = false;
        }
        if(this.y > HEIGHT) {
            this.y = 0;
            this.drawing = false;
        }
        if(this.y < 0) {
            this.y  = HEIGHT - 1;
            this.drawing = false;
        }

        this.ax = 0;
        this.ay = 0;
    }

    this.applyForce = function(arr) {
        let i = Math.floor(this.y / scl);
        let j = Math.floor(this.x / scl);
        //console.log(i,j);
        this.ax += arr[i][j][0] * REDUCE;
        this.ay += arr[i][j][1] * REDUCE;
    }
}

ctx.fillStyle = "black";
ctx.fillRect(0,0,WIDTH,HEIGHT);

function draw() {
    /*ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.fillRect(0,0,WIDTH,HEIGHT);*/
    /*ctx.fillStyle = "white";
    ctx.fillRect(0,0,WIDTH,HEIGHT);*/
    let yOff = 0;
    let dir = [];
    for(let i = 0; i < rows; i++) {
        let xOff = 0;
        dir[i] = [];
        for(let j = 0; j < cols; j++) {
            dir[i][j] = [];
            let angle = perlin3D(xOff,yOff,zOff) * Math.PI * 4;
            //let angle = 0;
            let x = Math.cos(angle);
            let y = Math.sin(angle);
            dir[i][j][0] = x;
            dir[i][j][1] = y;
            //line(i * scl + scl / 2 - scl / 2 * Math.cos(angle), j * scl + scl / 2 - scl / 2 * Math.sin(angle), i * scl + scl / 2 + scl / 2 * Math.cos(angle), j * scl + scl / 2 + scl / 2 * Math.sin(angle));
            //line(i * scl + scl / 2, j * scl + scl / 2, i * scl + scl / 2 - scl / 2 * Math.cos(angle), j * scl + scl / 2 - scl / 2 * Math.sin(angle));
            xOff += incr
        }
       yOff += incr;
    }
    zOff += incrZ;
    //console.log(dir);
    for(let i = 0; i < particules.length; i++) {
        particules[i].applyForce(dir);
        particules[i].update();
        particules[i].show();
    }

    time++;
    time %= skip;
    if(time == 0){
        color++;
        color %= 360;
    }
}

function stop() {
    clearInterval(intervalID);
}
//draw();
let intervalID = setInterval(draw, 1000 / 60);