import Piece, { STRAIGHTS } from '../piece';
import { Color } from '../color';

export default class Rook extends Piece {
    constructor(color: Color) {
        super(color);
        this.name = 'Rook';
    }
    _getPossibleMoves(consumer: (x: number, y: number) => void, onlyCaptures = false) {
        STRAIGHTS.forEach(straight => {
            this._getDirectionalMoves(consumer, straight.x, straight.y, onlyCaptures);
        });
    }
}
