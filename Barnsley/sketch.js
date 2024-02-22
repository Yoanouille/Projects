const canvas = document.getElementById("cvs");
const ctx = canvas.getContext("2d");

const WIDTH  = window.innerWidth;
const HEIGHT = window.innerHeight;
canvas.width  = WIDTH;
canvas.height = HEIGHT;

let intervalID;



const LAR = 200;
const PACK = 100;

let x = 0;
let y = 0;

function map(n, a, b, c, d) {
    return ((n - a) / (b - a)) * (d - c) + c;
}

function f1(a, b) {
    return {
        x : 0,
        y : 0.16 * b
    };
}


function f2(a, b) {
    return {
        x : 0.85 * a + 0.04 * b,
        y : -0.04 * a + 0.85 * b + 1.6
    };
}

function f3(a, b) {
    return {
        x : 0.20 * a + -0.26 * b,
        y : 0.23* a + 0.22 * b + 1.6
    };
}

function f4(a, b) {
    return {
        x : -0.15 * a + 0.28 * b,
        y : 0.26 * a + 0.24 * b + 0.44
    };
}

function cercle(x,y,r) {
    let c = map(y, 0, HEIGHT, 0, 255);
    ctx.fillStyle = "hsl(" + c + ", 100%, 50%)";
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI * 2,true);
    ctx.closePath();
    ctx.fill();
}



window.onload = function() {
    setup();
}

function setup() {
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,WIDTH,HEIGHT);
    //draw2();
    //intervalID = setInterval(draw, 1000 / 240);
    intervalID = setInterval(draw3, 1000 / 60);
}

function draw() {
    let r = Math.random();
    let nextX;
    let nextY;
    if(r < 0.01) {
        nextX = 0;
        nextY = 0.16 * y;
    } else if(r < 0.86) {
        nextX = 0.85 * x + 0.04 * y;
        nextY = -0.04 * x + 0.85 * y + 1.6;
    } else if(r < 0.93) {
        nextX = 0.20 * x + -0.26 * y;
        nextY = 0.23* x + 0.22 * y + 1.6;
    } else {
        nextX = -0.15 * x + 0.28 * y;
        nextY = 0.26 * x + 0.24 * y + 0.44;
    }

    x = nextX;
    y = nextY;

    let px = map(x, -2.1820, 2.6558, WIDTH / 2 - LAR, WIDTH / 2 + LAR);
    let py = map(y, 0, 9.9983, HEIGHT, 0);

    cercle(px,py,1);


}

function draw2() {
    let n = 0
    while(n < 700000) {
        let r = Math.random();
        let nextX;
        let nextY;
        if(r < 0.01) {
            nextX = 0;
            nextY = 0.16 * y;
        } else if(r < 0.86) {
            nextX = 0.85 * x + 0.04 * y;
            nextY = -0.04 * x + 0.85 * y + 1.6;
        } else if(r < 0.93) {
            nextX = 0.20 * x + -0.26 * y;
            nextY = 0.23* x + 0.22 * y + 1.6;
        } else {
            nextX = -0.15 * x + 0.28 * y;
            nextY = 0.26 * x + 0.24 * y + 0.44;
        }

        x = nextX;
        y = nextY;

        let px = map(x, -2.1820, 2.6558, WIDTH / 2 - LAR, WIDTH / 2 + LAR);
        let py = map(y, 0, 9.9983, HEIGHT, 0);

        cercle(px,py,0.5);
        n++;
    }
}

function draw3() {
    let n = 0
    while(n < PACK) {
        let r = Math.random();
        let nextX;
        let nextY;
        if(r < 0.01) {
            nextX = 0;
            nextY = 0.16 * y;
        } else if(r < 0.86) {
            nextX = 0.85 * x + 0.04 * y;
            nextY = -0.04 * x + 0.85 * y + 1.6;
        } else if(r < 0.93) {
            nextX = 0.20 * x + -0.26 * y;
            nextY = 0.23* x + 0.22 * y + 1.6;
        } else {
            nextX = -0.15 * x + 0.28 * y;
            nextY = 0.26 * x + 0.24 * y + 0.44;
        }

        x = nextX;
        y = nextY;

        let px = map(x, -2.1820, 2.6558, WIDTH / 2 - LAR, WIDTH / 2 + LAR);
        let py = map(y, 0, 9.9983, HEIGHT, 0);

        cercle(px,py,0.5);
        n++;
    }
}