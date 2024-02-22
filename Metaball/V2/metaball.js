const canvas = document.getElementById("cvs");
const ctx = canvas.getContext("2d");

const width = canvas.width = 800;
const height = canvas.height = 600;

let intervalID;

let scl = 5;
let ligne = (height) / scl;
let colonne = (width) / scl;

let num = 5;
let cercles = [];
let grid = [];

function Circle() {
    this.r = Math.random() * 60 + 30;
    this.x = Math.random() * width;
    while(this.x < this.r || this.x > width - this.r) {
        this.x = Math.random() * width;
    }

    this.y = Math.random() * height
    while(this.y < this.r || this.y > height - this.r) {
        this.y = Math.random() * height;
    }

    this.vx = Math.random() * 2 + 1;
    this.vy = Math.random() * 2 + 1;

    this.update = function() {
        this.x += this.vx;
        this.y += this.vy;

        if(this.x < this.r || this.x > width - this.r) this.vx = -this.vx;
        if(this.y < this.r || this.y > height - this.r) this.vy = -this.vy;
    }
}

function setup() {
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,width,height);
    for(let x = 0; x <= colonne; x++) {
        grid[x] = [];
        for(let y = 0; y <= ligne; y++) {
            grid[x][y] = 0;
        }
    }
    for(let i = 0; i < num; i++) {
        cercles.push(new Circle());
    }

    //draw();
    intervalID = setInterval(draw, 1000 / 60);
}
setup();

function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,width,height);
    /*for(let x = 0; x < colonne + 1; x++) {
        for(let y = 0; y < ligne + 1; y++) {
            point(x * scl, y * scl, 2, "white");
        }
    }*/
    for(let i = 0; i < cercles.length; i++) {
        cercles[i].update();
        /*let x = cercles[i].x;
        let y = cercles[i].y;
        let r = cercles[i].r
        cercle(x,y,r,"green");*/
    }

    for(let x = 0; x <= colonne; x++) {
        let x1 = x * scl;
        for(let y = 0; y <= ligne; y++) {
            let y1 = y * scl;
            let value = 0;
            for(let k = 0; k < cercles.length; k++) {
                let cx = cercles[k].x;
                let cy = cercles[k].y;
                let r = cercles[k].r;
                value += f(x1,y1,cx,cy,r);
            }
            if(value >= 1) {
                value = 1;
                //point(x1,y1,2,"green");
            } else {
                value = 0;
            }
            grid[x][y] = value; 
        }
    }

    for(let x = 0; x < colonne; x++) {
        for(let y = 0; y < ligne; y++) {
            let a = grid[x][y];
            let b = grid[x + 1][y];
            let c = grid[x + 1][y + 1];
            let d = grid[x][y + 1];
            let x1 = x * scl + scl / 2;
            let y1 = y * scl + scl / 2;
            trace(a,b,c,d,x1,y1);
        }
    }
}

function trace(a,b,c,d,x,y) {
    let bit = a * 2 * 2 * 2 + b * 2 * 2 + c * 2 + d;
    //console.log(bit);
    switch(bit) {
        case 1 :
        case 14:
            line(x - scl / 2, y, x, y + scl / 2);
            break;
        
        case 2 :
        case 13:
            line(x + scl / 2, y, x , y + scl / 2);
            break;

        case 3 :
        case 12:
            line(x - scl / 2, y, x + scl / 2, y);
            break;
        
        case 4 :
        case 11:
            line(x + scl / 2, y, x, y - scl / 2);
            break;
        
        case 5 :
            line(x - scl / 2, y, x, y - scl / 2);
            line(x + scl / 2, y, x , y + scl / 2);
            break;

        case 10:
            line(x - scl / 2, y, x, y + scl / 2);
            line(x + scl / 2, y, x, y - scl / 2);
            break;
        
        case 6 :
        case 9 :
            line(x, y - scl / 2, x, y + scl / 2);
            break;

        case 7 : 
        case 8 :
            line(x - scl / 2, y, x, y - scl / 2);
            break;

    }
}

function point(x,y,r,c) {
    ctx.beginPath();
    ctx.fillStyle = c;
    ctx.arc(x,y,r,0,Math.PI / 2,true);
    ctx.closePath();
    ctx.fill();
}

function cercle(x,y,r,c) {
    ctx.beginPath();
    ctx.strokeStyle = c;
    ctx.arc(x,y,r,0,Math.PI * 2,true);
    ctx.closePath();
    ctx.stroke();
}

function line(x0,y0,x1,y1) {
    ctx.beginPath();
    ctx.strokeStyle = "white";
    ctx.moveTo(x0,y0);
    ctx.lineTo(x1,y1);
    ctx.stroke();
}

function f(x,y,cx,cy,r) {
    return (r * r) / ((x - cx) * (x - cx) + (y - cy) * (y - cy));
}