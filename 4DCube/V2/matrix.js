function matmul(m1,m2) {
    if(m1[0].length != m2.length) {
        console.log("ERREUR DIMENSION PRODUIT !!!");
        return null;
    }
    let m = [];
    for(let i = 0; i < m1.length; i++) {
        m[i] = [];
        for(let j = 0; j < m2[0].length; j++) {
            let sum = 0;
            for(let k = 0; k < m2.length; k++) {
                sum += m1[i][k] * m2[k][j];
            }
            m[i][j] = sum;
        }
    }
    return m;
}

function Point2D(x,y) {
    this.x = x;
    this.y = y;

    this.convert = function() {
        let m = [];
        m[0] = [this.x];
        m[1] = [this.y];
        return m;
    }
}

function Point3D(x,y,z) {
    this.x = x;
    this.y = y;
    this.z = z;

    this.convert = function() {
        let m = [];
        m[0] = [this.x];
        m[1] = [this.y];
        m[2] = [this.z];
        return m;
    }
}

function Point4D(x,y,z,w) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;

    this.convert = function() {
        let m = [];
        m[0] = [this.x];
        m[1] = [this.y];
        m[2] = [this.z];
        m[3] = [this.w];
        return m;
    }
}

function convert(m) {
    if(m[0].length != 1) {
        console.log("ERREUR CONVERT");
    }
    if(m.length == 2) {
        return new Point2D(m[0][0], m[1][0]);
    }
    if(m.length == 3) {
        return new Point3D(m[0][0], m[1][0], m[2][0]);
    }
    if(m.length == 4) {
        return new Point4D(m[0][0], m[1][0], m[2][0], m[3][0]);
    }
}
