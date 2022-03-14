// declare socket io
let socket = io();

// game state
let board = [
    null, 0, null, 1, null, 2, null, 3,
    4, null, 5, null, 6, null, 7, null,
    null, 8, null, 9, null, 10, null, 11,
    null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null,
    12, null, 13, null, 14, null, 15, null,
    null, 16, null, 17, null, 18, null, 19,
    20, null, 21, null, 22, null, 23, null
];
let startBoard = board;
let kingOrNot = [
    false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false
];
let startKing = kingOrNot;

// returns index of piece
function findPiece(pieceId) {
    let piece = parseInt(pieceId);
    return board.indexOf(piece);
};

// query selectors
let cells = document.querySelectorAll("td");
let redsPieces = document.querySelectorAll("span.red");
let blacksPieces = document.querySelectorAll("span.black");
let allPieces = document.querySelectorAll("span");
let start = document.querySelector('#startBtn');

// properties
let turn = false;
let redScore = 12;
let blackScore = 12;
let playerPieces;

// selected piece object
let selectedPiece = {
    pieceId: -1,
    indexOfBoardPiece: -1,
    isKing: false,
    seventhSpace: false,
    ninthSpace: false,
    fourteenthSpace: false,
    eighteenthSpace: false,
    minusSeventhSpace: false,
    minusNinthSpace: false,
    minusFourteenthSpace: false,
    minusEighteenthSpace: false
}


//start button
start.addEventListener('click', updateBoard);

// update board based on socket io returned data
function updateBoard(){
    start.removeEventListener('click', updateBoard);
    for(let i=0; i<cells.length; i++){
        if(cells[i].hasChildNodes()){
            cells[i].removeChild(cells[i].firstChild);
        }
    }
    for(let i=0; i<cells.length; i++){
        if(board[i] !== null){
            if(board[i] < 12){
                cells[i].innerHTML = `<span class="red red-piece" id="${board[i]}"></span>`;
            }
            else{
                cells[i].innerHTML = `<span class="black black-piece" id="${board[i]}"></span>`
            }
        }
    }
    for(let i=0; i<cells.length; i++){
        if(kingOrNot[i]){
            if(cells[i].hasChildNodes()){
                cells[i].firstChild.classList.add('king');
            }
        }
    }
    redsPieces = document.querySelectorAll("span.red");
    blacksPieces = document.querySelectorAll("span.black");
    givePiecesEventListeners();
}
// initialize event listeners on pieces
function givePiecesEventListeners() {
    if (turn) {
        for (let i = 0; i < redsPieces.length; i++) {
            redsPieces[i].addEventListener("click", getPlayerPieces);
        }
    } 
    else {
        for (let i = 0; i < blacksPieces.length; i++) {
            blacksPieces[i].addEventListener("click", getPlayerPieces);
        }
    }
}

/*---------- Main Functions ----------*/

// decides which turn the player is on and gives access to the right color
function getPlayerPieces() {
    if (turn) {
        playerPieces = redsPieces;
    } else {
        playerPieces = blacksPieces;
    }
    removeCellonclick();
    resetBorders();
}

// removes on click events that were made in previous moves
function removeCellonclick() {
    for (let i = 0; i < cells.length; i++) {
        cells[i].removeAttribute("onclick");
    }
}

// removes green border on selected piece
function resetBorders() {
    for (let i = 0; i < playerPieces.length; i++) {
        playerPieces[i].style.border = "1px solid white";
    }
    resetSelectedPieceProperties();
    getSelectedPiece();
}

// reset properties
function resetSelectedPieceProperties() {
    selectedPiece.pieceId = -1;
    selectedPiece.pieceId = -1;
    selectedPiece.isKing = false;
    selectedPiece.seventhSpace = false;
    selectedPiece.ninthSpace = false;
    selectedPiece.fourteenthSpace = false;
    selectedPiece.eighteenthSpace = false;
    selectedPiece.minusSeventhSpace = false;
    selectedPiece.minusNinthSpace = false;
    selectedPiece.minusFourteenthSpace = false;
    selectedPiece.minusEighteenthSpace = false;
}

// gets ID and index of the piece's location
function getSelectedPiece() {
    selectedPiece.pieceId = parseInt(event.target.id);
    selectedPiece.indexOfBoardPiece = findPiece(selectedPiece.pieceId);
    isPieceKing();
}

// checks if piece king
function isPieceKing() {
    if (document.getElementById(selectedPiece.pieceId).classList.contains("king")) {
        selectedPiece.isKing = true;
    } else {
        selectedPiece.isKing = false;
    }
    getAvailableSpaces();
}

// gets legal moves
function getAvailableSpaces() {
    if (board[selectedPiece.indexOfBoardPiece + 7] === null && 
        cells[selectedPiece.indexOfBoardPiece + 7].classList.contains("empty") !== true) {
        selectedPiece.seventhSpace = true;
    }
    if (board[selectedPiece.indexOfBoardPiece + 9] === null && 
        cells[selectedPiece.indexOfBoardPiece + 9].classList.contains("empty") !== true) {
        selectedPiece.ninthSpace = true;
    }
    if (board[selectedPiece.indexOfBoardPiece - 7] === null && 
        cells[selectedPiece.indexOfBoardPiece - 7].classList.contains("empty") !== true) {
        selectedPiece.minusSeventhSpace = true;
    }
    if (board[selectedPiece.indexOfBoardPiece - 9] === null && 
        cells[selectedPiece.indexOfBoardPiece - 9].classList.contains("empty") !== true) {
        selectedPiece.minusNinthSpace = true;
    }
    checkEliminiations();
}

// gets legal eliminations
function checkEliminiations() {
    if (turn) {
        if (board[selectedPiece.indexOfBoardPiece + 14] === null 
        && cells[selectedPiece.indexOfBoardPiece + 14].classList.contains("empty") !== true
        && board[selectedPiece.indexOfBoardPiece + 7] >= 12) {
            selectedPiece.fourteenthSpace = true;
        }
        if (board[selectedPiece.indexOfBoardPiece + 18] === null 
        && cells[selectedPiece.indexOfBoardPiece + 18].classList.contains("empty") !== true
        && board[selectedPiece.indexOfBoardPiece + 9] >= 12) {
            selectedPiece.eighteenthSpace = true;
        }
        if (board[selectedPiece.indexOfBoardPiece - 14] === null 
        && cells[selectedPiece.indexOfBoardPiece - 14].classList.contains("empty") !== true
        && board[selectedPiece.indexOfBoardPiece - 7] >= 12) {
            selectedPiece.minusFourteenthSpace = true;
        }
        if (board[selectedPiece.indexOfBoardPiece - 18] === null 
        && cells[selectedPiece.indexOfBoardPiece - 18].classList.contains("empty") !== true
        && board[selectedPiece.indexOfBoardPiece - 9] >= 12) {
            selectedPiece.minusEighteenthSpace = true;
        }
    } 
    else {
        if (board[selectedPiece.indexOfBoardPiece + 14] === null 
        && cells[selectedPiece.indexOfBoardPiece + 14].classList.contains("empty") !== true
        && board[selectedPiece.indexOfBoardPiece + 7] < 12 && board[selectedPiece.indexOfBoardPiece + 7] !== null) {
            selectedPiece.fourteenthSpace = true;
        }
        if (board[selectedPiece.indexOfBoardPiece + 18] === null 
        && cells[selectedPiece.indexOfBoardPiece + 18].classList.contains("empty") !== true
        && board[selectedPiece.indexOfBoardPiece + 9] < 12 && board[selectedPiece.indexOfBoardPiece + 9] !== null) {
            selectedPiece.eighteenthSpace = true;
        }
        if (board[selectedPiece.indexOfBoardPiece - 14] === null && cells[selectedPiece.indexOfBoardPiece - 14].classList.contains("empty") !== true
        && board[selectedPiece.indexOfBoardPiece - 7] < 12 
        && board[selectedPiece.indexOfBoardPiece - 7] !== null) {
            selectedPiece.minusFourteenthSpace = true;
        }
        if (board[selectedPiece.indexOfBoardPiece - 18] === null && cells[selectedPiece.indexOfBoardPiece - 18].classList.contains("empty") !== true
        && board[selectedPiece.indexOfBoardPiece - 9] < 12
        && board[selectedPiece.indexOfBoardPiece - 9] !== null) {
            selectedPiece.minusEighteenthSpace = true;
        }
    }
    checkPieceConditions();
}

// resets legal movement if piece not king
function checkPieceConditions() {
    if (selectedPiece.isKing) {
        document.getElementById(selectedPiece.pieceId).style.border = "3px solid green";
    } 
    else {
        if (turn) {
            selectedPiece.minusSeventhSpace = false;
            selectedPiece.minusNinthSpace = false;
            selectedPiece.minusFourteenthSpace = false;
            selectedPiece.minusEighteenthSpace = false;
        } 
        else {
            selectedPiece.seventhSpace = false;
            selectedPiece.ninthSpace = false;
            selectedPiece.fourteenthSpace = false;
            selectedPiece.eighteenthSpace = false;
        }
        document.getElementById(selectedPiece.pieceId).style.border = "3px solid green";
    }
    giveCellsClick();
}

// give board cells on click for piece to move
function giveCellsClick() {
    if (selectedPiece.seventhSpace) {
        cells[selectedPiece.indexOfBoardPiece + 7].setAttribute("onclick", "makeMove(7)");
    }
    if (selectedPiece.ninthSpace) {
        cells[selectedPiece.indexOfBoardPiece + 9].setAttribute("onclick", "makeMove(9)");
    }
    if (selectedPiece.fourteenthSpace) {
        cells[selectedPiece.indexOfBoardPiece + 14].setAttribute("onclick", "makeMove(14)");
    }
    if (selectedPiece.eighteenthSpace) {
        cells[selectedPiece.indexOfBoardPiece + 18].setAttribute("onclick", "makeMove(18)");
    }
    if (selectedPiece.minusSeventhSpace) {
        cells[selectedPiece.indexOfBoardPiece - 7].setAttribute("onclick", "makeMove(-7)");
    }
    if (selectedPiece.minusNinthSpace) {
        cells[selectedPiece.indexOfBoardPiece - 9].setAttribute("onclick", "makeMove(-9)");
    }
    if (selectedPiece.minusFourteenthSpace) {
        cells[selectedPiece.indexOfBoardPiece - 14].setAttribute("onclick", "makeMove(-14)");
    }
    if (selectedPiece.minusEighteenthSpace) {
        cells[selectedPiece.indexOfBoardPiece - 18].setAttribute("onclick", "makeMove(-18)");
    }
}

// initiates move
function makeMove(number) {
    document.getElementById(selectedPiece.pieceId).remove();
    cells[selectedPiece.indexOfBoardPiece].innerHTML = "";
    if (turn) {
        if (selectedPiece.isKing) {
            cells[selectedPiece.indexOfBoardPiece + number].innerHTML = `<span class="red red-piece king" id="${selectedPiece.pieceId}"></span>`;
            redsPieces = document.querySelectorAll("span.red");
        } 
        else {
            cells[selectedPiece.indexOfBoardPiece + number].innerHTML = `<span class="red red-piece" id="${selectedPiece.pieceId}"></span>`;
            redsPieces = document.querySelectorAll("span.red");
        }
    } 
    else {
        if (selectedPiece.isKing) {
            cells[selectedPiece.indexOfBoardPiece + number].innerHTML = `<span class="black black-piece king" id="${selectedPiece.pieceId}"></span>`;
            blacksPieces = document.querySelectorAll("span.black");
        } 
        else {
            cells[selectedPiece.indexOfBoardPiece + number].innerHTML = `<span class="black black-piece" id="${selectedPiece.pieceId}"></span>`;
            blacksPieces = document.querySelectorAll("span.black");
        }
    }

    let indexOfPiece = selectedPiece.indexOfBoardPiece
    if (number === 14 || number === -14 || number === 18 || number === -18) {
        changeData(indexOfPiece, indexOfPiece + number, indexOfPiece + number / 2);
    } 
    else {
        changeData(indexOfPiece, indexOfPiece + number);
    }
}

// changes game state data
function changeData(indexOfBoardPiece, modifiedIndex, removePiece) {
    board[indexOfBoardPiece] = null;
    kingOrNot[indexOfBoardPiece] = false;
    board[modifiedIndex] = parseInt(selectedPiece.pieceId);
    if(selectedPiece.isKing){
        kingOrNot[modifiedIndex] = true;
    }
    // if red
    if (turn && selectedPiece.pieceId < 12 && modifiedIndex >= 57) {
        document.getElementById(selectedPiece.pieceId).classList.add("king");
        kingOrNot[modifiedIndex] = true;
    }
    // if black
    if (turn === false && selectedPiece.pieceId >= 12 && modifiedIndex <= 7) {
        document.getElementById(selectedPiece.pieceId).classList.add("king");
        kingOrNot[modifiedIndex] = true;
    }
    if (removePiece) {
        board[removePiece] = null;
        if (turn && selectedPiece.pieceId < 12) {
            cells[removePiece].innerHTML = "";
            blackScore--;
        }
        if (turn === false && selectedPiece.pieceId >= 12) {
            cells[removePiece].innerHTML = "";
            redScore--;
        }
    }
    resetSelectedPieceProperties();
    removeCellonclick();
    removeEventListeners();
}

// removes click event for all pieces
function removeEventListeners() {
    for(let i=0; i<allPieces.length; i++){
        allPieces[i].removeEventListener("click", getPlayerPieces);
    }
    turn = !turn;
    socket.emit("moved", {board, kingOrNot, turn, redScore, blackScore});
    
}

// listens when other player made their move
socket.on("moved", (arg) => {
    console.log("moved!");
    board = arg["board"];
    kingOrNot = arg["kingOrNot"];
    redScore = arg["redScore"];
    blackScore = arg["blackScore"];
    turn = arg["turn"];
    if(redScore==0 || blackScore ==0){
        board = startBoard;
        kingOrNot = startKing;
        redScore = 12;
        blackScore = 12;
    }
    updateBoard();
});

// using five data variables:
// board
// kingOrNot
// turn
// redScore
// blackScore