class Bird{
    constructor() {
        this.y = canvas.height / 2;
        this.x = 50;
        this.r = 10;
        this.show = function() {
            ctx.beginPath();
            ctx.fillStyle = "white";
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
        }
        this.gravity = 200;
        this.velocity = 0;
        this.lift = 10000;
    }

    static update(bir) {
        bir.velocity += bir.gravity / FPS;
        bir.y += bir.velocity / FPS;
    }

    static up(bir) {
        bir.velocity -= bir.lift / FPS;
    }
}
