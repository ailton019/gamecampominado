const gameBoard = document.getElementById('game');
const statusText = document.getElementById('status');
const size = 10;
const totalMines = 10;
let board = [];
let gameOver = false;

function startGame() {
  gameOver = false;
  board = [];
  gameBoard.innerHTML = '';
  statusText.textContent = '';

  // Cria matriz
  for (let row = 0; row < size; row++) {
    board[row] = [];
    for (let col = 0; col < size; col++) {
      board[row][col] = {
        mine: false,
        revealed: false,
        element: createCell(row, col),
        adjacentMines: 0
      };
    }
  }

  // Posiciona minas aleatoriamente
  let minesPlaced = 0;
  while (minesPlaced < totalMines) {
    const r = Math.floor(Math.random() * size);
    const c = Math.floor(Math.random() * size);
    if (!board[r][c].mine) {
      board[r][c].mine = true;
      minesPlaced++;
    }
  }

  // Calcula minas adjacentes
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      board[row][col].adjacentMines = countAdjacentMines(row, col);
    }
  }
}

function createCell(row, col) {
  const cell = document.createElement('div');
  cell.classList.add('cell');
  cell.addEventListener('click', () => revealCell(row, col));
  gameBoard.appendChild(cell);
  return cell;
}

function countAdjacentMines(row, col) {
  let count = 0;
  for (let r = row - 1; r <= row + 1; r++) {
    for (let c = col - 1; c <= col + 1; c++) {
      if (r >= 0 && r < size && c >= 0 && c < size && board[r][c].mine) {
        count++;
      }
    }
  }
  return count;
}

function revealCell(row, col) {
  const cell = board[row][col];
  if (cell.revealed || gameOver) return;

  cell.revealed = true;
  cell.element.classList.add('revealed');

  if (cell.mine) {
    cell.element.classList.add('mine');
    cell.element.textContent = '💣';
    statusText.textContent = '💥 Você perdeu!';
    revealAllMines();
    gameOver = true;
    return;
  }

  if (cell.adjacentMines > 0) {
    cell.element.textContent = cell.adjacentMines;
  } else {
    // Revela vizinhos se não há minas por perto
    for (let r = row - 1; r <= row + 1; r++) {
      for (let c = col - 1; c <= col + 1; c++) {
        if (r >= 0 && r < size && c >= 0 && c < size) {
          revealCell(r, c);
        }
      }
    }
  }

  checkWin();
}

function revealAllMines() {
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const cell = board[row][col];
      if (cell.mine && !cell.revealed) {
        cell.element.classList.add('mine');
        cell.element.textContent = '💣';
      }
    }
  }
}

function checkWin() {
  let revealedCount = 0;
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (board[row][col].revealed) revealedCount++;
    }
  }
  if (revealedCount === size * size - totalMines) {
    statusText.textContent = '🎉 Você venceu!';
    gameOver = true;
  }
}

startGame();
