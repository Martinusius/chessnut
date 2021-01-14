import Piece from '../piece';
import { Color } from '../color';
import Queen from './queen';
import Vector from '../vector';

export default class Pawn extends Piece {
    static Promotion = {
        enable: true
    };

    constructor(color: Color) {
        super(color);
        this.name = 'Pawn';
    }

    _getPossibleMoves(consumer: (x: number, y: number) => void, onlyCaptures = false){
        const dy = this.color === Color.WHITE ? -1 : 1;
        for(let dx = -1; dx <= 1; dx += 2) {
            const x = this.x + dx;
            const y = this.y + dy;

            if(x < 0 || y < 0 || x >= this.board.size.x || y >= this.board.size.y) continue;
            if(!this._isEnemy(x, y)) continue;
            
            consumer(x, y);
        }

        if(onlyCaptures) return;

        if(!this._isEmpty(this.x, this.y + dy)) return;
        consumer(this.x, this.y + dy);
        if(!this._isEmpty(this.x, this.y + 2 * dy) || this.moveCount > 0) return;
        consumer(this.x, this.y + 2 * dy);
    }


    onAfterMove(from: Vector, to: Vector) {
        if(!Pawn.Promotion.enable) return;
        
        const targetY = this.color === Color.WHITE ? 0 : 7;
        if(this.y === targetY)
            this.board.addPiece(this.x, this.y, new Queen(this.color));
    }
}