import Board from './board';
import Piece from './piece';

import King from './pieces/king';
import Queen from './pieces/queen';
import Rook from './pieces/rook';
import Bishop from './pieces/bishop';
import Knight from './pieces/knight';
import Pawn from './pieces/pawn';

import { expose } from './utils';

expose(
    { name: 'Board', type: Board },
    { name: 'Piece', type: Piece },
    { name: 'King', type: King },
    { name: 'Queen', type: Queen },
    { name: 'Rook', type: Rook },
    { name: 'Bishop', type: Bishop },
    { name: 'Knight', type: Knight },
    { name: 'Pawn', type: Pawn },
    { name: 'Board', type: Board },
);
