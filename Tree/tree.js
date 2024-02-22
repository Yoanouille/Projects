var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var radius = 2;
var numLeaves = 800;

var minDist = 3;
var maxDist = 40;

var minWidth = 3;
var maxWidth = 10;
var len = 3;

var tree;

function background() {
  ctx.fillStyle = "rgb(51,51,51)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function Vector(x, y) {
  if (x == undefined && y == undefined) {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
  } else {
    this.x = x;
    this.y = y;
  }
  this.dist = function (v) {
    return Math.sqrt(Math.pow(this.x - v.x, 2) + Math.pow(this.y - v.y, 2));
  };
  this.add = function (v) {
    this.x += v.x;
    this.y += v.y;
  };
  this.sub = function (v) {
    this.x -= v.x;
    this.y -= v.y;
  };
  this.mult = function (s) {
    this.x *= s;
    this.y *= s;
  };
  this.div = function (s) {
    this.x /= s;
    this.y /= s;
  };
  this.norme = function () {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  };
  this.normelize = function () {
    this.div(this.norme());
  };
}

function Leaf() {
  var x;
  var y;
  do {
    x = Math.random() * canvas.width;
    y = Math.random() * (canvas.height - 150);
  } while (
    Math.sqrt(
      Math.pow(x - canvas.width / 2, 2) + Math.pow(y - canvas.height / 2, 2)
    ) > 300
  );
  this.pos = new Vector(x, y);
  this.reached = false;
  this.show = function () {
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
  };
}

function Branch(pos, parent, dir) {
  this.pos = pos; // vecteur
  this.parent = parent;
  this.dir = dir; // vecteur
  this.nextDir = new Vector(dir.x, dir.y);
  this.count = 0;
  this.len = len;
  this.width = maxWidth;
  this.color = 0;
  this.next = function () {
    var nPos = new Vector(this.pos.x, this.pos.y);
    nPos.x += this.nextDir.x * this.len;
    nPos.y += this.nextDir.y * this.len;
    var branch = new Branch(
      nPos,
      this,
      new Vector(this.nextDir.x, this.nextDir.y)
    );
    if (this.width > minWidth) {
      branch.width = this.width * 0.99;
    } else {
      branch.width = this.width;
    }
    branch.color = this.color + 1;
    return branch;
  };
  this.show = function () {
    if (this.parent != null) {
      ctx.lineWidth = this.width;
      ctx.strokeStyle = "hsla(" + this.color + ",100%,50%)";
      ctx.beginPath();
      ctx.moveTo(this.parent.pos.x, this.parent.pos.y);
      ctx.lineTo(this.pos.x, this.pos.y);
      ctx.closePath();
      ctx.stroke();
    }
  };
}

function Tree() {
  this.leaves = [];
  this.branches = [];
  for (var i = 0; i < numLeaves; i++) {
    this.leaves.push(new Leaf());
  }

  this.show = function () {
    /*for(var i=0; i<this.leaves.length; i++){
            this.leaves[i].show();
        }*/
    for (var i = 0; i < this.branches.length; i++) {
      this.branches[i].show();
    }
  };

  this.start = function () {
    var root = new Branch(
      new Vector(canvas.width / 2, canvas.height),
      null,
      new Vector(0, -1)
    );
    //branches.push(root);

    var current = root;
    var found = false;
    while (!found) {
      this.branches.push(current);
      for (var i = 0; i < this.leaves.length; i++) {
        if (current.pos.dist(this.leaves[i].pos) < maxDist) {
          found = true;
        }
      }
      if (!found) {
        current = current.next();
      }
    }
  };

  this.grow = function () {
    for (var i = 0; i < this.leaves.length; i++) {
      //on cherche pour chaque feuille la branche la plus proche
      var closestB = null;
      var minRecord = 10000;
      for (var j = 0; j < this.branches.length; j++) {
        var d = this.leaves[i].pos.dist(this.branches[j].pos);
        //console.log(d);
        if (d < minDist) {
          this.leaves[i].reached = true;
          closestB = null;
          break;
        } else if (d < minRecord && d < maxDist) {
          minRecord = d;
          closestB = this.branches[j];
        }
      }
      //si la branche la plus proche existe
      if (closestB != null) {
        //on ajoute a la prochaine direction la direction de la feuille
        var v = new Vector(
          this.leaves[i].pos.x - closestB.pos.x,
          this.leaves[i].pos.y - closestB.pos.y
        );
        v.normelize();
        closestB.nextDir.add(v);
        closestB.count++;
      }
    }
    // on supprimme les feuilles qui ont une branche qui les atteigne
    for (var i = this.leaves.length - 1; i >= 0; i--) {
      if (this.leaves[i].reached) {
        this.leaves.splice(i, 1);
      }
    }

    //on cree les nouvelles branches
    for (var i = this.branches.length - 1; i >= 0; i--) {
      if (this.branches[i].count > 0) {
        //console.log("coucou");
        this.branches[i].nextDir.div(this.branches[i].count + 1);
        this.branches.push(this.branches[i].next());
        this.branches[i].count = 0;
        this.branches[i].nextDir = new Vector(
          this.branches[i].dir.x,
          this.branches[i].dir.y
        );
      }
    }
  };
}

function setup() {
  background();
  tree = new Tree();
  tree.start();
  var v = new Vector();
  tree.grow();
  ctx.strokeStyle = "red";
}
setup();

function draw() {
  background();

  tree.grow();
  tree.show();
  /* ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(canvas.width / 2 ,canvas.height / 2,300, 0, Math.PI * 2, true);
    ctx.closePath();
    //ctx.stroke();
    ctx.fill();*/
}

var intervalID = setInterval(draw, 1000 / 60);
