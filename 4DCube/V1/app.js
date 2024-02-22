const canvas = document.getElementById("cvs");
const ctx = canvas.getContext("2d");

const width = canvas.width = 600;
const height = canvas.height = 600;

let intervalID;
let cube;
let hypercube;

function line(x0,y0,x1,y1) {
    ctx.beginPath();
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
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

function Point4D(x,y,z,w) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
}

function Square(center,size,cubeCenter) {
    this.center = center;
    this.size = size;
    this.cubeCenter = cubeCenter;
    this.sommets = [
        new Point4D(this.center.x - 1, this.center.y - 1, this.center.z, this.center.w),
        new Point4D(this.center.x + 1, this.center.y - 1, this.center.z, this.center.w),
        new Point4D(this.center.x + 1, this.center.y + 1, this.center.z, this.center.w),
        new Point4D(this.center.x - 1, this.center.y + 1, this.center.z, this.center.w)
    ];

    this.projectSommet3D = function(center) {
        this.sommet3D = [];
        for(let i = 0; i < this.sommets.length; i++) {
            let p = project3D(this.sommets[i], cubeCenter);
            this.sommet3D[i] = new Point3D(p.x,p.y,p.z);
        }
    }

    this.projectSommet = function() {
        this.projectSommet3D();
        this.sommet2D = [];
        for(let i = 0; i < this.sommet3D.length; i++) {
            let p = project2D(this.sommet3D[i], this.center);
            let x = (p.x - this.center.x) * this.size + this.center.x;
            let y = (p.y - this.center.y) * this.size + this.center.y;
            this.sommet2D[i] = new Point2D(x,y);
        }
    }

    this.sommet3D = [];

    this.sommet2D = [];

    this.show = function() {
        this.projectSommet();
        for(let i = 0; i < this.sommet2D.length; i++) {
            let x0 = this.sommet2D[i].x;
            let y0 = this.sommet2D[i].y;
            let x1 = this.sommet2D[(i + 1)%this.sommet2D.length].x;
            let y1 = this.sommet2D[(i + 1)%this.sommet2D.length].y;
            line(x0,y0,x1,y1);
        }

    }
    this.connect = function(square) {
        for(let i = 0; i < this.sommet2D.length; i++) {
            let x0 = this.sommet2D[i].x;
            let y0 = this.sommet2D[i].y;
            let x1 = square.sommet2D[i].x;
            let y1 = square.sommet2D[i].y;
            line(x0,y0,x1,y1);
        }
    }

    this.rotateX = function(angle, center) {
        let cosine = Math.cos(angle);
        let sine = Math.sin(angle);
        for(let i = 0; i < this.sommets.length; i++) {
            let p = this.sommets[i];

            let x = p.x;
            let y = (p.y - center.y) * cosine + (p.z - center.z) * -sine + center.y;
            let z = (p.y - center.y) * sine + (p.z - center.z) * cosine + center.z;
            let w = p.w;

            this.sommets[i] = new Point4D(x,y,z,w);
        }
    }

    this.rotateY = function(angle,center) {
        let cosine = Math.cos(angle);
        let sine = Math.sin(angle);
        
        for(let i = 0; i < this.sommets.length; i++) {

            let p = this.sommets[i]

            let x = (p.x - center.x) * cosine + (p.z - center.z) * sine + center.x;
            let y = p.y;
            let z = (p.x - center.x) * -sine + (p.z - center.z) * cosine + center.z;
            let w = p.w;

            this.sommets[i] = new Point4D(x,y,z,w);
        }
    }

    this.rotateZ = function(angle,center) {
        let cosine = Math.cos(angle);
        let sine = Math.sin(angle);
        
        for(let i = 0; i < this.sommets.length; i++) {

            let p = this.sommets[i]

            let x = (p.x - center.x) * cosine + (p.y - center.y) * sine + center.x;
            let y = (p.x - center.x) * -sine + (p.y - center.y) * cosine + center.y;
            let z = p.z;
            let w = p.w;
            this.sommets[i] = new Point4D(x,y,z,w);
        }
    }

    this.rotateZW = function(angle, center) {
        let cosine = Math.cos(angle);
        let sine = Math.sin(angle);
        for(let i = 0; i < this.sommets.length; i++) {
            let p = this.sommets[i];
            let x = p.x;
            let y = p.y;
            let z = (p.z - center.z) * cosine - (p.w - center.w) * sine + center.z;
            let w = (p.z - center.z) * sine + (p.w - center.w) * cosine + center.w;
            this.sommets[i] = new Point4D(x,y,z,w);
        }
    }

    this.rotateXW = function(angle, center) {
        let cosine = Math.cos(angle);
        let sine = Math.sin(angle);
        for(let i = 0; i < this.sommets.length; i++) {
            let p = this.sommets[i];
            let x = (p.x - center.x) * cosine + (p.w - center.w) * -sine + center.x;
            let y = p.y;
            let z = p.z
            let w = (p.x - center.x) * sine + (p.w - center.w) * cosine + center.w;
            this.sommets[i] = new Point4D(x,y,z,w);
        }
    }

    this.rotateYW = function(angle, center) {
        let cosine = Math.cos(angle);
        let sine = Math.sin(angle);
        for(let i = 0; i < this.sommets.length; i++) {
            let p = this.sommets[i];
            let x = p.x
            let y = (p.y - center.y) * cosine - (p.w - center.w) * sine + center.y;
            let z = p.z;
            let w = (p.y - center.y) * sine + (p.w - center.w) * cosine + center.w;
            this.sommets[i] = new Point4D(x,y,z,w);
        }
    }
}

function Cube(x,y,z,w, size, hyperCenter) {
    this.hyperCenter = hyperCenter;
    this.center = new Point4D(x,y,z,w);
    this.square1 = new Square(new Point4D(x, y, z - 1,w), size, this.center);
    this.square2 = new Square(new Point4D(x, y, z + 1,w), size, this.center);
    this.show = function() {
        this.square1.show();
        this.square2.show();
        this.square1.connect(this.square2);
    }

    this.connect = function(cube) {
        this.square1.connect(cube.square1);
        this.square2.connect(cube.square2);
    }

    this.rotateX = function(angle) {
        this.square1.rotateX(angle,this.center);
        this.square2.rotateX(angle,this.center);
    }

    this.rotateY = function(angle) {
        this.square1.rotateY(angle,this.center);
        this.square2.rotateY(angle,this.center);
    }   

    this.rotateZ = function(angle) {
        this.square1.rotateZ(angle,this.center);
        this.square2.rotateZ(angle,this.center);
    }
    
    this.rotateZW = function(angle) {
        this.square1.rotateZW(angle, this.hyperCenter);
        this.square2.rotateZW(angle, this.hyperCenter);
    }

    this.rotateXW = function(angle) {
        this.square1.rotateXW(angle, this.hyperCenter);
        this.square2.rotateXW(angle, this.hyperCenter);
    }

    this.rotateYW = function(angle) {
        this.square1.rotateYW(angle, this.hyperCenter);
        this.square2.rotateYW(angle, this.hyperCenter);
    }


}

function HyperCube(x,y,z,w,size) {
    this.center = new Point4D(x,y,z,w);
    this.size = size;
    this.cube1 = new Cube(x,y,z,w - 1,size,this.center);
    this.cube2 = new Cube(x,y,z,w + 1,size,this.center);

    this.show = function() {
        this.cube1.show();
        this.cube2.show();
        this.cube1.connect(this.cube2);
    }

    this.rotateX = function(angle) {
        this.cube1.rotateX(angle);
        this.cube2.rotateX(angle);
    }

    this.rotateY = function(angle) {
        this.cube1.rotateY(angle);
        this.cube2.rotateY(angle);
    }

    this.rotateZ = function(angle) {
        this.cube1.rotateZ(angle);
        this.cube2.rotateZ(angle);
    }
    
    this.rotateZW = function(angle) {

        this.cube1.rotateZW(angle);
        this.cube2.rotateZW(angle);
    }

    this.rotateXW = function(angle) {
        this.cube1.rotateXW(angle);
        this.cube2.rotateXW(angle);
    }
    
    this.rotateYW = function(angle) {
        this.cube1.rotateYW(angle);
        this.cube2.rotateYW(angle);
    }

}

function project3D(point, center) {
    let distance = 4;
    let w = 1 / (distance - point.w);
    //let w = 1;
    let x = (point.x - center.x) * w + center.x;
    let y = (point.y - center.y) * w + center.y;
    let z = (point.z - center.z) * w + center.z;
    return new Point3D(x,y,z);
}


function project2D(point, center) {
    let distance = 4;
    let z = 1 / (distance - (point.z));
    //let z = 1;
    let x = (point.x - center.x) * z + center.x;
    let y = (point.y - center.y) * z + center.y;
    return new Point2D(x,y);
}

function setup() {
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,width,height);
    //cube = new Cube(width / 2, height / 2, 0, 1, 400);
    hypercube = new HyperCube(width / 2, height / 2, 0, 0, 800);
    //hypercube.rotateX(Math.PI / 3);
    //hypercube.rotateY(Math.PI / 3);
   // draw();
    intervalID = setInterval(draw, 1000 / 60);
}

setup();

function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,width,height);
    hypercube.show();
    //hypercube.rotateYW(0.03);
    //hypercube.rotateXW(0.03);
    //hypercube.rotateZ(0.02);
    hypercube.rotateZW(0.02);
    hypercube.rotateY(0.03);
    
}