var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
const FPS = 60;
const SHIP_SIZE = 20;
const SPEED_TURN = 360;
const SHIP_THRUST = 5 // acceleration en pixel par seconde² 
const FRIXION = 0.7;
const ROIDS_NUM = 1;
const ROIDS_SIZE = 100; // taille des asteroids
const ROIDS_SPEED = 50; // vitesse max
const ROIDS_COTE = 10;
const ROIDS_JAG = 0.33;
const SHOW_BOUNDING = false;
const LASER_SPEED = 20;
const NUM_LASER = 5;
const MAX_LASER_DIST = 0.4 * canvas.width;
const DUR_EXPLOSE = 0.1;
const TIME_TEXT = 1.5;
var ship, roids, level, text, textOp, lives, score, best;
best = 0;

function newGame() {
    ship = newShip();
    roids = [];
    level = 0;
    lives = 3;
    score = 0;
    newLevel();
}

function newLevel() {
    newRoidsBelt();
    text = "Level " + (level + 1);
    textOp = 1;
}

function destroyRoids(i) {
    if(roids[i].r == Math.ceil(ROIDS_SIZE / 2)){
        roids.push(newRoid(roids[i].x,roids[i].y,Math.ceil(ROIDS_SIZE / 4)));
        roids.push(newRoid(roids[i].x,roids[i].y,Math.ceil(ROIDS_SIZE / 4)));
        score += 20;
    }else if(roids[i].r == Math.ceil(ROIDS_SIZE / 4)){
        roids.push(newRoid(roids[i].x,roids[i].y,Math.ceil(ROIDS_SIZE / 8)));
        roids.push(newRoid(roids[i].x,roids[i].y,Math.ceil(ROIDS_SIZE / 8)));
        score += 50
    }else{
        score += 100;
    }
    if(score > best){
        best = score;
    }
    roids.splice(i,1);
    if(roids.length == 0){
        level++;
        newLevel();
    }
}

function drawScore() {
    ctx.fillStyle = "rgba(255,255,255," + 1 + ")";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "small-caps 40px dejavu sans mono";
    ctx.fillText(score, canvas.width - canvas.width/8, canvas.height / 12);
}

function drawBest() {
    ctx.fillStyle = "rgba(255,255,255," + 1 + ")";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "small-caps 40px dejavu sans mono";
    ctx.fillText("BEST " + best, canvas.width / 2, canvas.height / 12);
}

function newShip() {
    var nShip = {
        x: canvas.width / 2, // position x
        y: canvas.height / 2, // position y
        r: SHIP_SIZE, // rayon
        a: 90 / 180 * Math.PI, // angle
        rot: 0, // vitesse de rotation en degre par seconde
        thrusting: false, 
        thrust : {
            x: 0,
            y: 0,
        },
        explodeTime : 0,
        blinkTime: Math.ceil(0.1 * FPS),
        blinkNum: 30,
        canShoot: true,
        laser: [],
        dead: false,
    };
    return nShip;
    
}

function gameOver() {
    ship.dead = true;
    text = "Game Over";
    textOp = 1.0;
}

function newRoidsBelt() {
    var x,y;
    for(var i=0; i<ROIDS_NUM+level; i++){
        do {
            x = Math.random() * canvas.width;
            y = Math.random() * canvas.height;
        }while(distance(ship.x,x,ship.y,y) < ROIDS_SIZE * 2);
        roids[i] = newRoid(x,y,Math.ceil(ROIDS_SIZE / 2));
    }
}

function newRoid(x,y,r) {
    var mult = 1 + 0.1 * level;
    var roid = {
        x : x,
        y : y,
        vx : Math.random() * ROIDS_SPEED * mult / FPS * (Math.random() < 0.5 ? 1 : -1),
        vy : Math.random() * ROIDS_SPEED / FPS * (Math.random() < 0.5 ? 1 : -1),
        r : r,
        a : Math.random() * Math.PI * 2,
        nCote : Math.floor(Math.random() * (ROIDS_COTE + 1) + ROIDS_COTE/2),
        offs : []
    };
    for(var i=0; i<roid.nCote; i++){
        roid.offs[i] = Math.random() * 2 * ROIDS_JAG + 1 - ROIDS_JAG;
    }
    return roid;
}

function explosionShip() {
    ctx.beginPath();
    ctx.fillStyle = "darkred";
    ctx.arc(ship.x, ship.y, ship.r * 1.2, 0, 2 * Math.PI, true);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.arc(ship.x, ship.y, ship.r * 1, 0, 2 * Math.PI, true);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = "orange";
    ctx.arc(ship.x, ship.y, ship.r * 0.8, 0, 2 * Math.PI, true);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = "yellow";
    ctx.arc(ship.x, ship.y, ship.r * 0.6, 0, 2 * Math.PI, true);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.arc(ship.x, ship.y, ship.r * 0.4, 0, 2 * Math.PI, true);
    ctx.closePath();
    ctx.fill();
}

function shootLaser() {
    if(ship.canShoot && ship.laser.length < NUM_LASER){
        ship.laser.push({
            x: ship.x + ship.r * Math.cos(ship.a),
            y: ship.y - ship.r * Math.sin(ship.a),
            vx: Math.cos(ship.a) * LASER_SPEED,
            vy: Math.sin(ship.a) * LASER_SPEED,
            dist: 0,
            timeExplose: 0,
        });
    }
    ship.canShoot = false;
}

function keyDown(evt) {
    if(ship.dead) return;

    switch(evt.keyCode){
        case 32:
            shootLaser();
            break;
        case 37: //tourne vers la gauche
            ship.rot = SPEED_TURN / 180 * Math.PI / FPS
            break;
        
        case 39: //tourne vers la droite
            ship.rot =  - SPEED_TURN / 180 * Math.PI / FPS
            break;
        
        case 38: //accelere
            ship.thrusting = true;
            break;
    }
}


function keyUp(evt) {
    switch(evt.keyCode){
        case 32:
            ship.canShoot = true;
        case 37: //arrete de tourner
            ship.rot = 0;
            break;
        
        case 39: //arrete d'accelerer
            ship.rot = 0;
            break;
        
        case 38: //arrete de tourner
            ship.thrusting = false;
            break;
    }
}

setInterval(update, 1000/FPS);
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);
newGame();

function distance (x1,x2,y1,y2){
    return Math.sqrt(Math.pow(x2-x1,2) + Math.pow(y2-y1,2));
}

function milieu(x1, y1, x2, y2) {
    var point = {
        x: (x1 + x2) / 2,
        y: (y1 + y2) / 2
    };
    return point
}

function drawProp() {
    var lX = ship.x + ship.r * (Math.cos(ship.a + 17*Math.PI/24));
    var lY = ship.y - ship.r * (Math.sin(ship.a + 17*Math.PI/24));
    var rX = ship.x + ship.r * (Math.cos(ship.a - 17*Math.PI/24));
    var rY = ship.y - ship.r * (Math.sin(ship.a - 17*Math.PI/24));
    var mX = milieu(lX,lY,rX,rY).x;
    var mY = milieu(lX,lY,rX,rY).y;
    ctx.beginPath();ctx.lineWidth = 3;
    ctx.strokeStyle = "yellow";
    ctx.fillStyle = "red";
    ctx.moveTo(
        milieu(lX,lY,mX,mY).x,
        milieu(lX,lY,mX,mY).y
    );
    ctx.lineTo(
        ship.x - ship.r * Math.cos(ship.a) * 4 / 3,
        ship.y + ship.r * Math.sin(ship.a) * 4 / 3
    );
    ctx.lineTo(
        milieu(rX,rY,mX,mY).x,
        milieu(rX,rY,mX,mY).y
    );
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

function drawShip(x,y,a,c) {
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = c;
    ctx.moveTo(
        x + ship.r * Math.cos(a),
        y - ship.r * Math.sin(a)
    );
    ctx.lineTo(
        x + ship.r * (Math.cos(a + 17*Math.PI/24)),
        y - ship.r * (Math.sin(a + 17*Math.PI/24))
    );
    ctx.lineTo(
        x + ship.r * (Math.cos(a - 17*Math.PI/24)),
        y - ship.r * (Math.sin(a - 17*Math.PI/24))
    );
    ctx.closePath();
    ctx.stroke();

    
    
    if(SHOW_BOUNDING){
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "lime";
        ctx.arc(ship.x, ship.y, ship.r * 17/24,0, 2*Math.PI, true);
        ctx.closePath();
        ctx.stroke();
    }
}
function drawRoids() {
    for(var i=0; i<roids.length; i++){
        ctx.beginPath();
        ctx.strokeStyle = "slategrey";
        ctx.lineWidth = 2;
        ctx.moveTo(
            roids[i].x + roids[i].r * roids[i].offs[0] * (Math.cos(roids[i].a)),
            roids[i].y + roids[i].r * (Math.sin(roids[i].a))
        )
        for(var j=0; j<roids[i].nCote; j++){
            ctx.lineTo(
                roids[i].x + roids[i].r * roids[i].offs[j] * (Math.cos(roids[i].a + j * 2 * Math.PI / roids[i].nCote)),
                roids[i].y + roids[i].r * roids[i].offs[j] * (Math.sin(roids[i].a + j * 2 * Math.PI / roids[i].nCote))
            )
        }
        ctx.closePath();
        ctx.stroke();
        if(roids[i].x + roids[i].r < 0){
            roids[i].x = canvas.width + roids[i].r;
        }
        if(roids[i].x - roids[i].r > canvas.width){
            roids[i].x = 0 - roids[i].r;
        }
        if(roids[i].y + roids[i].r < 0){
            roids[i].y = canvas.height + roids[i].r;
        }
        if(roids[i].y - roids[i].r > canvas.height){
            roids[i].y = 0 - roids[i].r;
        }
        if(SHOW_BOUNDING){
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "lime";
            ctx.arc(roids[i].x, roids[i].y, roids[i].r,0, 2*Math.PI, true);
            ctx.closePath();
            ctx.stroke();
        }
    }
}

function drawLaser() {
    for(var i=ship.laser.length-1; i>=0; i--){
        if(ship.laser[i].timeExplose == 0){
            if(ship.laser[i].dist > MAX_LASER_DIST){
                ship.laser.splice(i,1);
            }else{
                ctx.fillStyle = "salmon";
                ctx.beginPath();
                ctx.arc(ship.laser[i].x, ship.laser[i].y, 2, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.fill();
            }
        } 
    }
}

function drawExplose(x,y) {
    ctx.beginPath();
    ctx.fillStyle = "salmon";
    ctx.arc(x,y,10,0,Math.PI * 2,true);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = "yellow";
    ctx.arc(x,y,8,0,Math.PI * 2,true);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = "salmon";
    ctx.arc(x,y,6,0,Math.PI * 2,true);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.arc(x,y,4,0,Math.PI * 2,true);
    ctx.closePath();
    ctx.fill();
}

function drawLives() {
    var exploding = ship.explodeTime!= 0;
    for(var i=0; i<lives; i++){
        var colorLife = exploding && i == lives - 1 ? "red" : "white";
        drawShip(SHIP_SIZE * 1.6 + i * SHIP_SIZE * 2, SHIP_SIZE * 1.5, Math.PI / 2, colorLife);
    }
}

function update() {
    var exploding = ship.explodeTime!= 0;
    var blinkOn = ship.blinkNum % 2 == 0;
    //draw space
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    //thrust the ship
    if(ship.thrusting && !ship.dead){
        ship.thrust.x += SHIP_THRUST * Math.cos(ship.a) / FPS;
        ship.thrust.y -= SHIP_THRUST * Math.sin(ship.a) / FPS;
    }else{
        ship.thrust.x -= FRIXION * ship.thrust.x / FPS;
        ship.thrust.y -= FRIXION * ship.thrust.y / FPS;
    }
    //draw score
    drawScore();
    drawBest();

    //draw ship
    if(!exploding){
        if(blinkOn && !ship.dead){
            drawShip(ship.x,ship.y,ship.a,"white");
            //propulseur
            if(ship.thrusting){
                drawProp();
            }
        }
        if(ship.blinkNum > 0){
            if(ship.blinkTime == 0){
                ship.blinkNum --;
                ship.blinkTime = Math.ceil(0.1 * FPS);
            }
            ship.blinkTime --;
        }
    }else{
        explosionShip();
    }
    
    //draw roids
    drawRoids();

    //draw laser
    drawLaser();

    //draw text
    if(textOp >= 0){
        ctx.fillStyle = "rgba(255,255,255," + textOp + ")";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        textOp -= (1 / TIME_TEXT / FPS);
        ctx.font = "small-caps 40px dejavu sans mono";
        ctx.fillText(text, canvas.width/2, 0.75 * canvas.height);
    }else if(ship.dead){
        newGame();
    }

    //draw lives
    drawLives();

    //move laser
    for(var i=ship.laser.length-1; i>=0; i--){
        if(ship.laser[i].timeExplose == 0){
            ship.laser[i].x += ship.laser[i].vx;
            ship.laser[i].y -= ship.laser[i].vy;
            ship.laser[i].dist += Math.sqrt(Math.pow(ship.laser[i].vx,2)+Math.pow(ship.laser[i].vy,2));
            if(ship.laser[i].x < 0){
                ship.laser[i].x = canvas.width;
            }
            if(ship.laser[i].x > canvas.width){
                ship.laser[i].x = 0;
            }
            if(ship.laser[i].y < 0){
                ship.laser[i].y = canvas.height;
            }
            if(ship.laser[i].y > canvas.height){
                ship.laser[i].y = 0;
            }
        }else{
            drawExplose(ship.laser[i].x,ship.laser[i].y);
            ship.laser[i].timeExplose --;
            if(ship.laser[i].timeExplose == 0){
                ship.laser.splice(i,1);
            }
        }
    }

    //colision avec asteroids
    for(var i=roids.length-1; i>=0; i--){
        for(var j=ship.laser.length-1; j>=0; j--){
            if(ship.laser[j].timeExplose == 0 &&distance(ship.laser[j].x,roids[i].x,ship.laser[j].y,roids[i].y)< roids[i].r && !ship.dead){
                ship.laser[j].timeExplose = Math.ceil(DUR_EXPLOSE * FPS);
                //drawExplose(ship.laser[j].x,ship.laser[j].y);
                //ship.laser.splice(j,1);
                destroyRoids(i);
                break;
            }
        }
    }
    
    //rotate ship
    if(!exploding){
        if(!ship.blinkNum > 0){
            for(var i=0; i<roids.length; i++){
                if(distance(ship.x, roids[i].x, ship.y, roids[i].y) < ship.r * 17/24 + roids[i].r && !ship.dead){
                    ship.explodeTime = 0.3 * FPS;
                    destroyRoids(i);
                    break;
                }
            }
        }
        ship.a += ship.rot;

        //move ship
        ship.x += ship.thrust.x;
        ship.y += ship.thrust.y;
    }else{
        ship.explodeTime --;
        if(ship.explodeTime == 0){
            lives--;
            console.log(lives);
            if(lives == 0){
                gameOver();
            }else{
                ship = newShip();
            }
        }
    }

    //move roids
    for(var i=0; i<roids.length; i++){
        roids[i].x += roids[i].vx;
        roids[i].y -= roids[i].vy;
    }

    //ne sort pas de l'ecran
    if(ship.x + ship.r < 0){
        ship.x = canvas.width + ship.r;
    }
    if(ship.x - ship.r > canvas.width){
        ship.x = 0 - ship.r;
    }
    if(ship.y + ship.r < 0){
        ship.y = canvas.height + ship.r;
    }
    if(ship.y - ship.r > canvas.height){
        ship.y = 0 - ship.r;
    }
    
}


