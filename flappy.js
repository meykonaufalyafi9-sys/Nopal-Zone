class FlappyBirdGame {
  constructor(canvasId, onScoreUpdate) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.onScoreUpdate = onScoreUpdate;
    this.reset();
    this.bindEvents();
  }

  reset() {
    this.bird = { x: 50, y: 150, velocity: 0, gravity: 0.35, jump: -6, radius: 12 };
    this.pipes = [];
    this.frame = 0;
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
    const handleJump = () => { if (!this.gameOver) this.bird.velocity = this.bird.jump; };
    window.onkeydown = (e) => { if (e.code === 'Space') handleJump(); };
    this.canvas.onclick = handleJump;
  }

  update() {
    this.frame++;
    this.bird.velocity += this.bird.gravity;
    this.bird.y += this.bird.velocity;

    if (this.bird.y + this.bird.radius >= this.canvas.height || this.bird.y - this.bird.radius <= 0) {
      return this.endGame();
    }

    if (this.frame % 90 === 0) {
      const gap = 100;
      const topHeight = Math.floor(Math.random() * (this.canvas.height - gap - 80)) + 30;
      this.pipes.push({ x: this.canvas.width, top: topHeight, bottom: this.canvas.height - topHeight - gap, passed: false });
    }

    this.pipes.forEach(p => {
      p.x -= 2;

      if (p.x + 40 < this.bird.x && !p.passed) {
        p.passed = true;
        this.score += 1;
        if (this.onScoreUpdate) this.onScoreUpdate(this.score);
      }

      if (
        this.bird.x + this.bird.radius > p.x &&
        this.bird.x - this.bird.radius < p.x + 40 &&
        (this.bird.y - this.bird.radius < p.top || this.bird.y + this.bird.radius > this.canvas.height - p.bottom)
      ) {
        this.endGame();
      }
    });

    if (this.pipes.length && this.pipes[0].x < -40) this.pipes.shift();
    this.draw();
  }

  endGame() {
    this.gameOver = true;
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = '#ef4444';
    this.ctx.font = '24px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Game Over!', this.canvas.width / 2, this.canvas.height / 2);
  }

  draw() {
    this.ctx.fillStyle = '#0284c7';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = '#22c55e';
    this.pipes.forEach(p => {
      this.ctx.fillRect(p.x, 0, 40, p.top);
      this.ctx.fillRect(p.x, this.canvas.height - p.bottom, 40, p.bottom);
    });

    this.ctx.fillStyle = '#facc15';
    this.ctx.beginPath();
    this.ctx.arc(this.bird.x, this.bird.y, this.bird.radius, 0, Math.PI * 2);
    this.ctx.fill();
  }

  stop() {
    if (this.loop) cancelAnimationFrame(this.loop);
  }
}