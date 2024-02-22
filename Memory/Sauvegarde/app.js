let cards = document.querySelectorAll(".card");

let board = document.querySelector(".board");
let fin_div = document.querySelector(".fin");
let recommencer = document.querySelector(".bouton");
let score_span = document.getElementById("score");

let width = 6;
let height = 4;
let opacity = 1;
let intervalID;

let score;

let hasFlipped = false;
let firstCard, secondCard;
let lock = false;

let time;

recommencer.addEventListener("click", restart);

function restart() {
    hasFlipped = false;
    firstCard = null;
    secondCard = null;
    for(let i = 0; i < cards.length; i++) {
        cards[i].classList.remove(cards[i].classList[1]);
    }
    start();
    begin();
}

function begin() {
    opacity = 1;
    intervalID = setInterval(disF, 1000 / 60);
    setTimeout(debut1, 1000);
}

function disF() {
    opacity--;
    fin_div.style.opacity = opacity;
}

function appB() {
    opacity++;
    board.style.opacity = opacity;
}

function debut1() {
    clearInterval(intervalID);
    fin_div.style.opacity = 0;
    opacity = 0;
    board.classList.remove("disp");
    fin_div.classList.add("disp");
    intervalID = setInterval(appB, 1000 / 60);
    setTimeout(debut2, 1000);
}

function debut2() {
    board.style.opacity = 1;
    opacity = 1;
    clearInterval(intervalID);
}



function end() {
    opacity = 1;
    intervalID = setInterval(disB, 1000 / 60);
    setTimeout(fin1, 1000);
}

function disB() {
    opacity --;
    board.style.opacity = opacity;
}

function appF() {
    opacity ++;
    fin_div.style.opacity = opacity;
}

function fin1() {
    clearInterval(intervalID);
    board.style.opacity = 0;
    opacity = 0;
    board.classList.add("disp");
    fin_div.classList.remove("disp");
    intervalID = setInterval(appF, 1000 / 60);
    setTimeout(fin2, 1000);
}

function fin2() {
    fin_div.style.opacity = 1;
    opacity = 1;
    clearInterval(intervalID);
}

function flip() {
    if(this == firstCard || lock) return;
    this.classList.toggle("hidden");
    if(time == null) {
        time = new Date().getTime();
    }
    if(!hasFlipped) {
        firstCard = this;
        hasFlipped = true;
    }else {
        secondCard = this;
        if(secondCard.classList[1] == firstCard.classList[1]) {
            firstCard.removeEventListener("click", flip);
            secondCard.removeEventListener("click", flip);
            firstCard = null;
            secondCard = null;
            hasFlipped = false;
            score += 2;
            if(score == width * height){
                let timeFin = new Date().getTime();
                time = timeFin - time;
                setTimeout(end,1000);
                let min = Math.floor(time / 60000);
                time -= min * 60000;
                let sec = Math.floor(time / 1000);
                if(min != 0) {
                    score = min + "min";
                }else{
                    score = "";
                }
                score += " " + sec + "s";
                time = null;
                score_span.innerHTML = score;
            }
        }else {
            lock = true;
            setTimeout(function() {
                firstCard.classList.toggle("hidden");
                secondCard.classList.toggle("hidden");
                firstCard = null;
                secondCard = null;
                hasFlipped = false;
                lock = false;
            }, 1000);
        }
    }
}

function start() {
    let color = ["red","blue","purple","green","yellow","cyan","brown","orange","greenOrange","greenBlue","indigo","pink"];
    let colot = [2,2,2,2,2,2,2,2,2,2,2,2];
    score = 0;
    for(let i = 0; i < width; i++) {
        for(let j = 0; j < height; j++) {
            var index = i + j * width;
            var rand = Math.floor(Math.random() * color.length);
            cards[index].classList.add(color[rand]);
            colot[rand]--;
            if(colot[rand] == 0) {
                color.splice(rand,1);
                colot.splice(rand,1);
            }
            cards[index].classList.add("hidden");
            cards[index].addEventListener("click", flip)
        }
    }
}
start();




