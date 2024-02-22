var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var width = canvas.width;
var height = canvas.height;

var grid = [];
var next = [];

var dA = 1;
var dB = 0.5;
var f = 0.055;
var k = 0.062;

function setup() {
    for(var i=0; i<width; i++){
        grid[i] = [];
        next[i] = [];
        for(var j=0; j<height; j++){
            grid[i][j] = {a: 1, b: 0};
            next[i][j] = {a: 1, b: 0};
        }
    }
    for(var i=95; i<105; i++){
        for(var j=95; j<105; j++){
            grid[i][j] = {a: 0, b: 1};
        }
    }
    
}
setup();

function drawGrid() {
    for(var i=0; i<width; i++){
        for(var j=0; j<height; j++){
            
            ctx.fillStyle = "rgba(" + (grid[i][j].a * 255) + "," + (grid[i][j].a * 255) + "," + (grid[i][j].a * 255) + ", 1)";
            ctx.fillRect(i,j,1,1);
        }
    }
}

function swap() {
    var tmp = grid;
    grid = next;
    next = tmp;
}

function laplacianB(x,y) {
    var sum = 0;
    sum += grid[x][y].b * -1;
    sum += grid[x+1][y].b * 0.2;
    sum += grid[x-1][y].b * 0.2;
    sum += grid[x][y+1].b * 0.2;
    sum += grid[x][y-1].b * 0.2;
    sum += grid[x+1][y+1].b * 0.05;
    sum += grid[x-1][y+1].b * 0.05;
    sum += grid[x+1][y-1].b * 0.05;
    sum += grid[x-1][y-1].b * 0.05;
    return sum;
}

function laplacianA(x,y) {
    var sum = 0;
    sum += grid[x][y].a * -1;
    sum += grid[x+1][y].a * 0.2;
    sum += grid[x-1][y].a * 0.2;
    sum += grid[x][y+1].a * 0.2;
    sum += grid[x][y-1].a * 0.2;
    sum += grid[x+1][y+1].a * 0.05;
    sum += grid[x-1][y+1].a * 0.05;
    sum += grid[x+1][y-1].a * 0.05;
    sum += grid[x-1][y-1].a * 0.05;
    return sum;
}

function evolution() {
    for(var i=1; i<width-1; i++){
        for(var j=1; j<height-1; j++){
            var a = grid[i][j].a;
            var b = grid[i][j].b;
            next[i][j].a = a
                           + dA * laplacianA(i,j)
                           - a * b * b
                           + f * (1 - a);
            next[i][j].b = b 
                           + dB * laplacianB(i,j)
                           + a * b * b
                           - (k + f) * b;
            ctx.fillStyle = "rgba(" + (grid[i][j].a * 255) + "," + (grid[i][j].a * 255) + "," + (grid[i][j].a * 255) + ", 1)";
            ctx.fillRect(i,j,1,1);
        }
    }
}

function draw() {
    evolution();
    swap();
}

intervalID = setInterval(draw, 1000 / 60);