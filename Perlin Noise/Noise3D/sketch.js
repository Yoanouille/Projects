const canvas = document.getElementById("cvs");
const ctx    = canvas.getContext("2d");
//canvas.width = window.innerWidth;
//canvas.height = window.innerHeight;
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

let incr = 1;
let inc = 3;
let zOff = 0;

let scl = 15;
let rows = HEIGHT / scl;
let cols = WIDTH / scl;

function draw() {
    let imageData = ctx.createImageData(WIDTH,HEIGHT);
    let xOff = 0;
    for(let i = 0; i < WIDTH; i++) {
        let yOff = 0;
        for(let j = 0; j < HEIGHT; j++) {
            let index = 4 * (i + j * canvas.width);
            let p = perlin3D(xOff / 64,yOff / 64,zOff / 64) * 1     + 
                    perlin3D(xOff / 32,yOff / 32,zOff / 32) * 0.5   + 
                    perlin3D(xOff / 16,yOff / 16,zOff / 16) * 0.25  + 
                    perlin3D(xOff / 8 ,yOff / 8 ,zOff / 8 ) * 0.125 ; 
            p = p / 2 + 0.5;
            imageData.data[index] = 255 * p;
            imageData.data[index + 1] = 255 * p;
            imageData.data[index + 2] = 255 * p;
            imageData.data[index + 3] = 255;
            yOff += incr;
        }
        xOff += incr;
    }
    ctx.putImageData(imageData,0,0);
    zOff += inc;
}


/*function draw() {
    let xOff = 0;
    for(let i = 0; i < cols; i++) {
        let yOff = 0;
        for(let j = 0; j < rows; j++) {
            //let bright = Math.random() * 255;
            let bright = perlin3D(xOff, yOff, zOff) * 255;
            ctx.fillStyle = "rgba(" + bright + "," + bright + "," + bright + ")";
            ctx.fillRect(i * scl, j * scl, scl, scl);
            yOff += incr;
        }
        xOff += incr;
    }
    zOff += inc;
}*/
//draw();
let intervalID = setInterval(draw, 1000 / 60);