import Piece from './piece';

export default class HistoryMove {
    piece: Piece;
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
    capture: Piece;

    constructor(piece: Piece, fromX: number, fromY: number, toX: number, toY: number, capture: Piece) {
        this.piece = piece;
        this.fromX = fromX;
        this.fromY = fromY;
        this.toX = toX;
        this.toY = toY;
        this.capture = capture;
    }
};