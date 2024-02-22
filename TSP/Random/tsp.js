var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var numCities = 6;
var cities = [];
var order = [];
var rad = 10;

var best;
var record = Infinity;

var total = 0;

function setup() {
    background();
    for(var i = 0; i < numCities; i++){
        cities[i] = new City(random(rad, canvas.width - rad), random(rad + canvas.height / 8, canvas.height/2 - rad));
        order[i] = i;
    }
    best = copy(order);
    total++
}
setup();

function draw() {
    background();
    text((total / factorial(numCities) * 100) + "%", canvas.width / 2, canvas.height / 12, 40, "rgba(0,255,0)");
    for(var i = 0; i < cities.length - 1; i++){
        line(cities[order[i]].x, cities[order[i]].y, cities[order[i + 1]].x, cities[order[i + 1]].y, 2, "white");
    }
    for(var i = 0; i < cities.length; i++){
        cities[i].show();
    }
    var d = distance(cities);
    if(d < record) {
        best = copy(order);
        //console.log(d);
        record = d;
    }

    for(var i = 0; i < best.length - 1; i++) {
        line(cities[best[i]].x, cities[best[i]].y + canvas.height / 2, cities[best[i + 1]].x, cities[best[i + 1]].y + canvas.height / 2, 5, "purple");
    }
    for(var i = 0; i < cities.length; i++){
        cities[i].show2();
    }
    /** var index1 = Math.random() * order.length;
     *  var 
     */

    if(total < factorial(numCities)){
        nextOrder(order);
        total++;
    }else{
        clearInterval(intervalID);
    }
}

var intervalID = setInterval(draw, 1000 / 60);

function City(x,y) {
    this.x = x;
    this.y = y;
    this.show = function() {
        circle(this.x, this.y, rad, "white");
    }
    this.show2 = function() {
        circle(this.x, this.y + canvas.height / 2, rad, "white");
    }
    this.copy = function() {
        return new City(this.x,this.y);
    }
}

function circle(x,y,r,color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
}

function line(x0,y0,x1,y1,width,color) {
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(x0,y0);
    ctx.lineTo(x1,y1);
    ctx.closePath();
    ctx.stroke();
}

function background() {
    ctx.fillStyle = "rgba(0,0,0)";
    ctx.fillRect(0,0,canvas.width,canvas.height);
}

function swap(a,i,j) {
    var tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
}

function distance(c) {
    var sum = 0;
    for(var i = 0; i < c.length - 1; i++) {
        sum += (c[order[i]].x - c[order[i + 1]].x) * (c[order[i]].x - c[order[i + 1]].x) + (c[order[i]].y - c[order[i + 1]].y) * (c[order[i]].y - c[order[i + 1]].y);
    }
    return sum;
}

function copy(array) {
    var arr = [];
    for(var i = 0; i < array.length; i++) {
        arr[i] = array[i];
    }
    return arr;
}

function random(a,b) {
    return Math.random() * (b - a) + a;
}

function nextOrder(order) {
     //STEP 1
     var x = -1;
     for(var i = 0; i < order.length - 1; i++) {
         if(order[i] < order[i + 1]){
             x = i;
         }
     }
     
    //STEP 2
    var y = -1;
    for(var i = 0; i < order.length; i++) {
        if(order[x] < order[i]){
            y = i;
        }
    }
    
    //STEP 3
    swap(order,x,y);
    
    //STEP 4
    for(var i = 0; i < Math.floor((order.length - x) / 2); i++) {
        swap(order,i + x + 1, order.length - 1 - i);
    } 
}

function factorial(n) {
    if(n == 1) {
        return 1;
    }
    return n * factorial(n - 1);
}

function text(texte, px, py,taille, color) {
    ctx.font = "small-caps " + taille + "px dejavu sans mono";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = color;
    ctx.fillText(texte,px,py);
}

