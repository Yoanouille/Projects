let cards = document.querySelectorAll(".memory-card");
let hasFlipped = false;
let first,second;
function flip() {
    this.classList.toggle("flip");
}

cards.forEach(card => card.addEventListener("click", flip));