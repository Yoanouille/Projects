let scoreJoueur = 0
let scoreComp = 0

let scoreJoueur_span = document.getElementById("score-joueur");
let scoreComp_span = document.getElementById("score-ordi");
//let scoreBoard_div = document.querySelector(".scoreBoard");
let resultat_div = document.querySelector(".result");
let pierre_div = document.getElementById("pierre");
let feuille_div = document.getElementById("feuille");
let ciseaux_div = document.getElementById("ciseaux");

let smallJ = "vous".fontsize(3).sub();
let smallC = "ordi".fontsize(3).sub();

function playComp() {
    let tab = ["p","f","c"];
    let r = Math.floor(Math.random() * 3);
    return tab[r];
}

function convert(e) {
    switch(e) {
        case "p": return "a pierre";
        case "f": return "a feuille";
        case "c": return "es ciseaux";
    }
}

function convert2 (e) {
    switch(e) {
        case "p": return "pierre";
        case "f": return "feuille";
        case "c": return "ciseaux";
    }
}

function win(u,c) {
    scoreJoueur++;
    scoreJoueur_span.innerHTML = scoreJoueur;
    let res = "L" + convert(u) + smallJ +" bat l" + convert(c) + smallC +". Vous gagnez!";
    resultat_div.innerHTML = res;
    document.getElementById(convert2(u)).classList.add("green");
    setTimeout(function() {
        document.getElementById(convert2(u)).classList.remove("green");
    }, 300);
}

function lose(u,c) {
    scoreComp++;
    scoreComp_span.innerHTML = scoreComp;
    let res = "L" + convert(u) + smallJ + " est battu par l" + convert(c) + smallC +". Vous perdez!";
    resultat_div.innerHTML = res;
    document.getElementById(convert2(u)).classList.add("red");
    setTimeout(function() {
        document.getElementById(convert2(u)).classList.remove("red");
    }, 300);
}

function equality(u) {
    let res = "Vous avez tous les deux joué l" + convert(u) + ". Match Nul!";
    resultat_div.innerHTML = res;
    document.getElementById(convert2(u)).classList.add("gray");
    setTimeout(function() {
        document.getElementById(convert2(u)).classList.remove("gray");
    }, 300);
}


function game(u) {
    let c = playComp();
    switch(u + c){
        case "pc":
        case "fp":
        case "cf":
            win(u,c);
            break;
        
        case "pf":
        case "fc":
        case "cp":
            lose(u,c);
            break;

        default: equality(u);
    }
}

function main() {
    pierre_div.addEventListener("click", function() {
        game("p");
    });
    
    feuille_div.addEventListener("click", function() {
        game("f");
    });
    
    ciseaux_div.addEventListener("click", function() {
        game("c");
    });
}
main();
