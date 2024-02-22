const canvas = document.getElementById("cvs");
const ctx = canvas.getContext("2d");

const width = canvas.width = 600;
const height = canvas.height = 600;

let intervalID;

let cube;

function line(x0,y0,x1,y1) {
    ctx.beginPath();
    ctx.strokeStyle = "white";
    ctx.moveTo(x0,y0);
    ctx.lineTo(x1,y1);
    ctx.stroke();
}

function Point2D(x,y) {
    this.x = x;
    this.y = y;
}

function Point3D(x,y,z) {
    this.x = x;
    this.y = y;
    this.z = z;
}

function Cube(x,y,z, size) {
    this.x = x;
    this.y = y;
    this.z = z;
    let w = size / 2;
    this.sommets = [
        new Point3D(x - w, y - w, z - w),
        new Point3D(x + w, y - w, z - w),
        new Point3D(x + w, y + w, z - w),
        new Point3D(x - w, y + w, z - w),
        new Point3D(x - w, y - w, z + w),
        new Point3D(x + w, y - w, z + w),
        new Point3D(x + w, y + w, z + w),
        new Point3D(x - w, y + w, z + w)
    ];

    this.sommets2D = project(this);

    this.face = [
        [0,1,2,3],
        [4,5,6,7],
        [0,1,5,4],
        [3,2,6,7],
        [0,4,7,3],
        [1,5,6,2]
    ];

    this.show = function() {
        ctx.beginPath();
        ctx.fillStyle = "white";
        for(let i = 0; i < this.face.length; i++) {
            let face = this.face[i];
            for(let j = 0; j < face.length; j++) {
                let x0 = this.sommets2D[face[j % 4]].x;
                let y0 = this.sommets2D[face[j % 4]].y;
                let x1 = this.sommets2D[face[(j + 1) % 4]].x;
                let y1 = this.sommets2D[face[(j + 1) % 4]].y;
                line(x0,y0,x1,y1);
            }
        }
    }

    this.rotateX = function(angle) {
        let cosine = Math.cos(angle);
        let sine = Math.sin(angle);
        
        for(let i = 0; i < this.sommets.length; i++) {

            let p = this.sommets[i]

            let x = p.x;
            let y = (p.y - this.y) * cosine + (p.z - this.z) * -sine + this.y;
            let z = (p.y - this.y) * sine + (p.z - this.z) * cosine + this.z;

            this.sommets[i] = new Point3D(x,y,z);
        }
        this.sommets2D = project(this);
    }

    this.rotateY = function(angle) {
        let cosine = Math.cos(angle);
        let sine = Math.sin(angle);
        
        for(let i = 0; i < this.sommets.length; i++) {

            let p = this.sommets[i]

            let x = (p.x - this.x) * cosine + (p.z - this.z) * sine + this.x;
            let y = p.y;
            let z = (p.x - this.x) * -sine + (p.z - this.z) * cosine + this.z;

            this.sommets[i] = new Point3D(x,y,z);
        }
        this.sommets2D = project(this);
    }

    this.rotateZ = function(angle) {
        let cosine = Math.cos(angle);
        let sine = Math.sin(angle);
        
        for(let i = 0; i < this.sommets.length; i++) {

            let p = this.sommets[i]

            let x = (p.x - this.x) * cosine + (p.y - this.y) * sine + this.x;
            let y = (p.x - this.x) * -sine + (p.y - this.y) * cosine + this.y;
            let z = p.z;

            this.sommets[i] = new Point3D(x,y,z);
        }
        this.sommets2D = project(this);
    }
}

function project(cube) {
    let points2D = [];
    let points3D = cube.sommets;
    for(let i = 0; i < points3D.length; i++) {
        let x = (points3D[i].x - cube.x) * 200 / (points3D[i].z) + cube.x;
        let y = (points3D[i].y - cube.y) * 200 / (points3D[i].z) + cube.y;
        points2D[i] = new Point2D(x,y);
    }
    return points2D;
}

function setup() {
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,width,height);

    cube = new Cube(width / 2, height / 2, 300, 100);
    //draw();
    intervalID = setInterval(draw, 1000 / 60);
}
setup();

let angle = 0.005;
 
function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,width,height);

    cube.show();
    cube.rotateX(angle * 6);
    cube.rotateY(angle * 3);
    //cube.rotateZ(angle);

    //angle += 0.02;
}

canvas.addEventListener("click", click);

function click(evt) {
    let Rect = canvas.getBoundingClientRect();
    let x = evt.clientX - Rect.left;
    let y = evt.clientY - Rect.top;
    x -= width / 2;
    y -= height / 2;
}
