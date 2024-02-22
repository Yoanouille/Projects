/**********************
    NEURAL NETWORK
***********************/

class NeuralNetwork {
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

    get weight1() {
        return this._weight1;
    }

    feedForward(inputs) {
        var Inputs = Matrix.convertFromArray(inputs);

        var hidden = Matrix.dot(Inputs, this.weight0);
        hidden = Matrix.map(hidden, x => sigmoid(x));

        var outputs = Matrix.dot(hidden, this.weight1);
        outputs = Matrix.map(outputs, x => sigmoid(x));
        console.table(outputs.data);

        return outputs;
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
}