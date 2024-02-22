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

function Square(center,size) {
    this.center = center;
    this.size = size;
    this.sommets = [
        new Point3D(this.center.x - 1, this.center.y - 1, this.center.z),
        new Point3D(this.center.x + 1, this.center.y - 1, this.center.z),
        new Point3D(this.center.x + 1, this.center.y + 1, this.center.z),
        new Point3D(this.center.x - 1, this.center.y + 1, this.center.z)
    ];

    this.projectSommet = function() {
        this.sommet2D = [];
        for(let i = 0; i < this.sommets.length; i++) {
            let p = project2D(this.sommets[i], this.center);
            let x = (p.x - this.center.x) * this.size + this.center.x;
            let y = (p.y - this.center.y) * this.size + this.center.y;
            this.sommet2D[i] = new Point2D(x,y);
        }
    }

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

            this.sommets[i] = new Point3D(x,y,z);
        }
    }

    this.rotateY = function(angle,center) {
        let cosine = Math.cos(angle);
        let sine = Math.sin(angle);
        
        for(let i = 0; i < this.sommets.length; i++) {

            let p = this.sommets[i]

            let x = (p.x - center.x) * cosine + (p.z - center.z) * -sine + center.x;
            let y = p.y;
            let z = (p.x - center.x) * sine + (p.z - center.z) * cosine + center.z;

            this.sommets[i] = new Point3D(x,y,z);
        }
    }

    this.rotateZ = function(angle,center) {
        let cosine = Math.cos(angle);
        let sine = Math.sin(angle);
        
        for(let i = 0; i < this.sommets.length; i++) {

            let p = this.sommets[i]

            let x = (p.x - center.x) * cosine + (p.y - center.y) * -sine + center.x;
            let y = (p.x - center.x) * sine + (p.y - center.y) * cosine + center.y;
            let z = p.z;

            this.sommets[i] = new Point3D(x,y,z);
        }
    }

}

function Cube(x,y,z, size) {
    this.square1 = new Square(new Point3D(x, y, z - 1), size);
    this.square2 = new Square(new Point3D(x, y, z + 1), size);
    this.center = new Point3D(x,y,z);
    this.show = function() {
        this.square1.show();
        this.square2.show();
        this.square1.connect(this.square2);
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
}


function project2D(point, center) {
    let distance = 20;
    //let z = 1 / (distance - (point.z));
    let z = 1;
    let x = (point.x - center.x) * z + center.x;
    let y = (point.y - center.y) * z + center.y;
    return new Point2D(x,y);
}

function setup() {
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,width,height);
    cube = new Cube(width / 2, height / 2, 0, 100);
   // draw();
    intervalID = setInterval(draw, 1000 / 60);
}

setup();

function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,width,height);
    cube.show();
    cube.rotateX(0.02);
    cube.rotateY(0.02);
    cube.rotateZ(0.02);
}