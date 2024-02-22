let canvas = document.getElementById("cvs");
let ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let intervalID;

let x = [];
let y = [];
let fourierX = [];
let fourierY = [];
let time;
let path = [];

let imageData;
let data = []


let state = 0;

const rect = canvas.getBoundingClientRect();

document.addEventListener("mousedown", mouseDown);
document.addEventListener("mouseup", mouseUp);
document.addEventListener("mousemove", mouseMove);

function mouseDown(evt) {
    if(state == 0 || state == 2) {
        state = 1;
        ctx.fillStyle = "black";
        ctx.fillRect(0,0,canvas.width,canvas.height);
        x = [];
        y = [];
        fourierX = [];
        fourierY = [];
        path = [];
        data = [];
        x.push(evt.clientX - rect.left - canvas.width / 2);
        y.push(evt.clientY - rect.top - canvas.height / 2);
        data.push({x: evt.clientX - rect.left, y: evt.clientY - rect.top});
        intervalID = setInterval(draw, 1000 / 60);
    }
}

function mouseMove(evt) {
    if(state == 1) {
        let mx = evt.clientX - rect.left - canvas.width / 2;
        let my = evt.clientY - rect.top - canvas.height /2; 
        data.push({x: mx + canvas.width / 2, y: my + canvas.height / 2});
        x.push(mx);
        y.push(my);
    }
}

function mouseUp(evt) {
    if(state == 1) {
        state = 2;
        time = 0;
        fourierX = discreteFourierTransform(x);
        fourierY = discreteFourierTransform(y);
    }
}

/*window.onload = function() {
    let data0 = [];
    ctx.fillStyle = "white";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(img, 0,0,img.width / 2,img.height, 200,100, 200,400);
    imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
    for(var i = 0; i < canvas.width; i++) {
        for(var j = 0; j < canvas.height; j++) {
            var index = (i + j * canvas.width) * 4;
            if(imageData.data[index] == 0) {
                data0.push({x: i, y: j});
            }
        }
    }
    data0.sort((a,b) => a.y - b.y);

    let data1 = [];
    ctx.fillStyle = "white";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(img, img.width / 2,0,img.width / 2,img.height, 400,100, 200,400);
    imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
    for(var i = 0; i < canvas.width; i++) {
        for(var j = 0; j < canvas.height; j++) {
            var index = (i + j * canvas.width) * 4;
            if(imageData.data[index] == 0) {
                data1.push({x: i, y: j});
            }
        }
    }
    data1.sort((a,b) => b.y - a.y);
    for(let i = 0; i < data0.length; i++) {
        data.push(data0[i]);
    }
    for(let i = 0; i < data1.length; i++) {
        data.push(data1[i]);
    }


    for(let i = 0; i < data.length; i++) {
        x[i] = data[i].x - canvas.width / 3;
        y[i] = data[i].y - canvas.height / 3;
    }

    setup();
}
*/

function discreteFourierTransform(signal) {
    let fourier = [];
    for(let k = 0; k < signal.length; k++) {
        let re = 0;
        let im = 0;
        for(let n = 0; n < signal.length; n++) {
            let phi = 2 * (Math.PI / signal.length) * k * n;
            re += signal[n] * Math.cos(phi);
            im -= signal[n] * Math.sin(phi);
        }
        re = re / signal.length;
        im = im / signal.length;
        let amp = Math.sqrt(re * re + im * im);
        let freq = k;
        let phase = Math.atan2(im, re);
        fourier.push({re: re, im: im, amp: amp, freq: freq, phase: phase});
    }
    return fourier;
}

function epiCycle(cx,cy,sTrans,rotation) {
    for(let i = 0; i < sTrans.length; i++) {
        let amp = sTrans[i].amp;
        let freq = sTrans[i].freq;
        let phase = sTrans[i].phase;
        if(i != 0) {
            circle(cx,cy,amp);
        }
        

        let prevX = cx;
        let prevY = cy;
        cx += amp * Math.cos(freq * time + phase + rotation);
        cy += amp * Math.sin(freq * time + phase + rotation);
        if(i != 0) {
            line(prevX,prevY,cx,cy, 1);
        }
    }
    return {x: cx, y: cy};
}

function line(x0,y0,x1,y1, w) {
    ctx.beginPath();
    ctx.lineWidth = w;
    ctx.strokeStyle = "white";
    ctx.moveTo(x0,y0);
    ctx.lineTo(x1,y1);
    ctx.stroke();
}

function circle(cx,cy,r) {
    ctx.beginPath();
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = "white";
    ctx.arc(cx,cy,r,0,Math.PI * 2,true);
    ctx.closePath();
    ctx.stroke();
}

function drawPath(t) {
    for(let i = 0; i < t.length - 1; i++) {
        line(t[i].x, t[i].y, t[i + 1].x, t[i + 1].y, 2);
    }
}

function map(x, a1, a2, b1, b2) {
    return (x - a1) / (a2 - a1) * (b2 - b1) + b1;
}

function setup() {
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    /*for(let i = 0; i < 100; i++) {
        let angle = i * Math.PI * 2 / 100;
        x[i] = 100 * Math.cos(angle);
        y[i] = 100 * Math.sin(angle);
    }*/
    time = 0;
    fourierX = discreteFourierTransform(x);
    fourierY = discreteFourierTransform(y);
    intervalID = setInterval(draw, 1000 / 60);
}


function draw() {
    if(state == 2) {
        ctx.fillStyle = "black";
        ctx.fillRect(0,0,canvas.width,canvas.height);
        let vx = epiCycle(canvas.width / 2,100,fourierX, 0);
        let vy = epiCycle(100,canvas.height / 2,fourierY,Math.PI / 2);
        path.unshift({x: vx.x, y: vy.y});
        line(vx.x, vx.y, vx.x, vy.y, 1);
        line(vy.x, vy.y, vx.x, vy.y, 1);
        drawPath(path);
        time += Math.PI * 2 / fourierY.length;
        //time += 0.005;

        if(/*time >= 2 * Math.PI || */path.length == x.length) {
            path = [];
        }
    }

    if(state == 1) {
        ctx.fillStyle = "black";
        ctx.fillRect(0,0,canvas.width,canvas.height);
        drawPath(data);
    }


}
