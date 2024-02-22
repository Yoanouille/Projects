var canvas = document.getElementById("cvs");
var ctx = canvas.getContext("2d");
var intervalID;

var cx = 200;
var cy = canvas.height / 2;
var angle = 0;
var radius = 70;
var wave = [];
var MAX_LEN_WAVE = 300;
var NUM_CERCLE = 1;

document.addEventListener("keydown", function(event) {
    if(event.keyCode == 107) {
        NUM_CERCLE++;
    }else if(event.keyCode == 109 && NUM_CERCLE > 1){
        NUM_CERCLE--;
    }
});


function line(x0,y0,x1,y1) {
    ctx.beginPath();
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.moveTo(x0,y0);
    ctx.lineTo(x1,y1);
    ctx.stroke();
}


function setup() {
    intervalID = setInterval(draw, 1000 / 60);
}
setup()

function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    var x = cx;
    var y = cy

    for(var i = 0; i < NUM_CERCLE; i++) {
        var n = i * 2 + 1;
        var prevx = x;
        var prevy = y;

        r = radius * (4 / (n * Math.PI));

        ctx.beginPath();
        ctx.strokeStyle = "white";
        ctx.lineWidth = 0.5;
        ctx.arc(x,y,r,0,Math.PI * 2,true);
        ctx.closePath();
        ctx.stroke();

        x += r * Math.cos(n * angle);
        y -= r * Math.sin(n * angle);
        line(prevx, prevy, x, y);
    }

    wave.unshift(y);

    for(var i = 0; i < wave.length - 1; i++) {
        line(400 + i / 2, wave[i], 400.5 + i / 2, wave[i + 1]);
    }

    line(x,y,400,wave[0]);

    if(wave.length > MAX_LEN_WAVE) wave.pop();

    angle += 0.04;
}