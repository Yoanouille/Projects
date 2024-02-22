var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var scale = 30;
var rows = Math.floor(canvas.height / scale);
var cols = Math.floor(canvas.width / scale);
var cells = [];
var current;
var stack = [];
var avance = true;

function line(x1,y1,x2,y2){
    ctx.beginPath();
    ctx.strokeStyle = "white";
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.closePath();
    ctx.stroke();
}

function getIndex (x,y) {
    if(x < 0 || y < 0 || x > cols - 1 || y > rows + 1) {
        return undefined;
    }
    return x + y * cols;
}

function removeWalls(c1, c2){
    var x = c1.x - c2.x;
    if(x == -1){
        c1.walls[1] = false;
        c2.walls[3] = false;
    }
    if(x == 1){
        c1.walls[3] = false;
        c2.walls[1] = false;
    }
    var y = c1.y - c2.y;
    if(y == -1){
        c1.walls[2] = false;
        c2.walls[0] = false;
    }
    if(y == 1){
        c1.walls[0] = false;
        c2.walls[2] = false;
    }
}

function Cell(x,y) {
    this.x = x;
    this.y = y;
    this.walls = [true/* haut */,true/* droite */,true/* bas */,true/* gauche */];
    this.visited = false;
    this.show = function() {
        if(this.walls[0]){
            // HAUT
            line(this.x * scale, this.y * scale, this.x * scale + scale, this.y * (scale));
        }

        if(this.walls[1]){
            // DROITE
            line(this.x * scale + scale, this.y * (scale), this.x * scale + scale, this.y * scale + scale);
        }

        if(this.walls[2]){
            // GAUCHE
            line(this.x * scale + scale, this.y * scale + scale, this.x * (scale), this.y * scale + scale);
        }

        if(this.walls[3]){
            // BAS
            line(this.x * (scale), this.y * scale + scale, this.x * (scale), this.y * (scale));
        }
        if(this.visited){
            ctx.fillStyle = "purple";
            ctx.strokeStyle = "purple";
            ctx.fillRect(this.x * scale, this.y * scale, scale, scale);
        }
    }
        
    this.highlight = function(color) {
        ctx.fillStyle = color;
        ctx.fillRect(this.x * scale, this.y * scale, scale, scale);
    }
    this.getVoisins = function() {
        var top = cells[getIndex(this.x,this.y - 1)];
        var right = cells[getIndex(this.x + 1, this.y)];
        var bottom = cells[getIndex(this.x, this.y + 1)];
        var left = cells[getIndex(this.x - 1, this.y)];
        var voisins = [];
        if(top && !top.visited) {
            voisins.push(top);
        }
        if(right && !right.visited){
            voisins.push(right);
        }
        if(bottom && !bottom.visited){
            voisins.push(bottom);
        }
        if(left && !left.visited){
            voisins.push(left);
        }

        if(voisins.length != 0){
            var r = Math.floor(Math.random() * voisins.length);
            return voisins[r];
        }else{
            return undefined;
        }
    }
    
}

function setup() {
    for(var y=0; y<rows; y++){
        for(var x=0; x<cols; x++){
            cells.push(new Cell(x,y));
        }
    }
    current = cells[0];
    stack.push(current);
}
setup();

function draw() {
    ctx.fillStyle = "rgba(51,51,51)";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    current.visited = true;
    for(var i=0; i<cells.length; i++){
        cells[i].show();
    }
    if(avance){
        current.highlight("green");
    }else{
        current.highlight("blue");
    }

    var next = current.getVoisins();
    if(next) {
        stack.push(next);
        removeWalls(current,next);
        current = next;
        avance = true;
    } else if(stack.length > 0){
        current = stack.pop();
        avance = false;
    }

}

intervalID = setInterval(draw, 100);