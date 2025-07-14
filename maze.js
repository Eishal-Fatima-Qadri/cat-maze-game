const startBtn = document.querySelector(".start-btn");
const container = document.querySelector(".container");
const canvas = document.getElementById("mazeCanvas");
const backBtn = document.getElementById("backBtn");
const ctx = canvas.getContext("2d");

let maze, rows, cols, tileSize;

const catImg = new Image();
catImg.src = "./assets/catto.png";

const goalImg = new Image();
goalImg.src = "./assets/cat-food.png";

class Graph {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.nodes = {};
    this.goal = null;
  }

  addEdge(r1, c1, r2, c2) {
    const key1 = `${r1},${c1}`;
    const key2 = `${r2},${c2}`;
    if (!this.nodes[key1]) this.nodes[key1] = [];
    if (!this.nodes[key2]) this.nodes[key2] = [];
    this.nodes[key1].push([r2, c2]);
    this.nodes[key2].push([r1, c1]);
  }
}

function generateMazeGraph(rows, cols) {
  const graph = new Graph(rows, cols);
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  function shuffle(array) {
    //fisher-yates shuffle algo
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  let lastVisitedCell = null;
  function dfs(r, c) {
    visited[r][c] = true;
    lastVisitedCell = [r, c]; //keep track of last visited cell

    for (const [dr, dc] of shuffle(directions)) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited[nr][nc]) {
        graph.addEdge(r, c, nr, nc);
        dfs(nr, nc);
      }
    }
  }

  dfs(0, 0);
  graph.goal = lastVisitedCell; // attach goal to graph
  console.log(graph);
  console.log("Last visited cell:", lastVisitedCell);
  return graph;
}

function graphToMaze(graph) {
  const rows = graph.rows;
  const cols = graph.cols;
  const grid = Array.from({ length: rows * 2 + 1 }, () =>
    Array(cols * 2 + 1).fill(1)
  );

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cellRow = r * 2 + 1;
      const cellCol = c * 2 + 1;
      grid[cellRow][cellCol] = 0;

      const neighbours = graph.nodes[`${r},${c}`] || [];
      for (const [nr, nc] of neighbours) {
        const dr = nr - r;
        const dc = nc - c;
        grid[cellRow + dr][cellCol + dc] = 0;
      }
    }
  }

  return grid;
}

let goalCell;
//---- start button
startBtn.addEventListener("click", () => {
  container.style.display = "none";
  canvas.style.display = "block";
  backBtn.style.display = "inline-block";

  // generate new maze
  const mazeGraph = generateMazeGraph(10, 10);
  maze = graphToMaze(mazeGraph);
  goalCell = mazeGraph.goal.map((n) => n * 2 + 1);

  if (catImg.complete && goalImg.complete) {
    drawMaze();
  } else {
    catImg.onload = drawMaze;
    goalImg.onload = drawMaze;
  }

  rows = maze.length;
  cols = maze[0].length;
  tileSize = canvas.width / cols;
});

//back button
backBtn.addEventListener("click", () => {
  canvas.style.display = "none";
  backBtn.style.display = "none";
  container.style.display = "block";
});

function drawMaze() {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      ctx.fillStyle = maze[row][col] === 1 ? "#cc6699" : "#fff";
      ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
      ctx.strokeStyle = "#fff";
      ctx.strokeRect(col * tileSize, row * tileSize, tileSize, tileSize);
    }
  }

  if (goalCell) {
    const [goalRow, goalCol] = goalCell;
    const size = tileSize * 0.8;
    const offset = (tileSize - size) / 2;
    ctx.drawImage(
      goalImg,
      goalCol * tileSize + offset,
      goalRow * tileSize + offset,
      size,
      size
    );
  }

  drawPlayer();
}

let player = {
  row: 1, // match new maze layout
  col: 1,
  color: "#000",
};

function drawPlayer() {
  const x = player.col * tileSize;
  const y = player.row * tileSize;
  const catSize = tileSize * 0.9;
  const offset = (tileSize - catSize) / 2;

  ctx.drawImage(catImg, x + offset, y + offset, catSize, catSize);
}

document.addEventListener("keydown", (e) => {
  let newRow = player.row;
  let newCol = player.col;
  switch (e.key) {
    case "ArrowUp":
      newRow -= 1;
      break;
    case "ArrowDown":
      newRow += 1;
      break;
    case "ArrowLeft":
      newCol -= 1;
      break;
    case "ArrowRight":
      newCol += 1;
      break;
  }

  if (
    newRow >= 0 &&
    newRow < rows &&
    newCol >= 0 &&
    newCol < cols &&
    maze[newRow][newCol] === 0
  ) {
    player.row = newRow;
    player.col = newCol;
    drawMaze();
  }

  if (player.row === goalCell[0] && player.col === goalCell[1]) {
    setTimeout(() => alert("You found the cat food! 🐾"), 100);
  }
});
