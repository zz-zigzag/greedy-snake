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

// 障碍物数组
let obstacles = [];
// 定义移动定时器变量
let moveInterval;
// 定义初始速度和速度增量
let initialSpeed = 200;  // 初始速度（单位：毫秒）
let speedIncrement = 10; // 速度增量（单位：毫秒）

let scoreThreshold = 10;       // 分数阈值
let level = 1;

// 生成障碍物
function generateObstacles() {
  // 清空障碍物数组
  obstacles = [];

  // 生成障碍物数量
  const numObstacles = 5;

  // 随机生成障碍物的位置
  while (obstacles.length < numObstacles) {
    const obstacleX = Math.floor(Math.random() * widthInBlocks);
    const obstacleY = Math.floor(Math.random() * heightInBlocks);

    // 确保障碍物不会与蛇头或食物位置重叠
    const overlapping = snake.some((block) => block[0] === obstacleX && block[1] === obstacleY) ||
      (food[0] === obstacleX && food[1] === obstacleY);

    if (!overlapping) {
      obstacles.push([obstacleX, obstacleY]);
    }
  }
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
  const hitObstacle = obstacles.some((obstacle) => obstacle[0] === head[0] && obstacle[1] === head[1]);

  return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall || hitSelf || hitObstacle;
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

// 绘制得分
function drawLevel(ctx) {
  ctx.font = "20px Arial";
  ctx.fillStyle = "black";
  ctx.textAlign = "left";
  ctx.fillText("Level: " + level, 150, 20);
}



// 绘制障碍物
function drawObstacles(ctx) {
  obstacles.forEach((obstacle) => {
    drawBlock(ctx, obstacle, "gray");
  });
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
      // 根据分数调整蛇的速度
    level = Math.floor(score / scoreThreshold) + 1;
    let currentSpeed = initialSpeed - (level * speedIncrement);

    // 限制最小速度
    if (currentSpeed < 50) {
      currentSpeed = 50;
    }
    // 更新移动定时器
    clearInterval(moveInterval);
    moveInterval =  setInterval(() => {
      updateSnake();
      render();
    }, currentSpeed);

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
  drawLevel(ctx);
  // 绘制障碍物
  drawObstacles(ctx);

  if (checkCollision()) {
    gameOver(ctx);
    return;
  }
}

// 游戏结束
function gameOver(ctx) {
  ctx.font = "30px Arial";
  ctx.fillStyle = "red";
  ctx.textAlign = "center";
  ctx.fillText("Game Over", canvasSize.width / 2, canvasSize.height / 2);
  clearInterval(moveInterval);
}

// 定义触摸起始位置
let touchStartX = 0;
let touchStartY = 0;
// 处理触摸开始事件
function handleTouchStart(event) {
  const touch = event.touches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
}

// 处理触摸结束事件
function handleTouchEnd(event) {
  const touch = event.changedTouches[0];
  const touchEndX = touch.clientX;
  const touchEndY = touch.clientY;

  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;

  // 判断滑动方向
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    // 水平滑动
    if (deltaX > 0 && direction !== "left") {
      // 向右滑动
      direction = "right";
    } else if (deltaX < 0 && direction !== "right") {
      // 向左滑动
      direction = "left";
    }
  } else {
    // 垂直滑动
    if (deltaY > 0 && direction !== "up") {
      // 向下滑动
      direction = "down";
    } else if (deltaY < 0 && direction !== "down") {
      // 向上滑动
      direction = "up";
    }
  }}


// 初始化游戏
function init() {
  snake = [[6, 4], [5, 4], [4, 4]];
  direction = "right";
  score = 0;

  generateFood();
  generateObstacles();
  document.addEventListener("keydown", handleKeyPress);
// 添加触摸事件监听器
  document.addEventListener("touchstart", handleTouchStart);
  document.addEventListener("touchend", handleTouchEnd);

  render();
  moveInterval =  setInterval(() => {
    updateSnake();
    render();
  }, initialSpeed);
}

// 启动游戏
init();
