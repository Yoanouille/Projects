const canvas = document.getElementById("cvs");
const ctx = canvas.getContext("2d");

let intervalID;
let time = 0;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const SIZE = 20;

ctx.font = "small-caps " + SIZE + "px Arial";

let rains = [];

function setup() {
    background("black");
    for(let i = 0; i < canvas.width / SIZE; i++) {
        rains.push(new Rain(i * SIZE,Math.random() * 500 - 500, Math.random() * 5 + 5));
    }
    intervalID = setInterval(draw, 1000 / 60);
}

setup();

function draw() {
    background("black");  
    for(let i = 0; i < rains.length; i++) {
        rains[i].render();
    }


    time++;
}

function background(color) {
    ctx.fillStyle = color;
    ctx.fillRect(0,0,canvas.width,canvas.height);
}

function Symbol(x,y,speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.content;
    this.freq = Math.floor(Math.random() * 18 + 2);
    this.first = false;
    this.getRandomValue = function() {
        this.content = String.fromCharCode(0x30A1 + Math.floor(Math.random() * 96)); //Math.random() > 0.5 ? 0 : 1;
    }

    this.render = function() {
        this.y += this.speed;
        if(time % this.freq == 0) {
            this.getRandomValue();
        } 
        if(this.y - SIZE > canvas.height) {
            this.y = 0;
        }

        ctx.fillStyle = "rgba(0,255,40)";
        /*if(this.first) {
            ctx.fillStyle = "rgba(200,255,200)";
        }*/
        ctx.fillText(this.content, this.x, this.y);
    }
}

function Rain(x,y,speed) {
    this.symbols = [];
    let size = Math.floor(Math.random() * (30 - 5) + 5);
    for(let i = 0; i < size; i++) {
        let symb = new Symbol(x, y, speed);
        symb.getRandomValue();
        if(i == 0 && Math.random() > 0.5) {
            symb.first = true;
        }
        y -= SIZE;
        this.symbols.push(symb);
    }

    this.render = function() {
        for(let i = 0; i < this.symbols.length; i++) {
            this.symbols[i].render();
        }
    }
}