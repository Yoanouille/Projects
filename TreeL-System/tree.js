var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var rule = "F";

var change = "FF+[+F-F-F]-[-F+F+F]";
var angleg = Math.PI / 8;
var angled = Math.PI / 8;
var len = 200;

function next() {
    var newRule = "";
    for(var i=0; i<rule.length; i++){
        var r = rule.charAt(i);
        if(r == "F"){
            r = change;
        }
        newRule += r;
    }
    rule = newRule;
}

function turtle() {
    ctx.strokeStyle = "white";
    var x = canvas.width / 2;
    var y = canvas.height;
    var a = Math.PI / 2;
    var stack = [];
    for(var i=0; i<rule.length; i++){
        var r = rule.charAt(i);
        switch(r){
            case "F":
                ctx.beginPath();
                ctx.moveTo(x,y);
                ctx.lineTo(x + len*Math.cos(a), y - len*Math.sin(a));
                ctx.closePath();
                ctx.stroke();
                x = x + len*Math.cos(a);
                y = y - len*Math.sin(a)
                break;

            case "+":
                a += angleg;
                break;

            case "-":
                a -= angled;
                break;

            case "[":
                stack.push({x:x, y:y, a:a});
                break;

            case "]":
                var p = stack.pop();
                x = p.x;
                y = p.y;
                a = p.a;
                break;
        }
    }
    len *= 0.5;

}

function setup() {
    ctx.fillStyle = "rgba(51,51,51)";
    ctx.fillRect(0,0,canvas.width,canvas.height);

   turtle();
    
    //console.log(rule);
   // next();
    //console.log(rule);
}
setup();

function draw() {
    ctx.fillStyle = "rgba(51,51,51)";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    next();
    turtle();
}
