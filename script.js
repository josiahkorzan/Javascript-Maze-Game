import {Player, Enemy, Map, Maze, Cell} from './classes.js';

let canvas;
let ctx;

let player;
let map;

window.onload = init;

function init(){
    canvas = document.querySelector('canvas');
    ctx = canvas.getContext('2d');

    player = new Player(50, 7, canvas);
    map = new Map(2000, player.xpos - player.size/2, player.ypos - player.size/2, 15, 15);

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

    draw_map(map.xpos, map.ypos, map.size);

    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(player.xpos, player.ypos, player.size, player.size);
}

function update() {
    player.move(map);
}


function draw_map(xpos, ypos, size) {
    ctx.fillStyle = "white";
    ctx.fillRect(xpos, ypos, size, size);

    let maze = map.maze;

    for (let r = 0; r < maze.num_rows; r++) {
        for (let c = 0; c < maze.num_cols; c++) {
            let cell = maze.grid[r][c];

            //Cell variables
            let cell_width = size / maze.num_cols;
            let cell_height = size / maze.num_rows;
            
            let x = (cell.col_num * cell_width) + xpos;
            let y = (cell.row_num * cell_height) + ypos;

            //changes the background color of the cell to white
            ctx.fillStyle = "white";
            ctx.fillRect(x, y, cell_width, cell_height);

            //Wall settings
            ctx.strokeStyle = "black";
            ctx.lineWidth = 5;

            //draw walls of cell
            if (cell.walls.top) draw_wall(x, y, cell_width, cell_height, 'top');
            if (cell.walls.right) draw_wall(x, y, cell_width, cell_height, 'right');
            if (cell.walls.bottom) draw_wall(x, y, cell_width, cell_height, 'bottom');
            if (cell.walls.left) draw_wall(x, y, cell_width, cell_height, 'left');
                
        }
    }
}

function draw_wall(x, y, width, height, dir) {
    ctx.beginPath();

    switch(dir) {
        case 'top':
            ctx.moveTo(x, y);
            ctx.lineTo(x + width, y);
            break;
        case 'right':
            ctx.moveTo(x + width, y);
            ctx.lineTo(x + width, y + height);
            break;
        case 'bottom':
            ctx.moveTo(x, y + height);
            ctx.lineTo(x + width, y + height);
            break;
        case 'left':
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + height);
            break;
    }

    ctx.stroke();
}
