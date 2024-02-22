const canvas = document.getElementById("cvs");
const ctx = canvas.getContext("2d");

const width = canvas.width = 600;
const height = canvas.height = 600;

let intervalID;

let points = [];
let center = new Point3D(width / 2, height / 2, 0);
let size = 600;
let angle = 0;
let angleX = 0;
let angleY = 0;
let angleZ = 0;
let incr = 0.02;

let mousePressed = false;
let mX;
let mY;
let incrX = 0;
let incrY = 0;
let incrZ;

function map(a,b,c,d,e) {
    return ((a - b) / (c - b)) * (e - d) + d;
}

function setup() {
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,width,height);

    points[0] = new Point4D(-1,-1,-1,-1);
    points[1] = new Point4D(1,-1,-1,-1);
    points[2] = new Point4D(1,1,-1,-1);
    points[3] = new Point4D(-1,1,-1,-1);
    points[4] = new Point4D(-1,-1,1,-1);
    points[5] = new Point4D(1,-1,1,-1);
    points[6] = new Point4D(1,1,1,-1);
    points[7] = new Point4D(-1,1,1,-1);

    points[8] = new Point4D(-1,-1,-1,1);
    points[9] = new Point4D(1,-1,-1,1);
    points[10] = new Point4D(1,1,-1,1);
    points[11] = new Point4D(-1,1,-1,1);
    points[12] = new Point4D(-1,-1,1,1);
    points[13] = new Point4D(1,-1,1,1);
    points[14] = new Point4D(1,1,1,1);
    points[15] = new Point4D(-1,1,1,1);

    //draw();
    //draw();
    //draw();
    intervalID = setInterval(draw, 1000 / 60);

}
setup();

function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,width,height);
    let projected2D = [];
    let cos = Math.cos(angle);
    let sin = Math.sin(angle);

    let rotationXY = [
        [cos,-sin,0,0],
        [sin, cos,0,0],
        [  0,   0,1,0],
        [  0,   0,0,1]
    ];

    let rotationYZ = [
        [1,  0,   0,0],
        [0,cos,-sin,0],
        [0,sin, cos,0],
        [0,  0,   0,1]
    ];

    let rotationZX = [
        [ cos,0,sin,0],
        [   0,1,  0,0],
        [-sin,0,cos,0],
        [   0,0,  0,1]
    ];

    let rotationZW = [
        [1,0,0,0],
        [0,1,0,0],
        [0,0,cos,-sin],
        [0,0,sin,cos]
    ];

    let rotationYW = [
        [1,0,0,0],
        [0,cos,0,-sin],
        [0,0,1,0],
        [0,0,sin,cos]
    ];

    let rotationXW = [
        [cos,0,0,-sin],
        [0,1,0,0],
        [0,0,1,0],
        [0,0,sin,cos]
    ];

    cos = Math.cos(angleX + incrX);
    sin = Math.sin(angleX + incrX);

    let rotationX = [
        [1,  0,   0,0],
        [0,cos,-sin,0],
        [0,sin, cos,0],
        [0,  0,   0,1]
    ]

    cos = Math.cos(angleY + incrY);
    sin = Math.sin(angleY + incrY);

    let rotationY = [
        [ cos,0,sin,0],
        [   0,1,  0,0],
        [-sin,0,cos,0],
        [   0,0,  0,1]
    ];

    cos = Math.cos(angleZ);
    sin = Math.sin(angleZ);

    let rotationZ = [
        [cos,-sin,0,0],
        [sin, cos,0,0],
        [  0,   0,1,0],
        [  0,   0,0,1]
    ]

    for(let i = 0; i < points.length; i++) {
        let rotated = matmul(rotationZW, points[i].convert());
        rotated = matmul(rotationX, rotated);
        rotated = matmul(rotationY, rotated);
        rotated = matmul(rotationZ, rotated);
        let w = 1 / (3 - convert(rotated).w);
        let projection3D = [
            [w,0,0,0],
            [0,w,0,0],
            [0,0,w,0]
        ];
        

        let projected = matmul(projection3D, rotated);
        let z = 1 / (5 - convert(projected).z);
        let projection2D = [
            [z,0,0],
            [0,z,0],
        ]

        projected = convert(matmul(projection2D, projected));
        let x = (projected.x) * size + center.x;
        let y = (projected.y) * size + center.y;
        projected2D.push(new Point2D(x,y));
        //console.log(projected2D);
        cercle(x,y);
    }

    for(let i = 0; i < 4; i++) {
        connect(i, (i+1) % 4, projected2D);
        connect((i + 4), (i + 1) % 4 + 4, projected2D);
        connect(i, i + 4, projected2D);

        connect(i + 8, (i+1) % 4 + 8, projected2D);
        connect((i + 4 + 8), (i + 1) % 4 + 4 + 8, projected2D);
        connect(i + 8, i + 4 + 8, projected2D);

        connect(i + 4, (i + 8 + 4), projected2D);
        connect(i, (i + 8), projected2D);
    }
    //console.log(angle);
    angle += 0.02;
}

function line(x0,y0,x1,y1) {
    ctx.strokeStyle = "white";
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.moveTo(x0,y0);
    ctx.lineTo(x1,y1);
    ctx.stroke();
}

function cercle(x,y) {
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.arc(x,y,5,0,Math.PI * 2,true);
    ctx.closePath();
    ctx.fill();
}

function connect(i,j,point) {
    let x0 = point[i].x;
    let y0 = point[i].y;
    let x1 = point[j].x;
    let y1 = point[j].y;
    line(x0,y0,x1,y1);
}


document.addEventListener("keydown", keyDown);
canvas.addEventListener("mousedown", mouseDown);
canvas.addEventListener("mouseup", mouseUp);
canvas.addEventListener("mousemove", mouseMove);

function mouseDown(evt) {
    if(!mousePressed) {
        mousePressed = true;
        mX = evt.clientX;
        mY = evt.clientY;
    }
}

function mouseUp(evt) {
    if(mousePressed) {
        mousePressed = false;
        angleX += incrX;
        angleY += incrY;
        incrX = 0;
        incrY = 0;
    }
}

function mouseMove(evt) {
    if(mousePressed) {
        incrY = map(evt.clientX - mX, -width / 2, width / 2, -5, 5);
        incrX = map(evt.clientY - mY, -height / 2, height / 2, -5, 5);
    }
}

function keyDown(evt) {
    //console.log(evt.keyCode);

    switch(evt.keyCode) {
        case 65: angleX += incr; break;
        case 81: angleX -= incr; break;
        case 90: angleY += incr; break;
        case 83: angleY -= incr; break;
        case 69: angleZ += incr; break;
        case 68: angleZ -= incr; break;
        case 32: console.log(angleX,angleY,angleZ);
    }
}