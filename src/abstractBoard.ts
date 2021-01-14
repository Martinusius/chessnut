import Piece from './piece';


export default class AbstractBoard {
    _state: number
    size: { x: number, y: number };
    pieces: Array<Piece>;
    kings: Array<Piece>;

    constructor(sizeX: number, sizeY: number) {
        this._state = 0;
        this.size = { x: sizeX || 8, y: sizeY || 8 };
        this.pieces = new Array(this.size.x * this.size.y).fill(null);
        this.kings = [];
    }


    removePiece(x: number, y: number) {
        const piece = this.pieces[x + y * this.size.x];
        if(piece && piece.name === 'King') delete this.kings[piece.color];
        this.pieces[x + y * this.size.x] = null;

        ++this._state;
        return piece;
    }

    addPiece(x: number, y: number, piece: Piece) {
        if(!piece) return;
        if(piece.name === 'King') {
            if(this.kings.hasOwnProperty(piece.color)) throw new Error('Only one king per color allowed');
            this.kings[piece.color] = piece;
        }

        piece.board = this;
        piece.x = x;
        piece.y = y;
        this.pieces[x + y * this.size.x] = piece;

        ++this._state;
        return piece;
    }

    getPiece(x: number, y: number) {
        return this.pieces[x + y * this.size.x];
    }

    // Remove all pieces from the board
    clear() {
        this.kings = [];
        this.pieces.fill(null);
    }
    
}