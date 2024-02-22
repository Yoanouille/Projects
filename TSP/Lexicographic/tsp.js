var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var order = [];
var num = 5;

function setup() {
    background();
    for(var i = 0; i < num; i++) {
        order.push(i);
    }
    drawOrder(order);
}

setup();

function draw() {
    background();

    //STEP 1
    var x = -1;
    for(var i = 0; i < order.length - 1; i++) {
        if(order[i] < order[i + 1]){
            x = i;
        }
    }
    if(x == -1){
        ctx.fillText("FINISHED", canvas.width / 2, canvas.height / 2);
        clearInterval(intervalID);
    }else{
        //STEP 2
        var y = -1;
        for(var i = 0; i < order.length; i++) {
            if(order[x] < order[i]){
                y = i;
            }
        }
        
        //STEP 3
        swap(order,x,y);
        
        //STEP 4
        for(var i = 0; i < Math.floor((order.length - x) / 2); i++) {
            swap(order,i + x + 1, order.length - 1 - i);
        }

        drawOrder(order);
    }
}
var intervalID = setInterval(draw, 4000);

function drawOrder(o) {
    var s = "";
    for(var i = 0; i < o.length; i++) {
        s += o[i];
    }
    ctx.font ="small-caps 40px dejavu sans mono";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(s, canvas.width / 2, canvas.height / 2);
}

function background() {
    ctx.fillStyle = "rgba(51,51,51)";
    ctx.fillRect(0,0,canvas.width,canvas.height);
}

function swap(a,i,j) {
    var tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
}