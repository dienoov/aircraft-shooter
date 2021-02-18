const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const GAME_OVER = true;
const LOCAL_HIGH_SCORE = "highscore";

canvas.height = 700;
canvas.width = 600;

const jet = {
    x: (canvas.width - 50) / 2,
    y: canvas.height - 100,
    height: 75,
    width: 50,
    speed: 7.5,
    draw: function () {
        ctx.drawImage(document.getElementById("jet"), this.x, this.y, this.width, this.height);
    },
};

function Airplane(imageId, point, gameOver = false) {
    this.x = 50 + Math.floor(Math.random() * (canvas.width - 100));
    this.y = -10;
    this.height = 100;
    this.width = 100;
    this.point = point;
    this.gameOver = gameOver;
    this.draw = function () {
        ctx.drawImage(document.getElementById(imageId), this.x, this.y, this.width, this.height);
    };
}

const airplanes = [
    new Airplane("garuda", 5),
    new Airplane("lion", 2),
    new Airplane("batik", 1),
    new Airplane("bomb", 0, GAME_OVER),
];

let airplane = airplanes[Math.floor(Math.random() * 3)];

const scoreBoard = {
    x: 25,
    y: 25,
    score: 0,
    draw: function () {
        ctx.beginPath();
        ctx.font = "30px Trebuchet MS";
        ctx.fillStyle = "white";
        ctx.fillText(this.score, this.x, this.y);
        ctx.closePath();
    },
    highscore: {
        x: 350,
        y: 25,
        draw: function () {
            ctx.beginPath();
            ctx.font = "30px Trebuchet MS";
            ctx.fillStyle = "white";
            ctx.fillText("High Score : " + localStorage.getItem(LOCAL_HIGH_SCORE), this.x, this.y);
            ctx.closePath();
        },
    },
};

const pressed = {
    left: false,
    right: false,
    space: false
};

document.addEventListener("keydown", ev => {
    switch (ev.code) {
        case "ArrowLeft":
            return pressed.left = true;
        case "ArrowRight":
            return pressed.right = true;
        case "Space":
            return pressed.space = true;
    }
});

document.addEventListener("keyup", ev => {
    switch (ev.code) {
        case "ArrowLeft":
            return pressed.left = false;
        case "ArrowRight":
            return pressed.right = false;
        case "Space":
            return pressed.space = false;
    }
});

const move = () => {
    if (pressed.left && jet.x > 0)
        jet.x -= jet.speed;
    if (pressed.right && jet.x + jet.width < canvas.width)
        jet.x += jet.speed;
};

const projectile = {
    x: jet.x + 22,
    y: -10,
    height: 50,
    width: 6,
    speed: jet.speed * 3,
    draw: function () {
        ctx.beginPath();
        ctx.fillStyle = "red";
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fill();
        ctx.closePath();
    },
};

const shoot = () => {
    projectile.y -= projectile.speed;
    if (pressed.space && projectile.y < 0) {
        projectile.x = jet.x + 22;
        projectile.y = jet.y - 50;
    }
};

const generate = () => {
    airplane.y += scoreBoard.score / 10 + 5;
    airplane.draw();
    if (airplane.y > canvas.height) {
        airplane = airplanes[Math.floor(Math.random() * 4)];
        airplane.x = 50 + Math.floor(Math.random() * (canvas.width - 100));
        airplane.y = -100;
    }
    if (projectile.y <= airplane.y + airplane.width && projectile.x > airplane.x && projectile.x < airplane.x + airplane.width && projectile.y > 0) {
        if (airplane.gameOver)
            gameOver();
        scoreBoard.score += airplane.point;
        airplane = airplanes[Math.floor(Math.random() * 4)];
        airplane.x = 50 + Math.floor(Math.random() * (canvas.width - 100));
        airplane.y = -100;
        projectile.y = -500;
        pressed.space = false;
    }
    if(jet.x > airplane.x && jet.x < airplane.x+airplane.width && jet.y < airplane.y + airplane.height)
        gameOver();
};

const gameOver = () => {
    location.reload();
    alert(`Your Score : ${scoreBoard.score}`);
    if (scoreBoard.score > localStorage.getItem(LOCAL_HIGH_SCORE))
        localStorage.setItem(LOCAL_HIGH_SCORE, scoreBoard.score);
}

const play = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    generate();

    jet.draw();
    projectile.draw();
    move();
    shoot();

    scoreBoard.draw();
    scoreBoard.highscore.draw();

    requestAnimationFrame(play);
};

if (!localStorage.getItem(LOCAL_HIGH_SCORE))
    localStorage.setItem(LOCAL_HIGH_SCORE, 0);

play();