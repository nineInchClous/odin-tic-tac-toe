'use strict';

const GameBoard = function() {
    let board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];
    let xCount = 0;
    let oCount = 0;

    /**
     * Play on the board
     * @param {string} letter Letter to play
     * @param {number} row Row to play
     * @param {number} col Column to play
     * @returns True if the play can be made, otherwise false
     */
    const play = (letter, row, col) => {
        if (board[row][col] === '' || row < 0 || row > board.length || col < 0 || col > board[0].length) {
            return false;
        }

        board[row][col] = letter.toUpperCase();
        letter === 'X' ? xCount++ : oCount++;
        return true;
    };

    /**
     * Get the winner of the game
     * @returns 'X' if player 1 won, 'O' if player 2 won, 'T' if it's a tie, '' if the game is not over yet
     */
    const getWinner = () => {
        if (xCount < 3 && oCount < 3) {
            return '';
        }

        // Horizontal or vertical win
        for(let i = 0; i < board.length; i++) {
            if ((board[0][i] === 'X' && board[1][i] === 'X' && board[2][i] === 'X') || (board[i][0] === 'X' && board[i][1] === 'X' && board[i][2] === 'X')) {
                return 'X';
            }
            else if ((board[0][i] === 'O' && board[1][i] === 'O' && board[2][i] === 'O') || (board[i][0] === 'O' && board[i][1] === 'O' && board[i][2] === 'O')) {
                return 'O';
            }
        }

        // Diagonal win
        if (board[1][1] === 'X' && (board[0][0] === 'X' && board[2][2] === 'X') || (board[0][2] === 'X' && board[2][0] === 'X')) {
            return 'X';
        }
        else if (board[1][1] === 'O' && (board[0][0] === 'O' && board[2][2] === 'O') || (board[0][2] === 'O' && board[2][0] === 'O')) {
            return 'O';
        }

        // Tie or not finished yet
        return xCount + oCount === 9 ? 'T' : '';
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

    return {play, getWinner, resetBoard};
}();
