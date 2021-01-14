import Piece, { DIAGONALS, STRAIGHTS } from '../piece';
import { Color } from '../color';

export default class Queen extends Piece {
    constructor(color: Color) {
        super(color);
        this.name = 'Queen';
    }
    _getPossibleMoves(consumer: (x: number, y: number) => void, onlyCaptures = false) {
        DIAGONALS.forEach(diagonal => {
            this._getDirectionalMoves(consumer, diagonal.x, diagonal.y, onlyCaptures);
        });
        STRAIGHTS.forEach(straight => {
            this._getDirectionalMoves(consumer, straight.x, straight.y, onlyCaptures);
        });
    }
}