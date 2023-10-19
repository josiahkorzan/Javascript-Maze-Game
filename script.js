import {Player, Enemy, Map, Maze, Cell} from './classes.js';

let canvas;
let ctx;

let player;

let maze = new Maze(12, 12);

console.log(maze);

window.onload = init;

function init(){
    canvas = document.querySelector('canvas');
    ctx = canvas.getContext('2d');

    player = new Player(50, 300, 400, 5);

    // Start the first frame request
    window.requestAnimationFrame(gameLoop);
}

function gameLoop(){
    update();
    draw();
    // Keep requesting new frames
    window.requestAnimationFrame(gameLoop);
}

function draw() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    draw_maze(800);

    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(player.xpos, player.ypos, player.size, player.size);
}

function update() {
    
}

function draw_maze(size) {

    ctx.strokeStyle = "black";
    ctx.fillStyle = "green";
    ctx.lineWidth = 1;

    for (let r = 0; r < maze.num_rows; r++) {
        for (let c = 0; c < maze.num_cols; c++) {
            let cell = maze.grid[r][c];
            
            let x = (cell.col_num * size) / maze.num_cols;
            let y = (cell.row_num * size) / maze.num_rows;

            //draw walls of cell
            if (cell.walls.top) {
                draw_wall(x, y, size, maze.num_cols, maze.num_rows, 'top');
            }

            if (cell.walls.right) {
                draw_wall(x, y, size, maze.num_cols, maze.num_rows, 'right');
            }

            if (cell.walls.bottom) {
                draw_wall(x, y, size, maze.num_cols, maze.num_rows, 'bottom');
            }

            if (cell.walls.left) {
                draw_wall(x, y, size, maze.num_cols, maze.num_rows, 'left');
            }
                
        }
    }
}

function draw_wall(x, y, size, columns, rows, dir) {
    ctx.beginPath();
    
    switch(dir) {
        case 'top':
            ctx.moveTo(x, y);
            ctx.lineTo(x + size / columns, y);
            break;
        case 'right':
            ctx.moveTo(x + size / columns, y);
            ctx.lineTo(x + size / columns, y + size / rows);
            break;
        case 'bottom':
            ctx.moveTo(x, y + size / rows);
            ctx.lineTo(x + size / columns, y + size / rows);
            break;
        case 'left':
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + size / rows);
            break;
    }

    ctx.stroke();
}
