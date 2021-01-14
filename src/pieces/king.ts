import Piece from '../piece';
import { Color } from '../color';
import SimulationBoard from '../simulationBoard';
import Vector from '../vector';
import Rook from './rook';

export default class King extends Piece {
    static Castling = {
        enable: true,
        extensible: false // Allow longer castling except classic kingside and queenside (for custom boards)
    };

    constructor(color: Color) {
        super(color);
        this.name = 'King';
    }
    _getPossibleMoves(consumer: (x: number, y: number) => void, onlyCaptures = false) {
        for(let dx = -1; dx <= 1; ++dx) {
            for(let dy = -1; dy <= 1; ++dy) {
                // Cannot move to itself
                if(dx === 0 && dy === 0) continue;
                
                const x = this.x + dx;
                const y = this.y + dy;

                // New position has to be within board
                if(x < 0 || y < 0 || x >= this.board.size.x || y >= this.board.size.y) continue;
            
                // Cannot attack friends
                if(this._isFriend(x, y)) continue;

                if(!onlyCaptures || this._isEnemy(x, y)) consumer(x, y);
            }
        }

        // Castling
        if(!King.Castling.enable || onlyCaptures) return;


        const rooks = this.board.pieces.filter(piece => piece && piece.name === 'Rook' && piece.color === this.color);

        // 2. Neither the king nor the chosen rook has previously moved.
        if(this.moveCount > 0) return;

        rooks.forEach(rook => {
            // Just in case someone tries this on some weird setup
            if(this.y !== rook.y) return;

            // 1. The castling must be kingside or queenside.
            const rookDistance = Math.abs(rook.x - this.x);
            if(King.Castling.extensible && (rookDistance < 2 || rookDistance > 3)) return; 

            // 2. Neither the king nor the chosen rook has previously moved.
            if(rook.moveCount > 0) return;
            
            //3. There are no pieces between the king and the chosen rook.
            const dx = rook.x > this.x ? 1 : -1;
            for(let i = this.x + dx; i !== rook.x; i += dx) {
                if(!this._isEmpty(i, this.y)) return;
            }

            // 4. The king is not currently in check.
            // 5. The king does not pass through a square that is attacked by an enemy piece.
          
            const simulationBoard = new SimulationBoard(this.board);
            const checkMask = simulationBoard.calculateChecks(Color.reverse(this.color));
            for(let i = this.x; i !== this.x + 3 * dx; i += dx) {
                if(checkMask.isChecked(i, this.y)) return;
            }

            consumer(this.x + dx * 2, this.y);
        });
    }

    onAfterMove(from: Vector, to: Vector) {
        // Castling
        if(!King.Castling.enable) return;

        if(from.y !== to.y || Math.abs(from.x - to.x) === 1) return;

        const dx = (to.x - from.x) / 2;
        let x = from.x + dx;
        while(true) {
            const piece = this.board.getPiece(x, from.y);
            if(piece && piece.name === 'Rook') break;
            x += dx;
        }

        const rook = this.board.removePiece(x, from.y);
        this.board.addPiece(from.x + dx, from.y, rook);
        ++rook.moveCount;
    }
}