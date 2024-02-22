var canvas = document.getElementById("cvs");
var ctx = canvas.getContext("2d");
var debut_div = document.getElementById("debut");
var start = document.getElementById("start");
var board = document.querySelector(".board");
var fin_div = document.getElementById("fin");
//var explosion_div = document.getElementById("explosion");
var score = document.getElementById("score");
var recommencer = document.getElementById("restart");
var intervalID;
var interval2;
var cercles = [];
var time;

var explX;
var explY;

var num_mine = 20;
var scl = 40;

var grid = [];
var rows = Math.floor(canvas.width / scl);
var cols = Math.floor(canvas.height  / scl);

var state = 0;

recommencer.addEventListener("click", restart);

function restart() {
    grid = [];
    setup();
    change(fin_div, board);
}

start.addEventListener("click", debut);
//explosion_div.addEventListener("click", explode);

function explode() {
    interval2 = setInterval(drawExplode, 1000 / 60);
    cercles.push(new Circle("white"));
    time = 0;
}

function end() {
    change(board, fin_div);
}
function Circle(color) {
    this.x = explX;
    this.y = explY;
    this.r = 1;
    this.color = color;
    this.show = function() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    }
    
    this.update = function() {
        this.r += 5;
    }
}



function drawExplode() {
    if(time == 2) {
        cercles.push(new Circle("yellow"));
    }else if(time == 4) {
        cercles.push(new Circle("orange"));
    }else if(time == 6) {
        cercles.push(new Circle("red"));
    }else if(time == 8) {
        cercles.push(new Circle("#04002a"));
    }
    for(var i = 0; i < cercles.length; i++) {
        cercles[i].show();
        cercles[i].update();
    }
    
    time++;
    if(time == 150) {
        clearInterval(interval2);
        cercles = [];
        time = 0;
    }
    //console.log(time);
}

function debut() {
    setup();
    change(debut_div, board);
}

function change(bloc1, bloc2) {
    bloc1.style.opacity = 0;
    setTimeout(function() {
        bloc1.classList.add("disp");
        bloc2.classList.remove("disp");
        setTimeout(function() {
            bloc2.style.opacity = 1;
        }, 300)
    }, 1000);
}

function initGrid(g) {
    for(var i = 0; i < rows; i++) {
        grid[i] = [];
        for(var j = 0; j < cols; j++) {
            //console.log(i + "," + j);
            g[i][j] = new Cell(i,j,true);
        }
    }
}

function initMine(g) {
    for(var i = 0; i < num_mine; i++) {
        do {
            var x = Math.floor(Math.random() * rows);
            var y = Math.floor(Math.random() * cols);
        }while(g[x][y].mine);
        grid[x][y].mine = true;
    }
}

function initCell(g) {
    for(var i = 0; i < g.length; i++) {
        for(var j = 0; j < g[i].length; j++) {
            if(!g[i][j].mine){
                var num = 0;
                for(var k = -1; k <= 1; k++) {
                    for(var l = -1; l <= 1; l++) {
                        var indexI = i + k;
                        var indexJ = j + l;
                        if(isValidIndex(g,indexI,indexJ) && g[indexI][indexJ].mine) {
                            num++;
                        }
                    }
                }
                g[i][j].num = num;
            }
        }
    }
}

function isValidIndex(g,i,j) {
    return !(i < 0 || i >= g.length || j < 0 || j >= g[0].length);
}

function setup() {
    state = 0;
    initGrid(grid);
    initMine(grid);
    initCell(grid);
    draw();
}

function draw() {
    background();
    drawGrid(grid);
}

function Cell(x,y) {
    this.x = x;
    this.y = y;
    this.mine = false;
    this.num = -1;
    this.revealed = false; 
    this.drapped = false;
    this.show = function() {
        ctx.fillStyle = "white";
        ctx.fillRect((this.x * scl) + 2, (this.y * scl) + 2, scl - 2, scl - 2);
        if(this.revealed){
            ctx.fillStyle = "rgba(200,200,200)";
            ctx.fillRect((this.x * scl) + 2, (this.y * scl) + 2, scl - 2, scl - 2); 
            if(this.mine) {
                ctx.lineWidth = 2;
                ctx.fillStyle = "black";
                ctx.beginPath();
                ctx.arc(this.x * scl + scl / 2, this.y * scl + scl / 2, scl / 4, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.fill();
            } else if(this.num != 0){
                ctx.font = "small-caps 10px dejavu sans mono";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillStyle = "black";
                ctx.fillText(this.num, this.x * scl + scl / 2, this.y * scl + scl / 2);
            }
        }
        if(this.drapped) {
            ctx.fillStyle = "rgba(255,0,0)";
            ctx.fillRect((this.x * scl) + 2, (this.y * scl) + 2, scl - 2, scl - 2);
        }
    }
    this.reveal = function() {
        this.revealed = true;
        if(this.num == 0) {
            for(var i = -1; i <= 1; i++) {
                for(var j = -1; j <= 1; j++) {
                    indexI = this.x + i;
                    indexJ = this.y + j;
                    if(isValidIndex(grid,indexI,indexJ) && !grid[indexI][indexJ].revealed){
                        grid[indexI][indexJ].reveal();
                    }
                }
            }
        }
    }
}

canvas.addEventListener("click", click);
canvas.oncontextmenu = function(e) {
    var pos = getMousePos(canvas, e);
    var x = Math.floor(pos.x / scl);
    var y = Math.floor(pos.y / scl);
    if(!grid[x][y].revealed){
        grid[x][y].drapped = !grid[x][y].drapped;
    }
    if(allDrapped(grid)){
        state = 2;
    }
    draw();
    if(state == 2) {
        for(var i =0; i < grid.length; i++) {
            for(var j = 0;  j < grid[i].length; j++) {
                grid[i][j].revealed = true;
            }
        }
        setTimeout(draw, 500);
        score.innerHTML = "BRAVO";
        setTimeout(end,1000);
        /*ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = "green";
        ctx.font = "small-caps 40px dejavu sans mono";
        ctx.fillText("BRAVO", canvas.width / 2, canvas.height / 2);*/
    }
    return false;
}


function getMousePos(cvs, evt) {
    var rect = cvs.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top,
    };
}

function click(e) {
    if(state == 0){
        var pos = getMousePos(canvas, e);
        var x = Math.floor(pos.x / scl);
        var y = Math.floor(pos.y / scl);
        if(!grid[x][y].drapped){
            if(grid[x][y].mine) {
                //badEnd();
                state = 1;
            }
            grid[x][y].reveal();
        }
        draw();
        if(state == 1) {
            explX = x * scl + scl / 2;
            explY = y * scl + scl / 2;
            explode();

            score.innerHTML = "PERDU";
            setTimeout(end,2000);
            /*ctx.fillStyle = "rgba(255,255,255,0.5)";
            ctx.fillRect(0,0,canvas.width,canvas.height);
            ctx.fillStyle = "red";
            ctx.font = "small-caps 40px dejavu sans mono";
            ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);*/
        }
    }
}

function drawGrid(g) {
    for(var i = 0; i < g.length; i++) {
        for(var j = 0; j < g[i].length; j++) {
            //console.log(grid[i][j].x + "," + grid[i][j].y);
            g[i][j].show();
        }
    }
}

function badEnd() {
    for(var i = 0; i < grid.length; i++) {
        for(var j = 0; j < grid[i].length; j++) {
            grid[i][j].revealed = true;
        }
    } 
    state = 1;
}

function background() {
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,canvas.width,canvas.height);
}

function allDrapped(g) {
    for(var i = 0; i < g.length; i++) {
        for(var j = 0; j < g[i].length; j++) {
            if(g[i][j].mine && !g[i][j].drapped) {
                return false;
            }
        }
    }
    return true;
}
