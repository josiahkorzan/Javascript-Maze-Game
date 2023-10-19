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



