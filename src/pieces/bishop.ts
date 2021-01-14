import Piece, { DIAGONALS } from '../piece';
import { Color } from '../color';
import Move from '../move';

export default class Bishop extends Piece {
    constructor(color: Color) {
        super(color);
        this.name = 'Bishop';
    }
    _getPossibleMoves(consumer: (x: number, y: number) => void, onlyCaptures = false) {
        DIAGONALS.forEach(diagonal => {
            this._getDirectionalMoves(consumer, diagonal.x, diagonal.y, onlyCaptures);
        });
    }
}