function GameBoard() {

    this.board = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
    ];
}

function checkMove(board, input) {

    if (board[input[0]][input[1]] == "") {
        return true;
    } else {
        return false;
    }
}

function checkWinner(board) {

    // Checking rows (making sure empty spaces dont count as a win)
    for (let i = 0; i < 3; i++) {
        if (board[i][0] != "" && board[i][1] != "" && board[i][2] != "" && board[i][0] == board[i][1] && board[i][0] == board[i][2]) {
            return true;
        }
    }

    // Checking columns
    for (let i = 0; i < 3; i++) {
        if (board[0][i] != "" && board[1][i] != "" && board[2][i] != "" && board[0][i] == board[1][i] && board[0][i] == board[2][i]) {
            return true;
        }
    }

    // Checking diagonals
    if (board[0][0] != "" && board[1][1] != "" && board[2][2] != "" && board[0][0] == board[1][1] && board[0][0] == board[2][2]) {
        return true;
    }
    if (board[0][2] != "" && board[1][1] != "" && board[2][0] != "" && board[0][2] == board[1][1] && board[0][2] == board[2][0]) {
        return true;
    }
    return false;
}

function gameReader(board, input) {
    
    let f_input = input.split(",");
    if (f_input.length !== 2) {
        throw new Error('Input has to be 2 integers');
    }

    for (let i = 0; i < f_input.length; i++) {
        if (isNaN(f_input[i])) {
            throw new Error('Input has to be integers');
        }
    }

    f_input = f_input.map(Number);

    if (f_input[0] < 0 || f_input[0] > 2 || f_input[1] < 0 || f_input[1] > 2) {
        throw new Error('Input out of index range');
    }

    let row = f_input[0];
    let col = f_input[1];

    let winner = checkWinner(board);
    let validMove = checkMove(board, f_input);

    return { winner, validMove, row, col };
}

function switchTurn(turn) {

    if (turn == "X") {
        return "O";
    } else {
        return "X";
    }
}

function Player() {
    this.name = "";
    this.symbol = "";
}

// Introduction

console.log("Welcome to Tic Tac Toe!");

let player1 = new Player();
let player2 = new Player();

player1.name = prompt("Player 1, what is your name?");
player1.symbol = "X";
player2.name = prompt("Player 2, what is your name?");
player2.symbol = "O";

console.log(`${player1.name} will be ${player1.symbol}`);
console.log(`${player2.name} will be ${player2.symbol}`);

// Game loop starts

game = new GameBoard();
winner = false;
moveCounter = 0;
turn = "X";

while (!winner && moveCounter < 9) {

    console.log(game.board);

    console.log(`${turn}, it is your turn.`);

    input = prompt("Enter your row and column (e.g. 0,1):");
    check = gameReader(game.board, input);

    while (!check.validMove) {
        console.log("Invalid move. Try again.");
        input = prompt("Enter your row and column (e.g. 0,1):");
        check = gameReader(game.board, input);

    }

    game.board[check.row][check.col] = turn;
    moveCounter++;

    turn = switchTurn(turn);

    winner = checkWinner(game.board);
}

console.log(game.board);

if (winner) {

    if (turn === player1.symbol) {
        console.log("Congratulations, " + player2.name + " wins!");
    } else {
        console.log("Congratulations, " + player1.name + " wins!");
    }
}

else {
    console.log("It's a draw!");
}



