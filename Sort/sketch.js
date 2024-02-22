const canvas = document.getElementById("cvs");
const ctx = canvas.getContext("2d");

const width = 600;
const height = 600;

canvas.width = width;
canvas.height = height;

let intervalID;

const NUM = 30;
let data = [];
const w = width / NUM;

function setup() {
    intervalID = setInterval(draw, 1000 / 60);
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,width,height);

    for(let i = 0; i < NUM; i++) {
        data.push(Math.random() * height);
    }

    sort(data, 0, data.length - 1);
}
setup();

function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,width,height);

    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    for(let i = 0; i < data.length; i++) {
        ctx.fillRect(i * w, height - data[i], w, data[i]);
        ctx.strokeRect(i * w, height - data[i], w, data[i]);
    }

}

function sort(arr, start, end) {
    if(start >= end) return;

    let index = partition(arr, start, end);

    sort(arr, start, index - 1);
    sort(arr, index + 1, end);
}

function partition(arr, start, end) {
    let pivot = arr[end];
    let pivotIndex = start;

    for(let i = start; i < end; i++) {
        if(arr[i] < pivot) {
            swap(arr, i, pivotIndex);
            pivotIndex++;
        }
    }

    swap(arr, end, pivotIndex);
    return pivotIndex;
}

function swap(arr, i, j) {
    //await sleep(10);
    let tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
} 

function sleep(time) {
    return new Promise(resolve => setTimeout(time, resolve));
}