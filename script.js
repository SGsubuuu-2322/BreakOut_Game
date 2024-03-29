const rules = document.getElementById("rules");
const rulesBtn = document.getElementById("rules-btn");
const closeBtn = document.getElementById("close-btn");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let score = 0;
const brickRowCount = 5;
const brickColumnCount = 9;

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 10,
  speed: 2,
  dx: 2,
  dy: -2,
};

const paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 10,
  w: 80,
  h: 10,
  speed: 8,
  dx: 0,
};

const brickInfo = {
  w: 70,
  h: 20,
  padding: 10,
  offsetX: 45,
  offsetY: 60,
  visible: true,
};

const bricks = [];

for (let i = 0; i < brickColumnCount; i++) {
  bricks[i] = [];
  for (let j = 0; j < brickRowCount; j++) {
    const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
    const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;

    bricks[i][j] = { x, y, ...brickInfo };
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  ctx.fillStyle = "#0095dd";
  ctx.fill();
  ctx.closePath();
}
function drawpaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.fillStyle = "#0095dd";
  ctx.fill();
  ctx.closePath();
}

function drawScore() {
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
}

function drawBricks() {
  bricks.forEach((column) => {
    column.forEach((brick) => {
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.w, brick.h);
      ctx.fillStyle = brick.visible ? "#0095dd" : "transparent";
      ctx.fill();
      ctx.closePath();
    });
  });
}

function movePaddle() {
  paddle.x += paddle.dx;

  if (paddle.x + paddle.w > canvas.width) {
    paddle.x = canvas.width - paddle.w;
  } else if (paddle.x < 0) {
    paddle.x = 0;
  }
}

function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
    ball.dx *= -1;
  }
  if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
    ball.dy *= -1;
  }

  if (
    ball.x - ball.size > paddle.x &&
    ball.x + ball.size < paddle.x + paddle.w &&
    ball.y + ball.size > paddle.y
  ) {
    ball.dy = -ball.speed;
  }

  bricks.forEach((column) => {
    column.forEach((brick) => {
      if (brick.visible) {
        if (
          ball.x - ball.size > brick.x && // left brick side check
          ball.x + ball.size < brick.x + brick.w && // right brick side check
          ball.y + ball.size > brick.y && // top brick side check
          ball.y - ball.size < brick.y + brick.h // bottom brick side check
        ) {
          ball.dy *= -1;
          brick.visible = false;

          increaseScore();
        }
      }
    });
  });

  if (ball.y + ball.size > canvas.height) {
    showAllBricks();
    score = 0;
  }
}

function increaseScore() {
  score++;

  if (score % (brickRowCount * brickColumnCount) === 0) {
    ball.visible = false;
    paddle.visible = false;

    //After 0.5 sec restart the game
    setTimeout(function () {
      showAllBricks();
      score = 0;
      paddle.x = canvas.width / 2 - 40;
      paddle.y = canvas.height - 20;
      ball.x = canvas.width / 2;
      ball.y = canvas.height / 2;
      ball.visible = true;
      paddle.visible = true;
    }, delay);
  }
}

function showAllBricks() {
  bricks.forEach((column) => {
    column.forEach((brick) => (brick.visible = true));
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawpaddle();
  drawScore();
  drawBricks();
}

function update() {
  movePaddle();
  moveBall();

  draw();
  requestAnimationFrame(update);
}

update();

function keyDown(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    paddle.dx = paddle.speed;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    paddle.dx = -paddle.speed;
  }
}

function keyUp(e) {
  if (
    e.key === "Right" ||
    e.key === "ArrowRight" ||
    e.key === "Left" ||
    e.key === "ArrowLeft"
  ) {
    paddle.dx = 0;
  }
}

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

rulesBtn.addEventListener("click", () => {
  rules.classList.add("show");
});

closeBtn.addEventListener("click", () => {
  rules.classList.remove("show");
});
