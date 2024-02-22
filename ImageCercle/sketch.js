var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var img = new Image();
img.src = "chien.jpg";

canvas.width = 1000;
canvas.height = 600;

const BEGIN_SIZE = 3;
const NUM_CERCLE_FRAME = 50;
const MAX_ATTEMPT = 1000;
const SEUIL = 200;

var cercles = [];
var intervalID;
var imageData;
var pos = [];
window.onload = start;

function start() {
   background();
   ctx.drawImage(img, 0,0, img.width, img.height, 0,0, canvas.width, canvas.height);
   imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
   background();
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
      cercles[i].show2();
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
      ctx.fillStyle = this.color;
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
      cx = randomInt(0,canvas.width);
      cy = randomInt(0,canvas.height);
      for(var i = 0; i < cercles.length; i++) {
         if(dist(cercles[i].x,cercles[i].y,cx,cy) < (cercles[i].r + BEGIN_SIZE) * (cercles[i].r + BEGIN_SIZE)) {
            good = false;
         }
      }
      //console.log(attempt);
      attempt++
   }while(!(good || attempt > MAX_ATTEMPT));

   if(good){
      var index = (cx + cy * canvas.width) * 4;
      //console.log(index);
      var color = "rgba(" + imageData.data[index] + "," + imageData.data[index + 1] + "," + imageData.data[index + 2] + ")";
      cercles.push(new Cercle(cx,cy,color));
      return true;
   } else{
      console.log("FINISHED");
      clearInterval(intervalID);
      return false;
   }
}

function chien() {
   clearInterval(intervalID);
   img.onload = function() {

   }
   img.src = "chien.jpg";
   canvas.width = 1000;
   canvas.heigth = 600;
   cercles = [];
   start();
   //window.onload = start;
}

function horloge() {
   clearInterval(intervalID);
   img.onload = function() {

   }
   img.src = "horloge.jpg";
   canvas.width = 600;
   canvas.heigth = 600;
   cercles = [];
   start();
}

function carrefour() {
   clearInterval(intervalID);
   img.onload = function() {

   }
   img.src = "carrefour.png";
   canvas.width = 1000;
   canvas.heigth = 600;
   cercles = [];
   start();
}

function vosges() {
   clearInterval(intervalID);
   img.onload = function() {

   }
   img.src = "vosges.jpg";
   canvas.width = 1000;
   canvas.heigth = 600;
   cercles = [];
   start();
}

function pong() {
   clearInterval(intervalID);
   img.onload = function() {

   }
   img.src = "pong.webp";
   canvas.width = 600;
   canvas.heigth = 600;
   cercles = [];
   start();
}

function bouygues() {
   clearInterval(intervalID);
   img.onload = function() {

   }
   img.src = "bouygues.png";
   canvas.width = 1000;
   canvas.heigth = 600;
   cercles = [];
   start();
}

function lg() {
   clearInterval(intervalID);
   img.onload = function() {

   }
   img.src = "LG.jpg";
   canvas.width = 1000;
   canvas.heigth = 600;
   cercles = [];
   start();
}

function soleil() {
   clearInterval(intervalID);
   img.onload = function() {

   }
   img.src = "soleil.jpg";
   canvas.width = 600;
   canvas.heigth = 600;
   cercles = [];
   start();
}

function mouton() {
   clearInterval(intervalID);
   img.onload = function() {

   }
   img.src = "mouton.jpg";
   canvas.width = 1000;
   canvas.heigth = 600;
   cercles = [];
   start();
}

function cabine() {
   clearInterval(intervalID);
   img.onload = function() {

   }
   img.src = "cabine.jpg";
   canvas.width = 400;
   canvas.heigth = 600;
   cercles = [];
   start();
}

function mc() {
   clearInterval(intervalID);
   img.onload = function() {

   }
   img.src = "mc.jpeg";
   canvas.width = 1000;
   canvas.heigth = 600;
   cercles = [];
   start();
}

function taxi() {
   clearInterval(intervalID);
   img.onload = function() {

   }
   img.src = "taxi.jpg";
   canvas.width = 600;
   canvas.heigth = 600;
   cercles = [];
   start();
}

function sg() {
   clearInterval(intervalID);
   img.onload = function() {

   }
   img.src = "sg.jpg";
   canvas.width = 600;
   canvas.heigth = 600;
   cercles = [];
   start();
}

function lidle() {
   clearInterval(intervalID);
   img.onload = function() {

   }
   img.src = "lidle.png";
   canvas.width = 600;
   canvas.heigth = 600;
   cercles = [];
   start();
}

function sw() {
   clearInterval(intervalID);
   img.onload = function() {

   }
   img.src = "sw.png";
   canvas.width = 1000;
   canvas.heigth = 600;
   cercles = [];
   start();
}