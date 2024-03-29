let perm = [151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,
    142,8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,
    203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,
    74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,
    105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,
    187,208,89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,
    64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,
    47,16,58,17,182,189,28,42,223,183,170,213,119,248,152,2,44,154,163,70,221,
    153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,178,185,
    112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,
    235,249,14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,
    127,4,150,254,138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,
    156,180];


const UNIT = 1 / Math.sqrt(2);
const GRADIENT = [[UNIT,UNIT],[-UNIT,UNIT],[UNIT,-UNIT],[-UNIT,-UNIT],[1,0],[-1,0],[0,1],[0,-1]];


for(let i = 0; i < 256; i++) {
    perm.push(perm[i]);
}
for(let i = 0; i < 256; i++) {
    perm.push(perm[i]);
}

const VECTEUR = [
                    [1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
                    [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
                    [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1],
                ];

function perlin3D(x,y,z) {

    let x0 = Math.floor(x);
    let y0 = Math.floor(y);
    let z0 = Math.floor(z);

    let xf = x - x0;
    let yf = y - y0;
    let zf = z - z0;

    let xi = x0 % 256;
    let yi = y0 % 256;
    let zi = z0 % 256;

    let aaa = perm[perm[perm[xi] + yi] + zi];
    let aba = perm[perm[perm[xi] + yi + 1] + zi]
    let aab = perm[perm[perm[xi] + yi] + zi + 1];
    let abb = perm[perm[perm[xi] + yi + 1] + zi + 1];
    let baa = perm[perm[perm[xi + 1] + yi] + zi];
    let bba = perm[perm[perm[xi + 1] + yi + 1] + zi];
    let bab = perm[perm[perm[xi + 1] + yi] + zi + 1];
    let bbb = perm[perm[perm[xi + 1] + yi + 1] + zi + 1];

    let u = fade(xf);
    let v = fade(yf);
    let w = fade(zf);

    let x1,x2,y1,y2;

    x1 = lerp(grad(/*VECTEUR[aaa]*/aaa, xf, yf, zf), grad(/*VECTEUR[baa]*/baa, xf - 1, yf, zf), u);
    x2 = lerp(grad(/*VECTEUR[aba]*/aba, xf, yf - 1, zf), grad(/*VECTEUR[aab]*/bba, xf - 1, yf - 1, zf), u);

    y1 = lerp(x1, x2, v);

    x1 = lerp(grad(/*VECTEUR[bba]*/aab, xf, yf, zf - 1), grad(/*VECTEUR[bab]*/bab, xf - 1, yf, zf - 1), u);
    x2 = lerp(grad(/*VECTEUR[abb]*/abb, xf, yf - 1, zf - 1), grad(/*VECTEUR[bbb]*/bbb, xf - 1, yf - 1, zf - 1), u);

    y2 = lerp(x1, x2, v);

    //return (lerp(y1, y2, w) + 1) / 2;
    return lerp(y1, y2, w);
}

function perlin2D(x,y) {
    let x0 = Math.floor(x);
    let y0 = Math.floor(y);

    let xf = x - x0;
    let yf = y - y0;
    
    let xi = x0 % 256;
    let yi = y0 % 256;

    let aa = perm[xi + perm[yi]] % 8;
    let ba = perm[xi + 1 + perm[yi]] % 8;
    let ab = perm[xi + perm[yi + 1]] % 8;
    let bb = perm[xi + 1 + perm[yi + 1]] % 8;

    let u = fade2(xf);
    let v = fade2(yf);


    /*console.log(grad2(GRADIENT[aa], xf, yf));
    console.log(grad2(GRADIENT[ba], xf - 1, yf));
    console.log(grad2(GRADIENT[ab], xf, yf - 1));
    console.log(grad2(GRADIENT[bb], xf - 1, yf - 1));*/
    let x1 = lerp(grad2(GRADIENT[aa], xf, yf), grad2(GRADIENT[ba], xf - 1, yf), u);
    let x2 = lerp(grad2(GRADIENT[ab], xf, yf - 1), grad2(GRADIENT[bb], xf - 1, yf - 1), u);
    //console.log(x1,x2);
    return (lerp(x1,x2,v) + 1) / 2;
    
}

function fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10); 
}

function fade2(t) {
    return 3 * t * t - 2 * t * t * t;
}

/*function grad(vec, a, b, c) {
    return vec[0] * a + vec[1] * b + vec[2] * c;
}*/

function grad(hash, x, y, z) {
    switch(hash & 0xF)
    {
        case 0x0: return  x + y;
        case 0x1: return -x + y;
        case 0x2: return  x - y;
        case 0x3: return -x - y;
        case 0x4: return  x + z;
        case 0x5: return -x + z;
        case 0x6: return  x - z;
        case 0x7: return -x - z;
        case 0x8: return  y + z;
        case 0x9: return -y + z;
        case 0xA: return  y - z;
        case 0xB: return -y - z;
        case 0xC: return  y + x;
        case 0xD: return -y + z;
        case 0xE: return  y - x;
        case 0xF: return -y - z;
        default: return 0; // never happens
    }
}

function grad2(vec, a, b) {
    /*console.log(vec[0] + " " + vec[1]);*/

    return vec[0] * a + vec[1] * b;
}

function lerp(a, b, x) {
    return a + x * (b - a);
}

