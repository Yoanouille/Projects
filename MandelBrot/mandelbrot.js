var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var width = canvas.width;
var height = canvas.height;
var maxIteration = 100;
var maxModule = 2;

let form = 0;

document.addEventListener("keydown", keyDown);

function keyDown(evt) {
    console.log(evt.keyCode);
    switch(evt.keyCode) {
        case 37 : 
            form++;
            form %= 5;
            setup();
            break;

        case 39 : 
            form = (form - 1 + 5) % 5;
            setup();
            break;
    }
}

function Complexe(a,b) {
    this.a = a;
    this.b = b;
    this.module = function() {
        return Math.sqrt(this.a * this.a + this.b * this.b);
    }
    this.add = function(z) {
        return new Complexe(this.a + z.a, this.b + z.b);
    }
    this.squared = function() {
        var aa = this.a * this.a - this.b * this.b;
        var bb = this.a * this.b * 2;
        return new Complexe(aa,bb);
    }
}

function setup() {
    for(var i=0; i<width; i++){
        for(var j=0; j<height; j++){
            var ii = (i / width) * 4 - 2;
            var jj = (j / height) * 4 - 2;
            var c;
            switch(form) {
                case 0 : c = new Complexe(ii,jj); maxIteration = 100; break;
                case 1 : c = new Complexe(0.285,0.01); maxIteration = 100; break;
                case 2 : c = new Complexe(-0.8,0.156); maxIteration = 100; break;
                case 3 : c = new Complexe(-0.6, 0.43); maxIteration = 200; break;
                case 4 : c = new Complexe(-0.4,0.6); maxIteration = 100; break;
            }
            //var c = new Complexe(0.285,0.01);
            //var c = new Complexe(-0.8,0.156);
            //var c = new Complexe(-0.6, 0.43); maxIteration = 200;
            //var c = new Complexe(ii,jj);
            //var c = new Complexe(-0.4,0.6);
            var z = new Complexe(ii,jj);
            var n = 0;
            while(n < maxIteration){
                z = z.squared();
                z = z.add(c);
                if(z.module() > maxModule){
                    break;
                }
                n++;
            }
            var bright = n / maxIteration * 255;
            /*if(n == maxIteration){
               ctx.fillStyle = "darkblue";
            }else if( n >= 0.7 * maxIteration){
                ctx.fillStyle = "blue";
            }else if(n >= 0.4 * maxIteration){
                ctx.fillStyle = "lightblue";
            }else if(n >= 0.3 * maxIteration){
                ctx.fillStyle = "yellow";
            }else if(n >= 0.25 * maxIteration){
                ctx.fillStyle = "orange";
            }else if(n >= 0.23 * maxIteration){
                //ctx.fillStyle = "rgba("+ (bright + 100) +",0,0,"+ "255" +")";
                ctx.fillStyle = "#fc8b02";
            }else if(n >= 0.21 * maxIteration){
                ctx.fillStyle = "#fc4e02";
            }else if(n >= 0.13 * maxIteration){
                ctx.fillStyle = "#ff0000";
            }else if(n >= 0.10 * maxIteration){
                ctx.fillStyle = "#ee0000";
            }else if(n >= 0.07 * maxIteration){
                ctx.fillStyle = "#dd0000";
            }else if(n >= 0.04 * maxIteration){
                ctx.fillStyle = "#cc0000";
            }else if(n >= 0.02 * maxIteration){
                ctx.fillStyle = "#aa0000";
            }else if(n >= 0.01 * maxIteration){
                ctx.fillStyle = "#880000";
            }
            else{
                ctx.fillStyle = "#770000";
            }*/
            bright = 255 - bright;
            ctx.fillStyle = "rgba(" + bright + "," + bright + "," + bright + ")";
            ctx.fillRect(i, j, 1, 1);
        }
    }
}
setup();

function draw() {

}

intervalID = setInterval(draw, 1000 / 60);