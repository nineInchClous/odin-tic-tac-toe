'use strict';

/**
 * Create a player object
 * @param {string} name Name of the player
 * @param {string} letter 'X' or 'O'
 * @returns A player object
 */
function createPlayer(name, letter) {
    return {name, letter};
}

const board = function() {
    let board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];

    /**
     * Get a cell value from the board
     * @param {number} row Row of the wanted value
     * @param {number} col Column of the wanted value
     * @returns The value of the wanted cell
     */
    const getBoardValue = (row, col) => board[row][col];

    /**
     * Get the board length
     * @returns The board length
     */
    const getBoardLength = () => board.length;

    /**
     * Set a cell value from the board
     * @param {number} row Row of the wanted value
     * @param {number} col Column of the wanted value
     * @param {string} value The value to set in the board
     */
    const setBoardValue = (row, col, value) => {board[row][col] = value;};

    /**
     * Get the board values in an array
     * @returns The board in an array
     */
    const getAllBoardValues = () => {
        const boardValues = [];
        board.forEach(row => {
            row.forEach(cell => boardValues.push(cell));
        });
        return boardValues;
    };

     /**
     * Reset the board
     */
     const resetBoard = () => {
        board = [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
        ];
    };

    return {getBoardValue, setBoardValue, getAllBoardValues, getBoardLength, resetBoard};
}();

const game = function() {
    let player1 = undefined;
    let player2 = undefined;
    let currPlayer = undefined;
    let xCount = 0;
    let oCount = 0;

    /**
     * Play on the board
     * @param {number} row Row to play
     * @param {number} col Column to play
     * @returns True if the play can be made, otherwise false
     */
    const play = (row, col) => {
        if (currPlayer === undefined || board.getBoardValue(row, col) !== '' || row < 0 || row > board.getBoardLength() || col < 0 || col > board.getBoardLength()) {
            return false;
        }

        board.setBoardValue(row, col, currPlayer.letter.toUpperCase());
        currPlayer.letter === 'X' ? xCount++ : oCount++;
        currPlayer === player1 ? currPlayer = player2 : currPlayer = player1;
        return true;
    };

    /**
     * Get the winner of the game
     * @returns 'X' if player 1 won, 'O' if player 2 won, 'T' if it's a tie, '' if the game is not over yet
     */
    const getWinner = () => {
        // Not enough plays to win
        if (xCount < 3 && oCount < 3) {
            return '';
        }
        // Tie
        else if (xCount + oCount === 9) {
            return 'That\'s a tie!';
        }

        // Horizontal or vertical win
        for(let i = 0; i < board.getBoardLength(); i++) {
            if ((board.getBoardValue(0, i) === 'X' && 
            board.getBoardValue(1, i) === 'X' && 
            board.getBoardValue(2, i) === 'X') || 
            (board.getBoardValue(i, 0) === 'X' && 
            board.getBoardValue(i, 1) === 'X' && 
            board.getBoardValue(i, 2) === 'X')) {
                return `${player1.name} wins!`;
            }
            else if ((board.getBoardValue(0, i) === 'O' && 
            board.getBoardValue(1, i) === 'O' && 
            board.getBoardValue(2, i) === 'O') || 
            (board.getBoardValue(i, 0) === 'O' && 
            board.getBoardValue(i, 1) === 'O' && 
            board.getBoardValue(i, 2) === 'O')) {
                return `${player2.name} wins!`;
            }
        }

        // Diagonal win
        if (board.getBoardValue(1, 1) === 'X' && 
        (board.getBoardValue(0, 0) === 'X' && 
        board.getBoardValue(2, 2) === 'X') || 
        (board.getBoardValue(0, 2) === 'X' && 
        board.getBoardValue(2, 0) === 'X')) {
            return `${player1.name} wins!`;
        }
        else if (board.getBoardValue(1, 1) === 'O' && 
        (board.getBoardValue(0, 0) === 'O' && 
        board.getBoardValue(2, 2) === 'O') || 
        (board.getBoardValue(0, 2) === 'O' && 
        board.getBoardValue(2, 0) === 'O')) {
            return `${player2.name} wins!`;
        }

        // Not finished yet
        return  '';
    };

    const setPlayers = (pPlayer1, pPlayer2) => {
        player1 = pPlayer1;
        player2 = pPlayer2;
        currPlayer = player1;
    };

    /**
     * Get the current player's name
     * @returns The current player's name
     */
    const getCurrentPlayer = () => currPlayer;

    /**
     * Reset the game
     */
    const resetGame = () => {
        currPlayer = player1;
        xCount = 0;
        oCount = 0;
    };

    return {play, getWinner, setPlayers, getCurrentPlayer, resetGame};
}();


const boardSect = document.getElementById('board');
const startSect = document.getElementById('start-sect');
const cells = document.querySelectorAll('#board div');
const playerNameTurn = document.getElementById('player-turn');
const scoreSect = document.getElementById('score-sect');
const winnerPara = document.getElementById('winner-para');
const dialog = document.querySelector('dialog');

document.getElementById('restart').addEventListener('click', () => {
    board.resetBoard();
    game.resetGame();
    updateBoard();
    dialog.close();
});
document.getElementById('change-players').addEventListener('click', () => {
    board.resetBoard();
    game.resetGame();
    boardSect.style.display = 'none';
    scoreSect.style.display = 'none';
    startSect.style.display = 'block';
    dialog.close();
});
document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    const player1 = document.getElementById('player1');
    const player2 = document.getElementById('player2');
    game.setPlayers(createPlayer(player1.value, 'X'), 
                    createPlayer(player2.value, 'O'));
    player1.value = '';
    player2.value = '';
    updateBoard();
    boardSect.style.display = 'grid';
    scoreSect.style.display = 'block';
    startSect.style.display = 'none';
});
cells.forEach(cell => {
    cell.addEventListener('click', () => {
        if (game.play(cell.getAttribute('data-row'), 
                cell.getAttribute('data-col'))); {
            updateBoard();
            const result = game.getWinner();
            console.log(result);
            if (result !== '') {
                winnerPara.textContent = result;
                dialog.showModal();
            }
        }
    });
});

/**
 * 
 */
function updateBoard() {
    board.getAllBoardValues().forEach((value, i) => {
        cells[i].textContent = value;
    });
    playerNameTurn.textContent = game.getCurrentPlayer().name;
}
