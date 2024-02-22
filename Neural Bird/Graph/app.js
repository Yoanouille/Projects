const canvas = document.getElementById("cvs");
const ctx = canvas.getContext("2d");

const width = canvas.width = 600;
const height = canvas.height = 600;

ctx.fillStyle = "black";
ctx.fillRect(0,0,width,height);

let cX = 100;
let cY = 100;

let Xlen = 400;
let Ylen = 400;

line(cX,height - cY,cX + Xlen,height - cY, 3);
line(cX,height - cY,cX,height - (cY + Ylen), 3);

let points = [0,20,3,50];

let max = 0;

for(let i = 0; i < points.length; i++) {
    if(points[i] > max) max = points[i];
}

for(let i = 0; i < points.length - 1; i++) {
    let x = map(i, 0, points.length - 1, cX, Xlen + cX);
    let y = map(points[i], 0, max, cY + Ylen, cY);

    let x1 = map(i + 1, 0, points.length - 1, cX, Xlen + cX);
    let y1 = map(points[i + 1], 0, max, cY + Ylen, cY);

    line(x,y, x1,y1, 1);
}

function map(a,b,c,d,e) {
    return ((a - b) / (c - b)) * (e - d) + d;
}

function cercle(x,y,r,c) {
    ctx.beginPath();
    ctx.fillStyle = c;
    ctx.arc(x,y,r,0,Math.PI * 2,true);
    ctx.closePath();
    ctx.fill();
}

function line(x0,y0,x1,y1,w) {
    ctx.strokeStyle = "white";
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.moveTo(x0,y0);
    ctx.lineTo(x1,y1);
    ctx.stroke();
}