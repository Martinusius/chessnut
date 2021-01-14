export const Color = {
    WHITE: 'white',
    BLACK: 'black',
    reverse: (color) => {
        return color === Color.WHITE ? Color.BLACK : Color.WHITE;
    } 
};

const GameEnd = {
    CHECKMATE: 'checkmate',
    STALEMATE: 'stalemate',
}

class Piece {
    constructor(color) {
        this.color = color;
        this.moveCount = 0;

        this._playableMoves = [];
        this._lastState = 0;
    }

    get assetName() {
        return `${this.constructor.name.toLowerCase()}_${this.color}`;
    }
    

    get playableMoves() {
        if(this._lastState === this.board._state) return this._playableMoves;
        else return this.calculatePlayableMoves();
    }

    getPossibleMoves() {
        return [];
    }



    calculatePlayableMoves() {
        this._lastState = this.board._state;
        return this._playableMoves = this.getPossibleMoves().filter(move => this._validateMove(move.x, move.y));
    }

    canMoveTo(tx, ty) {
        return this.playableMoves.some(move => move.x === tx && move.y === ty);
    }

    moveTo(tx, ty) {
        return this.board.move(this.x, this.y, tx, ty);
    }

    // Get moves in straight line (for bishop, rook, and queen)
    // x and y indicate direction, they can be -1, 0, or 1
    _getDirectionalMoves(dx, dy, canCapture = true, moveLimit = -1) {
        const array = [];
        let x = this.x + dx;
        let y = this.y + dy;
        let moveCount = 0;
        
        while(true) {
            if(moveCount === moveLimit) break;
            // Cannot move outside the board
            if(x < 0 || y < 0 || x >= this.board.size.x || y >= this.board.size.y) break;
            if(!this._isEmpty(x, y) && !canCapture) break;
            if(this._isFriend(x, y)) break;
            array.push({ x: x, y: y });
            if(this._isEnemy(x, y)) break;
            x += dx;
            y += dy;
            ++moveCount;
        }
        return array;
    }

    // Verify that the specified move doesn't cause our king to be in check
    _validateMove(tx, ty) {
        const friendColor = this.color;
        const enemyColor = Color.reverse(friendColor);

        // Create a virutal board and perform the move there
        const virtualBoard = new VirtualBoard(this.board);
        virtualBoard.movePiece(this.x, this.y, tx, ty);
        const friendKing = virtualBoard.kings[friendColor];

        // Calculate checks on the virtual board and check if king is checked
        const enemyChecks = virtualBoard.calculateChecks(enemyColor);
        return !enemyChecks.isChecked(friendKing.x, friendKing.y);
    }

    // Helper method for strict relative moves (like knight)
    _getRelativeMoves(relatives) {
        const array = [];
        relatives.forEach(relative => {
            const x = this.x + relative.x;
            const y = this.y + relative.y;
            if(x < 0 || y < 0 || x >= this.board.size.x || y >= this.board.size.y) return;
            if(this._isFriend(x, y)) return;
            array.push({ x: x, y: y });
        });
        return array;
    }

    _isFriend(x, y) {
        const piece = this.board.getPiece(x, y);
        return piece && piece.color === this.color;
    }
    _isEnemy(x, y) {
        const piece = this.board.getPiece(x, y);
        return piece && piece.color !== this.color;
    }
    _isEmpty(x, y) {
        return !this.board.getPiece(x, y);
    }
}


class King extends Piece {
    constructor(color) {
        super(color);
        this.name = 'King';
    }
    getPossibleMoves() {
        const array = [];
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
                array.push({ x: x, y: y });
            }
        }

        return array;
    }
}


class Queen extends Piece {
    constructor(color) {
        super(color);
        this.name = 'Queen';
    }
    getPossibleMoves() {
        let array = [];
        for(let dx = -1; dx <= 1; ++dx) {
            for(let dy = -1; dy <= 1; ++dy) {
                // 0, 0 is invalid direction
                if(dx !== 0 || dy !== 0) array = array.concat(this._getDirectionalMoves(dx, dy));
            }
        }
        return array;
    }
}


class Rook extends Piece {
    constructor(color) {
        super(color);
        this.name = 'Rook';
    }
    getPossibleMoves() {
        let array = [];
        for(let dx = -1; dx <= 1; ++dx) {
            for(let dy = -1; dy <= 1; ++dy) {
                if((dx === 0 || dy === 0) && (dx !== 0 || dy !== 0)) array = array.concat(this._getDirectionalMoves(dx, dy));
            }
        }
        return array;
    }
}


class Bishop extends Piece {
    constructor(color) {
        super(color);
        this.name = 'Bishop';
    }
    getPossibleMoves() {
        let array = [];
        for(let dx = -1; dx <= 1; ++dx) {
            for(let dy = -1; dy <= 1; ++dy) {
                if(dx !== 0 && dy !== 0) array = array.concat(this._getDirectionalMoves(dx, dy));
            }
        }
        return array;
    }
}


class Knight extends Piece {
    constructor(color) {
        super(color);
        this.name = 'Knight';
    }
    getPossibleMoves() {
        return this._getRelativeMoves([
            { x: -1, y: -2 },
            { x:  1, y: -2 },
            { x:  2, y: -1 },
            { x:  2, y:  1 },
            { x:  1, y:  2 },
            { x: -1, y:  2 },
            { x: -2, y:  1 },
            { x: -2, y: -1 }
        ]);
    }
}


class Pawn extends Piece {
    constructor(color) {
        super(color);
        this.name = 'Pawn';
    }

    getPossibleMoves() {
        let array = [];
        const dy = (this.color === Color.WHITE ? -1 : 1);
        for(let dx = -1; dx <= 1; dx += 2) {
            const x = this.x + dx;
            const y = this.y + dy;
            if(x < 0 || y < 0 || x >= this.board.size.x || y >= this.board.size.y) continue;
            if(this._isFriend(x, y)) continue;
            if(this._isEmpty(x, y)) continue;
            
            array.push({ x: x, y: y });
        }
        array = array.concat(this._getDirectionalMoves(0, dy, false, this.moveCount === 0 ? 2 : 1));
        return array;
    }
}


class CheckMask {
    constructor(board, color, checks) {
        this.board = board;
        this.color = color;
        this.checks = checks;
    }
    isChecked(x, y) {
        return this.checks[x + y * this.board.size.x];
    }
    getCheckingColor() {
        return this.color;
    }
    getCheckedColor() {
        return Color.reverse(this.color);
    }
}


class VirtualBoard {
    constructor(arg0, arg1) {
        if(arg0 && arg0 instanceof VirtualBoard) this.constructorBoard(arg0);
        else this.constructorSizes(arg0, arg1);

        this._state = 0;
    }

    constructorSizes(sizeX, sizeY) {
        this.size = { x: sizeX || 8, y: sizeY || 8 };
        this.pieces = new Array(this.size.x * this.size.y).fill(null);
        this.kings = {};
    }

    constructorBoard(board) {
        this.size = { x: board.size.x, y: board.size.y };
        this.pieces = new Array(this.size.x * this.size.y).fill(null);
        this.kings = {};
        board.pieces.forEach(piece => {
            if(!piece) return;
            const clonedPiece = new piece.constructor(piece.color);
            clonedPiece.moveCount = piece.moveCount;
            this.addPiece(piece.x, piece.y, clonedPiece);
        });
    }

    movePiece(fx, fy, tx, ty) {
        const piece = this.removePiece(fx, fy);
        this.addPiece(tx, ty, piece);
        ++piece.moveCount;
        return piece;
    }

    removePiece(x, y) {
        const piece = this.pieces[x + y * this.size.x];
        if(piece && piece instanceof King) delete this.kings[piece.color];
        this.pieces[x + y * this.size.x] = null;

        ++this._state;
        return piece;
    }

    addPiece(x, y, piece) {
        if(piece instanceof King) {
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

    getPiece(x, y) {
        return this.pieces[x + y * this.size.x];
    }

    // Board mask
    calculateChecks(color) {
        const checks = new Array(this.size.x * this.size.y).fill(false);
        this.pieces.forEach(piece => {
            if(!piece || piece.color !== color) return;
            piece.getPossibleMoves().forEach(move => {
                checks[move.x + move.y * this.size.x] = true;
            });
        });
        return new CheckMask(this, color, checks);
    }

    // Remove all pieces from the board
    clear() {
        this.pieces.fill(null);
    }

    // Create the begginning board state
    basicSetup() {
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

class Board extends VirtualBoard {
    constructor(sizeX, sizeY, config) {
        super(sizeX, sizeY);
        this.kings = {};
        this.turn = Color.WHITE;

        this.handlers = {};
        this.config = config || {
            errors: true,
        };

        this.history = [];
        this.graveyard = [];
    }


    forSquares(callback) {
        for(let x = 0; x < this.size.x; ++x) {
            for(let y = 0; y < this.size.y; ++y) {
                callback(x, y, this.getPiece(x, y));
            }
        }
    }

    forPieces(callback) {
        for(let x = 0; x < this.size.x; ++x) {
            for(let y = 0; y < this.size.y; ++y) {
                if(!this.getPiece(x, y)) return;
                callback(this.getPiece(x, y));
            }
        }
    }

    undo(count = 1) {
        count = Math.min(count, this.history.length);

        for(let i = 0; i < count; ++i) {
            const event = this.history.pop();
            this.movePiece(event.piece.x, event.piece.y, event.from.x, event.from.y);

            if(!event.capture) continue;
            this.addPiece(event.capture.x, event.capture.y, event.capture);
            this.graveyard.pop();
        }
    }

    _error(name, params, message) {
        if(!this.handlers.hasOwnProperty(`on${name}`) && this.config.errors) throw Error(`${name}: ${message}`);
        else this.handlers[`on${name}`](...params);

        return false;
    }

    move(fx, fy, tx, ty) {
        const piece = this.getPiece(fx, fy);
        if(piece.color !== this.turn) return false;
        
        if(!piece.canMoveTo(tx, ty)) return false;


        if(this.getPiece(tx, ty))
            this.graveyard.push(this.getPiece(tx, ty));


        this.history.push({
            piece: piece,
            from: { x: fx, y: fy },
            to: { x: tx, y: ty},
            capture: this.getPiece(tx, ty)
        });


        this.movePiece(fx, fy, tx, ty);
        this.calculateEndTurn(Color.reverse(piece.color));

        this.turn = Color.reverse(this.turn);
    }

    calculateEndTurn(color) {
        // Check if there's any move that wont result in a check
        for(let i = 0; i < this.pieces.length; ++i) {
            const piece = this.pieces[i];
            if(!piece || piece.color !== color) continue;
            const moves = piece.calculatePlayableMoves();
            if(moves.length > 0) return false;
        }

        // Now if we can't move...
        const friendKing = this.kings[color];
        
        if(this.calculateChecks(Color.reverse(color)).isChecked(friendKing.x, friendKing.y)) {
            this.events.onGameEnd(Color.reverse(color), GameEnd.CHECKMATE);
        }
        else {
            this.events.onGameEnd(Color.reverse(color), GameEnd.STALEMATE);
        }

        return true;
    }

    testSetup() {
        this.addPiece(2, 6, new Rook(Color.WHITE));
        this.addPiece(6, 6, new Bishop(Color.WHITE));
        this.kings[Color.WHITE] = this.addPiece(0, 7, new King(Color.WHITE));
        this.kings[Color.BLACK] = this.addPiece(0, 1, new King(Color.BLACK));
    }
}