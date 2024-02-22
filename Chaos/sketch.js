const canvas = document.getElementById("cvs");
const ctx = canvas.getContext("2d");

const width = window.innerWidth;
const height = window.innerHeight;
canvas.width = width;
canvas.height = height;

let intervalID;

let FIGURE = 0;

const RADIUS = 300;
let NUM = 5;
const ROT = Math.PI / 2;
const PHI = (1 + Math.sqrt(5)) / 2;

let points = [];
let x;
let y;
let c;
let prevR = NUM;
let prevPrevR = NUM;
let percent;

document.addEventListener("keydown", keyDown);

function keyDown(evt) {
    switch(evt.keyCode) {
        case 107 : 
            clearInterval(intervalID);
            FIGURE++;
            FIGURE %= 6;
            setup(FIGURE);
            break;
        case 109 :
            clearInterval(intervalID);
            FIGURE--;
            FIGURE += 6;
            FIGURE %= 6;
            setup(FIGURE);
            break;
    }
}

function setup(f) {
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,width,height);

    points = [];

    switch(f) {
        case 0 : NUM = 3;break;

        case 1 : 
        case 2 :
        case 3 :
            NUM = 5;
            percent = 1 / PHI;
            break;
        case 4 :
            NUM = 4;
            percent = 2 / 3;
            break;
        case 5 : 
            NUM = 4;
            break;
    }

    prevR = NUM;
    prevPrevR = NUM;

    x = Math.random() * width;
    y = Math.random() * height;

    for(let i = 0; i < NUM; i++) {
        let angle = i *  Math.PI * 2 / NUM - ROT;
        points[i] = [RADIUS * Math.cos(angle) + width / 2, RADIUS * Math.sin(angle) + height / 2];
    }

    if(f == 4) {
        for(let i = 0; i < NUM; i++) {
            points.push([(points[i][0] + points[(i + 1) % NUM][0]) / 2, (points[i][1] + points[(i + 1) % NUM][1]) / 2]);
        }
    }
    /*for(let i = 0; i < NUM; i++) {
        points.push([(points[i][0] + points[(i + 1) % NUM][0]) / 2, (points[i][1] + points[(i + 1) % NUM][1]) / 2]);
    }*/

    /*for(let i = 0; i < points.length; i++) {
        point(points[i][0], points[i][1], 3,"white");
    }*/

    //point(x,y,0.5,"white");
    switch(f) {
        case 0 : intervalID = setInterval(draw0, 1000 / 60);break;
        case 1 : intervalID = setInterval(draw, 1000 / 60);break;
        case 2 : intervalID = setInterval(draw2, 1000 / 60);break;
        case 3 : intervalID = setInterval(draw3, 1000 / 60);break;
        case 4 : intervalID = setInterval(draw3, 1000 / 60);break;
        case 5 : intervalID = setInterval(draw4, 1000 / 60);break;
    }
    //intervalID = setInterval(draw, 1000 / 60);
}
setup(FIGURE);

function draw0() {
    for(let i = 0; i < 700; i++) {
        nextPoint0();
        point(x,y,0.5,c);
    }
}

function draw() {
    for(let i = 0; i < 700; i++) {
        nextPoint();
        point(x,y,0.5,c);
    }
}

function draw2() {
    for(let i = 0; i < 700; i++) {
        nextPoint2();
        point(x,y,0.5,c);
    }
}

function draw3() {
    for(let i = 0; i < 700; i++) {
        nextPoint3();
        point(x,y,0.5,c);
    }
}

function draw4() {
    for(let i = 0; i < 700; i++) {
        nextPoint4();
        point(x,y,0.5,c);
    }
}

function point(x,y,r,c) {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI * 2,true);
    ctx.closePath();
    ctx.fill();
}

function cercle(x,y,r,c) {
    ctx.strokeStyle = c;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI * 2,true);
    ctx.closePath();
    ctx.stroke();
}

function nextPoint() {
    let r;
    do {
        r = Math.floor(Math.random() * points.length);
    }while(r == prevR);
    prevR = r;
    x = (points[r][0] + x) / 2;
    y = (points[r][1] + y) / 2;
    c ="rgba(255,0,255,0.1)";
}

function nextPoint2() {
    let r;
    do {
        r = Math.floor(Math.random() * points.length);
    }while(prevPrevR == prevR && ((r + 1) % NUM == prevR || (r - 1 + NUM) % NUM == prevR));
    prevPrevR = prevR;
    prevR = r;
    x = (points[r][0] + x) / 2;
    y = (points[r][1] + y) / 2;
    c ="rgba(255,0,255,0.1)";
}

function nextPoint0() {
    let r = Math.floor(Math.random() * points.length);
    x = (points[r][0] + x) / 2;
    y = (points[r][1] + y) / 2;
    c ="hsla(" + (r * 360 / NUM) + ",100%, 50%, 1)";
}

function nextPoint3() {
    let r = Math.floor(Math.random() * points.length);
    //x -= width / 2;
    //y -= height / 2;

    let vx = (points[r][0] - x) * percent;
    let vy = (points[r][1] - y) * percent;
    x += vx;
    y += vy;
    c ="hsla(" + (r * 255 / NUM) + ",100%, 50%, 0.1)";
}

function nextPoint4() {
    let r;
    do {
        r = Math.floor(Math.random() * points.length);
    }while(r == (prevR + 1) % NUM);
    prevR = r;
    x = (points[r][0] + x) / 2;
    y = (points[r][1] + y) / 2;
    c ="rgba(255,0,255,0.1)";
}