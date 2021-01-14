import AbstractBoard from './abstractBoard';

import Piece from './piece';
import { Color } from './color';
import CheckMask from './checkMask';
import Vector from './vector';


function clonePiece(piece: Piece) {
    if(!piece) return null;
    const clonedPiece = new (Object.getPrototypeOf(piece).constructor)(piece.color);
    clonedPiece.moveCount = piece.moveCount;
    return clonedPiece;
}


export default class SimulationBoard extends AbstractBoard {
    _state: number
    size: { x: number, y: number };
    pieces: Array<Piece>
    kings: Array<Piece>

    constructor(board: AbstractBoard) {
        super(board.size.x, board.size.y);

        for(let x = 0; x < this.size.x; ++x) {
            for(let y = 0; y < this.size.y; ++y) {
                this.addPiece(x, y, clonePiece(board.getPiece(x, y)));
            }
        }
    }


    movePiece(fromX: number, fromY: number, toX: number, toY: number) {
        const piece = this.removePiece(fromX, fromY);
        this.addPiece(toX, toY, piece);
        ++piece.moveCount;
        piece.onAfterMove(new Vector(fromX, fromY), new Vector(toX, toY));
    }


    // Board mask
    calculateChecks(color: Color) {
        const mask = new CheckMask(this.size.x, this.size.y, color);
        this.pieces.forEach(piece => {
            if(!piece || piece.color !== color) return;
            piece._getPossibleMoves((x, y) => { mask.setChecked(x, y, true); }, true);
        });
        
        return mask;
    }

    // Remove all pieces from the board
    clear() {
        this.pieces.fill(null);
    }
    
}