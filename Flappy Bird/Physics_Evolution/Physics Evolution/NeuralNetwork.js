
/*
function matmul(a,b){
	if(a[0].length == b.length){
		var c = [];
		for(var i=0;i < a.length;i++){
			c[i] = [];
			for(var j=0;j < b[0].length;j++){
				c[i][j] = 0;
				for(k=0;k < b.length;k++){
					c[i][j] += a[i][k]*b[k][j];
				}
			}
		}
		return c;
	} else  {
		return 'error';
	}
}*/
function softmax(arr){
    return arr.map(function(value,index) { 
      return Math.exp(value) / arr.map( function(y /*value*/){ return Math.exp(y) } ).reduce( function(a,b){ return a+b })
    })
}

function sigmoid(x){
	return 1/(1+Math.exp(-x));
}

function dsigmoid(s){
	return s*(1-s);
}

function dtanh(x){
	return 1-Math.pow(Math.tanh(x),2);
}

function relu(x){
	if(x > 0){
		return x;
	} else {
		return 0;
	}
}

function drelu(x){
	if(x > 0){
		return 1;
	} else {
		return 0;
	}
}

function linear(x){
	return x;
}

function dlinear(x){
	return 1;
}

function mse(x,y){
	var tmp = y-x;
	return tmp*tmp;
}

function NeuralNetwork(){
	this.layers = [];
	this.weights = [];
	this.results;
	this.alpha = 0.01;
	this.error = 0;
	this.globalError = 0;
	this.addLayer = function(layer){
		if(layer.activation == sigmoid){
			layer.derivative = dsigmoid;
		}
		if(layer.activation == Math.tanh){
			layer.derivative = dtanh;
		}
		if(layer.activation == relu){
			layer.derivative = drelu;
		}
		if(layer.activation == linear){
			layer.derivative = dlinear;
		}
		this.layers.push(layer);
	}
	this.initWeights = function(range){
		if(range == undefined){
			range = [-1,1];
		}
		for(var i=1;i < this.layers.length;i++){
			this.weights[i] = [];
			for(var j=0;j < this.layers[i].n;j++){
				this.weights[i][j] = [];
				for(var k=0;k < this.layers[i-1].n+1;k++){
					this.weights[i][j][k] = range[0]+Math.random()*(range[1]-range[0]);
				}
			}
		}
	}
	this.getWeights = function(){
		var arr = [];
		for(var i=1;i < this.layers.length;i++){
			for(var j=0;j < this.layers[i].n;j++){
				for(var k=0;k < this.layers[i-1].n+1;k++){
					arr.push(this.weights[i][j][k]);
				}
			}
		}
		return arr;
	}
	this.setWeights = function(arr){
		var a = 0;
		for(var i=1;i < this.layers.length;i++){
			for(var j=0;j < this.layers[i].n;j++){
				for(var k=0;k < this.layers[i-1].n+1;k++){
					this.weights[i][j][k] = arr[a];
					a++;
				}
			}
		}
	}
	/*this.mutate = function(l){
		var a = Math.round(Math.random()*(this.weights.length-2))+1;
		var b = Math.round(Math.random()*(this.weights[a].length-1));
		var c = Math.round(Math.random()*(this.weights[a][b].length-1));
		this.weights[a][b][c] += (Math.random()-0.5)*2*l;
	}
	this.crossover = function(){
		
	}*/
	this.feedForward = function(inputs){
		this.results = [[]];
		for(var i=0;i < inputs.length;i++){
			this.results[0][i] = inputs[i];
		}
		for(var i=1;i < this.layers.length;i++){
			this.results[i-1].push(1);
			this.results[i] = [];
			for(var j=0;j < this.layers[i].n;j++){
				this.results[i][j] = 0;
				for(var k=0;k < this.layers[i-1].n;k++){
					this.results[i][j] += this.weights[i][j][k]*this.results[i-1][k];
				}
				if(this.layers[i].activation != softmax){
					this.results[i][j] = this.layers[i].activation(this.results[i][j]);
				}
			}
			if(this.layers[i].activation == softmax){
				this.results[i] = softmax(this.results);
			}
		}
		return this.results[this.results.length-1];
	}
	
	this.backpropagate = function(inputs,outputs){
		this.error = 0;
		var out = this.feedForward(inputs);
		var deltas = [];
		for(var i=this.layers.length-1;i >= 1;i--){
			deltas[i] = [];
			for(var j=0;j < this.layers[i].n;j++){
				deltas[i][j] = 0;
				if(i == this.layers.length-1){
					var e = outputs[j]-out[j];
					this.error += Math.abs(e)/out.length;
					deltas[i][j] = e;//Math.pow(outputs[j]-out[j],2)*Math.sign(outputs[j]-out[j]);
				} else {
					deltas[i][j] = this.layers[i].derivative(this.results[i][j]);
					var s = 0
					for(var k=0;k<this.layers[i+1].n;k++){
						s += this.weights[i+1][k][j]*deltas[i+1][k];
					}
					deltas[i][j] *= s;
				}
			}
		}
		var gradient = [];
		for(var i=1;i < this.weights.length;i++){
			gradient[i] = [];
			for(var j=0;j < this.weights[i].length;j++){
				gradient[i][j] = [];
				for(var k=0;k < this.weights[i][j].length;k++){
					gradient[i][j][k] = this.alpha*deltas[i][j]*this.results[i-1][k];
				}
			}
		}
		return gradient;
	}
	this.addGradient = function(grad){
		for(var i=1;i < this.weights.length;i++){
			for(var j=0;j < this.weights[i].length;j++){
				for(var k=0;k < this.weights[i][j].length;k++){
					this.weights[i][j][k] += grad[i][j][k];
				}
			}
		}
	}
	this.trainBatch = function(inputs,outputs){
		var gradient = [];
		for(var i=1;i < this.weights.length;i++){
			gradient[i] = [];
			for(var j=0;j < this.weights[i].length;j++){
				gradient[i][j] = [];
				for(var k=0;k < this.weights[i][j].length;k++){
					gradient[i][j][k] = 0;
				}
			}
		}
		this.globalError = 0;
		for(var i=0;i < inputs.length;i++){
			var grad = this.backpropagate(inputs[i],outputs[i]);
			this.globalError += this.error/inputs.length;
			for(var ii=1;ii < this.weights.length;ii++){
				for(var j=0;j < this.weights[ii].length;j++){
					for(var k=0;k < this.weights[ii][j].length;k++){
						gradient[ii][j][k] += grad[ii][j][k];
					}
				}
			}
		}
		this.addGradient(gradient);
	}
	this.trainMiniBatch = function(inp,out,n){
		var inputs = [];
		var outputs = [];
		var indexes = [];
		if(n < inp.length){
			n = inp.length;
		}
		for(var i=0;i < n;i++){
			do{
				var a = Math.round(Math.random()*(inp.length-1));
				var b = false
				for(var j=0;j < indexes.length;j++){
					if(a == indexes[j]){
						b = true;
					}
				}
			}while(b);
			indexes.push(a);
			inputs.push(inp[a]);
			outputs.push(out[a]);
		}
		var gradient = [];
		for(var i=1;i < this.weights.length;i++){
			gradient[i] = [];
			for(var j=0;j < this.weights[i].length;j++){
				gradient[i][j] = [];
				for(var k=0;k < this.weights[i][j].length;k++){
					gradient[i][j][k] = 0;
				}
			}
		}
		this.globalError = 0;
		for(var i=0;i < inputs.length;i++){
			var grad = this.backpropagate(inputs[i],outputs[i]);
			this.globalError += this.error/inputs.length;
			for(var ii=1;ii < this.weights.length;ii++){
				for(var j=0;j < this.weights[ii].length;j++){
					for(var k=0;k < this.weights[ii][j].length;k++){
						gradient[ii][j][k] += grad[ii][j][k];
					}
				}
			}
		}
		this.addGradient(gradient);
	}
	this.clone = function(){
		var clone = new NeuralNetwork();
		clone.alpha = this.alpha;
		clone.addLayer({n:this.layers[0].n});
		for(var i=1;i < this.layers.length;i++){
			clone.addLayer({n:this.layers[i].n,activation:this.layers[i].activation});
		}
		clone.initWeights();
		for(var i=1;i < this.weights.length;i++){
			for(var j=0;j < this.weights[i].length;j++){
				for(var k=0;k < this.weights[i][j].length;k++){
					clone.weights[i][j][k] = this.weights[i][j][k];
				}
			}
		}
		return clone;
	}
}