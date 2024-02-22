

function Line(x1, y1, x2, y2){
    this.x1 = x1;
    this.x2 = x2;
    this.y1 = y1;
    this.y2 = y2;
}

Line.prototype.intersection = function(line){
    var d = (line.x2-line.x1)*(this.y1-this.y2)-(this.x1-this.x2)*(line.y2-line.y1);
    if(d != 0){
        var ta = ((line.y1-line.y2)*(this.x1-line.x1)+(line.x2-line.x1)*(this.y1-line.y1))/d;
        var tb = ((this.y1-this.y2)*(this.x1-line.x1)+(this.x2-this.x1)*(this.y1-line.y1))/d;
        return {intersect:(ta <= 1 && ta >= 0 && tb <= 1 && tb >= 0), x:this.x1+ta*(this.x2-this.x1), y:this.y1+ta*(this.y2-this.y1)};
    }
    return {intersect:false};
}

Line.prototype.draw = function(ctx, cam){
    if(cam == null){
        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.stroke();
        ctx.closePath();
    } else {
        ctx.beginPath();
        ctx.moveTo(cam.width/2+(this.x1-cam.x)*cam.zoom, cam.height/2+(this.y1-cam.y)*cam.zoom);
        ctx.lineTo(cam.width/2+(this.x2-cam.x)*cam.zoom, cam.height/2+(this.y2-cam.y)*cam.zoom);
        ctx.stroke();
        ctx.closePath();
    }
}

Line.prototype.getNormal = function(){
    var dx = this.x2-this.x1;
    var dy = this.y2-this.y1;
    var l = Math.sqrt(dx*dx+dy*dy);
    return {x:-dy/l, y:dx/l};
}


function Particle(x, y){
    this.x = x;
    this.y = y;
    this.m = 1;
    this.oldx = x;
    this.oldy = y;

    this.grav = 100;
}

Particle.prototype.update = function(dt){

    var xspd = (this.x-this.oldx)/dt;
    var yspd = (this.y-this.oldy)/dt+ this.grav*dt;

    this.oldx = this.x;
    this.oldy = this.y;
    this.x += xspd*dt;
    this.y += yspd*dt;
}

Particle.prototype.collisions = function(lines){
    var line = new Line(this.oldx, this.oldy, this.x, this.y);
    for(var i = 0; i < lines.length; i++){
        var intersection = lines[i].intersection(line);
        if(intersection.intersect){
            var xspd = this.x-this.oldx;
            var yspd = this.y-this.oldy;
            var spd = Math.sqrt(xspd*xspd+yspd*yspd);
            var n = lines[i].getNormal();
            var p = lines[i].intersection(line);
            var pr = lines[i].intersection(new Line(this.oldx, this.oldy, this.oldx+n.x, this.oldy+n.y));
            var d1 = Math.pow(this.oldx-(pr.x+n.x), 2) + Math.pow(this.oldy-(pr.y+n.y), 2);
            var d2 = Math.pow(this.oldx-(pr.x-n.x), 2) + Math.pow(this.oldy-(pr.y-n.y), 2);
            if(d2 < d1){
                n.x *= -1;
                n.y *= -1;
            }
            this.x = p.x+n.x*0.001;
            this.y = p.y+n.y*0.001;

            var dx = this.oldx-pr.x +this.x-pr.x;
            var dy = this.oldy-pr.y +this.y-pr.y;
            var l = Math.sqrt(dx*dx+dy*dy);

            var fric = 0.5;

            this.oldx = this.x-fric*spd*dx/l;
            this.oldy = this.y-fric*spd*dy/l;
        }
    }
}

Particle.prototype.draw = function(ctx){
    ctx.fillRect(this.x-.5, this.y-.5, 1, 1);
}

function Stick(p1, p2, s, l){
    this.p1 = p1;
    this.p2 = p2;
    if(l == null){
        this.l = Math.sqrt((p1.x-p2.x)*(p1.x-p2.x) + (p1.y-p2.y)*(p1.y-p2.y));
    } else {
        this.l = l;
    }

    if(s == null){
        this.s = 1;
    } else {
        this.s = s;
    }
}

Stick.prototype.update = function(){
    var dx = this.p2.x-this.p1.x;
    var dy = this.p2.y-this.p1.y;
    var d = Math.sqrt(dx*dx+dy*dy);
    this.p1.x -= this.s*0.5*(this.l-d)*dx/d;
    this.p1.y -= this.s*0.5*(this.l-d)*dy/d;
    this.p2.x += this.s*0.5*(this.l-d)*dx/d;
    this.p2.y += this.s*0.5*(this.l-d)*dy/d;   
    return d;
}

Stick.prototype.getLength = function(){
    var dx = this.p2.x-this.p1.x;
    var dy = this.p2.y-this.p1.y;
    return Math.sqrt(dx*dx+dy*dy);
}

Stick.prototype.draw = function(ctx, cam){
    if(cam == null){
        ctx.beginPath();
        ctx.moveTo(this.p1.x, this.p1.y);
        ctx.lineTo(this.p2.x, this.p2.y);
        ctx.stroke();
        ctx.closePath();
    } else {
        ctx.beginPath();
        ctx.moveTo(cam.width/2+(this.p1.x-cam.x)*cam.zoom, cam.height/2+(this.p1.y-cam.y)*cam.zoom);
        ctx.lineTo(cam.width/2+(this.p2.x-cam.x)*cam.zoom, cam.height/2+(this.p2.y-cam.y)*cam.zoom);
        ctx.stroke();
        ctx.closePath();
    }

}

function Creature(x, y, weights){
    this.apoints = [[0, 0],[10, 10],[-10, 10],[20, 0],[-20, 0], [30, 30], [-30, 30], [25, 60], [-25, 60], [40, 65], [-40, 65]];
    this.alinks = [[0, 1], [0, 2], [1, 3], [2, 4], [3, 5], [4, 6], [1, 2], [5, 7], [6, 8], [7, 9], [8, 10]];
    this.amuscles = [[0, 2], [1, 3], [2, 4], [3, 5], [4, 7], [5, 8], [7, 9], [8, 10]];

    this.points = [];
    this.links = [];
    this.muscles = [];

    for(var i = 0; i < this.apoints.length; i++){
        this.points[i] = new Particle(this.apoints[i][0]+x, this.apoints[i][1]+y);
    }

    for(var i = 0; i < this.amuscles.length; i++){
        var ps = [this.points[this.alinks[this.amuscles[i][0]][0]],
                  this.points[this.alinks[this.amuscles[i][0]][1]],
                  this.points[this.alinks[this.amuscles[i][1]][0]],
                  this.points[this.alinks[this.amuscles[i][1]][1]]];
        var a;
        var b;
        for(var j = 0; j < ps.length; j++){
            for(var k = 0; k < ps.length; k++){
                if(j != k && ps[j] == ps[k]){
                    a = j;
                    b = k;
                }
            }
        }
        var ind = [0, 1, 2, 3];
        ind.splice(a, 1);
        ind.splice(b, 1);
        this.muscles[i] = new Stick(ps[ind[0]], ps[ind[1]], 0.1);
    }

    for(var i = 0; i < this.alinks.length; i++){
        this.links[i] = new Stick(this.points[this.alinks[i][0]], this.points[this.alinks[i][1]]);
    }

    this.mLengths = [];
    for(var i = 0; i < this.muscles.length; i++){
        this.mLengths[i] = 0.5;
    }
    for(var i = 0; i < this.muscles.length; i++){
        this.muscles[i].l = this.mLengths[i]*(this.links[this.amuscles[i][0]].getLength()+this.links[this.amuscles[i][1]].getLength());
    }
    for(var i = 0; i < this.muscles.length; i++){
        this.muscles[i].update();
    }
    for(var i = 0; i < this.links.length; i++){
        this.links[i].update();
    }
    for(var i = 0; i < this.points.length; i++){
        this.points[i].oldx = this.points[i].x;
        this.points[i].oldy = this.points[i].y;
    }

    this.brain = new NeuralNetwork();
    this.brain.addLayer({n:this.points.length*4+1});
    this.brain.addLayer({n:20, activation:sigmoid});
    this.brain.addLayer({n:10, activation:sigmoid});
    this.brain.addLayer({n:this.muscles.length, activation:sigmoid});
    this.brain.initWeights();
    if(weights != null){
        this.brain.setWeights(weights);
    }


    var minx = this.points[0].x;
    var maxx = this.points[0].x;
    var miny = this.points[0].y;
    var maxy = this.points[0].y;
    for(var i = 1; i < this.points.length; i++){
        if(this.points[i].x < minx){
            minx = this.points[i].x
        }
        if(this.points[i].x > maxx){
            maxx = this.points[i].x
        }
        if(this.points[i].y < miny){
            miny = this.points[i].y
        }
        if(this.points[i].y > maxy){
            maxy = this.points[i].y
        }
    }
    this.width = maxx-minx;
    this.height = maxy-miny;
}

Creature.prototype.update = function(dt, lines){

    var inputs = [this.points[0].y/this.height];
    for(var i = 0; i < this.points.length; i++){
        inputs.push((this.points[i].x-this.points[i].oldx)/dt, (this.points[i].y-this.points[i].oldy)/dt, (this.points[i].x-this.points[0].x)/this.width,(this.points[i].y-this.points[0].y)/this.height);
    }

    var outputs = this.brain.feedForward(inputs);
    for(var i = 0; i < this.muscles.length; i++){
        this.mLengths[i] += (outputs[i]*0.6+0.2-this.mLengths[i])*0.1;
    }


    for(var i = 0; i < this.muscles.length; i++){
        var l1 = this.links[this.amuscles[i][0]].getLength();
        var l2 = this.links[this.amuscles[i][1]].getLength();
        var min = Math.abs(l1-l2);
        var max = l1+l2;
        this.muscles[i].l = min+this.mLengths[i]*(max-min);
    }
    


    for(var i = 0; i < this.points.length; i++){
        this.points[i].update(dt);
    }
    for(var j = 0; j < 10; j++){
        for(var i = 0; i < this.links.length; i++){
            this.links[i].update();
        }
        for(var i = 0; i < this.muscles.length; i++){
            this.muscles[i].update();
        }
    }
    for(var i = 0; i < this.points.length; i++){
        this.points[i].collisions(lines);
    }
}

Creature.prototype.draw = function(ctx, cam, transparent){
    if(transparent){
        ctx.strokeStyle = "rgba(0,0,0,0.1)";
    }
    for(var i = 0; i < this.links.length; i++){
        this.links[i].draw(ctx, cam);
    }
    ctx.strokeStyle = "rgba(0,0,0,1)";

    for(var i = 0; i < this.muscles.length; i++){
        x1 = (this.links[this.amuscles[i][0]].p1.x + this.links[this.amuscles[i][0]].p2.x)/2;
        y1 = (this.links[this.amuscles[i][0]].p1.y + this.links[this.amuscles[i][0]].p2.y)/2;

        x2 = (this.links[this.amuscles[i][1]].p1.x + this.links[this.amuscles[i][1]].p2.x)/2;
        y2 = (this.links[this.amuscles[i][1]].p1.y + this.links[this.amuscles[i][1]].p2.y)/2;
        ctx.strokeStyle = "rgba(0,0,0,0.2)";
        if(transparent){
            ctx.strokeStyle = "rgba(0,0,0,0.05)";
        }
        ctx.beginPath();
        ctx.moveTo(cam.width/2+(x1-cam.x)*cam.zoom, cam.height/2+(y1-cam.y)*cam.zoom);
        ctx.lineTo(cam.width/2+(x2-cam.x)*cam.zoom, cam.height/2+(y2-cam.y)*cam.zoom);
        ctx.stroke();
        ctx.closePath();
        ctx.strokeStyle = "rgba(0,0,0,1)";
    }
}

function ES(n, cv){
    this.n = n;
    this.creature = new Creature(0, 0);
    console.log("Number of genes: "+this.creature.brain.getWeights().length);
    console.log("Width: "+this.creature.width);
    console.log("Height: "+this.creature.height);
    this.creatureHeight = this.creature.height;
    this.genes = this.creature.brain.getWeights();
    this.pop = [];
    this.lines = [new Line(-5000, 0, 5000, 0)];
    for(var i = -100; i < 1000; i += 10){
        this.lines.push(new Line(i, 10, i, 50));
    }
    this.time;
    this.cam = {x:0, y:0, zoom:2, width:cv.width, height:cv.height};
}

ES.prototype.initGen = function(){
    for(var i = 0; i < this.n; i++){
        this.pop[i] = {genes:[], fitness:0, creature:new Creature(0, -this.creatureHeight*2)};
        for(var j = 0; j < this.genes.length; j++){
            this.pop[i].genes[j] = this.genes[i]+Math.random()*.2-.1;
        }
        this.pop[i].creature.brain.setWeights(this.pop[i].genes);
    }
    this.time = 0;
    this.creature = new Creature(0, -this.creatureHeight*2, this.genes);
}

ES.prototype.simStep = function(dt){
    for(var i = 0; i < this.n; i++){
        this.pop[i].creature.update(dt, this.lines);
        /*if(this.pop[i].creature.points[0].y < -this.pop[i].fitness){
            this.pop[i].fitness = -this.pop[i].creature.points[0].y;
        }*/
        this.pop[i].fitness = this.pop[i].creature.points[0].x;
    }
    this.creature.update(dt, this.lines);
    this.time += dt;
}

ES.prototype.draw = function(ctx){
    this.cam.x += (this.creature.points[0].x-this.cam.x)*.1;
    /*for(var i = -10; i < 10; i++){
        ctx.fillRect((-this.cam.x-this.cam.width/2-100+i*10)*this.cam.zoom, 300, 1, 500);
    }*/
    ctx.clearRect(0, 0, this.cam.width, this.cam.height);
    this.creature.draw(ctx, this.cam);
    for(var i = 0; i < this.lines.length; i++){
        this.lines[i].draw(ctx, this.cam);
    }
    /*for(var i = 0; i < this.pop.length; i++){
        this.pop[i].creature.draw(ctx, this.cam);
    }*/
}

ES.prototype.endGen = function(){
    var m = 0;
    var max = this.pop[0].fitness;
    for(var i = 0; i < this.pop.length; i++){
        m += this.pop[i].fitness;
        if(this.pop[i].fitness > max){
            max = this.pop[i].fitness;
        }

    }
    m /= this.pop.length;
    console.log(m);
    for(var i = 0; i < this.genes.length; i++){
        var v = 0;
        for(var j = 0; j < this.pop.length; j++){
            v += 1*((this.pop[j].fitness)/max)*(this.pop[j].genes[i]-this.genes[i]);
            //console.log((this.pop[j].fitness)/max);
        }
        v /= this.pop.length;
        //console.log(v);
        this.genes[i] += v;
    }
}

function GA(n, cv){
    this.n = n;
    this.pop = [];
    c = new Creature(0, 0);
    this.creatureHeight = c.height;
    for(var i = 0; i < this.n; i++){
        this.pop[i] = {genes:[], creature:null, fitness:0};
        for(var j = 0; j < c.brain.getWeights().length; j++){
            this.pop[i].genes[j] = Math.random()*2-1;
        }
    }
    this.lines = [new Line(-5000, 0, 5000, 0)];
    /*for(var i = -100; i < 1000; i += 10){
        this.lines.push(new Line(i, 10, i, 50));
    }*/
    this.time;
    this.cam = {x:0, y:0, zoom:2, width:cv.width, height:cv.height};
    this.generation = 0;
}

GA.prototype.initGen = function(){
    this.generation++;
    for(var i = 0; i < this.n; i++){
        this.pop[i].creature = new Creature(0, -this.creatureHeight*2, this.pop[i].genes);
        this.pop[i].fitness = 0;
    }
    this.time = 0;
}

GA.prototype.simStep = function(dt){
    for(var i = 0; i < this.n; i++){
        this.pop[i].creature.update(dt, this.lines);
        this.pop[i].fitness = this.pop[i].creature.points[0].x;
        /*if(-this.pop[i].creature.points[0].y > this.pop[i].fitness){
            this.pop[i].fitness = -this.pop[i].creature.points[0].y;
        }*/
    }
    this.time += dt;
}

GA.prototype.draw = function(ctx){
    ctx.clearRect(0, 0, this.cam.width, this.cam.height);
    this.cam.x += (this.pop[0].creature.points[0].x-this.cam.x)*.1;
    var o = 10*Math.floor(this.cam.x/10);
    for(var i = -this.cam.width/2; i < this.cam.width/2; i+=10){
        ctx.fillRect(this.cam.width/2+(o+i-this.cam.x)*this.cam.zoom, this.cam.height/2+(10-this.cam.y)*this.cam.zoom, 1, 50);
    }
    this.pop[0].creature.draw(ctx, this.cam);
    for(var i = 0; i < this.lines.length; i++){
        this.lines[i].draw(ctx, this.cam);
    }
    for(var i = 0; i < this.pop.length; i++){
        this.pop[i].creature.draw(ctx, this.cam, true);
    }
}

GA.prototype.endGen = function(){
    this.pop.sort(function(a, b) {
        return b.fitness - a.fitness;
    });
    console.log("Gen "+this.generation+": "+this.pop[0].fitness);
    
    var newGenes = [];
    for(var i = 0; i < this.n*0.2; i++){
        var g1 = this.pop[i].genes;
        var g2 = this.pop[Math.floor(Math.random()*this.n)].genes;
        newGenes[i] = [];
        var p = Math.floor(Math.random()*g1.length);
        var s = Math.random > 0.5;
        for(var j = 0; j < g1.length; j++){
            if(j < p){
                if(s){
                    newGenes[i][j] = g1[j];
                } else {
                    newGenes[i][j] = g2[j];
                }
            } else {
                if(s){
                    newGenes[i][j] = g2[j];
                } else {
                    newGenes[i][j] = g1[j];
                }
            }
            if(Math.random() < 0.01){
                newGenes[i][j] += Math.random()*0.1-0.05;
            }
        }
    }
    for(var i = 0; i < newGenes.length; i++){
        this.pop[this.pop.length-1-i].genes = newGenes[i];
    }
}




window.onload = function(){
    var cv = document.getElementById("canvas");
    var ctx = cv.getContext("2d");
    cv.width = 500;
    cv.height = 500;

    var mousex = 250;
    var mousey = 50;
    function getMousePosition(canvas, event) { 
        let rect = canvas.getBoundingClientRect(); 
        mousex = event.clientX - rect.left; 
        mousey = event.clientY - rect.top; 
    } 
   
      
    cv.addEventListener("mousemove", function(e) 
    { 
        getMousePosition(cv, e); 
    });

    keylist = [];
    window.addEventListener('keydown',function(event){
        keylist[event.keyCode] = true;
        if([32, 37, 38, 39, 40].indexOf(event.keyCode) > -1) {
            event.preventDefault();
        }
    });
    window.addEventListener('keyup',function(event){
        keylist[event.keyCode] = false;
    });

    /*var lines = [new Line(-500, 0, 500, 0)];
  

    var c = new Creature(0, -20);
    var cam = {x:0, y:0, zoom:2, width:cv.width, height:cv.height};*/
    var ev = new GA(200, cv);
    ev.initGen();
    console.log(ev.pop);

    function loop(){
        if(ev.time > 20){
            ev.endGen();
            ev.initGen();
        }
        ev.simStep(1/60);
        ev.draw(ctx);
        /*c.update(1/60, lines);
        c.draw(ctx, cam);
        for(var i = 0; i < lines.length; i++){
            lines[i].draw(ctx, cam);
        }*/
    }

    window.setInterval(loop, 1000/60);

}