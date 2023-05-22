// 定义游戏区域大小
const canvas = document.getElementById("gameCanvas");
const canvasSize = { width: canvas.width, height: canvas.height };

// 定义蛇和食物的大小
const blockSize = 20;

// 计算游戏区域可以容纳多少个方块
const widthInBlocks = canvasSize.width / blockSize;
const heightInBlocks = canvasSize.height / blockSize;

// 定义游戏的状态
let score = 0;
let snake = [];
let direction = "right";
let food = null;


// 绘制得分
function drawScore(ctx) {
  ctx.font = "20px Arial";
  ctx.fillStyle = "black";
  ctx.textAlign = "left";
  ctx.fillText("Score: " + score, blockSize, blockSize);
}

// 检查蛇是否碰到了边界或自身
function checkCollision() {
  const head = snake[0];
  const body = snake.slice(1);

  const snakeX = head[0];
  const snakeY = head[1];

  const hitLeftWall = snakeX < 0;
  const hitRightWall = snakeX >= widthInBlocks;
  const hitTopWall = snakeY < 0;
  const hitBottomWall = snakeY >= heightInBlocks;

  const hitSelf = body.some(([x, y]) => x === snakeX && y === snakeY);

  return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall || hitSelf;
}

// 生成随机的食物位置
function generateFood() {
  const x = Math.floor(Math.random() * widthInBlocks);
  const y = Math.floor(Math.random() * heightInBlocks);

  food = [x, y];
}

// 在画布上绘制方块
function drawBlock(ctx, position, color) {
  const x = position[0] * blockSize;
  const y = position[1] * blockSize;

  ctx.fillStyle = color;
  ctx.fillRect(x, y, blockSize, blockSize);
}

// 绘制蛇
function drawSnake(ctx) {
  for (let i = 0; i < snake.length; i++) {
    const color = i === 0 ? "green" : "limegreen";
    drawBlock(ctx, snake[i], color);
  }
}

// 绘制食物
function drawFood(ctx) {
  drawBlock(ctx, food, "red");
}

  
// 绘制得分
function drawScore(ctx) {
  ctx.font = "20px Arial";
  ctx.fillStyle = "black";
  ctx.textAlign = "left";
  ctx.fillText("Score: " + score, blockSize, blockSize);
}

// 处理键盘事件，改变蛇的移动方向
function handleKeyPress(event) {
  const key = event.keyCode;
  const arrowKeys = { 37: "left", 38: "up", 39: "right", 40: "down" };

  if (key in arrowKeys) {
    const newDirection = arrowKeys[key];

    if (isOppositeDirection(newDirection, direction)) {
      return;
    }

    direction = newDirection;
  }
}

// 检查新方向是否与当前方向相反
function isOppositeDirection(newDirection, currentDirection) {
  const opposites = { left: "right", up: "down", right: "left", down: "up" };
  return newDirection === opposites[currentDirection];
}

// 更新蛇的位置
function updateSnake() {
  const head = snake[0].slice();
  switch (direction) {
    case "up":
      head[1] -= 1;
      break;
    case "down":
      head[1] += 1;
      break;
    case "left":
      head[0] -= 1;
      break;
    case "right":
      head[0] += 1;
      break;
  }

  // 蛇头穿墙处理
  if (head[0] < 0) {
    head[0] = widthInBlocks - 1;
  } else if (head[0] >= widthInBlocks) {
    head[0] = 0;
  }

  if (head[1] < 0) {
    head[1] = heightInBlocks - 1;
  } else if (head[1] >= heightInBlocks) {
    head[1] = 0;
  }

  snake.unshift(head);

  if (head[0] === food[0] && head[1] === food[1]) {
    score += 1;
    generateFood();
  } else {
    snake.pop();
  }
}


// 渲染游戏画面
function render() {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

  drawSnake(ctx);
  drawFood(ctx);
  drawScore(ctx);

  if (checkCollision()) {
    gameOver(ctx);
    return;
  }

  setTimeout(() => {
    updateSnake();
    render();
  }, 100);
}

// 游戏结束
function gameOver(ctx) {
  ctx.font = "30px Arial";
  ctx.fillStyle = "red";
  ctx.textAlign = "center";
  ctx.fillText("Game Over", canvasSize.width / 2, canvasSize.height / 2);
}

// 初始化游戏
function init() {
  snake = [[6, 4], [5, 4], [4, 4]];
  direction = "right";
  score = 0;

  generateFood();

  document.addEventListener("keydown", handleKeyPress);

  render();
}

// 启动游戏
init();
