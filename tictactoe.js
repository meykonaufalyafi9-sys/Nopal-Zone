class TicTacToeGame {
  constructor(canvasId, onScoreUpdate) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.onScoreUpdate = onScoreUpdate;
    this.cellSize = this.canvas.width / 3;
    this.reset();
    this.bindEvents();
  }

  reset() {
    this.board = ['', '', '', '', '', '', '', '', ''];
    this.turn = 'X';
    this.gameOver = false;
    this.score = 0;
    this.draw();
  }

  start() {
    this.reset();
  }

  bindEvents() {
    this.canvas.onclick = (e) => {
      if (this.gameOver || this.turn !== 'X') return;
      const rect = this.canvas.getBoundingClientRect();
      const col = Math.floor((e.clientX - rect.left) / this.cellSize);
      const row = Math.floor((e.clientY - rect.top) / this.cellSize);
      const index = row * 3 + col;

      if (this.board[index] === '') {
        this.makeMove(index, 'X');
        if (!this.gameOver) {
          setTimeout(() => this.botMove(), 400);
        }
      }
    };
  }

  makeMove(index, player) {
    this.board[index] = player;
    this.draw();
    
    if (this.checkWin(player)) {
      this.gameOver = true;
      if (player === 'X') {
        this.score = 50;
        if (this.onScoreUpdate) this.onScoreUpdate(this.score);
        this.endGame('Kamu Menang!');
      } else {
        this.endGame('Bot Menang!');
      }
    } else if (this.board.every(cell => cell !== '')) {
      this.gameOver = true;
      this.endGame('Hasil Seri!');
    } else {
      this.turn = player === 'X' ? 'O' : 'X';
    }
  }

  botMove() {
    const emptyIndices = this.board.map((v, i) => v === '' ? i : null).filter(v => v !== null);
    if (emptyIndices.length > 0) {
      const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
      this.makeMove(randomIndex, 'O');
    }
  }

  checkWin(p) {
    const wins = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
    return wins.some(w => w.every(i => this.board[i] === p));
  }

  endGame(text) {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = '#ef4444';
    this.ctx.font = '24px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(text, this.canvas.width / 2, this.canvas.height / 2);
  }

  draw() {
    this.ctx.fillStyle = '#0f172a';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.strokeStyle = '#334155';
    this.ctx.lineWidth = 4;
    for (let i = 1; i < 3; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(i * this.cellSize, 0);
      this.ctx.lineTo(i * this.cellSize, this.canvas.height);
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.moveTo(0, i * this.cellSize);
      this.ctx.lineTo(this.canvas.width, i * this.cellSize);
      this.ctx.stroke();
    }

    this.board.forEach((cell, i) => {
      const row = Math.floor(i / 3);
      const col = i % 3;
      const x = col * this.cellSize + this.cellSize / 2;
      const y = row * this.cellSize + this.cellSize / 2;

      if (cell === 'X') {
        this.ctx.strokeStyle = '#ef4444';
        this.ctx.lineWidth = 6;
        this.ctx.beginPath();
        this.ctx.moveTo(x - 30, y - 30); this.ctx.lineTo(x + 30, y + 30);
        this.ctx.moveTo(x + 30, y - 30); this.ctx.lineTo(x - 30, y + 30);
        this.ctx.stroke();
      } else if (cell === 'O') {
        this.ctx.strokeStyle = '#3b82f6';
        this.ctx.lineWidth = 6;
        this.ctx.beginPath();
        this.ctx.arc(x, y, 30, 0, Math.PI * 2);
        this.ctx.stroke();
      }
    });
  }

  stop() {}
}