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

    document.getElementById("player-name").addEventListener("submit", (event) => {

        event.preventDefault();

        if (document.getElementById("player1").value == "" || document.getElementById("player2").value == "") {
            alert("Please enter player names.");
            return;
        }

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

        // Getting player names
        
        player1.name = document.getElementById("player1").value;
        player2.name = document.getElementById("player2").value;
        
        document.getElementById("player").innerHTML = turn == "X" ? player1.name : player2.name;
      
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
