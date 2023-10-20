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
    constructor(size, speed, canvas) {
        super(size, 0, 0, speed);
        this.xpos = (canvas.width/2) - (this.size/2);
        this.ypos = (canvas.height/2) - (this.size/2);
        this.input = new InputHandler();
    }

    move(map) {
        this.getInput();
        this.collision_detection(map);
        if (this.up) {
            map.ypos += this.speed;
        }
        if (this.down) {
            map.ypos -= this.speed;
        }
        if (this.left) {
            map.xpos += this.speed;
        }
        if (this.right) {
            map.xpos -= this.speed;
        }
    }

    collision_detection(map) {
        // get the cell that the player is currently in 
        // for each wall in that cell check if player is touching that wall
        // if the player is, set the direction corresponding to that wall to false

        let cell_top_left = this.get_current_cell(map, this.xpos, this.ypos);
        let cell_top_right = this.get_current_cell(map, this.xpos + this.size, this.ypos);
        let cell_bottom_left = this.get_current_cell(map, this.xpos, this.ypos + this.size);
        let cell_bottom_right = this.get_current_cell(map, this.xpos + this.size, this.ypos + this.size);

        // Check if player is touching any wall of the cell
        if (cell_top_left.walls.top && this.ypos <= cell_top_left.ypos + 5) {
            this.up = false;
        }

        if (cell_top_left.walls.left && this.xpos <= cell_top_left.xpos + 5) {
            this.left = false;
        }

        if (cell_top_left.walls.bottom && this.ypos + this.size >= cell_top_left.ypos + cell_top_left.height - 5) {
            this.down = false;
        }

        if (cell_top_left.walls.right && this.xpos + this.size >= cell_top_left.xpos + cell_top_left.width - 5) {
            this.right = false;
        }

        //Edge case to stop player from travelling down the vertical of a wall
        // if (cell_top_left.col_num + 1 === cell_top_right.col_num) {
        //     if (cell_top_left.row_num < map.num_rows - 1 && cell_top_left.row_num > 0) {
        //         new_cell_bottom = map.grid[cell_top_left.row_num + 1][cell_top_left.col_num];
        //         new_cell_top = map.grid[cell_top_left.row_num - 1][cell_top_left.col_num];
            
        //         if (new_cell_bottom.walls.right) {
        //             this.down = false;
        //         } else {
        //             this.down = true;
        //         }

        //         if (new_cell_top.walls.right) {
        //             this.up = false;
        //         } else {
        //             this.up = true;
        //         }
        //     }

        // }
        

    }

    get_current_cell(map, xpos, ypos) {
        // Calculate player's position relative to the map
        let relX = xpos - map.xpos;
        let relY = ypos - map.ypos;

        // Calculate the width and height of each cell
        let cell_width = map.size / map.num_cols;
        let cell_height = map.size / map.num_rows;

        // Calculate the row and column number of the cell the player is in
        let col_num = Math.floor(relX / cell_width);
        let row_num = Math.floor(relY / cell_height);

        //  Return the corresponding cell from the grid
        map.maze.grid[row_num][col_num].calculate_cell(map); //makes sure xpos, ypos, width, height are defined for cell
        return map.maze.grid[row_num][col_num];
    }



    getInput() {
        if (this.input.isKeyDown('w') || this.input.isKeyDown('ArrowUp')) {
            this.up = true;
        } else {
            this.up = false;
        }


        if (this.input.isKeyDown('a') || this.input.isKeyDown('ArrowLeft')) {
            this.left = true;
        } else {
            this.left = false;
        }


        if (this.input.isKeyDown('s') || this.input.isKeyDown('ArrowDown')) {
            this.down = true;
        } else {
            this.down = false;
        }


        if (this.input.isKeyDown('d') || this.input.isKeyDown('ArrowRight')) {
            this.right = true;
        } else {
            this.right = false;
        }

    }

}

export class InputHandler {
    constructor() {
        this.keyDown = {};

        window.addEventListener('keydown', (e) => {
            this.keyDown[e.key] = true;
        });

        window.addEventListener('keyup', (e) => {
            this.keyDown[e.key] = false;
        });
    }

    isKeyDown(key) {
        return this.keyDown[key];
    }
}



export class Enemy extends Entity {
    constructor(size, xpos, ypos, speed) {
        super(size, xpos, ypos, speed);
    }

}

export class Map {
    constructor(size, xpos, ypos, num_rows, num_cols) {
        this.size = size;

        this.xpos = xpos;
        this.ypos = ypos;

        this.num_rows = num_rows;
        this.num_cols = num_cols;

        this.maze = new Maze(num_rows, num_cols);
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
        this.width;
        this.height;
        this.xpos;
        this.ypos;
    }

    calculate_cell(map) {
        // Calculate the width and height of each cell
        this.width = map.size / map.num_cols;
        this.height = map.size / map.num_rows;

        // Calculate the x and y position of the cell
        this.xpos = this.col_num * this.width + map.xpos;
        this.ypos = this.row_num * this.height + map.ypos;
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


