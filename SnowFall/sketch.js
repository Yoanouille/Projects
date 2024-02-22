const canvas = document.getElementById("cvs");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let intervalID;

let img1 = new Image();
img1.src = "1.png";

let img2 = new Image();
img2.src = "s2.png";

let img3 = new Image();
img3.src = "s3.png";

let img4 = new Image();
img4.src = "s4.png";

let img5 = new Image();
img5.src = "s5.png";

let img6 = new Image();
img6.src = "s6.png";

let img = [img1, img2, img3, img4, img5, img6];


/****************************************** */

const NUM = 300;


let gravity = 0.005;
let snowflakes = [];



function SnowFlakes() {
    this.x = random(0,canvas.width);
    this.r = randomSize(3,20);
    this.y = -this.r * 2;

    this.xOff = 0;

    this.vx = 0;
    this.vy = 0;

    this.ax = 0;
    this.ay = 0;

    this.angle = 0;
    this.img = img[randomInt(0, 5)];

    this.dir = Math.random() > 0.5 ? 1 : -1;

    this.show = function() {
        //cercle(this.x,this.y,this.r);
        ctx.rotate(this.angle);
        ctx.drawImage(this.img, 0, 0, 600, 600, (this.x + this.xOff) * Math.cos(this.angle) + this.y * Math.sin(this.angle) -  2 * this.r, (this.x + this.xOff) * -Math.sin(this.angle) + this.y * Math.cos(this.angle) - 2 * this.r, 2 * 2 * this.r, 2  * 2 * this.r);
        ctx.restore();
    }

    this.applyForce = function(fx, fy) {
        this.ax += fx * this.r;
        this.ay += fy * this.r;
    }

    this.update = function() {
        this.xOff = Math.sin(this.angle / 2) * 6 * this.r;


        this.vx += this.ax;
        this.vy += this.ay;

        /*let vel = Math.sqrt(this.vx * this.vx + this.vy * this.vy);

        if(vel > 0.2 * this.r) {
            this.vx /= vel;
            this.vy /= vel;
            this.vx *= 0.2 * this.r;
            this.vy *= 0.2 * this.r;
        }*/

        if(this.vy > 0.6 * this.r) {
            this.vy = 0.6 * this.r;
        }

        if(this.x < -this.r) {
            this.x = canvas.width + this.r;
        }

        if(this.x > this.r + canvas.width) {
            this.x = -this.r;
        }

        this.angle += this.vy * this.dir / 100;

        this.x += this.vx;
        this.y += this.vy;

        this.ax = 0;
        this.ay = 0;
    }

}

function cercle(x,y,r) {
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.arc(x,y,r,0,Math.PI * 2,true);
    ctx.closePath();
    ctx.fill();
}

function randomInt(a,b) {
    return Math.floor(Math.random() * (b - a + 1) + a);
}

function random(a,b) {
    return Math.random() * (b - a) + a;
}

function randomSize(a,b) {
    while(true) {
        let r1 = Math.random();
        let r2 = Math.random();
        if(r1 < r2) {
            return r1 * (b - a) + a;
        }
    }
}

window.onload = function() {
    setup();
}

function setup() {
    //ctx.drawImage(img1, 0, 0, 600, 600, 200, 200, 200, 200);
    for(let i = 0; i < NUM; i++) {
        snowflakes.push(new SnowFlakes());
    }
    intervalID = setInterval(draw, 1000 / 60);
}

function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    for(let i =  snowflakes.length - 1; i >= 0; i--) {
        ctx.save();
        if(snowflakes[i].y > snowflakes[i].r + canvas.height) {
            snowflakes.splice(i,1);
            snowflakes.push(new SnowFlakes());
        }else{
            snowflakes[i].show();
            snowflakes[i].applyForce(0,gravity);
            snowflakes[i].update();
        }
    }



    /*angle += 1
    ctx.rotate(angle);
    ctx.drawImage(img1, 0, 0, 600, 600, x * Math.cos(angle) + y * Math.sin(angle) -  2 * 50, x * -Math.sin(angle) + y * Math.cos(angle) - 2 * 50, 2 * 100, 2 * 100);
    ctx.restore();

    y++;
    x += Math.sin(angle / 60) ; */
}


