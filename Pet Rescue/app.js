const canvas = document.getElementById("cvs");
const ctx = canvas.getContext("2d");

const width = canvas.width = 600;
const height = canvas.height = 600;

let intervalID;

/*****************************
 * INITIALISATION CONSTANTES *
 *****************************/

let grid = [];
let colors = ["red","blue","green","yellow","purple"];
let scl = 60;
const rows = height / scl;
const column = width / scl;

/*******************
 * FONCTIONS OBJET *
 *******************/

function Cell(x,y) {
    this.x = x;
    this.y = y;
    this.xOff = 0;
    this.yOff = 0;
    this.color = colors[Math.floor(Math.random() * colors.length)];

    this.show = function() {
        ctx.fillStyle = "black";
        ctx.fillRect((this.x) * scl + this.xOff, (this.y) * scl - this.yOff, scl, scl);
        ctx.fillStyle = "white";
        ctx.fillRect((this.x) * scl + 1, (this.y) * scl + 1, scl - 1, scl - 1);
        ctx.fillStyle = this.color;
        ctx.fillRect((this.x) * scl + this.xOff + 1, (this.y) * scl - this.yOff + 1, scl - 1, scl - 1);
    }

    this.update = function() {
        if(this.yOff != 0) this.yOff -= 5;
        if(this.xOff != 0) this.xOff -= 5;
    }

    this.explose = function(color) {
        if(this.color != color) return;
        this.color = "white";
        if(this.x > 0) {
            grid[this.x - 1][this.y].explose(color);
        }
        if(this.x < grid.length - 1) {
            grid[this.x + 1][this.y].explose(color);
        }
        if(this.y > 0) {
            grid[this.x][this.y - 1].explose(color);
        }
        if(this.y < grid[0].length - 1) {
            grid[this.x][this.y + 1].explose(color);
        }
    }
    this.canExplose = function() {
        if(this.color == "white") return false;
        let explose = false;
        if(this.x > 0) {
            if(grid[this.x - 1][this.y].color == this.color) explose = true;
        }
        if(this.x < grid.length - 1) {
            if(grid[this.x + 1][this.y].color == this.color) explose = true;
        }
        if(this.y > 0) {
            if(grid[this.x][this.y - 1].color == this.color) explose = true;
        }
        if(this.y < grid[0].length - 1) {
            if(grid[this.x][this.y + 1].color == this.color) explose = true;
        }
        return explose;
    }
    this.fall = function() {
        if(this.color == "white") return;
        while(this.y < grid[0].length - 1 && grid[this.x][this.y + 1].color == "white") {
            grid[this.x][this.y + 1].y = this.y;
            grid[this.x][this.y] = grid[this.x][this.y + 1];
            grid[this.x][this.y + 1] = this;
            this.y = this.y + 1;
            this.yOff += scl;
        }
    }

    this.leftOnLastLine = function() {
        if(this.color == "white") return;
        let step = 0;
        let x = this.x;
        while(this.x > 0 && grid[this.x - 1][this.y].color == "white") {
            grid[this.x - 1][this.y].x = this.x;
            grid[this.x][this.y] = grid[this.x - 1][this.y];
            grid[this.x - 1][this.y] = this;
            this.x = this.x - 1;
            step++;
            this.xOff += scl;
        }
        for(let y = 0; y < rows - 1; y++) {
            grid[x][y].left(step);
        }
    }

    this.left = function(step) {
        if(this.color == "white") return;
        for(let i = 0; i < step; i++) {
            grid[this.x - 1][this.y].x = this.x;
            grid[this.x][this.y] = grid[this.x - 1][this.y];
            grid[this.x - 1][this.y] = this;
            this.x = this.x - 1;
        }
        this.xOff += scl * step;
    }
}

/*****************
 * FONCTION MAIN *
 *****************/

function setup() {
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,width,height);
    for(let x = 0; x < column; x++) {
        grid[x] = []
        for(let y = 0; y < rows; y++) {
            grid[x][y] = new Cell(x,y);
        }
    }    
    //draw();
    intervalID = setInterval(draw, 1000 / 60);
}
setup();

function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,width,height);
    for(let x = column - 1; x >= 0; x--) {
        for(let y = 0; y < rows; y++) {
            grid[x][y].show();
            grid[x][y].update();
        }
    }
}

/*************************
 * FONCTIONS AUXILIAIRES *
 *************************/
function getMousePos(evt) {
    let Rect = canvas.getBoundingClientRect();
    let x = evt.clientX - Rect.left;
    x = Math.floor(x / scl);
    let y = evt.clientY - Rect.top;
    y = Math.floor(y / scl);
    return {x:x,y:y};
}


/***************************
 * FONCTIONS INTERAGISSANT *
 ***************************/

document.addEventListener("click", click);
function click(evt) {
    let pos = getMousePos(evt);
    let color = grid[pos.x][pos.y].color;
    //if(grid[pos.x][pos.y].canExplose()) {
        grid[pos.x][pos.y].explose(color);
    //}
    for(let x = 0; x < column; x++) {
        for(let y = rows - 1; y >= 0; y--) {
            grid[x][y].fall();
        }
    }

    for(let x = 0; x < column; x++) {
        grid[x][grid[0].length - 1].leftOnLastLine();
    }

}