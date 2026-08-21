class SnakeGame {
  constructor(canvasId, onScoreUpdate) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.onScoreUpdate = onScoreUpdate;
    this.gridSize = 20;
    this.tileCount = this.canvas.width / this.gridSize;
    this.reset();
    this.bindEvents();
  }

  reset() {
    this.snake = [{ x: 10, y: 10 }];
    this.food = { x: 15, y: 15 };
    this.dx = 1;
    this.dy = 0;
    this.score = 0;
    this.gameOver = false;
    if (this.loop) clearInterval(this.loop);
  }

  start() {
    this.reset();
    this.loop = setInterval(() => this.update(), 100);
  }

  bindEvents() {
    window.onkeydown = (e) => {
      if (e.key === 'ArrowUp' && this.dy === 0) { this.dx = 0; this.dy = -1; }
      if (e.key === 'ArrowDown' && this.dy === 0) { this.dx = 0; this.dy = 1; }
      if (e.key === 'ArrowLeft' && this.dx === 0) { this.dx = -1; this.dy = 0; }
      if (e.key === 'ArrowRight' && this.dx === 0) { this.dx = 1; this.dy = 0; }
    };
  }

  update() {
    if (this.gameOver) return;
    const head = { x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy };

    if (head.x < 0 || head.x >= this.tileCount || head.y < 0 || head.y >= this.tileCount) {
      return this.endGame();
    }

    for (let segment of this.snake) {
      if (head.x === segment.x && head.y === segment.y) return this.endGame();
    }

    this.snake.unshift(head);

    if (head.x === this.food.x && head.y === this.food.y) {
      this.score += 10;
      if (this.onScoreUpdate) this.onScoreUpdate(this.score);
      this.spawnFood();
    } else {
      this.snake.pop();
    }

    this.draw();
  }

  spawnFood() {
    this.food = {
      x: Math.floor(Math.random() * this.tileCount),
      y: Math.floor(Math.random() * this.tileCount)
    };
  }

  endGame() {
    this.gameOver = true;
    clearInterval(this.loop);
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = '#ef4444';
    this.ctx.font = '24px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Game Over!', this.canvas.width / 2, this.canvas.height / 2);
  }

  draw() {
    this.ctx.fillStyle = '#0f172a';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = '#ef4444';
    this.ctx.beginPath();
    this.ctx.arc((this.food.x + 0.5) * this.gridSize, (this.food.y + 0.5) * this.gridSize, this.gridSize / 2 - 2, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = '#10b981';
    this.snake.forEach(s => {
      this.ctx.fillRect(s.x * this.gridSize + 1, s.y * this.gridSize + 1, this.gridSize - 2, this.gridSize - 2);
    });
  }

  stop() {
    if (this.loop) clearInterval(this.loop);
  }
}