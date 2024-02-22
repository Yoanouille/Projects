const canvas = document.getElementById("cvs");
const ctx = canvas.getContext("2d");

const width = canvas.width = 600;
const height = canvas.height = 600;

let intervalID;

let points = [];
let center = new Point3D(width / 2, height / 2, 0);
let size = 1000;
let angle = 0;

function setup() {
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,width,height);

    points[0] = new Point3D(-1,-1,-1);
    points[1] = new Point3D(1,-1,-1);
    points[2] = new Point3D(1,1,-1);
    points[3] = new Point3D(-1,1,-1);
    points[4] = new Point3D(-1,-1,1);
    points[5] = new Point3D(1,-1,1);
    points[6] = new Point3D(1,1,1);
    points[7] = new Point3D(-1,1,1);

    //draw();
    intervalID = setInterval(draw, 1000 / 60);

}
setup();

function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,width,height);
    let projected2D = [];
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    let rotationZ = [
        [cos,-sin,0],
        [sin, cos,0],
        [  0,   0,1]
    ];

    let rotationX = [
        [1,  0,   0],
        [0,cos,-sin],
        [0,sin, cos]
    ]

    let rotationY = [
        [ cos,0,sin],
        [   0,1,  0],
        [-sin,0,cos]
    ]

    for(let i = 0; i < points.length; i++) {
        let rotated = matmul(rotationY, points[i].convert());
        rotated = matmul(rotationZ, rotated);
        rotated = matmul(rotationX, rotated);

        let z = 1 / (20 - convert(rotated).z);
        //z = 1;
        let projection2D = [
            [z,0,0],
            [0,z,0],
        ]


        let projected = convert(matmul(projection2D, rotated));
        let x = (projected.x) * size + center.x;
        let y = (projected.y) * size + center.y;
        projected2D.push(new Point2D(x,y));
        //cercle(x,y);
    }

    for(let i = 0; i < 4; i++) {
        connect(i, (i+1) % 4, projected2D);
        connect((i + 4), (i + 1) % 4 + 4, projected2D);
        connect(i, i + 4, projected2D);
    }

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