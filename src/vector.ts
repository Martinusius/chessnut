export default class Vector {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    add(x: number, y: number): Vector {
        return new Vector(this.x + x, this.y + y);   
    }

    subtract(x: number, y: number): Vector {
        return new Vector(this.x - x, this.y - y);   
    }
};