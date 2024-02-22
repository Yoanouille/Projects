var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");


var ag = Math.PI / 8;
var ad = Math.PI / 8;
var incr = 2 * Math.PI / 64;
var wid = 10;

function plus() {
    ag += incr;
    ad += incr;
}

function moins() {
    ag -= incr;
    ad -= incr
}

function moinG() {
    ag -= incr;
}

function plusG() {
    ag += incr;
}

function moinD() {
    ad -= incr;
}

function plusD() {
    ad += incr;
}

function drawBrench(x,y,len,w,a) {
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.lineWidth = w;
    ctx.moveTo(x,y);
    ctx.lineTo(x + len * Math.cos(a), y - len * Math.sin(a));
    ctx.closePath();
    ctx.stroke();

    x = x + len * Math.cos(a);
    y = y - len * Math.sin(a);
    w = w * 0.7;

    len = len * 0.67;
    if(len > 2){
        drawBrench(x,y,len,w,a + ag);
        drawBrench(x,y,len,w,a - ad);
    }

}


function draw() {
    ctx.fillStyle = "white";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    drawBrench(canvas.width / 2, canvas.height, 180, wid, Math.PI / 2);
}

var intervalID = setInterval(draw, 1000 / 60);