var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var b = [];
var num = 4;

for(var i=0; i<num; i++){
    b.push(new Meta(Math.random() * ((canvas.width - 100) - 100) + 100, Math.random() * ((canvas.height - 100) - 100) + 100));
}
var pixels;
function dist(x0,y0,x1,y1){
    return Math.sqrt(Math.pow(x1 - x0,2) + Math.pow(y1 - y0,2));
}

function Meta(x,y) {
    this.x = x;
    this.y = y;
    this.r = Math.random() * 20 + 40;
    this.vx = Math.random() * 3 + 1;
    this.vy = Math.random() * 3 + 1;
    this.update = function() {
        if(this.x < this.r || this.x > canvas.width - this.r){
            this.vx *= -1;
        }
        if(this.y < this.r || this.y > canvas.height - this.r){
            this.vy *= -1;
        }
        this.x += this.vx;
        this.y += this.vy;
    }
    
}


function draw() {
    ctx.fillStyle = "rgba(0,0,0,1)";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    pixels = ctx.createImageData(canvas.width, canvas.height);
    for(var i=0; i<canvas.width; i++){
        for(var j=0; j<canvas.height; j++){
            var bright = 0;
            for(var k=0; k<b.length; k++){
                bright += b[k].r * 250 / dist(b[k].x, b[k].y, i, j);
            }
            if(bright < 255 && bright > 253){
                bright = 0;
            }
            else if(bright <= 253){
                bright = 175;
            }
            var index = (i + j * canvas.width) * 4;
            pixels.data[index + 0] = bright;
            pixels.data[index + 1] = bright;
            pixels.data[index + 2] = bright;
            pixels.data[index + 3] = 255;
        }
    }
    ctx.putImageData(pixels,0,0);
    for(var i=0; i<b.length; i++){
        b[i].update();
    }
}

var intervalID = setInterval(draw, 1000 / 60);