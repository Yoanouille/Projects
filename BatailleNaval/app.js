const canvas = document.getElementById("cvs");
const canvas2 = document.getElementById("cvs2");
const ctx = canvas.getContext("2d");
const ctx2 = canvas2.getContext("2d");

const MESSAGE_DIV = document.querySelector(".message");
const BOARD_DIV = document.getElementById("board");

const width = 402;
const height = 402;
canvas.width = canvas2.width = width;
canvas.height = canvas2.height = height;

const TOT_TIME_BLINK = 100;
const TIME_BLINK = 10;

let intervalID;

let lock = true;
let message;

ctx.font = "small-caps 20px dejavu sans mono";
ctx.textAlign = "center";
ctx.textBaseline = "middle";

ctx2.font = "small-caps 20px dejavu sans mono";
ctx2.textAlign = "center";
ctx2.textBaseline = "middle";

const Rect = canvas.getBoundingClientRect();
const Rect2 = canvas2.getBoundingClientRect();

const LIGNE = 11;
const COLONNE = 11;
const scl = (width - 2) / LIGNE;

let grid = [];
let gridOrdi = [];

let currentX = -1;
let currentY = -1;
let currentX2 = -1;
let currentY2 = -1;
let currentBoat = 0;
let taille = [5,4,3,3,2];
let couleurs = ["purple", "blue", "green", "green", "orange"];
let dir = 0;

canvas.addEventListener("mousemove", mouseMove);
canvas2.addEventListener("mousemove", mouseMove2);
canvas.addEventListener("mouseout", mouseOut);
canvas2.addEventListener("mouseout", mouseOut2);
canvas.addEventListener("contextmenu", clickRight);
canvas.addEventListener("click", clickLeft);
canvas2.addEventListener("click", clickLeft2);

function clickLeft(e) {
    if(currentBoat < 5) {
        if(grid[currentX][currentY].state != 2 && grid[currentX][currentY].color != "red") {
            for(let i = 0; i < taille[currentBoat]; i++) {
                if(dir == 0) {
                    grid[currentX + i][currentY].prevState = 2;
                    grid[currentX + i][currentY].state = 2;
                }else {
                    grid[currentX][currentY + i].prevState = 2;
                    grid[currentX][currentY + i].state = 2;
                }
                grid[currentX + i][currentY].ship = currentBoat;
            }
            currentBoat++;
            if(currentBoat == 5) {
                lock = false;
                message = "A VOUS DE JOUER !";
                change(message);
            }
        }
    }
}

function clickLeft2(e) {
    let x = Math.floor((e.clientX - Rect2.left) / scl);
    let y = Math.floor((e.clientY - Rect2.top) / scl);

    if(gridOrdi[x][y].prevState == 0 && !lock && x != 0 && y != 0) {
        if(gridOrdi[x][y].ship != -1) {
            gridOrdi[x][y].prevState = 3;
            if(estCouleOrdi(gridOrdi[x][y].ship)) {
                message = "COULE";
                couleOrdi(gridOrdi[x][y].ship);
            } else {
                message = "KABOOM !";
            }
        } else {
            gridOrdi[x][y].prevState = 5;
            message = "SPLUTCH !";
        }

        change(message);
        lock = true;
        if(amIWin()) {
            setTimeout(function() {
                fin("VOUS AVEZ GAGNE !!!");
            }, 1000)
            
        }else {
            setTimeout(function() {
                message = "L'IA REFLECHIT ";
                change(message);
                setTimeout(function() {
                    message += ".";
                    MESSAGE_DIV.innerHTML = message;
                    setTimeout(function() {
                        message += ".";
                        MESSAGE_DIV.innerHTML = message;
                        setTimeout(function() {
                            message += ".";
                            MESSAGE_DIV.innerHTML = message;
                            setTimeout(function() {
                                playOrdi();
                            }, 1000);
                        }, 1000);
                    }, 1000);
                }, 2000);
            }, 1200);
        }
        
    } 
}

function couleOrdi(ship) {
    for(let x = 1; x < COLONNE; x++) {
        for(let y = 1; y < LIGNE; y++) {
            if(gridOrdi[x][y].ship == ship) {
                gridOrdi[x][y].prevState = 4;
                gridOrdi[x][y].time = TOT_TIME_BLINK;
            }
        }
    }
}

function estCouleOrdi(ship) {
    for(let x = 1; x < COLONNE; x++) {
        for(let y = 1; y < LIGNE; y++) {
            if(gridOrdi[x][y].ship == ship && gridOrdi[x][y].prevState != 3) {
                return false;
            }
        }
    }
    return true;
}

function clickRight(e) {
    dir = (dir + 1) % 2;
    resetGrid(grid);
    drawBoat(currentX,currentY);
    
}

function drawBoat(x,y) {
    let pbm = false;
    if(grid[x][y].state == 2) {
        return;
    }
    if(dir == 0) {
        if(currentX != x || currentY != y) {
            resetGrid(grid);
        }
        let i = 0
        while(i < taille[currentBoat] && i + x < COLONNE) {
            if(grid[x + i][y].state == 2) {
                pbm = true;
            } else {
                grid[x + i][y].color = couleurs[currentBoat];
            }
            i++;
            
        }
        if(i != taille[currentBoat] || pbm) {
            for(let I = 0; I < i; I++) {
                if(grid[x + I][y].state != 2) {
                    grid[x + I][y].color = "red";
                }
            }
        }
    } else {
        if(currentX != x || currentY != y) {
            resetGrid(grid);
        }
        let j = 0
        while(j < taille[currentBoat] && j + y < LIGNE) {
            if(grid[x][y + j].state == 2) {
                pbm = true;
                
            }else {
                grid[x][y + j].color = couleurs[currentBoat];
            }
            j++;
        }
        if(j != taille[currentBoat] || pbm) {
            for(let J = 0; J < j; J++) {
                if(grid[x][y + J].state != 2) {
                    grid[x][y + J].color = "red";
                }
            }
        }
    }
    currentX = x;
    currentY = y;
}


function mouseMove(e) {
    let x = e.clientX;
    let y = e.clientY;
    x -= Rect.left;
    y -= Rect.top;
    x = Math.floor(x / scl);
    y = Math.floor(y / scl);
    if(currentBoat < 5 && x > 0 && x < COLONNE && y < LIGNE && y > 0) {
        drawBoat(x,y);
    } /*else if(x != 0 && y != 0 && x > 0 && x < COLONNE && y < LIGNE && y > 0){
        currentX = x;
        currentY = y;
        grid[x][y].state = 1;
    }*/
    //console.log(x,y);
}

function mouseMove2(e) {
    let x = e.clientX;
    let y = e.clientY;
    x -= Rect2.left;
    y -= Rect2.top;
    x = Math.floor(x / scl);
    y = Math.floor(y / scl);
    if(x != 0 && y != 0 && x > 0 && x < COLONNE && y < LIGNE && y > 0){
        currentX2 = x;
        currentY2 = y;
        gridOrdi[x][y].state = 1;
    }
    //console.log(x,y);
}

function mouseOut() {
    currentX = -1;
    currentY = -1;
    resetGrid(grid);
}

function mouseOut2() {
    currentX2 = -1;
    currentY2 = -1;
    //resetGrid(gridOrdi);
}

function line(x0,y0,x1,y1) {
    ctx.beginPath();
    ctx.strokeWeight = 2;
    ctx.strokeStyle = "black";
    ctx.moveTo(x0,y0);
    ctx.lineTo(x1,y1);
    ctx.stroke();
}

function drawGrid(g) {
    for(let x = 0; x < COLONNE; x++) {
        for(let y = 0; y < LIGNE; y++) {
            g[x][y].show();
        }
    }
}

function updateGrid(g) {
    for(let x = 0; x < COLONNE; x++) {
        for(let y = 0; y < LIGNE; y++) {
            g[x][y].update();
        }
    }
}

function resetGrid(g) {
    for(let x = 0; x < COLONNE; x++) {
        for(let y = 0; y < LIGNE; y++) {
            if(g[x][y].state != 2) {
                g[x][y].color = "white";
            }
        }
    }
}

function cercle(x,y,r,c) {
    ctx.beginPath();
    ctx.fillStyle = c;
    ctx.arc(x,y,r,0,Math.PI * 2,true);
    ctx.closePath();
    ctx.fill();
}

function cercle2(x,y,r,c) {
    ctx2.beginPath();
    ctx2.fillStyle = c;
    ctx2.arc(x,y,r,0,Math.PI * 2,true);
    ctx2.closePath();
    ctx2.fill();
}

function arc(x,y,r,c) {
    x -= r;
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = c;
    ctx.arc(x,y,r,Math.PI,0,false);
    x += 2 * r;
    ctx.arc(x,y,r,Math.PI,0,true);
    ctx.stroke();
}

function arc2(x,y,r,c) {
    x -= r;
    ctx2.beginPath();
    ctx2.lineWidth = 3;
    ctx2.strokeStyle = c;
    ctx2.arc(x,y,r,Math.PI,0,false);
    x += 2 * r;
    ctx2.arc(x,y,r,Math.PI,0,true);
    ctx2.stroke();
}


function drawExplose(x,y) {
    x += scl / 2;
    y += scl / 2;

    cercle(x,y,scl / 2,"red");
    cercle(x,y,scl * 3 / 8,"orange");
    cercle(x,y,scl / 4, "yellow");
    cercle(x,y,scl / 8,"white");
}

function drawExplose2(x,y) {
    x += scl / 2;
    y += scl / 2;

    cercle2(x,y,scl / 2,"red");
    cercle2(x,y,scl * 3 / 8,"orange");
    cercle2(x,y,scl / 4, "yellow");
    cercle2(x,y,scl / 8,"white");
}

function drawPlouf(x,y) {
    x += scl / 2;
    y += scl / 2;

    arc(x,y - scl / 4,scl / 8, "red");
    arc(x,y,scl / 8, "red");
    arc(x,y + scl / 4,scl / 8, "red");
}

function drawPlouf2(x,y) {
    x += scl / 2;
    y += scl / 2;

    arc2(x,y - scl / 4,scl / 8, "blue");
    arc2(x,y,scl / 8, "blue");
    arc2(x,y + scl / 4,scl / 8, "blue");
}
/**
 * 
 * state = 0 => NORMAL
 * state = 1 => INTERACTION AVEC LA SOURIS
 * state = 2 => CHANGE PLUS DE COULEURS
 * 
 * state = 3 => EXPLOSE
 * state = 4 => COULE
 * state = 5 => A L'EAU
 * 
 */

/**
 * 
 * 1 porte-avions => 5 cases
 * 1 croiseur => 4 cases
 * 2 contre-torpilleurs => 3 cases
 * 1 torpilleur => 2 cases
 * 
 */

function Cell(x,y) {
    this.x = x;
    this.y = y;
    this.prevState = 0;
    this.state = 0;
    this.content = "";
    this.color = "white";
    this.revealed = true;
    this.time = 0;
    this.ship = -1;
    this.show = function() {
        if(this.x == 0 && this.y == 0) {
            ctx.fillStyle = "white";
            ctx.fillRect(x * scl, y * scl, scl, scl);
        }

        if(this.state < 3 || !this.revealed) {
            ctx.fillStyle = this.color;
        } else {
            ctx.fillStyle = "white";
        }
        
        ctx.fillRect(x * scl + 2, y * scl + 2, scl - 2, scl - 2);
        ctx.fillStyle = "black";
        ctx.fillText(this.content, this.x * scl + scl / 2, this.y * scl + scl / 2);

        if(this.state == 3) {
            drawExplose(this.x * scl, this.y * scl);
        }
        if(this.state == 5) {
            drawPlouf(this.x * scl, this.y * scl);
        }
        if(this.state == 4 && this.revealed) {
            ctx.fillStyle = "black";
            ctx.fillRect(x * scl + 2, y * scl + 2, scl - 2, scl - 2);
        }

    }
    this.update = function() {
        if(this.time % TIME_BLINK == 0 && this.time != 0) {
            this.revealed = !this.revealed;
        }

        if(this.time == 0) {
            this.revealed = true;
        }

        if(this.time != 0) {
            this.time--;
        }
    }
}

function Cell2(x,y) {
    this.x = x;
    this.y = y;
    this.prevState = 0;
    this.state = 0;
    this.content = "";
    this.color = "white"
    this.ship = -1;
    this.time = 0;
    this.revealed = true;
    this.show = function() {
        if(this.x == 0 && this.y == 0) {
            ctx2.fillStyle = "white";
            ctx2.fillRect(x * scl, y * scl, scl, scl);
        }

        ctx2.fillStyle = "white";
        ctx2.fillRect(x * scl + 2, y * scl + 2, scl - 2, scl - 2);
        ctx2.fillStyle = "black";
        ctx2.fillText(this.content, this.x * scl + scl / 2, this.y * scl + scl / 2);

        if(this.ship == -1 && this.prevState != 0) {
            drawPlouf2(this.x * scl, this.y * scl);
        }else if(this.prevState == 3) {
            drawExplose2(this.x * scl, this.y * scl);
        }else if(this.prevState == 4 && this.revealed) {
            ctx2.fillStyle = couleurs[this.ship];
            ctx2.fillRect(x * scl + 2, y * scl + 2, scl - 2, scl - 2);
        }

        if(this.state == 1) {
            ctx2.fillStyle = "rgba(100,100,100,0.5)"; 
            ctx2.fillRect(x * scl + 2, y * scl + 2, scl - 2, scl - 2);
        }
    }
    this.update = function() {
        if(this.x != currentX2 || this.y != currentY2) {
            this.state = this.prevState;
        }

        if(this.time % TIME_BLINK == 0 && this.time != 0) {
            this.revealed = !this.revealed;
        }

        if(this.time == 0) {
            this.revealed = true;
        }

        if(this.time != 0) {
            this.time--;
        }
    }
}

function setup() {
    for(let x = 0; x < COLONNE; x++) {
        grid[x] = [];
        gridOrdi[x] = [];
        for(let y = 0; y < LIGNE; y++) {
            grid[x][y] = new Cell(x,y);
            gridOrdi[x][y] = new Cell2(x,y);
            if(x == 0 && y != 0) {
                grid[x][y].content = y;
                gridOrdi[x][y].content = y;
            }
            if(y == 0 && x != 0) {
                grid[x][y].content = String.fromCharCode(64 + x);
                gridOrdi[x][y].content = String.fromCharCode(64 + x);
            }
        }
    }
    initOrdi();
    intervalID = setInterval(draw, 1000 / 60);
}
setup();

function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,width,height);
    ctx2.fillStyle = "black";
    ctx2.fillRect(0,0,width,height);
    drawGrid(grid);
    updateGrid(grid);
    drawGrid(gridOrdi);
    updateGrid(gridOrdi);
}

function initOrdi() {
    for(let a = 0; a < taille.length; a++) {
        let x;
        let y;
        let d;
        let pbm = false;
        do {
            pbm = false;
            x = Math.floor(Math.random() * 10 + 1);
            y = Math.floor(Math.random() * 10 + 1);
            d = Math.floor(Math.random() * 2);

            if(d == 0) {
                let i = 0
                while(i < taille[a] && x + i < COLONNE) {
                    if(gridOrdi[x + i][y].ship != -1) {
                        pbm = true;
                        break;
                    }
                    i++;
                }
                pbm = pbm || i != taille[a];
            } else {
                let j = 0
                while(j < taille[a] && y + j < LIGNE) {
                    if(gridOrdi[x][y + j].ship != -1) {
                        pbm = true;
                        break;
                    }
                    j++;
                }
                pbm = pbm || j != taille[a];
            }
            
        } while(pbm);

        for(let i = 0; i < taille[a]; i++) {
            if(d == 0) {
                gridOrdi[x + i][y].ship = a;
            } else {
                gridOrdi[x][y + i].ship = a;
            }
        }
    }
}


/**
 * 0 => CHERCHE ALEATOIREMENT LES BATEAUX
 * 1 => CHASSE LE BATEAU
 */

let IA_MODE = 0;
let PRE = true;

let possibilites = [];
let priviligies = [];




function playOrdiOld() {
    let x;
    let y;
    do {
        x = Math.floor(Math.random() * 10 + 1);
        y = Math.floor(Math.random() * 10 + 1);
    }while(grid[x][y].state > 2);

    if(grid[x][y].state == 2) {
        grid[x][y].state = 3;
        if(estCoule(grid[x][y].ship)) {
            coule(grid[x][y].ship);
            message = "COULE";
        } else {
            message = "KABOOM !";
        }
    } else {
        grid[x][y].state = 5;
        message = "SPLUTCH !";
    }
    change(message);
    lock = false;
    setTimeout(function() {
        message = "A VOUS DE JOUER !";
        change(message);
    }, 900);
}

function playOrdiMode0() {
    let x;
    let y;
    do {
        /*x = Math.floor(Math.random() * 10 + 1);
        y = Math.floor(Math.random() * 10 + 1);*/
        x = Math.floor(Math.random() * 5 + 1);
        y = Math.floor(Math.random() * 5 + 1);
        x *= 2;
        y *= 2;
    }while(grid[x][y].state > 2);

    /*if(PRE) {
        x = 2; 
        y = 2;
        PRE = false;
    }*/

    if(grid[x][y].state == 2) {
        grid[x][y].state = 3;
        if(estCoule(grid[x][y].ship)) {
            coule(grid[x][y].ship);
            message = "COULE";
        } else {
            message = "KABOOM !";
            IA_MODE = 1;
            if(x - 1 > 0 && grid[x - 1][y].state <= 2) {
                possibilites.push([grid[x - 1][y], 0]);
            }
            if(x + 1 < COLONNE && grid[x + 1][y].state <= 2) {
                possibilites.push([grid[x + 1][y], 0]);
            }
            if(y - 1 > 0 && grid[x][y - 1].state <= 2) {
                possibilites.push([grid[x][y - 1], 1]);
            }
            if(y + 1 < LIGNE && grid[x][y + 1].state <= 2) {
                possibilites.push([grid[x][y + 1], 1]);
            }
        }
    } else {
        grid[x][y].state = 5;
        message = "SPLUTCH !";
    }
}

function playOrdiMode10() {
    let i;
    let cell;
    let D;
    if(priviligies.length != 0) {
        i = Math.floor(Math.random() * priviligies.length);
        cell = priviligies[i][0];
        D = priviligies[i][1];
    } else {
        i = Math.floor(Math.random() * possibilites.length);
        cell = possibilites[i][0];
        D = possibilites[i][1];
    }
    while(cell.state > 2) {
        if(priviligies.length != 0) {
            priviligies.splice(i, 1);
            i = null;
        }
        if(priviligies.length != 0) {
            i = Math.floor(Math.random() * priviligies.length);
            cell = priviligies[i][0];
            D = priviligies[i][1];
        } else {
            if (i != null) {
                possibilites.splice(i, 1);
            }
            if(possibilites.length == 0) {
                break;
            }
            i = Math.floor(Math.random() * possibilites.length);
            cell = possibilites[i][0];
            D = possibilites[i][1];
        }
    }
    if(possibilites.length == 0 && priviligies.length == 0) {
        IA_MODE = 0;
        playOrdiMode0();
        return;
    }
    if(cell.state == 2) {
        cell.state = 3;
        if(estCoule(cell.ship)) {
            coule(cell.ship);
            message = "COULE";
            //possibilites = [];
            //priviligies = [];
        } else {
            message = "KABOOM";
            let x = cell.x;
            let y = cell.y;
            let d = D;
            if(priviligies.length != 0) {
                priviligies.splice(i, 1);
                if(d == 0) {
                    if(x - 1 > 0 && grid[x - 1][y].state <= 2) {
                        priviligies.push([grid[x - 1][y], 0]);
                        possibilites.push([grid[x - 1][y], 0]);
                    }
                    if(x + 1 < COLONNE && grid[x + 1][y].state <= 2) {
                        priviligies.push([grid[x + 1][y], 0]);
                        possibilites.push([grid[x + 1][y], 0]);
                    }
                } else {
                    if(y - 1 > 0 && grid[x][y - 1].state <= 2) {
                        priviligies.push([grid[x][y - 1], 1]);
                        possibilites.push([grid[x][y - 1], 1]);
                    }
                    if(y + 1 < LIGNE && grid[x][y + 1].state <= 2) {
                        priviligies.push([grid[x][y + 1], 1]);
                        possibilites.push([grid[x][y + 1], 1]);
                    }
                }
            } else {
                possibilites.splice(i, 1);
                if(d == 0) {
                    for(let j = possibilites.length - 1; j >= 0; j--) {
                        if(possibilites[j][1] == 0) {
                            let t = possibilites.splice(j, 1)[0];
                            console.log(t);
                            priviligies.push(t);
                        }
                    }
                    if(x - 1 > 0 && grid[x - 1][y].state <= 2) {
                        priviligies.push([grid[x - 1][y], 0]);
                        possibilites.push([grid[x - 1][y], 0]);
                    }
                    if(x + 1 < COLONNE && grid[x + 1][y].state <= 2) {
                        priviligies.push([grid[x + 1][y], 0]);
                        possibilites.push([grid[x + 1][y], 0]);
                    }
                } else {
                    for(let j = possibilites.length - 1; j >= 0; j--) {
                        if(possibilites[j][1] == 1) {
                            let t = possibilites.splice(j, 1)[0];
                            console.log(t);
                            priviligies.push(t);
                        }
                    }
                    if(y - 1 > 0 && grid[x][y - 1].state <= 2) {
                        priviligies.push([grid[x][y - 1], 1]);
                        possibilites.push([grid[x][y - 1], 1]);
                    }
                    if(y + 1 < LIGNE && grid[x][y + 1].state <= 2) {
                        priviligies.push([grid[x][y + 1], 1]);
                        possibilites.push([grid[x][y + 1], 1]);
                    }
                }
            }
        }
    } else {
        if(priviligies.length != 0) {
            priviligies[i][0].state = 5;
            priviligies.splice(i, 1);
        } else {
            possibilites[i][0].state = 5;
            possibilites.splice(i, 1);
        }
        message = "SPLUTCH !";
    }

    if(possibilites.length == 0 && priviligies.length == 0) {
        IA_MODE = 0;
    }
}

function playOrdiMode1() {
    let i = Math.floor(Math.random() * possibilites.length);
    if(possibilites[i][0].state == 2) {
        possibilites[i][0].state = 3;
        if(estCoule(possibilites[i][0].ship)) {
            coule(possibilites[i][0].ship);
            message = "COULE";
            possibilites = [];
            priviligies = [];
        } else {
            message = "KABOOM";
            let x = possibilites[i][0].x;
            let y = possibilites[i][0].y;
            let d = possibilites[i][1];
            possibilites.splice(i, 1);

            if(d == 0) {
                for(let j = possibilites.length - 1; j >= 0; j--) {
                    if(possibilites[j][1] == 1) {
                        possibilites.splice(j, 1);
                    }
                }
                if(x - 1 > 0 && grid[x - 1][y].state <= 2) {
                    possibilites.push([grid[x - 1][y], 0]);
                }
                if(x + 1 < COLONNE && grid[x + 1][y].state <= 2) {
                    possibilites.push([grid[x + 1][y], 0]);
                }
            } else {
                for(let j = possibilites.length - 1; j >= 0; j--) {
                    if(possibilites[j][1] == 0) {
                        possibilites.splice(j, 1);
                    }
                }
                if(y - 1 > 0 && grid[x][y - 1].state <= 2) {
                    possibilites.push([grid[x][y - 1], 1]);
                }
                if(y + 1 < LIGNE && grid[x][y + 1].state <= 2) {
                    possibilites.push([grid[x][y + 1], 1]);
                }
            }
        }
    } else {
        possibilites[i][0].state = 5;
        message = "SPLUTCH !";
        possibilites.splice(i, 1);
    }

    if(possibilites.length == 0) {
        IA_MODE = 0;
    }
}

function playOrdi() {
    if(IA_MODE == 0) {
        playOrdiMode0();
    } else {
        playOrdiMode1();
    }

    change(message);
    lock = false;
    setTimeout(function() {
        if(isOrdiWin()) {
            lock = true;
            setTimeout(function() {
                fin("VOUS AVEZ PERDU");
            }, 1000);
        }else {
            message = "A VOUS DE JOUER !";
            change(message);    
        }
    }, 900);
}


function estCoule(ship) {
    for(let x = 1; x < COLONNE; x++) {
        for(let y = 1; y < LIGNE; y++) {
            if(grid[x][y].ship == ship && grid[x][y].state != 3) {
                return false;
            }
        }
    }
    return true;
}

function coule(ship) {
    for(let x = 1; x < COLONNE; x++) {
        for(let y = 1; y < LIGNE; y++) {
            if(grid[x][y].ship == ship) {
                grid[x][y].state = 4;
                grid[x][y].time = TOT_TIME_BLINK;
            }
        }
    }
}

function change(text) {
    MESSAGE_DIV.style.opacity = 0;
    setTimeout(function() {
        MESSAGE_DIV.innerHTML = text;
        MESSAGE_DIV.style.opacity = 1;
    }, 600)
}

function isOrdiWin() {
    for(let x = 1; x < COLONNE; x++) {
        for(let y = 1; y < LIGNE; y++) {
            if(grid[x][y].ship != -1 && grid[x][y].state != 4) {
                return false;
            }
        }
    }
    return true;
}

function amIWin() {
    for(let x = 1; x < COLONNE; x++) {
        for(let y = 1; y < LIGNE; y++) {
            if(gridOrdi[x][y].ship != -1 && gridOrdi[x][y].state != 4) {
                return false;
            }
        }
    }
    return true;
}

function fin(text) {
    BOARD_DIV.style.opacity = 0;
    setTimeout(function() {
        BOARD_DIV.style.display = "none";
        message = text;
        change(message);
    }, 600)
}