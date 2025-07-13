const startBtn = document.querySelector(".start-btn");
const container = document.querySelector(".container");
const canvas = document.getElementById("mazeCanvas");
const backBtn = document.getElementById("backBtn");
const ctx = canvas.getContext("2d");

startBtn.addEventListener("click", () => {
  container.style.display = "none";
  canvas.style.display = "block";
  backBtn.style.display = "inline-block";

  // wait for cat image before drawing
  if (catImg.complete) {
    drawMaze();
  } else {
    catImg.onload = () => drawMaze();
  }
});

backBtn.addEventListener("click", () => {
  canvas.style.display = "none";
  backBtn.style.display = "none";
  container.style.display = "block";
});

const rows = 10;
const cols = 10;
const tileSize = canvas.width / cols; // 60

const maze = [
  [0, 1, 0, 0, 0, 1, 0, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 1, 0, 1, 0],
  [0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
  [1, 1, 0, 1, 1, 1, 1, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
  [0, 1, 0, 1, 1, 1, 1, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
  [1, 1, 1, 1, 1, 0, 1, 1, 1, 0],
];

function drawMaze() {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const isWall = maze[row][col] === 1;
      if (isWall) {
        ctx.fillStyle = "#cc6699";
      } else {
        ctx.fillStyle = "#fff";
      }

      ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
      ctx.strokeStyle = "#fff";
      ctx.strokeRect(col * tileSize, row * tileSize, tileSize, tileSize);
    }
  }

  drawPlayer();
}

let player = {
  row: 0, //->stored as grid coordinates
  col: 0,
  color: "#000",
};

function drawPlayer() {
  //   ctx.fillStyle = player.color;
  //   ctx.beginPath();
  //   ctx.arc(
  //     player.col * tileSize + tileSize / 2, //x // converted to pixels
  //     player.row * tileSize + tileSize / 2, //y
  //     tileSize / 3, //radius
  //     0,
  //     Math.PI * 2
  //   );
  //   ctx.fill();

  const x = player.col * tileSize;
  const y = player.row * tileSize;

  //  adjust size
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

  //check for walls and outer boundary
  if (
    newRow >= 0 &&
    newRow < rows &&
    newCol >= 0 &&
    newCol < cols &&
    maze[newRow][newCol] === 0
  ) {
    player.row = newRow;
    player.col = newCol;
    drawMaze(); // re-draw maze and player
  }
});

const catImg = new Image();
catImg.src = "./assets/catto.png";

//graph implementation
function CreateGraph(maze) {
  let graph = [];
  let rows = maze.length;
  let cols = maze[0].length;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (maze[i][j] === 0) {
        const key = `${i}-${j}`;
        graph[key] = [];

        const directions = [
          [-1, 0], // up
          [1, 0], // down
          [0, -1], // left
          [0, 1], // right
        ];

        for (const [dr, dc] of directions) {
          const newRow = i + dr;
          const newCol = j + dc;

          if (
            newRow >= 0 &&
            newRow < rows &&
            newCol >= 0 &&
            newCol < cols &&
            maze[newRow][newCol] === 0
          ) {
            graph[key].push(`${newRow}-${newCol}`);
          }
        }
      }
    }
  }

  console.log(graph);
  return graph;
}

CreateGraph(maze);
