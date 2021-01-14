import { Color } from './color';
import Move from './move';
import Vector from './vector';

import AbstractBoard from './abstractBoard';
import SimulationBoard from './simulationBoard';

export const DIAGONALS = [
    new Vector(-1, -1),
    new Vector( 1, -1),
    new Vector(-1,  1),
    new Vector( 1,  1),
];

export const STRAIGHTS = [
    new Vector( 1,  0),
    new Vector(-1,  0),
    new Vector( 0,  1),
    new Vector( 0, -1),
];



export default class Piece {
    name: string;

    color: Color;
    moveCount: number;

    private _playableMoves: Array<any>;
    private _lastState: number;

    board: AbstractBoard;
    x: number;
    y: number;

    constructor(color: Color) {
        this.color = color;
        this.moveCount = 0;

        this._playableMoves = [];
        this._lastState = 0;
    }

    onAfterMove(from: Vector, to: Vector) {}

    get assetName(): string {
        return `${this.name.toLowerCase()}_${this.color ? 'black' : 'white'}`;
    }

    get playableMoves(): Array<Move> {
        if(this._lastState === this.board._state) return this._playableMoves;
        else return this.calculatePlayableMoves();
    }

    _getPossibleMoves(consumer: (x: number, y: number) => void, onlyCaptures = false) {}



    calculatePlayableMoves(): Array<Vector> {
        this._lastState = this.board._state;

        const moves: Array<Vector> = [];
        this._getPossibleMoves((x, y) => { moves.push(new Vector(x, y)); });
        return this._playableMoves = moves.filter(move => this._validateMove(move.x, move.y));
    }

    canMoveTo(toX: number, toY: number): boolean {
        return this.playableMoves.some(move => move.x === toX && move.y === toY);
    }


    // Get moves in straight line (for bishop, rook, and queen)
    // x and y indicate direction, they can be -1, 0, or 1
    protected _getDirectionalMoves(consumer: (x: number, y: number) => void, directionX: number, directionY: number, onlyCaptures = false) {
        let x = this.x + directionX;
        let y = this.y + directionY;
        let moveCount = 0;
        
        while(true) {
            // Cannot move outside the board
            if(x < 0 || y < 0 || x >= this.board.size.x || y >= this.board.size.y) break;
            if(this._isFriend(x, y)) break;

            if(!onlyCaptures || this._isEnemy(x, y)) consumer(x, y);

            if(this._isEnemy(x, y)) break;
            x += directionX;
            y += directionY;
            ++moveCount;
        }
    }

    // Verify that the specified move doesn't cause our king to be in check
    _validateMove(toX: number, toY: number): boolean {
        const friendColor = this.color;
        const enemyColor = Color.reverse(friendColor);

        // Create a virutal board and perform the move there
        const simulationChessboard = new SimulationBoard(this.board);
        simulationChessboard.movePiece(this.x, this.y, toX, toY);
        const friendKing = simulationChessboard.kings[friendColor];

        // Calculate checks on the virtual board and check if king is checked
        const enemyChecks = simulationChessboard.calculateChecks(enemyColor);
        return !enemyChecks.isChecked(friendKing.x, friendKing.y);
    }

    // Helper method for strict relative moves (like knight)
    protected _getRelativeMoves(consumer: (x: number, y: number) => void, relatives: Array<Vector>, onlyCaptures = false) {
        relatives.forEach(relative => {
            const x = this.x + relative.x;
            const y = this.y + relative.y;

            if(x < 0 || y < 0 || x >= this.board.size.x || y >= this.board.size.y) return;
            if(this._isFriend(x, y)) return;

            if(!onlyCaptures || this._isEnemy(x, y)) consumer(x, y);
        });
    }

    protected _isFriend(x: number, y: number) {
        const piece = this.board.getPiece(x, y);
        return piece && piece.color === this.color;
    }
    protected _isEnemy(x: number, y: number) {
        const piece = this.board.getPiece(x, y);
        return piece && piece.color !== this.color;
    }
    protected _isEmpty(x: number, y: number) {
        return !this.board.getPiece(x, y);
    }
}