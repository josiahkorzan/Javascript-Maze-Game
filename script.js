import {Player, Enemy} from './classes.js';

let canvas;
let ctx;
let current;

class Maze {
    constructor(rows, cols, size) {
        this.size = size;
        this.rows = rows;
        this.cols = cols;
        this.grid = []; //2d array
        this.stack = [];
    }

    setup() {
        for (let r = 0; r < this.rows; r++) {
            let row = []
            for (let c = 0; c < this.cols; c++) {
                let cell = new Cell(r, c, this.grid, this.size);
                row.push(cell);
            }
            this.grid.push(row);
        }
        current = this.grid[0][0];
    }

    draw() {
        canvas.width = this.size;
        canvas.height = this.size;
        // canvas.style.background = "black";
        current.visited = true;

        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                let grid = this.grid;
                grid[r][c].show(this.rows, this.cols);
            }
        }
    }

}

class Cell {
    constructor(row_num, col_num, parent_grid, parent_size) {
        this.row_num = row_num;
        this.col_num = col_num;
        this.parent_grid = parent_grid;
        this.parent_size = parent_size;
        this.visited = false;
        this.walls = {
            top: true,
            right: true,
            bottom: true,
            left: true
        };
    }

    draw_top_wall(x, y, cols, rows) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + this.parent_size/cols, y);
        ctx.stroke(); 
    }

    draw_right_wall(x, y, cols, rows) {
        ctx.beginPath();
        ctx.moveTo(x + this.parent_size/cols, y);
        ctx.lineTo(x + this.parent_size/cols, y + this.parent_size/rows);
        ctx.stroke(); 
    }

    draw_bottom_wall(x, y, cols, rows) {
        ctx.beginPath();
        ctx.moveTo(x, y + this.parent_size/rows);
        ctx.lineTo(x + this.parent_size/cols, y + this.parent_size/rows);
        ctx.stroke(); 
    }

    draw_left_wall(x, y, cols, rows) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + this.parent_size/rows);
        ctx.stroke(); 
    }

    show(num_rows, num_cols) {
        let x = (this.col_num * this.parent_size) / num_cols;
        let y = (this.row_num * this.parent_size) / num_rows;
        ctx.strokeStyle = "white";
        ctx.fillStyle = "green";
        ctx.lineWidth = 2;

        if (this.walls.top) this.draw_top_wall(x, y, this.parent_size, num_cols, num_rows);
        if (this.walls.left) this.draw_left_wall(x, y, this.parent_size, num_cols, num_rows);
        if (this.walls.bottom) this.draw_bottom_wall(x, y, this.parent_size, num_cols, num_rows);
        if (this.walls.right) this.draw_right_wall(x, y, this.parent_size, num_cols, num_rows);
        if (this.visited) {
            ctx.fillRect(x+1, y+1, this.parent_size/num_cols - 2, this.parent_size/num_rows - 2);
        }
    }

}

let player;

window.onload = init;

function init(){
    canvas = document.querySelector('canvas');
    ctx = canvas.getContext('2d');

    // player = new Player(50, 300, 400, 5);
    let maze = new Maze(10, 10, 500);
    maze.setup();
    maze.draw();
    console.log(maze);

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

    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(player.xpos, player.ypos, player.size, player.size);
}

function update() {
    
}

