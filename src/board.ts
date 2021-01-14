import AbstractBoard from './abstractBoard';
import SimulationBoard from './simulationBoard';

import { Color } from './color';

import King from './pieces/king';
import Queen from './pieces/queen';
import Rook from './pieces/rook';
import Bishop from './pieces/bishop';
import Knight from './pieces/knight';
import Pawn from './pieces/pawn';
import Vector from './vector';




export default class Board extends AbstractBoard {
    turn: Color;

    constructor(sizeX: number, sizeY: number) {
        super(sizeX, sizeY);
        this.kings = [];
        this.turn = Color.WHITE;
    }


    forSquares(callback: Function) {
        for(let x = 0; x < this.size.x; ++x) {
            for(let y = 0; y < this.size.y; ++y) {
                callback(x, y, this.getPiece(x, y));
            }
        }
    }

    forPieces(callback: Function) {
        for(let x = 0; x < this.size.x; ++x) {
            for(let y = 0; y < this.size.y; ++y) {
                if(!this.getPiece(x, y)) return;
                callback(this.getPiece(x, y));
            }
        }
    }


    movePiece(fromX: number, fromY: number, toX: number, toY: number) {
        const piece = this.getPiece(fromX, fromY);

        if(piece.color !== this.turn) return false;
        if(!piece.canMoveTo(toX, toY)) return false;

        this.removePiece(fromX, fromY);
        this.addPiece(toX, toY, piece);
        ++piece.moveCount;
        
        piece.onAfterMove(new Vector(fromX, fromY), new Vector(toX, toY));

        this.calculateEndTurn(Color.reverse(piece.color));

        this.turn = Color.reverse(this.turn);

        return true;
    }

    playableMoves() {
        const moves: Array<{ from: Vector, to: Vector }> = [];
        for(let i = 0; i < this.pieces.length; ++i) {
            const piece = this.pieces[i];
            if(!piece || piece.color !== this.turn) continue;
            piece.calculatePlayableMoves().forEach(move => {
                moves.push({ from: new Vector(piece.x, piece.y), to: move });
            });
        }

        return moves;
    }

    calculateEndTurn(color: Color) {
        // Check if there's any move that wont result in a check
        for(let i = 0; i < this.pieces.length; ++i) {
            const piece = this.pieces[i];
            if(!piece || piece.color !== color) continue;
            const moves = piece.calculatePlayableMoves();
            if(moves.length > 0) return false;
        }

        // Now if we can't move...
        const friendKing = this.kings[color];

        const simulationBoard = new SimulationBoard(this);
        if(simulationBoard.calculateChecks(Color.reverse(color)).isChecked(friendKing.x, friendKing.y)) {
            console.log('Checkmate');
        }
        else {
            console.log('Stalemate')
        }

        return true;
    }

    testSetup() {
        this.addPiece(2, 6, new Rook(Color.WHITE));
        this.addPiece(6, 6, new Bishop(Color.WHITE));
        this.kings[Color.WHITE] = this.addPiece(0, 7, new King(Color.WHITE));
        this.kings[Color.BLACK] = this.addPiece(0, 1, new King(Color.BLACK));
    }

    testSetup2() {
        this.addPiece(0, 7, new Rook(Color.WHITE));
        this.addPiece(7, 7, new Rook(Color.WHITE));
        this.addPiece(0, 0, new Rook(Color.BLACK));
        this.addPiece(7, 0, new Rook(Color.BLACK));

        this.kings[Color.WHITE] = this.addPiece(4, 7, new King(Color.WHITE));
        this.kings[Color.BLACK] = this.addPiece(4, 0, new King(Color.BLACK));
    }

    classicSetup() {
        if(this.size.x !== 8 || this.size.y !== 8) return;
        this.clear();
        this.addPiece(0, 0, new Rook(Color.BLACK));
        this.addPiece(1, 0, new Knight(Color.BLACK));
        this.addPiece(2, 0, new Bishop(Color.BLACK));
        this.addPiece(3, 0, new Queen(Color.BLACK));
        this.addPiece(4, 0, new King(Color.BLACK));
        this.addPiece(5, 0, new Bishop(Color.BLACK));
        this.addPiece(6, 0, new Knight(Color.BLACK));
        this.addPiece(7, 0, new Rook(Color.BLACK));
        this.addPiece(0, 1, new Pawn(Color.BLACK));
        this.addPiece(1, 1, new Pawn(Color.BLACK));
        this.addPiece(2, 1, new Pawn(Color.BLACK));
        this.addPiece(3, 1, new Pawn(Color.BLACK));
        this.addPiece(4, 1, new Pawn(Color.BLACK));
        this.addPiece(5, 1, new Pawn(Color.BLACK));
        this.addPiece(6, 1, new Pawn(Color.BLACK));
        this.addPiece(7, 1, new Pawn(Color.BLACK));
        this.addPiece(0, 7, new Rook(Color.WHITE));
        this.addPiece(1, 7, new Knight(Color.WHITE));
        this.addPiece(2, 7, new Bishop(Color.WHITE));
        this.addPiece(3, 7, new Queen(Color.WHITE));
        this.addPiece(4, 7, new King(Color.WHITE));
        this.addPiece(5, 7, new Bishop(Color.WHITE));
        this.addPiece(6, 7, new Knight(Color.WHITE));
        this.addPiece(7, 7, new Rook(Color.WHITE));
        this.addPiece(0, 6, new Pawn(Color.WHITE));
        this.addPiece(1, 6, new Pawn(Color.WHITE));
        this.addPiece(2, 6, new Pawn(Color.WHITE));
        this.addPiece(3, 6, new Pawn(Color.WHITE));
        this.addPiece(4, 6, new Pawn(Color.WHITE));
        this.addPiece(5, 6, new Pawn(Color.WHITE));
        this.addPiece(6, 6, new Pawn(Color.WHITE));
        this.addPiece(7, 6, new Pawn(Color.WHITE));
    }
}