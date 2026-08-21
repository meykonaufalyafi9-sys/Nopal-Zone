class PongGame {
  constructor(canvasId, onScoreUpdate) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.onScoreUpdate = onScoreUpdate;
    this.reset();
    this.bindEvents();
  }

  reset() {
    this.paddleHeight = 60;
    this.paddleWidth = 10;
    this.playerY = (this.canvas.height - this.paddleHeight) / 2;
    this.aiY = (this.canvas.height - this.paddleHeight) / 2;

    this.ball = { x: this.canvas.width / 2, y: this.canvas.height / 2, dx: 3, dy: 3, radius: 7 };

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
      this.playerY = e.clientY - rect.top - this.paddleHeight / 2;
    };
  }

  update() {
    this.ball.x += this.ball.dx;
    this.ball.y += this.ball.dy;

    // AI Sederhana
    this.aiY += (this.ball.y - (this.aiY + this.paddleHeight / 2)) * 0.08;

    // Pantulan Atas/Bawah
    if (this.ball.y < 0 || this.ball.y > this.canvas.height) {
      this.ball.dy = -this.ball.dy;
    }

    // Pantulan Paddle Pemain
    if (
      this.ball.x - this.ball.radius < this.paddleWidth &&
      this.ball.y > this.playerY &&
      this.ball.y < this.playerY + this.paddleHeight
    ) {
      this.ball.dx = -this.ball.dx * 1.05;
      this.score += 10;
      if (this.onScoreUpdate) this.onScoreUpdate(this.score);
    }

    // Pantulan Paddle AI
    if (
      this.ball.x + this.ball.radius > this.canvas.width - this.paddleWidth &&
      this.ball.y > this.aiY &&
      this.ball.y < this.aiY + this.paddleHeight
    ) {
      this.ball.dx = -this.ball.dx;
    }

    // Kebobolan
    if (this.ball.x < 0) {
      return this.endGame('Game Over!');
    } else if (this.ball.x > this.canvas.width) {
      return this.endGame('Kamu Menang!');
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

    // Garis Tengah
    this.ctx.strokeStyle = '#334155';
    this.ctx.setLineDash([5, 5]);
    this.ctx.beginPath();
    this.ctx.moveTo(this.canvas.width / 2, 0);
    this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    // Paddle Pemain & AI
    this.ctx.fillStyle = '#10b981';
    this.ctx.fillRect(0, this.playerY, this.paddleWidth, this.paddleHeight);
    this.ctx.fillStyle = '#ef4444';
    this.ctx.fillRect(this.canvas.width - this.paddleWidth, this.aiY, this.paddleWidth, this.paddleHeight);

    // Bola
    this.ctx.fillStyle = '#facc15';
    this.ctx.beginPath();
    this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
    this.ctx.fill();
  }

  stop() {
    if (this.loop) cancelAnimationFrame(this.loop);
  }
}