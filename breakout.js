class BreakoutGame {
  constructor(canvasId, onScoreUpdate) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.onScoreUpdate = onScoreUpdate;
    this.reset();
    this.bindEvents();
  }

  reset() {
    this.paddleWidth = 75;
    this.paddleHeight = 10;
    this.paddleX = (this.canvas.width - this.paddleWidth) / 2;

    this.ball = { x: this.canvas.width / 2, y: this.canvas.height - 30, dx: 3, dy: -3, radius: 8 };

    this.rowCount = 4;
    this.colCount = 5;
    this.brickWidth = 65;
    this.brickHeight = 20;
    this.brickPadding = 10;
    this.brickOffsetTop = 30;
    this.brickOffsetLeft = 15;

    this.bricks = [];
    for (let c = 0; c < this.colCount; c++) {
      this.bricks[c] = [];
      for (let r = 0; r < this.rowCount; r++) {
        this.bricks[c][r] = { x: 0, y: 0, status: 1 };
      }
    }

    this.score = 0;
    this.gameOver = false;
    if (this.loop) cancelAnimationFrame(this.loop);
  }

  start() {
    this.reset();
    const animate = () => {
      this.update();
      if (!this.gameOver) this.loop = requestAnimationFrame(animate);
    };
    animate();
  }

  bindEvents() {
    this.canvas.onmousemove = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      if (relativeX > 0 && relativeX < this.canvas.width) {
        this.paddleX = relativeX - this.paddleWidth / 2;
      }
    };
  }

  update() {
    this.ball.x += this.ball.dx;
    this.ball.y += this.ball.dy;

    // Dinding Kiri/Kanan
    if (this.ball.x + this.ball.dx > this.canvas.width - this.ball.radius || this.ball.x + this.ball.dx < this.ball.radius) {
      this.ball.dx = -this.ball.dx;
    }
    // Atas
    if (this.ball.y + this.ball.dy < this.ball.radius) {
      this.ball.dy = -this.ball.dy;
    } else if (this.ball.y + this.ball.dy > this.canvas.height - this.ball.radius) {
      // Pantulan Paddle
      if (this.ball.x > this.paddleX && this.ball.x < this.paddleX + this.paddleWidth) {
        this.ball.dy = -this.ball.dy;
      } else {
        return this.endGame('Game Over!');
      }
    }

    // Deteksi Tabrakan Bata
    for (let c = 0; c < this.colCount; c++) {
      for (let r = 0; r < this.rowCount; r++) {
        const b = this.bricks[c][r];
        if (b.status === 1) {
          if (
            this.ball.x > b.x &&
            this.ball.x < b.x + this.brickWidth &&
            this.ball.y > b.y &&
            this.ball.y < b.y + this.brickHeight
          ) {
            this.ball.dy = -this.ball.dy;
            b.status = 0;
            this.score += 10;
            if (this.onScoreUpdate) this.onScoreUpdate(this.score);

            if (this.score === this.rowCount * this.colCount * 10) {
              return this.endGame('Kamu Menang!');
            }
          }
        }
      }
    }

    this.draw();
  }

  endGame(text) {
    this.gameOver = true;
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = '#ef4444';
    this.ctx.font = '24px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(text, this.canvas.width / 2, this.canvas.height / 2);
  }

  draw() {
    this.ctx.fillStyle = '#0f172a';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Gambar Bata
    for (let c = 0; c < this.colCount; c++) {
      for (let r = 0; r < this.rowCount; r++) {
        if (this.bricks[c][r].status === 1) {
          const brickX = c * (this.brickWidth + this.brickPadding) + this.brickOffsetLeft;
          const brickY = r * (this.brickHeight + this.brickPadding) + this.brickOffsetTop;
          this.bricks[c][r].x = brickX;
          this.bricks[c][r].y = brickY;
          this.ctx.fillStyle = '#8b5cf6';
          this.ctx.fillRect(brickX, brickY, this.brickWidth, this.brickHeight);
        }
      }
    }

    // Gambar Paddle
    this.ctx.fillStyle = '#38bdf8';
    this.ctx.fillRect(this.paddleX, this.canvas.height - this.paddleHeight, this.paddleWidth, this.paddleHeight);

    // Gambar Bola
    this.ctx.fillStyle = '#facc15';
    this.ctx.beginPath();
    this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
    this.ctx.fill();
  }

  stop() {
    if (this.loop) cancelAnimationFrame(this.loop);
  }
}