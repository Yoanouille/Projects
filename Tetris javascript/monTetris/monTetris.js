var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var intervalID;

var hauteur = 28;
var largeur = 14;
var tailleCase = 20;
var score = 0;
var acc = false;
var fin = false;
var mul = 0;
var sco = 0;

const initX = 5;
const initY = 0;
var formX = initX;
var formY = initY;

var form = new Array();

form[0] = [
    [
        [0,0,0],
        [1,1,1],
        [0,0,1]
    ],
    [
        [0,1,0],
        [0,1,0],
        [1,1,0]
    ],
    [
        [1,0,0],
        [1,1,1],
        [0,0,0]
    ],
    [
        [0,1,1],
        [0,1,0],
        [0,1,0]
    ]

];

form[1] = [
    [
        [0,0,0],
        [0,1,1],
        [1,1,0]
    ],
    [
        [0,1,0],
        [0,1,1],
        [0,0,1]
    ]
];

form[2] = [
    [
        [0,0,0],
        [1,1,0],
        [0,1,1]
    ],
    [
        [0,0,1],
        [0,1,1],
        [0,1,0]
    ]
];

form[3] = [
    [
        [0,1,0],
        [1,1,1],
        [0,0,0]
    ],
    [
        [0,1,0],
        [0,1,1],
        [0,1,0]
    ],
    [
        [0,0,0],
        [1,1,1],
        [0,1,0]
    ],
    [
        [0,1,0],
        [1,1,0],
        [0,1,0]
    ]
];

form[4] = [
    [
        [0,0,0],
        [1,1,1],
        [1,0,0]
    ],
    [
        [1,1,0],
        [0,1,0],
        [0,1,0]
    ],
    [
        [0,0,1],
        [1,1,1],
        [0,0,0]
    ],
    [
        [0,1,0],
        [0,1,0],
        [0,1,1]
    ]

];

form[5] = [
    [
        [0,0,0,0],
        [0,1,1,0],
        [0,1,1,0],
        [0,0,0,0]
    ]
];

form[6] = [
    [
        [0,0,0,0],
        [1,1,1,1],
        [0,0,0,0],
        [0,0,0,0]
    ],
    [
        [0,0,1,0],
        [0,0,1,0],
        [0,0,1,0],
        [0,0,1,0]
    ],

];

var numForm = nouvelleForme();
var numRot = 0;
var numColor = Math.trunc(Math.random() * 7);
var numColorSuiv = Math.trunc(Math.random() * 7);

var couleurForm = ["#FF0000","#00FF00","#0000FF","#FFFF00","#FF00FF","#00FFFF","#FB9501"];

var grille = new Array(largeur);


function initGrille() {
    for(var i=0; i<largeur; i++){
        grille[i] = new Array(hauteur);
        for(var j=0; j<hauteur; j++){
            grille[i][j] = -1;
        }
    }
}

initGrille();

var m = 0;

function nouvelleForme() {
    return Math.trunc(Math.random() * (form.length));
}

var formeSuiv = nouvelleForme();



function effaceLigne(numLigne){
    for(var i=0; i<grille.length; i++){
        for(var j=numLigne; j>0; j--){
            grille[i][j] = grille[i][j-1];
        }
    }
    for(var i=0; i<grille.length; i++){
        grille[i][0] = -1;
    }
}

function ligneAEfface(){
    var tab = new Array();
    for(var i=0; i<grille[0].length; i++){
        var bool = true;
        for(var j=0; j<grille.length; j++){
            if(grille[j][i] == -1){
                bool = false;
            }
        }
        if(bool) {
            tab.push(i);
        }
    }
    return tab;
}

function transfertForm() {
    var piece = form[numForm][numRot];
    for(var i=0; i<piece.length; i++){
        for(var j=0; j<piece[i].length; j++){
            if(piece[i][j] == 1){
                grille[j+formX][i+formY] = numColor;
            }
        }
    }
}
function drawGrille() {
    for(var i=0; i<largeur; i++){
        for(var j=0; j<hauteur; j++){
            if(grille[i][j] != -1){
                ctx.fillStyle = couleurForm[grille[i][j]];
                ctx.fillRect(i*tailleCase, j*tailleCase, tailleCase, tailleCase);
                ctx.strokeRect(i*tailleCase, j*tailleCase, tailleCase, tailleCase);
            }
        }
    }
}

function collision() {
    var piece = form[numForm][numRot];
    for(var i=0; i<piece.length; i++){
        for(var j=0; j<piece[i].length; j++){
            if(piece[i][j] == 1){
                if(formX + j < 0 || formX + j >= 14 || formY + i < 0 || formY + i >= 28){
                    return true;
                }
                if(grille[formX+j][formY+i] != -1){
                    return true;
                }
            }
        }
    }
    return false;
}

function drawForm(x,y,piece,rot, color) {
    for(var i=0; i<form[piece][rot].length; i++){
        for(var j=0; j<form[piece][rot][i].length; j++){
            if(form[piece][rot][i][j] == 1){
                ctx.fillStyle = couleurForm[color];
                ctx.fillRect((j + x)*tailleCase, (i + y)*tailleCase, tailleCase, tailleCase);
                ctx.strokeRect((j + x)*tailleCase, (i + y)*tailleCase, tailleCase, tailleCase);
                
            }
        }
    }
}

function drawInterface() {
    ctx.beginPath();
    ctx.moveTo(281, 0);
    ctx.lineTo(281, 560);
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.closePath();
    ctx.stroke();
    ctx.font = "16px Arial";
    ctx.fillStyle = "#000000";
    ctx.fillText("Prochaine pièce :", 290, 30);
    drawForm(16, 5, formeSuiv, 0, numColorSuiv);
    ctx.fillStyle = "#000000";
    ctx.fillText("Score: "+score, 290, 250);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(!fin){
        drawInterface();
        drawForm(formX, formY, numForm, numRot, numColor);
        drawGrille();
        var tmp = formY;
        formY++;
        if(collision()){
            formY = tmp;
            m++
            if(m == 2){
                transfertForm();
                numColor = numColorSuiv;
                numColorSuiv = Math.trunc(Math.random() * 7);
                formY = 0;
                m=0;
                numForm = formeSuiv;
                formeSuiv = nouvelleForme();
                formX = initX;
                numRot = 0;
                var tab = ligneAEfface();
                for(var i=0; i<tab.length; i++){
                    effaceLigne(tab[i]);
                    sco += 100;
                    mul++;
                }
                score += sco*mul;
                mul = 0;
                sco = 0;
                if(collision()){
                    fin = true;
                }
            }
        }
    }else{
        ctx.font = "50px Arial";
        ctx.fillStyle = "#FF0000";
        ctx.fillText("GAME OVER", 70, 200);
        ctx.fillStyle = "#000000";
        ctx.font = "30px Arial";
        ctx.fillText("Votre Score: "+score, 100, 270);
        ctx.font = "16px Arial";
        ctx.fillText("Appuyer sur \"ENTRE\" pour recommencer", 70, 400);
    } 
}

function keyBoard(evt) {
    //console.log(evt.keyCode);
    switch(evt.keyCode){
        case 38:
            var tmp = numRot; 
            numRot ++;
            numRot %= form[numForm].length;
            if(collision()) numRot = tmp;
            break;
        
        case 40:
            var tmp = numRot;
            numRot --;
            if(numRot < 0){
                numRot += form[numForm].length;
            }
            if(collision()) numRot = tmp;
            break;

        case 37:
            var tmp = formX;
            formX--;
            if(collision()) formX = tmp;
            break;

        case 39:
            var tmp = formX;
            formX++;
            if(collision()) formX = tmp;
            break;

        case 107: 
            numForm++;
            numRot = 0;
            numForm %= form.length;
            break;

        case 32:
            if(acc == false){
                clearInterval(intervalID);
                intervalID = setInterval(draw, 50);
                acc = true;
            }
            break;

        case 13:
            if(fin){
                fin = false;
                initGrille();
                score = 0;
            }
            break;
    }
}

function keyDo(evt) {
    //console.log(evt.keyCode);
    if(evt.keyCode == 32){
        clearInterval(intervalID);
        intervalID = setInterval(draw, 200);
        acc = false;
    }
}



intervalID = setInterval(draw, 200);
document.addEventListener("keyup", keyDo);
document.addEventListener("keydown", keyBoard);