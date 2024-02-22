var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var largeur = Math.trunc(Math.random()*200) + 20;
var x = canvas.width/2;
var y = canvas.height - largeur - 1;

var dx = 0;
var ay = 0;
var dy = 0;

function keyBoard (evt) {
    switch(evt.keyCode){
        case 37: 
            dx = -5;
            break;
        
        case 39:
            dx = 5;
            break;

    }
}

function keyDown (evt){
    switch(evt.keyCode){
        case 37:
            dx = 0;
            break;
        
        case 39:
            dx = 0;
            break;

        case 38: 
            dy = -2;
            break;
    }
}

function drawCarre (Cx, Cy, Cwidth){
    ctx.fillStyle = "#00FF00";
    ctx.fillRect(Cx,Cy,Cwidth,Cwidth);
    ctx.strokeRect(Cx,Cy,Cwidth,Cwidth);
}

function draw () {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawCarre(x,y,largeur);
    x += dx;
    y += dy;
}

intervalID = setInterval(draw, 10);
document.addEventListener("keydown", keyBoard);
document.addEventListener("keyup", keyDown);