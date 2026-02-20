document.addEventListener("DOMContentLoaded", function() {
    
     function checkMove(cell) {
        if (cell.children[0].innerHTML == "") {
            return true;
        } else {
            return false;
        }
    }

    function switchTurn(turn) {
        if (turn == "X") {
            return "O";
        } else {
            return "X";
        }
    }

    function Gameboard() {
        this.board = [
            ["", "", ""],
            ["", "", ""],
            ["", "", ""],
        ];
    }

    function Player() {
        this.name = "";
        this.symbol = "";    
    }

    function checkWin(player) {

        // Horizontal
        for (i = 0; i < 3; i++) {
            if (board.board[i][0] == player && board.board[i][1] == player && board.board[i][2] == player) {
                return true;
            }
        }
        // Vertical
        for (i = 0; i < 3; i++) {
            if (board.board[0][i] == player && board.board[1][i] == player && board.board[2][i] == player) {
                return true;
            }
        }
        // Diagonal
        if (board.board[0][0] == player && board.board[1][1] == player && board.board[2][2] == player) {
            return true;
        }
        if (board.board[0][2] == player && board.board[1][1] == player && board.board[2][0] == player) {
            return true;
        }
        return false;
    }

    function resetGame() {
        // Resetting start board
        start_board = document.getElementById("start_board")
        start_board.style.opacity = "0";

        setTimeout(() => {
            document.getElementById("end_board").style.opacity = "0";
            start_board.style.display = "block";
        }, 100);
        setTimeout(() => {
            document.getElementById("end_board").style.display = "none";
            start_board.style.opacity = "1";
        }, 400);
        
         setTimeout(() => {
            document.getElementById("player-turn").style.opacity = "0";
        }, 100);
        setTimeout(() => {
            document.getElementById("player-turn").style.display = "none";
            document.getElementById("turn").innerHTML = turn
            cells = document.querySelectorAll(".cell");
            for (i = 0; i < cells.length; i++) {
                cells[i].children[0].innerHTML = "";
                cells[i].children[0].style.opacity = "0";
            }
        }, 600);

        
        // Resetting players, move counter and turn
        board = new Gameboard();
        player1 = new Player();
        player2 = new Player();
        player1.name = "Player 1";
        player2.name = "Player 2";
        player1.symbol = "X";
        player2.symbol = "O";
        turn = "X";
        moveCounter = 0;
        bot = false;
    }


    // Functions for minimax, computer AI
    function checkWinForBoard(boardState, player) {

        // Horizontal
        for (let i = 0; i < 3; i++) {
            if (
                boardState[i][0] === player &&
                boardState[i][1] === player &&
                boardState[i][2] === player
            ) return true;
        }

        // Vertical
        for (let i = 0; i < 3; i++) {
            if (
                boardState[0][i] === player &&
                boardState[1][i] === player &&
                boardState[2][i] === player
            ) return true;
        }

        // Diagonals
        if (
            boardState[0][0] === player &&
            boardState[1][1] === player &&
            boardState[2][2] === player
        ) return true;

        if (
            boardState[0][2] === player &&
            boardState[1][1] === player &&
            boardState[2][0] === player
        ) return true;

        return false;
    }


    function terminal(boardState) {
        return (
            checkWinForBoard(boardState, "X") ||
            checkWinForBoard(boardState, "O") ||
            actions(boardState).length === 0
        );
    }

    function utility(boardState) {
        if (checkWinForBoard(boardState, "X")) return 1;
        if (checkWinForBoard(boardState, "O")) return -1;
        return 0;
    }


    function actions(board) {

        let new_actions = [];
        for (let i = 0; i < board.length; i++) {
            let row = board[i];
            for (let j = 0; j < row.length; j++) {
                if (row[j] === "") {
                    new_actions.push([i, j]);
                }
            }
        }
        return new_actions;
    }

    function result(board, action, player) {

        let new_board = [];
        for (let i = 0; i < board.length; i++) {
            let row = [];
            for (let j = 0; j < board[i].length; j++) {
                row.push(board[i][j]);
            }
            new_board.push(row);
        }
        new_board[action[0]][action[1]] = player;

        return new_board;
    }

    function max_value(board, alpha, beta) {
        
        if (terminal(board)) {
            return [utility(board), null];
        }

        let v = -Infinity;
        let best_action = null;

        for (let action of actions(board)) {
            let [value, _] = min_value(result(board, action, "X"), alpha, beta,);
            if (value > v) {
                v = value;
                best_action = action;
            }
            alpha = Math.max(alpha, v);
            if (v >= beta) {
                return [v, best_action];
            }
        }
        return [v, best_action];
    }

    function min_value(board, alpha, beta) {
        
        if (terminal(board)) {
            return [utility(board), null];
        }

        let v = Infinity;
        let best_action = null;
        for (let action of actions(board)) {
            let [value, _] = max_value(result(board, action, "O"), alpha, beta);
            if (value < v) {
                v = value;
                best_action = action;
            }
            beta = Math.min(beta, v);
            if (v <= alpha) {
                return [v, best_action];
            }
        }
        return [v, best_action]; 
    }

    function minimax(board, turn) {

        let alpha = -Infinity;
        let beta = Infinity;

        if (turn === 'X') {
            let [_, best_action] = max_value(board, alpha, beta);
            return best_action;
        } else {
            let [_, best_action] = min_value(board, alpha, beta);
            return best_action;
        }
    }

    // End of minimax
    function computerMove() {

        let action = minimax(board.board, turn);

        if (!action) {
            return;
        }

        let [row, col] = action;

        let index = action[0] * 3 + action[1];
        let cell = document.getElementById(index);

        cell.children[0].innerHTML = turn;
        cell.children[0].style.opacity = "1";

        board.board[row][col] = turn;
        moveCounter++;

        if (checkWin(turn)) {
            if (turn == "X") {
                document.getElementById("end_board").style.display = "block";
                setTimeout(() => {
                    document.getElementById("end_board").style.opacity = "1";
                }, 10);
                document.getElementById("winner").innerHTML = `${player1.name} wins!`;
            } else {
                document.getElementById("end_board").style.display = "block";
                document.getElementById("end_board").style.opacity = "1";
                document.getElementById("winner").innerHTML = `${player2.name} wins!`;    
            }
            
        } 
        else if (moveCounter == 9) {
            document.getElementById("end_board").style.display = "block";
            document.getElementById("end_board").style.opacity = "1";
            document.getElementById("winner").innerHTML = "Draw!";
        }

        turn = switchTurn(turn);

        document.getElementById("turn").innerHTML = turn;
        document.getElementById("player").innerHTML = turn === "X" ? player1.name : player2.name;
    }

    board = new Gameboard();
    player1 = new Player();
    player2 = new Player();
    player1.name = "Player 1";
    player2.name = "Player 2";
    player1.symbol = "X";
    player2.symbol = "O";
    turn = "X";
    moveCounter = 0;
    bot = false;

    document.getElementById("player-name").addEventListener("submit", (event) => {

        event.preventDefault();

        // Getting player names

        if (document.getElementById("player1").value) {
            player1.name = document.getElementById("player1").value;
        }
        if (document.getElementById("player2").value) {
            player2.name = document.getElementById("player2").value;
        }
        
        if (document.getElementById("checkbox").checked) {
                player2.name = player2.name + " (Bot)";
                bot = true;
            }
        
        document.getElementById("player").innerHTML = turn == "X" ? player1.name : player2.name;

        // Smooth transition to game board

        start_board = document.getElementById("start_board")
        start_board.style.opacity = "1";
        setTimeout(() => {
            start_board.style.opacity = "0";
        }, 100);
        setTimeout(() => {
            start_board.style.display = "none";
        }, 800);

         setTimeout(() => {
            document.getElementById("player-turn").style.opacity = "1";
        }, 200);
        setTimeout(() => {
            document.getElementById("player-turn").style.display = "block";
        }, 100);

    });
    
    document.getElementById("board").addEventListener("click", (event) => {

        if (event.target.classList.contains("cell")) {
            if (checkMove(event.target)) {

                event.target.children[0].innerHTML = turn;
                event.target.children[0].style.opacity = "1";

                moveCounter++;
                
                // Update backend gameboard
                board.board[event.target.dataset.row][event.target.dataset.col] = turn;
                
                if (checkWin(turn)) {
                    if (turn == "X") {
                        document.getElementById("end_board").style.display = "block";
                        setTimeout(() => {
                            document.getElementById("end_board").style.opacity = "1";
                        }, 10);
                        document.getElementById("winner").innerHTML = `${player1.name} wins!`;
                    } else {
                        document.getElementById("end_board").style.display = "block";
                        document.getElementById("end_board").style.opacity = "1";
                        document.getElementById("winner").innerHTML = `${player2.name} wins!`;    
                    }
                  
                } 
                else if (moveCounter == 9) {
                    document.getElementById("end_board").style.display = "block";
                    document.getElementById("end_board").style.opacity = "1";
                    document.getElementById("winner").innerHTML = "Draw!";
                }

                turn = switchTurn(turn);
                document.getElementById("turn").innerHTML = turn
                document.getElementById("player").innerHTML = turn == "X" ? player1.name : player2.name;
                
                if (bot && !checkWin("X") && !checkWin("O") && moveCounter < 9) {
                    document.getElementById("prevent-move").style.display = "block";
                    setTimeout(() => {
                        computerMove();
                        document.getElementById("prevent-move").style.display = "none";
                    }, 600);
                }
            }
            else {
            alert("Invalid move, please try again.");
            }
        }

        
    });

    document.getElementById("restart-button").addEventListener("click", () => {
        resetGame();
    });

});
