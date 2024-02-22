/**********************
    NEURAL NETWORK
***********************/

/*class NeuralNetwork {
    constructor(inputs, hidden, outputs) {
        this._inputs = inputs;
        this._hidden = hidden;
        this._outputs = outputs;
        this._weight0 = new Matrix(this._inputs, this._hidden);
        this._weight1 = new Matrix(this._hidden, this._outputs);
        this._weight0.randomWeight();
        this._weight1.randomWeight();
    }

    get inputs() {
        return this._inputs;
    }

    get hidden() {
        return this._hidden;
    }

    get outputs() {
        return this._outputs;
    }

    get weight0() {
        return this._weight0;
    }

    set weight0(value) {
        this._weight0 = value;
    }

    get weight1() {
        return this._weight1;
    }

    set weight1()

    copy() {
        nn = new NeuralNetwork(this.inputs, this.hidden, this.outputs);
        nn._weight0 = this._weight0.copy();
        nn._weight1 = this._weight1.copy();
        return nn;
    }

    feedForward(inputs) {
        var Inputs = Matrix.convertFromArray(inputs);

        var hidden = Matrix.dot(Inputs, this.weight0);
        hidden = Matrix.map(hidden, x => sigmoid(x));

        var outputs = Matrix.dot(hidden, this.weight1);
        outputs = Matrix.map(outputs, x => sigmoid(x));

        return outputs;
    }
}*/

function NeuralNetwork(inputs, hidden, outputs) {
    this.inputs = inputs;
    this.hidden = hidden;
    this.outputs = outputs;
    this.weight0 = new Matrix(inputs, hidden);
    this.weight1 = new Matrix(hidden, outputs);
    this.weight0.randomWeight();
    this.weight1.randomWeight();
    this.feedForward = function(inputsArray) {
        var Inputs = Matrix.convertFromArray(inputsArray);

        var hidden = Matrix.dot(Inputs, this.weight0);
        hidden = Matrix.map(hidden, x => sigmoid(x));

        var outputs = Matrix.dot(hidden, this.weight1);
        outputs = Matrix.map(outputs, x => sigmoid(x));

        return outputs;
    }
    
    this.copy = function() {
        var nn = new NeuralNetwork(this.inputs, this.hidden, this.outputs);
        nn.weight0 = this.weight0.copy();
        nn.weight1 = this.weight1.copy();
        return nn;
    }
    
    this.mutate = function(prob) {
        w0 = this.weight0.data;
        w1 = this.weight1.data;
        for(var i=0; i<w0.length; i++){
            for(var j=0; j<w0[i].length; j++){
                var r = Math.random();
                if(r < prob){
                    w0[i][j] += Math.random() * 0.2 - 0.1;
                }
            }
        }
        for(var i=0; i<w1.length; i++){
            for(var j=0; j<w1[i].length; j++){
                var r = Math.random();
                if(r < prob){
                    w1[i][j] = Math.random() * 0.2 - 0.1;
                }
            }
        }
    }
} 

function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
}


/**********************
    MATRIX FUNCTION
***********************/

class Matrix {
    constructor(rows, cols, data = []){
        this._rows = rows;
        this._cols = cols;
        this._data = data;
        // initialise 0
        if(data == null || data.length == 0){
            this._data = [];
            for(var i=0; i<this._rows; i++){
                this._data[i] = [];
                for(var j=0; j<this._cols; j++){
                    this._data[i][j] = 0;
                }
            }
        } else {
            if(data.length != this._rows || data[0].length != this._cols){
                throw new Error("Probleme data dimension");
            }
        }
    }

    get rows() {
        return this._rows;
    }

    get cols() {
        return this._cols;
    }

    get data() {
        return this._data;
    }

    set data(dat) {
        this._data = dat;
    }

    randomWeight() {
        for(var i=0; i<this.rows; i++){
            for(var j=0; j<this.cols; j++){
                this.data[i][j] = Math.random() * 2 - 1;
            }
        }
    }

    static check(m0, m1) {
        if(m0.rows != m1.rows && m0.cols != m1.cols){
            throw new Error("Les Deux matrices n'ont pas les meme dimensions");
        }
    }

    static checkDot(m0, m1) {
        if(m0.cols != m1.rows) {
            throw new Error("Incompatible par le produit");
        }
    }

    static add(m0, m1) {
        Matrix.check(m0, m1);
        m = new Matrix(m0.rows, m0.cols);
        for(var i=0; i<m0.rows; i++){
            for(var j=0; j<m0.cols; j++){
                m.data[i][j] = m0.data[i][j] + m1.data[i][j];
            }
        }
        return m;
    }

    static substract(m0, m1) {
        Matrix.check(m0, m1);
        m = new Matrix(m0.rows, m0.cols);
        for(var i=0; i<m0.rows; i++){
            for(var j=0; j<m0.cols; j++){
                m.data[i][j] = m0.data[i][j] - m1.data[i][j];
            }
        }
        return m;
    }

    static multiply(m0, m1) {
        Matrix.check(m0, m1);
        m = new Matrix(m0.rows, m0.cols);
        for(var i=0; i<m0.rows; i++){
            for(var j=0; j<m0.cols; j++){
                m.data[i][j] = m0.data[i][j] * m1.data[i][j];
            }
        }
        return m;
    }

    static dot(m0, m1) {
        Matrix.checkDot(m0, m1);
        var m = new Matrix(m0.rows, m1.cols);
        for(var i=0; i<m0.rows; i++){
            for(var j=0; j<m1.cols; j++){
                var sum = 0;
                for(var k=0; k<m0.cols; k++){
                    sum += m0.data[i][k] * m1.data[k][j];
                }
                m.data[i][j] = sum;
            }
        }
        return m;
    }

    static convertFromArray(arr){
        return new Matrix(1, arr.length, [arr]);
    }

    static map(m0, maFunction) {
        var m = new Matrix(m0.rows, m0.cols);
        for(var i=0; i<m.rows; i++){
            for(var j=0; j<m.cols; j++){
                m.data[i][j] = maFunction(m0.data[i][j]);
            }
        }
        return m;
    }

    static transpose(m0) {
        m = new Matrix(m0.cols, m0.rows);
        for(var i=0; i<m.rows; i++){
            for(var j=0; j<m.cols; j++){
                m.data[i][j] = m0.data[j][i];
            }
        }
        return m;
    }

    copy() {
        var m = new Matrix(this.rows, this.cols);
        for(var i=0; i<this.rows; i++){
            for(var j=0; j<this.cols; j++){
                m._data[i][j] = this._data[i][j];
            }
        }

        return m;
    }
}