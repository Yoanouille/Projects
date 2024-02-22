var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
document.addEventListener("keydown", keyDown);

var scl = 20;
var rows = Math.floor(canvas.height / scl);
var cols = Math.floor(canvas.width / scl);

var vlim = 50;
var color = "green";

var snake;
var state = 0;
var best = 0;

function keyDown(evt) {
    switch(evt.keyCode){
        case 38: 
            if(snake.dir != 2){
                snake.vx = 0;
                snake.vy = -1;
            }
            break;
        case 40: 
            if(snake.dir != 0){
                snake.vx = 0;
                snake.vy = 1;
            }
            break; 
        case 37: 
            if(snake.dir != 1){
                snake.vx = -1;
                snake.vy = 0;
            }
            break; 
        case 39: 
            if(snake.dir != 3){
                snake.vx = 1;
                snake.vy = 0;
            }
            break;     
        case 32:
            if(state == 0){
                state++;
            }
            if(state == 2){
                state = 1;
                snake = new Snake();
                clearInterval(intervalID);
                intervalID = setInterval(draw, 150);
            }
            break;
    }
}

function Snake() {
    this.x = Math.floor(cols / 2);
    this.y = Math.floor(rows / 2);
    this.vx = 0;
    this.vy = 0;
    this.tail = [];
    this.max = 0;
    this.dir = -1;
    this.vit = 150;
    this.apple = new Apple(5,5);
    this.newApple = function () {
        do{
            var b = false;
            var x = Math.floor(Math.random() * cols);
            var y = Math.floor(Math.random() * rows);
            for(var i=0; i<this.tail.length; i++){
                if(x == this.tail[i][0] && y == this.tail[i][1]){
                    b = true;
                }
            }
        } while (b);
        this.apple = new Apple(x,y);
    }
    this.show = function() {
        ctx.fillStyle = color;
        ctx.fillRect(this.x * scl + 1, this.y * scl + 1, scl - 1, scl - 1);
        for(var i=0; i<this.tail.length; i++){
            ctx.fillRect(this.tail[i][0] * scl + 1, this.tail[i][1] * scl + 1,scl - 1, scl - 1);
        }
        this.apple.show();
    }
    this.update = function() {
        if(this.vy == -1){
            this.dir = 0;
        }
        if(this.vy == 1){
            this.dir = 2;
        }
        if(this.vx == -1){
            this.dir = 3;
        }
        if(this.vx == 1){
            this.dir = 1;
        }

        if(this.x == this.apple.x && this.y == this.apple.y){
            this.newApple();
            this.max++;
            var r = Math.random();
            if(r > 0.5){
                this.vit -=10;
                if(this.vit < vlim) {
                    this.vit = vlim;
                }
                clearInterval(intervalID);
                intervalID = setInterval(draw, this.vit);
            }
        }
        this.tail.push([this.x,this.y]);
        while(this.tail.length > this.max){
            this.tail.splice(0,1);
        }
        this.x += this.vx;
        this.y += this.vy;
    }
    this.drawScore = function() {
        ctx.font = "small-caps 40px dejavu sans mono";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        var score = this.tail.length;
        ctx.fillText(score,canvas.width - canvas.width/16, canvas.height / 12);
    }
    this.collision = function() {
        if(this.x < 0 || this.y < 0 || this.x >= cols || this.y >= rows){
            return true;
        }
        for(var i=0; i<this.tail.length; i++){
            if(this.x == this.tail[i][0] && this.y == this.tail[i][1]){
                return true;
            }
        }
        return false;
    }
}

function Apple(x,y) {
    this.x = x;
    this.y = y;
    this.show = function() {
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(this.x * scl + scl / 2, this.y * scl + scl / 2, scl / 2, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    }
}

function setup() {
    ctx.fillStyle = "rgba(51,51,51)";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    snake = new Snake();
}
setup();

function draw() {
    if(state == 0){
        ctx.font = "small-caps 20px dejavu sans mono";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Appuyer sur ESPACE pour commencer !", canvas.width / 2, canvas.height / 2);
    }else if(state == 1){
        ctx.fillStyle = "rgba(51,51,51)";
        ctx.fillRect(0,0,canvas.width,canvas.height);
        snake.show();
        snake.update();
        snake.drawScore();
        if(snake.collision()){
            if(this.snake.tail.length > best){
                best = this.snake.tail.length;
            }
            state++;
        }
    }else if(state == 2){
        ctx.fillStyle = "rgba(51,51,51)";
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.font = "small-caps 30px dejavu sans mono";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("SCORE " + snake.tail.length, canvas.width / 2, 2 * canvas.height / 6);

        ctx.font = "small-caps 40px dejavu sans mono";
        ctx.fillStyle = "red";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 6);
        ctx.font = "small-caps 20px dejavu sans mono";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Appuyer sur ESPACE pour recommencer !", canvas.width / 2, 3 * canvas.height / 4);
        ctx.font = "small-caps 30px dejavu sans mono";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("HIGHSCORE " + best, canvas.width / 2, 3 * canvas.height / 6);
    }
    
}

var intervalID = setInterval(draw, 150);