import Piece from '../piece';
import { Color } from '../color';
import Vector from '../vector';

export default class Knight extends Piece {
    constructor(color: Color) {
        super(color);
        this.name = 'Knight';
    }
    _getPossibleMoves(consumer: (x: number, y: number) => void, onlyCaptures = false) {
        this._getRelativeMoves(consumer, [
            new Vector(-2, -1),
            new Vector(-2,  1),
            new Vector(-1, -2),
            new Vector(-1,  2),
            new Vector( 1, -2),
            new Vector( 1,  2),
            new Vector( 2, -1),
            new Vector( 2,  1),
        ], onlyCaptures);
    }
}

