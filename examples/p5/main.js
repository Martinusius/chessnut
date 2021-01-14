const board = new Board(8, 8);
board.testSetup2();

let tileSize;
let images = {};

function initCanvas() {
    const size = Math.min(window.innerWidth, window.innerHeight);
    createCanvas(size, size);
}

window.addEventListener('resize', initCanvas)



function setup() {
    initCanvas();

    noStroke();

    images['king_white'] = loadImage('Chess_klt45.svg');
    images['king_black'] = loadImage('Chess_kdt45.svg');
    images['queen_white'] = loadImage('Chess_qlt45.svg');
    images['queen_black'] = loadImage('Chess_qdt45.svg');
    images['rook_white'] = loadImage('Chess_rlt45.svg');
    images['rook_black'] = loadImage('Chess_rdt45.svg');
    images['bishop_white'] = loadImage('Chess_blt45.svg');
    images['bishop_black'] = loadImage('Chess_bdt45.svg');
    images['knight_white'] = loadImage('Chess_nlt45.svg');
    images['knight_black'] = loadImage('Chess_ndt45.svg');
    images['pawn_white'] = loadImage('Chess_plt45.svg');
    images['pawn_black'] = loadImage('Chess_pdt45.svg');


    
}

let grabbedPiece;
    
function draw() {
    background(255);
    

    tileSize = Math.min(window.innerWidth / board.size.x, window.innerHeight / board.size.y);

    

    board.forSquares((x, y, piece) => {
        fill(...((x + y) % 2 == 0 ? [255] : [100, 150, 100]));
        if(grabbedPiece && grabbedPiece.canMoveTo(x, y)) fill(100, 100, 150);
        
        rect(x * tileSize, y * tileSize, tileSize, tileSize);
        

        if(!piece) return;
        if(piece === grabbedPiece) return false;
        
        image(images[piece.assetName], x * tileSize, y * tileSize, tileSize, tileSize);
    });

    if(!grabbedPiece) return;

    image(images[grabbedPiece.assetName], window.mouseX - tileSize / 2, window.mouseY - tileSize / 2, tileSize, tileSize);
}


function mousePressed() {
    // Calculate position on the board
    const x = Math.floor(window.mouseX / tileSize);
    const y = Math.floor(window.mouseY / tileSize);

    // Ignore clicks outside the board
    if(x < 0 || y < 0 || x >= board.size.x || y >= board.size.y) return;
    const clickedPiece = board.getPiece(x, y);

    if(clickedPiece && clickedPiece.color === board.turn)
        grabbedPiece = clickedPiece;
}

function mouseReleased() {
    if(!grabbedPiece) return;

    const releasedPiece = grabbedPiece;
    grabbedPiece = undefined; // Release it even if the move is invalid

    // Calculate position on the board
    const x = Math.floor(window.mouseX / tileSize);
    const y = Math.floor(window.mouseY / tileSize);

    // Ignore releases outside the board
    if(x < 0 || y < 0 || x >= board.size.x || y >= board.size.y) return;

    if(!board.movePiece(releasedPiece.x, releasedPiece.y, x, y)) return;
    
    const moves = board.playableMoves();
    const selectedMove = moves[Math.floor(Math.random() * moves.length)];
    board.movePiece(selectedMove.from.x, selectedMove.from.y, selectedMove.to.x, selectedMove.to.y);
}