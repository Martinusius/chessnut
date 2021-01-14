import { Color } from './color';

export default class CheckMask {
    private color: Color;
    private checks: Array<boolean>;
    private size: { x: number, y: number };

    constructor(sizeX: number, sizeY: number, color: Color) {
        this.size = { x: sizeX, y: sizeY };
        this.color = color;
        this.checks = new Array(this.size.x * this.size.y).fill(false);
    }

    setChecked(x: number, y: number, checked: boolean) {
        this.checks[x + y * this.size.x] = checked;
    }

    isChecked(x: number, y: number): boolean {
        return this.checks[x + y * this.size.x];
    }


    get checkingColor() {
        return this.color;
    }
    get checkedColor() {
        return Color.reverse(this.color);
    }
}