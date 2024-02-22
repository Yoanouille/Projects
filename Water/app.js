const canvas = document.getElementById("cvs");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

const DUMP = 0.999;
let intervalID;

let front;
let back;

let Rect = canvas.getBoundingClientRect();

let hasClicked = false;

let time = 0;
let skip = 2;

document.addEventListener("mousedown", mouseDown);
document.addEventListener("mousemove", mouseMove);
document.addEventListener("mouseup", mouseUp);

function mouseMove(evt) {
    if(hasClicked) {
        let x = evt.clientX - Rect.left;
        let y = evt.clientY - Rect.top;

        let index = 4 * (x + y * WIDTH);
        front.data[index] = 255;
        front.data[index + 1] = 255;
        front.data[index + 2] = 255;

        back.data[index] = 255;
        back.data[index + 1] = 255;
        back.data[index + 2] = 255;
    }
}

function mouseDown(evt) {
    let x = evt.clientX - Rect.left;
    let y = evt.clientY - Rect.top;

    let index = 4 * (x + y * WIDTH);
    front.data[index] = 255;
    front.data[index + 1] = 255;
    front.data[index + 2] = 255;

    back.data[index] = 255;
    back.data[index + 1] = 255;
    back.data[index + 2] = 255;
    hasClicked = true;
    
}

function mouseUp(evt) {
    hasClicked = false;
}

function setup() {
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,WIDTH,HEIGHT);

    ctx.fillStyle = "white";
    ctx.fillRect(WIDTH / 2, HEIGHT / 2, 2, 2);

    front = ctx.getImageData(0,0,WIDTH,HEIGHT);
    back = ctx.getImageData(0,0,WIDTH,HEIGHT);

    intervalID = setInterval(draw, 1000 / 60);
}
setup();

function draw() {
    for(let i = 1; i < WIDTH - 1; i++) {
        for(let j = 1; j < HEIGHT - 1; j++) {
            let index = 4 * (i + j * WIDTH);
            let bright = calcul(index);
            bright *= DUMP;
            front.data[index] = bright;
            front.data[index + 1] = bright;
            front.data[index + 2] = bright;
            front.data[index + 3] = 255;
        }
    }
    ctx.putImageData(front,0,0);
    swap();
    if(time == 0) {
        newPoint();
    }
    time %= skip;
}

function calcul(i) {
    return (back.data[i - 4] + back.data[i + 4] + back.data[i - WIDTH * 4] + back.data[i + 4 * WIDTH]) / 2 - front.data[i];
}

function swap() {
    let tmp = front;
    front = back;
    back = tmp;
}

function newPoint() {
    let x = Math.floor(Math.random() * WIDTH);
    let y = Math.floor(Math.random() * HEIGHT);
    let index = 4 * (x + y * WIDTH);
    front.data[index] = 255;
    front.data[index + 1] = 255;
    front.data[index + 2] = 255;

    back.data[index] = 255;
    back.data[index + 1] = 255;
    back.data[index + 2] = 255;
}

/**
 * front[i][j] = (back[i + 1][j] + back[i - 1][j] + back[i][j + 1] + back[i][j - 1]) / 2 - front[i][j];
 */