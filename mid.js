function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function generateseq() {
  const seq = ['N', 'J', 'L', 'O', 'mS', 'T', 'Z','C','S','I','E'];
  while (seq.length) {
    const rand = getRandomInt(0, seq.length - 1);
    const name = seq.splice(rand, 1)[0];
    tetrominoseq.push(name);
  }
}

function getNextTetromino() {
  if (tetrominoseq.length === 0) {
    generateseq();
  }
  const name = tetrominoseq.pop();
  const matrix = tetrominos[name];
  const col = playfield[0].length / 2 - Math.ceil(matrix[0].length / 2);
  const row = name === 'I' ? -1 : -2;
  return {
    name: name,
    matrix: matrix,
    row: row,
    col: col
  };
}
function rotate(matrix) {
  const N = matrix.length - 1;
  const result = matrix.map((row, i) =>
    row.map((val, j) => matrix[N - j][i])
  );

  return result;
}
function move(matrix, cellRow, cellCol) {
  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[row].length; col++) {
      if (matrix[row][col] && (
          cellCol + col < 0 ||
          cellCol + col >= playfield[0].length ||
          cellRow + row >= playfield.length ||
          playfield[cellRow + row][cellCol + col])
        ) {
        return false;
      }
    }
  }

  return true;
}
let point=0;
function placeTetromino() {
  for (let row = 0; row < tetromino.matrix.length; row++) {
    for (let col = 0; col < tetromino.matrix[row].length; col++) {
      if (tetromino.matrix[row][col]) {
        if (tetromino.row + row < 0) {
          return showGameOver();
        }

        playfield[tetromino.row + row][tetromino.col + col] = tetromino.name;
      }
    }
  }
  for (let row = playfield.length - 1; row >= 0; ) {
    if (playfield[row].every(cell => !!cell)) {
      point+=1;
      for (let r = row; r >= 0; r--) {
        for (let c = 0; c < playfield[r].length; c++) {
          playfield[r][c] = playfield[r-1][c];
        }
      }
    }
    else {
      row--;
    }
  }
  tetromino = getNextTetromino();
  score.innerHTML="Score: "+String(point)
}
function showGameOver() {
  cancelAnimationFrame(zz);
  gameOver = true;
  context.fillStyle = 'white';
  context.globalAlpha = 0.75;
  context.fillRect(0, canvas.height / 2 - 30, canvas.width, 60);
  context.globalAlpha = 1;
  context.fillStyle = 'black';
  context.font = 'bold 55px serif';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText('GameOver',canvas.width/2, canvas.height/2);
}
const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
const grid = 32;
const tetrominoseq = [];
const playfield = [];

for (let row = -2; row < 20; row++) {
  playfield[row] = [];

  for (let col = 0; col < 10; col++) {
    playfield[row][col] = 0;
  }
}
const tetrominos = {
  'N': [[0,0,0,0],
        [1,1,1,1],
        [0,0,0,0],
        [0,0,0,0]],
  'J': [[1,0,0],
        [1,1,1],
        [0,0,0],],
  'L': [[0,0,1],
        [1,1,1],
        [0,0,0],],
  'O': [[1,1],
        [1,1],],
  'mS': [[0,1,1],
        [1,1,0],
        [0,0,0],],
  'Z': [[1,1,0],
        [0,1,1],
        [0,0,0],],
  'T': [[0,1,0],
        [1,1,1],
        [0,0,0]],
  'C': [[1,1,1,0,0],
        [1,0,0,0,0],
        [1,0,0,0,0],
        [1,0,0,0,0],
        [1,1,1,0,0]],
  'S': [[1,1,1,1,0],
        [1,0,0,0,0],
        [1,1,1,1,0],
        [0,0,0,1,0],
        [1,1,1,1,0]],
  'I': [[0,0,1,0,0],
        [0,0,1,0,0],
        [0,0,1,0,0],
        [0,0,1,0,0],
        [0,0,1,0,0]],
  'E': [[1,1,1,0,0],
        [1,0,0,0,0],
        [1,1,1,0,0],
        [1,0,0,0,0],
        [1,1,1,0,0]]
};

const colors = {
  'N': 'cyan',
  'O': 'yellow',
  'T': 'purple',
  'mS': 'green',
  'Z': 'red',
  'J': 'blue',
  'L': 'orange',
  'C': 'pink',
  'S': 'grey',
  'I': 'brown',
  'E': 'white'
};

let count = 0;
let tetromino = getNextTetromino();
let zz = null;
let gameOver = false;

function loop() {
  zz = requestAnimationFrame(loop);
  context.clearRect(0,0,canvas.width,canvas.height);
  for (let row = 0; row < 20; row++) {
    for (let col = 0; col < 10; col++) {
      if (playfield[row][col]) {
        const name = playfield[row][col];
        context.fillStyle = colors[name];
        context.fillRect(col * grid, row * grid, grid-1, grid-1);
      }
    }
  }
  if (tetromino) {
    if (++count > 70) {
      tetromino.row++;
      count = 0;
      if (!move(tetromino.matrix, tetromino.row, tetromino.col)) {
        tetromino.row--;
        placeTetromino();
      }
    }
    context.fillStyle = colors[tetromino.name];
    for (let row = 0; row < tetromino.matrix.length; row++) {
      for (let col = 0; col < tetromino.matrix[row].length; col++) {
        if (tetromino.matrix[row][col]) {
          context.fillRect((tetromino.col + col) * grid, (tetromino.row + row) * grid, grid-1, grid-1);
        }
      }
    }
  }
};
function start(){
  zz = requestAnimationFrame(loop);
}
function dm(){
  if (gameOver) return;
  const row = tetromino.row + 1;
  if (!move(tetromino.matrix, row, tetromino.col)) {
    tetromino.row = row - 1;
    placeTetromino();
    return;
  }
  tetromino.row = row;
}
function lm(){
  const col=tetromino.col - 1
  if (move(tetromino.matrix, tetromino.row, col)) {
    tetromino.col = col;
  }
}
function rm(){
  const col=tetromino.col + 1
  if (move(tetromino.matrix, tetromino.row, col)) {
    tetromino.col = col;
  }
}
function rt(){
  const matrix = rotate(tetromino.matrix);
  if (move(matrix, tetromino.row, tetromino.col)){
    tetromino.matrix = matrix;
  }
}
