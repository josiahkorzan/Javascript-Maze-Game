class Entity {
    constructor(size, xpos, ypos, speed) {
        this.size = size;
        this.xpos = xpos;
        this.ypos = ypos;
        this.speed = speed;
    
        this.up = false;
        this.down = false;
        this.left = false;
        this.right = false;
    }
}


export class Player extends Entity {
    constructor(size, xpos, ypos, speed) {
        super(size, xpos, ypos, speed);
    }

}

export class Enemy extends Entity {
    constructor(size, xpos, ypos, speed) {
        super(size, xpos, ypos, speed);
    }

}

export class Map {
    constructor(xpos, ypos, num_rows, num_cols, player_size) {
        this.xpos = xpos;
        this.ypos = ypos;
        this.size = (player_size * 1.5) * num_cols
        this.num_rows = num_rows;
        this.num_cols = num_cols;
    }
}

export class Maze {
    constructor(num_rows, num_cols) { //num_rows and num_cols are decided in map class
        this.num_rows = num_rows;
        this.num_cols = num_cols;
        this.grid = []; //2d array
        this.setup();
        this.generate_maze(this.grid[0][0]);
    }

    setup() {
        for (let r = 0; r < this.num_rows; r++) {
            let row = [];
            for (let c = 0; c < this.num_cols; c++) {
                let cell = new Cell(r, c);
                row.push(cell);
            }
            this.grid.push(row);
        }
    }

    get_neighbors(cell, is_visited, is_unvisited) { //get_visited and get_unvisited are bools
        let row_num = cell.row_num;
        let col_num = cell.col_num;

        let neighbors = []; // array of cells which are neighbors of given cell

        if (row_num > 0) {
            let neighbor_cell = this.grid[row_num - 1][col_num];
            if ((is_visited && neighbor_cell.visited) || (is_unvisited && !neighbor_cell.visited)) {
                neighbors.push(neighbor_cell);
            }
        }
        if (row_num < this.num_rows - 1) {
            let neighbor_cell = this.grid[row_num + 1][col_num];
            if ((is_visited && neighbor_cell.visited) || (is_unvisited && !neighbor_cell.visited)) {
                neighbors.push(neighbor_cell);
            }
        }
        if (col_num > 0) {
            let neighbor_cell = this.grid[row_num][col_num - 1];
            if ((is_visited && neighbor_cell.visited) || (is_unvisited && !neighbor_cell.visited)) {
                neighbors.push(neighbor_cell);
            }
        }
        if (col_num < this.num_cols - 1) {
            let neighbor_cell = this.grid[row_num][col_num + 1];
            if ((is_visited && neighbor_cell.visited) || (is_unvisited && !neighbor_cell.visited)) {
                neighbors.push(neighbor_cell);
            }
        }

        return neighbors;

    }

    generate_maze(current_cell) {
        current_cell.visited = true;
        let neighbors = this.get_neighbors(current_cell, false, true);
        while(neighbors.length > 0) {
            let rand_int = Math.floor(Math.random() * neighbors.length);
            let neighbor = neighbors.splice(rand_int, 1)[0];

            if (!neighbor.visited) {
                //remove walls of current_cell and neighbor
                if (neighbor.row_num > current_cell.row_num && current_cell.row_num < this.num_rows - 1) {
                    //remove bottom wall of current_cell
                    current_cell.remove_wall('bottom');
                    neighbor.remove_wall('top');
                } else if (neighbor.row_num < current_cell.row_num && current_cell.row_num > 0) {
                    //remove top wall of current_cell
                    current_cell.remove_wall('top');
                    neighbor.remove_wall('bottom');
                }
    
                if (neighbor.col_num > current_cell.col_num && current_cell.col_num < this.num_cols -1) {
                    // remove right wall of current_cell
                    current_cell.remove_wall('right');
                    neighbor.remove_wall('left');
                } else if (neighbor.col_num < current_cell.col_num && current_cell.col_num > 0) {
                    //remove left wall of current_cell
                    current_cell.remove_wall('left');
                    neighbor.remove_wall('right');
                }
            }

            //set neighbor to visited
            neighbor.visited = true;

            //call generate maze with neighbor
            this.generate_maze(neighbor);

        }
    }

}

export class Cell {
    constructor(row_num, col_num) {
        this.row_num = row_num;
        this.col_num = col_num;
        this.visited = false;
        this.walls = {
            top: true,
            right: true,
            bottom: true,
            left: true
        };
    }

    remove_wall(wall) { //wall is a string
        switch(wall) {
            case 'top':
                this.walls.top = false;
                break;
            case 'right':
                this.walls.right = false;
                break;
            case 'bottom':
                this.walls.bottom = false;
                break;
            case 'left':
                this.walls.left = false;
                break;
            default:
                throw new Error('Class: Cell, function: remove_wall; invalid input');   
        }
    }

}


