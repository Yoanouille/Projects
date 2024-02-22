var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
//var freq = 0;
var frame = 0;
document.addEventListener("keydown", keyDown);
function keyDown(evt) {
    console.log(evt.keyCode);
    if(evt.keyCode == 107){
        zSpeed++;
    }else if(evt.keyCode == 109){
        zSpeed--;
    }
}

canvas.width = window.innerWidth
canvas.height = window.innerHeight;

const NUM_STARS = 500;
var stars = [];
var zSpeed = 5;

function Star() {
    this.x = Math.random() * canvas.width - canvas.width / 2;
    this.y = Math.random() * canvas.height - canvas.height / 2;
    this.z = Math.random() * canvas.width;
    this.show = function() {
        ctx.beginPath();
        ctx.fillStyle = "white";
        var sx = ( this.x / this.z ) * canvas.width + canvas.width / 2;
        var sy = ( this.y / this.z ) * canvas.height + canvas.height / 2;
        var sr = (this.z / canvas.width) * 4; 
        ctx.arc(sx, sy, 4 - sr, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    };
    this.update = function() {
        this.z -= zSpeed;
        if(this.z < 1) {
            this.z = canvas.width;
            this.x = Math.random() * canvas.width - canvas.width / 2;
            this.y = Math.random() * canvas.height - canvas.height / 2;
        }
    };
}

function setup() {
    ctx.fillStyle = "rgba(0,0,0,1)";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    for(var i=0; i<NUM_STARS; i++){
        stars[i] = new Star();
    }
}
setup();

function draw() {
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    for(var i=0; i<stars.length; i++){
        stars[i].show();
        stars[i].update();
    }
}

var intervalID = setInterval(draw, 1000 / 60);