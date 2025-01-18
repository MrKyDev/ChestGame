const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status');

let initialBoard = [
    ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
    ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
    ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖']
];

let selectedSquare = null;
let currentPlayer = "white"; // or black

// Create the chessboard
function createBoard() {
    boardElement.innerHTML = ""; // Clear the board before creating it
    initialBoard.forEach((row, rowIndex) => {
        row.forEach((piece, colIndex) => {
            const square = document.createElement("div");
            square.classList.add("square");
            square.dataset.row = rowIndex;
            square.dataset.col = colIndex;
            square.textContent = piece;

            square.addEventListener("click", () => handleSquareClick(square));

            boardElement.appendChild(square);
        });
    });
}

// Handle square click
function handleSquareClick(square) {
    if (selectedSquare) {
        const fromRow = parseInt(selectedSquare.dataset.row);
        const fromCol = parseInt(selectedSquare.dataset.col);
        const toRow = parseInt(square.dataset.row);
        const toCol = parseInt(square.dataset.col);

        if (isValidMove(fromRow, fromCol, toRow, toCol)) {
            // Valid move: update the board
            initialBoard[toRow][toCol] = initialBoard[fromRow][fromCol];
            initialBoard[fromRow][fromCol] = "";
            updateBoard();
            selectedSquare.classList.remove("selected");
            selectedSquare = null;

            // Switch player turn
            currentPlayer = currentPlayer === "white" ? "black" : "white";
            updateStatus();
        } else {
            // Invalid move: alert and keep the selection
            alert("Invalid move! Please select a valid destination.");
        }
    } else {
        // Select the square
        selectedSquare = square;
        square.classList.add("selected");
    }
}

// Check if the move is valid
function isValidMove(fromRow, fromCol, toRow, toCol) {
    const piece = initialBoard[fromRow][fromCol];
    const targetPiece = initialBoard[toRow][toCol];

    // Basic validation: check if moving within bounds
    if (toRow < 0 || toRow >= 8 || toCol < 0 || toCol >= 8) return false;

    // Check if moving to a square occupied by own piece
    if (
        (currentPlayer === "white" &&
            targetPiece &&
            targetPiece.charCodeAt(0) >= 0x2654 &&
            targetPiece.charCodeAt(0) <= 0x2659) ||
        (currentPlayer === "black" &&
            targetPiece &&
            targetPiece.charCodeAt(0) >= 0x265A &&
            targetPiece.charCodeAt(0) <= 0x265F)
    ) {
        return false; // Cannot capture your own piece
    }

    switch (piece) {
        case "♙": // White Pawn
            return isValidPawnMove(fromRow, fromCol, toRow, toCol, true);
        case "♟": // Black Pawn
            return isValidPawnMove(fromRow, fromCol, toRow, toCol, false);
        case "♖": case "♜": // Rooks
            return isValidRookMove(fromRow, fromCol, toRow, toCol);
        case "♘": case "♞": // Knights
            return isValidKnightMove(fromRow, fromCol, toRow, toCol);
        case "♗": case "♝": // Bishops
            return isValidBishopMove(fromRow, fromCol, toRow, toCol);
        case "♕": case "♛": // Queens
            return isValidQueenMove(fromRow, fromCol, toRow, toCol);
        case "♔": case "♚": // Kings
            return isValidKingMove(fromRow, fromCol, toRow, toCol);
        default:
            return false; // Unknown piece or empty square
    }
}

// Pawn movement logic
function isValidPawnMove(fromRow, fromCol, toRow, toCol, isWhite) {
    const direction = isWhite ? -1 : 1; // White moves up (-1), Black moves down (+1)

    if (toCol === fromCol) { // Moving forward
        if (initialBoard[toRow][toCol] === "") { // Move forward one square
            if (toRow === fromRow + direction) return true;
            if ((isWhite && fromRow === 6) || (!isWhite && fromRow === 1)) { // Initial double move
                return (
                    toRow === fromRow + 2 * direction &&
                    initialBoard[fromRow + direction][toCol] === ""
                );
            }
        }
    } else if (
        Math.abs(toCol - fromCol) === 1 &&
        toRow === fromRow + direction &&
        initialBoard[toRow][toCol] !== ""
    ) { // Capturing diagonally
        return true;
    }

    return false;
}

// Rook movement logic
function isValidRookMove(fromRow, fromCol, toRow, toCol) {
    if (fromRow !== toRow && fromCol !== toCol) return false; // Must move in straight line

    const stepR = Math.sign(toRow - fromRow); // Row step direction (-1/0/+1)
    const stepC = Math.sign(toCol - fromCol); // Column step direction (-1/0/+1)

    let r = fromRow + stepR;
    let c = fromCol + stepC;

    while (r !== toRow || c !== toCol) {
        if (initialBoard[r][c] !== "") return false; // Blocked by another piece
        r += stepR;
        c += stepC;
    }

    return true;
}

// Knight movement logic
function isValidKnightMove(fromRow, fromCol, toRow, toCol) {
    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);

    return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
}

// Bishop movement logic
function isValidBishopMove(fromRow, fromCol, toRow, toCol) {
    if (Math.abs(toRow - fromRow) !== Math.abs(toCol - fromCol)) return false; // Must move diagonally

    const stepR = Math.sign(toRow - fromRow);
    const stepC = Math.sign(toCol - fromCol);

    let r = fromRow + stepR;
    let c = fromCol + stepC;

    while (r !== toRow || c !== toCol) {
        if (initialBoard[r][c] !== "") return false; // Blocked by another piece
        r += stepR;
        c += stepC;
    }

    return true;
}

// Queen movement logic combines rook and bishop logic
function isValidQueenMove(fromRow, fromCol, toRow, toCol) {
   return (
       isValidRookMove(fromRow, fromCol,to.Row,to.Col) ||
       isValidBishopMove(from.Row.from.Col,to.Row.to.Col)
   )
}

// King movement logic 
function IsvalidkingMove(from,Row,from,Col,to,Row,to,Col){
   const rowDiff=Math.abs(to.Row-from.Row)
   const colDiff=Math.abs(to.Col-from.Col)

   return rowDiff<=1&&colDiff<=1; 
}

// Update the board UI based on the current state of initialBoard
function updateBoard() {
   const squares = boardElement.children;
   for (let rowIndex = 0; rowIndex < initialBoard.length; rowIndex++) {
       for (let colIndex = 0; colIndex < initialBoard[rowIndex].length; colIndex++) {
           const index=rowIndex*8+colIndex;
           squares[index].textContent=initialBoard[rowIndex][colIndex];
       }
   }
}

// Highlight valid moves based on current selection 
function highlightValidMoves(square) {
   clearHighlights();
   const row=parseInt(square.dataset.row);
   const col=parseInt(square.dataset.col);

   const pieceType=initialBoard[row][col];
   let validMoves=[];

   switch(pieceType){
       case "♙":
           validMoves=getPawnMoves(row,col,true); 
           break;
       case "♟":
           validMoves=getPawnMoves(row,col,false); 
           break;
       case "♖":
       case "♜":
           validMoves=getRookMoves(row,col); 
           break;
       case "♘":
       case "♞":
           validMoves=getKnightMoves(row,col); 
           break;
       case "♗":
       case "♝":
           validMoves=getBishopMoves(row,col); 
           break;
       case "♕":
       case "♛":
           validMoves=getQueenMoves(row,col); 
           break;
       case "♔":
       case "♚":
           validMoves=getKingMoves(row,col); 
           break;
   }

   validMoves.forEach(move => {
       const targetSquare=boardElement.children[move.row*8+move.col];
       targetSquare.classList.add('valid-move');
   });
}

function clearHighlights() {
   document.querySelectorAll('.valid-move').forEach(sq => sq.classList.remove('valid-move'));
}

// Update status display with current player information.  
function updateStatus() {
   statusElement.textContent=`Current Player: ${currentPlayer}`;
}

// Function to reset the game
function restartGame() {
   initialBoard=[
       ['♜','♞','♝','♛','♚','♝','♞','♜'],
       ['♟','♟','♟','♦️' ,' ♟' ,' ♟' ,' ♟' ,' ♟' ],
       ['','','','','','','',''],
       ['','','','','','','',''],
       ['','','','','','','',''],
       ['','','','','','','',''],
       [' ♙' ,' ♙' ,' ♙' ,' ♙' ,' ♙' ,' ♙' ,' ♙' ,' ♙' ],
       [' ♖' ,' ♘' ,' ♗' ,' ♕' ,' ♔' ,' ♗' ,' ♘' ,' ♖' ]
   ];

   selectedSquare=null;
   currentPlayer="white";

   updateBoard();
   updateStatus();
}

// Add event listener for the restart button
document.getElementById('restartButton').addEventListener('click', restartGame);

// Initialize the game when page loads.  
createBoard();
updateStatus();
