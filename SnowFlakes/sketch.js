const canvas = document.getElementById("cvs");
const ctx = canvas.getContext("2d");

//const canvas2 = document.getElementById("cvs2");
//const ctx2 = canvas2.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

let RADIUS = 2;
let COLOR = false;
let VAR = 5;

let intervalID;
let snowFlakes = [];
let particule;
let finished = false;

document.addEventListener("keydown", keyDown);

function keyDown(evt) {
    if(evt.keyCode == 37) {
        setup();
    }
    if(evt.keyCode == 32) {
        COLOR = !COLOR;
    }
    if(evt.keyCode == 107) {
        VAR++;
    }
    if(evt.keyCode == 109) {
        VAR--;
    }
    if(evt.keyCode == 38) {
        RADIUS++;
    }
    if(evt.keyCode == 40) {
        RADIUS--;
    }
}


function cercle(x,y,r, c) {
    ctx.beginPath();
    ctx.fillStyle = "white";
    if(COLOR) {
        let color = (c / (HEIGHT / 2)) * 360;
        ctx.fillStyle = "hsl(" + color + ", 100%, 50%)";
    }
    ctx.arc(x,y,r,0,Math.PI * 2,true);
    ctx.closePath();
    ctx.fill();

    /*ctx2.beginPath();
    ctx2.fillStyle = "white";
    if(COLOR) {
        let color = (c / (HEIGHT / 2)) * 360;
        ctx2.fillStyle = "hsl(" + color + ", 100%, 50%)";
    }
    ctx2.arc(x,y,r,0,Math.PI * 2,true);
    ctx2.closePath();
    ctx2.fill();*/
}

function random(a,b) {
    return Math.random() * (b - a) + a;
}

function dist(x0,y0,x1,y1) {
    return (x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0);
}

function Particule(x,y) {
    this.x = x;
    this.y = y;
    this.finished = false;
    this.angle = Math.atan2(this.y - HEIGHT / 2, this.x - WIDTH / 2);
    this.r = Math.sqrt((this.x - WIDTH / 2) * (this.x - WIDTH / 2) + (this.y - HEIGHT / 2) * (this.y - HEIGHT / 2));

    this.show = function() {
        //console.log(theta);

        //cercle(this.x, this.y, 3);
        //cercle(r * Math.cos(theta) + WIDTH / 2, r * Math.sin(-theta) + HEIGHT / 2, 3);

        for(let i = 0; i < 6; i++) {
            cercle(this.r * Math.cos(this.angle + i * Math.PI / 3 + Math.PI / 2) + WIDTH / 2, this.r * Math.sin(this.angle + i * Math.PI / 3 + Math.PI / 2) + HEIGHT / 2, RADIUS, this.r);
            cercle(this.r * Math.cos(this.angle + i * Math.PI / 3 + Math.PI / 2) + WIDTH / 2, this.r * -Math.sin(this.angle + i * Math.PI / 3 + Math.PI / 2) + HEIGHT / 2, RADIUS, this.r);
        }

    }

    this.update = function() {
        this.x -= 1;
        this.y += random(-VAR,VAR);
        this.r = Math.sqrt((this.x - WIDTH / 2) * (this.x - WIDTH / 2) + (this.y - HEIGHT / 2) * (this.y - HEIGHT / 2));
        this.angle = Math.atan2(this.y - HEIGHT / 2, this.x - WIDTH / 2);
        this.constrain();
        if(this.x < WIDTH / 2 + 1) this.finished = true;
    }

    this.constrain = function() {
        if(this.angle > Math.PI / 6) {
            this.angle = Math.PI / 6;
        }

        if(this.angle < 0) {
            this.angle = 0;
        }
        this.x = Math.cos(this.angle) * this.r + WIDTH / 2;
        this.y = Math.sin(this.angle) * this.r + HEIGHT / 2;
    }

    this.intersect = function(arr) {
        for(let i = 0; i < arr.length; i++) {
            if(dist(arr[i].x, arr[i].y, this.x, this.y) < RADIUS * RADIUS * 4) {
                this.finished = true;
                break;
            }
        }
    }
} 

function drawText(x,y,text) {
    ctx.fillStyle = "white";
    ctx.font = "small-caps 40px dejavu sans mono";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, x, y);
}

function setup() {
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,WIDTH,HEIGHT);
    snowFlakes = [];
    finished = false;
   // ctx2.fillStyle = "black";
    //ctx2.fillRect(0,0,WIDTH,HEIGHT);
    particule = new Particule(WIDTH, HEIGHT / 2);

    intervalID = setInterval(draw, 1000 / 60);
}
setup();


function draw() {
    //particule.show();
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,WIDTH,HEIGHT);

    drawText(canvas.width / 12, canvas.height / 12, "VAR " + VAR);
    drawText(canvas.width / 12, 4 * canvas.height / 12, "RADIUS " + RADIUS);

    while(!particule.finished) {
        particule.update();
        particule.intersect(snowFlakes);
    }

    snowFlakes.push(particule);
    if(particule.r >= HEIGHT / 2 - 25) {
        clearInterval(intervalID);
        finished = true;
    }
    //particule.show();
    particule = new Particule(WIDTH, HEIGHT / 2);

    for(let i = 0; i < snowFlakes.length; i++) {
        snowFlakes[i].show();
    }

    if(finished) {
        console.log("finished");
        //let img = canvas.toDataURL("image/png");
        //document.write('<img src="'+img+'"/>');
    }

}

