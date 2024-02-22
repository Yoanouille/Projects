var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var gx = 0;
var gy = 0.25;

var fire = [];
var numResidu = 100;
var lifeTime = 30;

function randomColor() {
    var random = Math.random() * 360;
    return "hsl(" + random + ",100%,50%)";
}

function Parti(x,y,vx,vy,fire,color) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy
    this.ax = 0;
    this.ay = 0;
    this.r = 3;
    this.fire = fire;
    this.lifeTime = lifeTime;
    this.color = color;
    this.show = function() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    }
    this.applyForce = function(fx,fy) {
        this.ax += fx;
        this.ay += fy;
    }
    this.update = function() {
        if(this.fire){
            this.applyForce(gx,gy);
        }
        if(!this.fire){
            this.lifeTime --;
            var m = Math.random() * 0.2 + 0.85;
            this.vx *= m;
            this.vy *= m;
            this.r *= m;
        }
        this.vx += this.ax;
        this.vy += this.ay;
        
        this.x += this.vx;
        this.y += this.vy;

        this.ax = 0;
        this.ay = 0;
    }
}

function Fire(x,y,vx,vy,fire,color,fire2) {
    this.firework = new Parti(x,y,vx,vy,fire,color);
    this.exploded = false;
    this.fire2 = fire2;
    this.residu = [];
    this.residu2 = [];
    this.show = function() {
        if(!this.exploded){
            this.firework.show();
        }
        if(!this.fire2){
            for(var i=0; i<this.residu.length; i++){
                this.residu[i].show();
            }
        }
        if(this.fire2){
            for(var i=0; i<this.residu2.length; i++){
                this.residu2[i].show();
            }
        }
    }
    this.update = function() {
        if(!this.exploded){
            this.firework.update();
            if(this.firework.vy >= 0) {
                this.exploded = true;
                if(!this.fire2){
                    for(var i=0; i<numResidu; i++){
                        var a = Math.random() * Math.PI * 2;
                        var r = Math.random() * 5;
                        var vx = Math.cos(a) * r;
                        var vy = Math.sin(a) * r;
                        var p = new Fire(this.firework.x,this.firework.y,vx,vy,false,this.firework.color,true);
                        this.residu.push(p);
                    }
                }
            }
            if(this.firework.lifeTime < 0){
                this.exploded = true;
                for(var i=0; i<5; i++){
                    var a = Math.random() * Math.PI * 2;
                    var r = Math.random() * 5;
                    var vx = Math.cos(a) * r;
                    var vy = Math.sin(a) * r;
                    var p = new Parti(this.firework.x,this.firework.y,vx,vy,false,this.firework.color);
                    this.residu2.push(p);
                }
            }
        }else{
            if(!this.fire2){
                for(var i=this.residu.length - 1; i>=0; i--){
                    this.residu[i].update();
                    if(this.residu[i].lifeTime < 0 && this.residu2.length == 0) {
                        this.residu.splice(i,1);
                    }
                }
            }else if(this.fire2){
                for(var i=this.residu2.length - 1; i>=0; i--){
                    this.residu2[i].update();
                    if(this.residu2[i].lifeTime < 0) {
                        this.residu2.splice(i,1);
                    }
                }
            }
        }
    }
}

function setup() {
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,canvas.width,canvas.height);
}
setup();

function draw() {
    ctx.fillStyle = "rgba(0,0,0,0.1)";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    var r = Math.random();
    if(r < 0.1){
        fire.push(new Fire(Math.random() * canvas.width, canvas.height,0, Math.random() * 7 - 15,true, randomColor(),false));
    }

    for(var i=fire.length-1; i>=0; i--){
        if(fire[i].exploded && fire[i].residu.length == 0){
            fire.splice(i,1);
        }else{
            fire[i].show();
            fire[i].update();
        }
    }
}

intervalID = setInterval(draw, 1000 / 60);
