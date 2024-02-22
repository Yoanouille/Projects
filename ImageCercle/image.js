var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var img = new Image();
img.src = "images.png";

const BEGIN_SIZE = 3;
const NUM_CERCLE_FRAME = 30;
const MAX_ATTEMPT = 1000;
const SEUIL = 200;

var cercles = [];
var intervalID;
var imageData;
var pos = [];
window.onload = function() {
    background();
    ctx.drawImage(img, 30,30, img.width - 60, img.height - 80, 100,100, 400, 400);
    imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
    background();
    for(var i = 0; i < canvas.width; i++) {
        for(var j = 0; j < canvas.height; j++) {
            var index = (i + j * canvas.width) * 4;
            if(imageData.data[index] >= SEUIL) {
                imageData.data[index] = 255;
                imageData.data[index + 1] = 255;
                imageData.data[index + 2] = 255;
                imageData.data[index + 3] = 255;
                pos.push([i,j]);
            }else{
                imageData.data[index] = 0;
                imageData.data[index + 1] = 0;
                imageData.data[index + 2] = 0;
                imageData.data[index + 3] = 255;
            }
        }
    }
    //ctx.putImageData(imageData, 0, 0);

    intervalID = setInterval(draw,1000 / 60);

}

function draw() {
    background();
    for(var i = 0; i < NUM_CERCLE_FRAME; i++) {
       if(!newCercle()){
          break;
       }
    }
    for(var i = 0; i < cercles.length; i++) {
       cercles[i].show();
    }
 
    for(var i = 0; i < cercles.length; i++) {
       for(var j = 0; j  < cercles.length; j++) {
          if(i != j) {
             if(cercles[i].growing) {
                if(dist(cercles[i].x, cercles[i].y, cercles[j].x, cercles[j].y) <= (cercles[i].r + cercles[j].r) * (cercles[i].r + cercles[j].r)) {
                   cercles[i].growing = false;
                   break;
                }
             }
          }
       }
       cercles[i].update();
    }
}

function Cercle(x,y,color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.r = BEGIN_SIZE;
    this.growing = true;
    this.show = function() {
       ctx.strokeStyle = "white";
       ctx.lineWidth = "1";
       ctx.beginPath();
       ctx.arc(this.x,this.y,this.r,0,Math.PI * 2,true);
       ctx.closePath();
       ctx.stroke();
    }
    this.show2 = function() {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.r,0,Math.PI * 2,true);
        ctx.closePath();
        ctx.fill();
    }
    this.update = function() {
       if(this.growing){
          if(this.x + this.r > canvas.width || this.x < this.r || this.y < this.r || this.y + this.r > canvas.height){
             this.growing = false;
          }
       }
       if(this.growing){
          this.r += 1;
       }
    }
 }
 
function background() {
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,canvas.clientWidth,canvas.height);
}

function random(x,y) {
    return Math.random() * (y - x) + x;
}

function randomInt(x,y) {
    return Math.floor(Math.random() * (y - x) + x);
}

function dist(x0,y0,x1,y1) {
    return (x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1);
}

function newCercle() {
    var cx,cy;
    var attempt = 0;
    var good = true;
    do{
        good = true
        var r = randomInt(0,pos.length);
        cx = pos[r][0];
        cy = pos[r][1];
        //cx = random(0,canvas.width);
        //cy = random(0,canvas.height);
        for(var i = 0; i < cercles.length; i++) {
            if(dist(cercles[i].x,cercles[i].y,cx,cy) < (cercles[i].r + BEGIN_SIZE) * (cercles[i].r + BEGIN_SIZE)) {
                good = false;
            }
        }
        attempt++
    }while(!(good || attempt > MAX_ATTEMPT));

    if(good){
        var index = (cx + cy * canvas.width) * 4;
        var color = "rgba(" + imageData.data[index] + "," + imageData.data[index + 1] + "," + imageData.data[index + 2] + ")";
        cercles.push(new Cercle(cx,cy,color));
        return true;
    } else{
        console.log("FINISHED");
        clearInterval(intervalID);
        return false;
    }
}