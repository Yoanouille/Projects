var canvas = document.getElementById("cvs");
var ctx = canvas.getContext("2d");

var load_div = document.getElementById("load");



var NUM;
var val = [];

var data = "";

Array.prototype.copy = function() {
    var copy = [];
    for(var i = 0; i < this.length; i++) {
        copy[i] = [];
        for(var j = 0; j < this[i].length; j++) {
            copy[i][j] = this[i][j];
        }
    }
    return copy;
}

Array.prototype.equal = function(t) {
    if(this.length != t.length) return false;

    for(var i = 0; i < t.length; i++) {
        if(t[i] != this[i]) return false;
    }

    return true;
}

Array.prototype.remove = function(t) {
    for(var i = 0; i < this.length; i++) {
        if(this[i].equal(t)) {
            this.splice(i,1);
            break;
        }
    }
}

Array.prototype.sum = function() {
    var tot = 0;
    for(var i = 0; i < this.length; i++) {
        tot += this[i];
    }
    return tot;
}

Array.prototype.exist = function(elem) {
    for(var i = 0;  i < this.length; i++) {
        if(this[i] == elem) return true;
    }
    return false;
}

/*Array.prototype.sameContent = function(t) {
    if(this.length != t.length) return false;
    for(var i = 0; i < this.length; i++) {
        var b = false;
        for(var j = 0; j < t.length; j++) {
            if(this[i] == t[j]) {
                b = true;
            }
        }
        if(!b) return false;
    }
    for(var i = 0; i < t.length; i++) {
        var b = false;
        for(var j = 0; j < this.length; j++) {
            if(this[j] == t[i]) {
                b = true;
            }
        }
        if(!b) return false;
    }
    return true;
}*/

Array.prototype.sameContent = function(t) {
    if(this.length != t.length) return false;
    for(var i = 0; i < this.length; i++) {
        if(this.count(this[i]) != t.count(this[i])) return false;
    }
    return true;
}

Array.prototype.exist2 = function(elem) {
    for(var i = 0;  i < this.length; i++) {
        if(this[i].sameContent(elem)) return true;
    }
    return false;
}

Array.prototype.count = function(elem) {
    var x = 0;
    for(var i = 0; i < this.length; i++) {
        if(this[i] == elem) x++;
    }
    return x;
}

function add(t1,t2) {
    var x = 0;
    var t = [];
    for(var i = 0; i < t1.length; i++) {
        t[x] = t1[i];
        x++;
    }
    for(var j = 0; j < t2.length; j++) {
        t[x] = t2[j];
        x++;
    }
    return t;
}

function algo1(v) {    //fonctionne que si il y a vraiment une somme qui marche
    if(v.length == 1) {
        return null
    }
    var res = [];
    var x = 0;
    for(var i = 0; i < v.length; i++) {
        for(var j = i + 1; j < v.length; j++) {
            var tab = add(v[i], v[j]);
            if(tab.sum() == NUM) return tab;
            var copy = v.copy();
            copy.remove(v[i]);
            copy.remove(v[j]);
            copy.push(tab);
            res[x] = calcul(copy);
            x++;
        }
    }
    for(var i = 0; i < res.length; i++) {
        if(res[i] != null) {
            return res[i];
        }
    }
}


function algo2(v) {
    var index = 0;
    var len = v.length;
    var copyFalse = v.copy();
    var copy = [];
    while(copyFalse.length != 0) {
        copy.push(copyFalse.pop().pop());
    }
    var k = 0;
    while(v[index] /*&& v[index].length != len && v[index].sum() < 1.5 * NUM*/ && index < 5000) {
        for(var i = 0 /* k */; i < len; i++) {
            if(v[index].exist(v[i][0])  && (v[index].count(v[i][0]) < copy.count(v[i][0]))) { // et nombre de v[i][0] dans v[index] est strictement inferieur au nombre de v[i][0] dans copy
                var tab = add(v[index], v[i]);
                if(!v.exist2(tab)){
                    v.push(tab);
                    if(tab.sum() == NUM) return v;
                }
            }

            else if(!v[index].exist(v[i][0])) { 
                var tab = add(v[index], v[i]);
                if(!v.exist2(tab)){
                    v.push(tab);
                    if(tab.sum() == NUM) return v;
                }
            }
        }
        index++;
        k++;
        k %= len;

    }
    console.log(v);
    return v;
}

function findTheBest(v) {
    var e = Infinity;
    var bestIndex = -1;
    for(var i = 0; i < v.length; i++) {
        var sum = v[i].sum();
        var ecart = Math.abs(NUM - sum);
        if(ecart < e) {
            e = ecart;
            bestIndex = i;
        }
    }
    return v[bestIndex];
}


function loadFile(event) {
    var file = document.getElementById("file1").files[0];
    var fr = new FileReader();
    fr.onload = function(event) {
        data = event.target.result;
    } 
    fr.readAsText(file);
    main();
}


function main() {
    if(data) {
        data = data.split("\n");
        var x = 0;
        for(var i = 0; i < data.length; i++) {
            if(!isNaN(parseInt(data[i]))){
                val[x] = [];
                val[x][0] = parseInt(data[i]);
                x++;
            }
        }
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        NUM = val.pop().pop();
        algo2(val);
        drawResponse(findTheBest(val));
        load_div.style.display = "none";
        
    }

    //canvas.width = window.innerWidth;
    //canvas.height = window.innerHeight;
    /*val = GET("data.txt");
    NUM = val.pop().pop();
    algo2(val);
    drawResponse(findTheBest(val));*/
}


function drawResponse(arr) {
    ctx.fillStyle = "rgba(51,51,51)";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.font = "small-caps 40px dejavu san mono";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    var str = "";
    if(!arr) {
        str = "Error";
        ctx.fillText(str,canvas.width / 2, canvas.height / 2);
        return;
    }
    for(var i = 0; i < arr.length; i++) {
        str += arr[i] + " ";
    }


    ctx.fillText(str,canvas.width / 2, canvas.height / 2 - 40);
    ctx.fillText(arr.sum(),canvas.width / 2, canvas.height / 2 + 40);
}


function fin() {
    conti = false;
}