var canvas = document.getElementById("cvs");
var ctx = canvas.getContext("2d");

const CUBE_SIZE = 80;
const LATERAL_SPEED = 10;
const GRAVITY = 0.5;
const UP_SPEED = 15;


var plateWidth = 100;
var plateHeight = 40;

var cube;
var plates = [];

var leftPressed = false;
var rightPressed = false;


document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

function keyDown(e) {
    switch(e.keyCode) {
        case 37: 
            leftPressed = true;
            break;
            
        case 39:
            rightPressed = true;
            break;
        
        case 32:
        if(!cube.jumping) {
            cube.jumping = true;
            cube.up();
        }
        break;

        case 40:
            cube.down();
            break;
    }
} 

function keyUp(e) {
    switch(e.keyCode) {
        case 37: 
            leftPressed = false;
            break;
            
        case 39:
            rightPressed = false;
            break;
    }
} 


function Plate(left, top) {
    this.left = left;
    this.top = top;
    this.right = this.left + plateWidth;
    this.bottom = this.top + plateHeight;

    this.show = function() {
        ctx.fillStyle = "blue";
        ctx.fillRect(this.left, this.top, plateWidth, plateHeight);
    }

    this.collision = function(r) {
        if(r.top > this.bottom || r.bottom < this.top || r.left > this.right || r.right < this.left) {
            return;
        }

        if(r.top <= this.bottom && r.oldT > this.bottom) {
            r.top = this.bottom + 0.1;
            r.bottom = r.top + CUBE_SIZE;
            r.vy = 0;

        }

        if(r.bottom >= this.top && r.oldB < this.top) {
            r.bottom = this.top - 0.1;
            r.top = r.bottom - CUBE_SIZE;
            //r.jumping = false;
            //r.up();
            r.vy = -0.60 * r.vy;
        }

        if(r.left <= this.right && r.oldL > this.right) {
            r.left = this.right + 0.1;
            r.right = r.left + CUBE_SIZE;
        }

        if(r.right >= this.left && r.oldR < this.left) {
            r.right = this.left - 0.1;
            r.left = r.right - CUBE_SIZE;
        }
    }
}


function Cube() {
    this.oldT = this.top = canvas.height - CUBE_SIZE;
    this.oldL = this.left = canvas.width / 2 - CUBE_SIZE / 2;
    this.oldB = this.bottom = this.top + CUBE_SIZE;
    this.oldR = this.right = this.left + CUBE_SIZE;
    this.jumping = false
    this.vy = 0;
    this.ax = 0;
    this.ay = 0;

    this.applyForce = function(fy) {
        this.ay += fy;
    }

    this.up = function() {
        this.vy = -UP_SPEED;
    }

    this.down = function() {
        this.vy = 20;
    }

    this.show = function() {
        ctx.fillStyle = "red";
        ctx.fillRect(this.left, this.top, CUBE_SIZE, CUBE_SIZE);
        ctx.lineWidth = 3;
        ctx.strokeStyle = "black";
        ctx.strokeRect(this.left, this.top, CUBE_SIZE, CUBE_SIZE);
    }

    this.update = function() {
        this.oldT = this.top;
        this.oldB = this.bottom;
        this.oldL = this.left;
        this.oldR = this.right;
        if(leftPressed) {
            this.oldL = this.left;
            this.oldR = this.right;
            this.left -= LATERAL_SPEED;
            this.right -= LATERAL_SPEED;
        }
        if(rightPressed) {
            this.left += LATERAL_SPEED;
            this.right += LATERAL_SPEED;
        }

        this.vy += this.ay;


        this.top += this.vy;
        this.bottom += this.vy;

        if(this.bottom > canvas.height) {
            vy = 0;
            this.bottom = canvas.height;
            this.top = this.bottom - CUBE_SIZE;
            this.jumping = false;
        }

        this.ay = 0;
    }
}
 
function background() {
    ctx.fillStyle = "rgba(51,51,51)";
    ctx.fillRect(0,0,canvas.width,canvas.height);
}

function setup() {
    background();
    cube = new Cube();
    plates.push(new Plate(500,500));
    plates.push(new Plate(50,550));
    plates.push(new Plate(300,400));
}
setup();

function draw() {
    background();
    cube.show();
    cube.applyForce(GRAVITY);
    cube.update();

    for(var i = 0; i < plates.length; i++) {
        plates[i].show();
        plates[i].collision(cube);
    }
}

var intervalID = setInterval(draw, 1000 / 60);