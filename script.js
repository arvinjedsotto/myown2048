const board = document.getElementById("board");
const scoreDisplay = document.getElementById("score");
const highscoreDisplay = document.getElementById("highscore");
const message = document.getElementById("message");
const restartBtn = document.getElementById("restart");

let grid, score, highscore;

function init() {
  grid = Array(4).fill(null).map(() => Array(4).fill(0));
  score = 0;
  message.textContent = "";
  updateScore();
  placeRandom();
  placeRandom();
  drawBoard();
}

function updateScore() {
  scoreDisplay.textContent = score;
  highscore = Math.max(score, Number(localStorage.getItem("highscore") || 0));
  localStorage.setItem("highscore", highscore);
  highscoreDisplay.textContent = highscore;
}

function drawBoard() {
  board.innerHTML = "";
  grid.flat().forEach(val => {
    const tile = document.createElement("div");
    tile.className = "tile";
    tile.textContent = val !== 0 ? val : "";
    if (val !== 0) tile.setAttribute("data-value", val);
    board.appendChild(tile);
  });
}

function placeRandom() {
  const empty = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (grid[r][c] === 0) empty.push({ r, c });
    }
  }
  if (empty.length === 0) return;
  const { r, c } = empty[Math.floor(Math.random() * empty.length)];
  grid[r][c] = Math.random() < 0.9 ? 2 : 4;
}

function move(dir) {
  let moved = false;
  let addScore = 0;

  function moveRowLeft(row) {
    let newRow = row.filter(x => x !== 0);
    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        addScore += newRow[i];
        newRow[i + 1] = 0;
      }
    }
    return newRow.filter(x => x !== 0).concat(Array(4 - newRow.filter(x => x !== 0).length).fill(0));
  }

  for (let i = 0; i < 4; i++) {
    let row = grid[i].slice();
    if (dir === "right") row.reverse();
    else if (dir === "up" || dir === "down") row = grid.map(r => r[i]);
    if (dir === "down") row.reverse();

    let movedRow = moveRowLeft(row);

    if (dir === "right") movedRow.reverse();
    else if (dir === "up" || dir === "down") {
      if (dir === "down") movedRow.reverse();
      movedRow.forEach((val, rIdx) => {
        if (grid[rIdx][i] !== val) moved = true;
        grid[rIdx][i] = val;
      });
      continue;
    }

    if (grid[i].join() !== movedRow.join()) moved = true;
    grid[i] = movedRow;
  }

  if (moved) {
    score += addScore;
    updateScore();
    placeRandom();
    drawBoard();
    if (isGameOver()) {
      message.textContent = alert("Kamulalan mo! HAHAHAHAHA!");
    }
  }
}

function isGameOver() {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (grid[r][c] === 0) return false;
      if (c < 3 && grid[r][c] === grid[r][c + 1]) return false;
      if (r < 3 && grid[r][c] === grid[r + 1][c]) return false;
    }
  }
  return true;
}

document.addEventListener("keydown", e => {
  if (message.textContent) return;
  switch (e.key) {
    case "ArrowLeft": move("left"); break;
    case "ArrowRight": move("right"); break;
    case "ArrowUp": move("up"); break;
    case "ArrowDown": move("down"); break;
  }
});

restartBtn.addEventListener("click", init);

init();
