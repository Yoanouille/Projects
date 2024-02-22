var val = [];
var OBJECTIF = 2000;
const NUM = 100;
const MAX_GEN = 50;
var intervalID;
var GEN = 0;
var pop = [];
var data = "";


var load_div = document.getElementById("load");
var bouton_div = document.getElementById("bouton");
var bravo_div = document.getElementById("bravo");
var canvas = document.getElementById("cvs");
var ctx = canvas.getContext("2d");


bouton_div.addEventListener("click", function() {
    bouton_div.classList.add("disp");
    setup();
})

function loadFile(event) {
    var file = document.getElementById("file1").files[0];
    var fr = new FileReader();
    fr.onload = function(event) {
        data = event.target.result;
    } 
    fr.readAsText(file);
    initialise();
}

Array.prototype.copy = function() {
    var t = [];
    for(var i = 0; i < this.length; i++) {
        t[i] = this[i];
    }
    return t;
}

Array.prototype.sum = function() {
    var x = 0;
    for(var i = 0; i < this.length; i++) {
        x += this[i];
    }
    return x;
}

function Combinaison(content) {
    if(content == null) {
        var len = randomInt(1,val.length);
        var cont = [];
        var copy = val.copy();
        for(var i = 0; i < len; i++) {
            var index = randomInt(0, copy.length - 1);
            cont[i] = copy.splice(index, 1)[0];
        }
        this.content = cont;
    } else {
        this.content = content;
    }

    this.fitness = Infinity;

    this.show = function() {
        console.log(this.content);
    }

    this.copy = function() {
        return new Combinaison(this.content.copy());
    }

    this.mutate = function(prob) {
        var r = Math.random();
        if(r < prob) {
            var copy = val.copy();
            for(var i = 0; i < this.content.length; i++) {
                for(var j = 0; j < copy.length; j++) {
                    if(this.content[i] == copy[j]) {
                        copy.splice(j,1);
                        break;
                    }
                }
            }
            r = Math.random();
            if(r < 0.5 && copy.length != 0) {
                r = randomInt(0, copy.length - 1);
                this.content.push(copy.splice(r,1)[0]);
                r += 1;
            }
            r -= 0.5;
            if(r < 0.5 && this.content.length > 1) {
                r = randomInt(0, this.content.length - 1);
                copy.push(this.content.splice(r,1)[0]);
            }
        }
    }

    this.calculFitness = function() {
        this.fitness = Math.abs(this.content.sum() - OBJECTIF);
    }
}

function randomInt(a,b) {
    return Math.floor(Math.random() * (b - a + 1) + a);
}

function trie(tab) {
    tab.sort(function(a,b){
        return a.fitness - b.fitness;
    })
}

function initialise() {
    if(data != ""){
        data = data.split("\n");
        var x = 0;
        for(var i = 0; i < data.length; i++) {
            if(!isNaN(parseInt(data[i]))){
                val[x] = parseInt(data[i]);
                x++;
            }
        }
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        OBJECTIF = val.pop();
        load_div.style.display = "none";
        setup();
    }
}

function setup() {
    pop = [];
    GEN = 0;
    for(var i = 0; i < NUM; i++) {
        pop[i] = new Combinaison();
        pop[i].calculFitness();
    }
    intervalID = setInterval(draw, 250);
}

function nextGeneration() {
    /*if(t[0].fitness == 0) {
        console.log(t[0].content);
    }*/
    var newPop = [];
    newPop.push(pop[0]);
    for(var i = 1; i < NUM / 4; i++) {
        var newComb = pop[i].copy();
        newComb.mutate(0.5);
        newPop.push(newComb);
    }
    for(var i = NUM / 2; i < 3 * NUM / 4; i++) {
        var newComb = pop[i].copy();
        newComb.mutate(0.9);
        newPop.push(newComb);
    }
    for(var i = NUM / 4; i < NUM / 2; i++) {
        var newComb = pop[i].copy();
        newComb.mutate(0.7);
        newPop.push(newComb);
    }
    for(var i = 0; i < NUM / 4; i++) {
        newPop.push(new Combinaison());
    }
    for(var i = 0; i < newPop.length; i++) {
        newPop[i].calculFitness();
    }

    pop = newPop;
}

function stop() {
    clearInterval(intervalID);
}

function draw() {
    ctx.font = "small-caps 30px dejavu sans mono";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    trie(pop);
    /*console.log("------------------");
    for(var i = 0; i < pop.length; i++) {
        pop[i].show();
    }*/


    ctx.fillStyle = "rgba(51,51,51)";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle = "white";
    ctx.fillText("GEN " + GEN, canvas.width / 8, canvas.height / 8);
    var str = "";
    for(var i = 0; i < pop[0].content.length; i++) {
        str += pop[0].content[i] + " ";
    }

    ctx.fillText(str, canvas.width / 2, canvas.height / 2);
    ctx.fillText(pop[0].content.sum(), canvas.width / 2, canvas.height / 4 * 3);

    if(GEN == MAX_GEN || pop[0].fitness == 0) {
        end();
        //clearInterval(intervalID);
    }

    nextGeneration(pop);
    GEN ++;

}

function end() {
    clearInterval(intervalID);
    if(GEN == MAX_GEN && pop[0].fitness != 0){
        bouton_div.classList.remove("disp");
    } else {
        bravo_div.classList.remove("disp");
    }

}

//setup();