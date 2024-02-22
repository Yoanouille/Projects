const canvas = document.getElementById("cvs");
const ctx    = canvas.getContext("2d");
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

let path = [];
let incr = 0.01;
const SEUIL = 400;

let xOff = 0;

function line(x0,y0,x1,y1) {
    ctx.beginPath();
    ctx.strokeStyle = "white";
    ctx.moveTo(x0,y0);
    ctx.lineTo(x1,y1);
    ctx.stroke();
}

function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,WIDTH,HEIGHT);

    let p = perlin1D(xOff) * 200 + 200;
    path.unshift(p);

    for(let i = 0; i < path.length - 1; i++) {
        line(100 + i, path[i], 101 + i, path[i + 1]);
    }

    xOff += incr;
    if(path.length > SEUIL) path.pop();
}



let intervalID = setInterval(draw, 1000 / 60);