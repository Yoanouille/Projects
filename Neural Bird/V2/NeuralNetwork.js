/*********************
 * FONCTIONS MATRICE *
 *********************/


function matmul(m1,m2) {
    if(m1[0].length != m2.length) {
        console.log("PROBLEME DIMENSION PRODUIT !!!");
        return null;
    }
    let m = [];
    for(let i = 0; i < m1.length; i++) {
        m[i] = [];
        for(let j = 0; j < m2[0].length; j++) {
            let sum = 0;
            for(let k = 0; k < m1[0].length; k++) {
                sum += m1[i][k] * m2[k][j];
            }
            m[i][j] = sum;
        }
    }
    return m;
}

function add(m1,m2) {
    if(m1.length != m2.length || m1[0].length != m2[0].length) {
        console.log("PROBLEME DIMENSION ADD");
        return null;
    }
    let m = [];
    for(let i = 0; i < m1.length; i++) {
        m[i] = [];
        for(let j = 0; j < m1[i].length; j++) {
            m[i][j] = m1[i][j] + m2[i][j];
        }
    }
    return m;
}

function transpose(m1) {
    let m2 = [];
    for(let i = 0; i < m1.length; i++) {
        for(let j = 0; j < m1[0].length; j++) {
            if(i == 0) {
                m2[j] = [];
            } 
            m2[j][i] = m1[i][j];
        }
    }
    return m2
}

function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
}

function newWeight(l,c) {
    let w = [];
    for(let i = 0; i < l; i++) {
        w[i] = [];
        for(let j = 0; j < c; j++) {
            w[i][j] = random(-1,1);
        }
    }
    return w;
}

Array.prototype.copy = function() {
    let t = [];
    for(let i = 0; i < this.length; i++) {
        t[i] = [];
        for(let j = 0; j < this[i].length; j++) {
            t[i][j] = this[i][j];
        }
    }
    return t;
}

Array.prototype.map = function(fonction) {
    for(let i = 0; i < this.length; i++) {
        for(let j = 0; j < this[i].length; j++) {
            this[i][j] = fonction(this[i][j]);
        }
    }
}

function random(a,b) {
    return Math.random() * (b - a) + a;
}

/******************
 * NEURAL NETWORK *
 ******************/

function NeuralNetwork(input, hidden, output) {
    this.weight0 = newWeight(input,hidden);
    this.weight1 = newWeight(hidden,output);
    this.bias0 = newWeight(1,hidden);
    this.bias1 = newWeight(1, output);

    this.feedForward = function(inputs) {
        inputs = [inputs];
        let hiddens = matmul(inputs,this.weight0);
        //console.log(this.weight0);
        hiddens = add(hiddens, this.bias0);
        hiddens.map(x => sigmoid(x));

        let outputs = matmul(hiddens, this.weight1);
        outputs = add(outputs, this.bias1);
        outputs.map(x => sigmoid(x));

        return outputs;
    }

    this.mutate = function(rate) {
        for(let i = 0; i < this.weight0.length; i++) {
            for(let j = 0; j < this.weight0[i].length; j++) {
                let r = random(0,1);
                if(r < rate) {
                    //r = random(-0.1,0.1);
                    r = random(-1,1);
                    this.weight0[i][j] += r;
                }
            }
        }

        for(let i = 0; i < this.weight1.length; i++) {
            for(let j = 0; j < this.weight1[i].length; j++) {
                let r = random(0,1);
                if(r < rate) {
                   // r = random(-0.1,0.1);
                    r = random(-1,1);
                    this.weight1[i][j] += r;
                }
            }
        }

        for(let i = 0; i < this.bias0.length; i++) {
            for(let j = 0; j < this.bias0[i].length; j++) {
                let r = random(0,1);
                if(r < rate) {
                   // r = random(-0.1,0.1);
                    r = random(-1,1);
                    this.bias0[i][j] += r;
                }
            }
        }

        for(let i = 0; i < this.bias1.length; i++) {
            for(let j = 0; j < this.bias1[i].length; j++) {
                let r = random(0,1);
                if(r < rate) {
                   // r = random(-0.1,0.1);
                    r = random(-1,1);
                    this.bias1[i][j] += r;
                }
            }
        }
        
    }

    this.copy = function() {
        let nn = new NeuralNetwork(0,0,0);
        nn.weight0 = this.weight0.copy();
        nn.weight1 = this.weight1.copy();
        nn.bias0 = this.bias0.copy();
        nn.bias1 = this.bias1.copy();
        return nn;
    }
}



