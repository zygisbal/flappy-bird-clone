let bird;
let pipes = [];
let score = 0;
let gameOver = false;

function setup() {
    createCanvas(400, 600);
    bird = new Bird();
    pipes.push(new Pipe());
}

function draw() {
    background(135, 206, 235);

    if (!gameOver) {
        bird.update();
        bird.show();

        if (frameCount % 100 == 0) {
            pipes.push(new Pipe());
        }

        for (let i = pipes.length - 1; i >= 0; i--) {
            pipes[i].show();
            pipes[i].update();

            if (pipes[i].hits(bird)) {
                gameOver = true;
            }

            if (!pipes[i].passed && pipes[i].x < bird.x) {
                score++;
                pipes[i].passed = true;
            }

            if (pipes[i].offscreen()) {
                pipes.splice(i, 1);
            }
        }

        fill(0);
        textSize(32);
        text(`Score: ${score}`, 10, 40);
    } else {
        fill(0);
        textSize(32);
        text("Game Over!", width / 2 - 80, height / 2);
        text(`Score: ${score}`, width / 2 - 60, height / 2 + 40);
    }
}

function touchStarted() {
    bird.up();
    if (gameOver) {
        bird = new Bird();
        pipes = [];
        pipes.push(new Pipe());
        score = 0;
        gameOver = false;
    }
    return false;
}

class Bird {
    constructor() {
        this.y = height / 2;
        this.x = 50;
        this.gravity = 0.6;
        this.lift = -15;
        this.velocity = 0;
    }

    show() {
        fill(255, 200, 0);
        ellipse(this.x, this.y, 30, 30);
    }

    up() {
        this.velocity += this.lift;
    }

    update() {
        this.velocity += this.gravity;
        this.y += this.velocity;

        if (this.y > height) {
            this.y = height;
            this.velocity = 0;
        }

        if (this.y < 0) {
            this.y = 0;
            this.velocity = 0;
        }
    }
}

class Pipe {
    constructor() {
        this.top = random(height / 6, 3 / 4 * height);
        this.bottom = height - (this.top + 150);
        this.x = width;
        this.w = 40;
        this.speed = 3;
        this.passed = false;
    }

    show() {
        fill(34, 139, 34);
        rect(this.x, 0, this.w, this.top);
        rect(this.x, height - this.bottom, this.w, this.bottom);
    }

    update() {
        this.x -= this.speed;
    }

    offscreen() {
        return this.x < -this.w;
    }

    hits(bird) {
        if (bird.y < this.top || bird.y > height - this.bottom) {
            if (bird.x > this.x && bird.x < this.x + this.w) {
                return true;
            }
        }
        return false;
    }
}