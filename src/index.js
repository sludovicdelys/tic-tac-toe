import React from 'react';
import ReactDOM from 'react-dom';
import { useState } from 'react';
import './index.css';
import Square from './components/square.js'

/** displays the board's squares */
function Board({ xIsNext, squares, onPlay }) {

    function handleClick(i) {
        //  check if a user has clicked a square & check if a player has won
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        const nextSquares = squares.slice();

        if (xIsNext) {
            nextSquares[i] = "X";
        } else {
            nextSquares[i] = "O";
        }
        onPlay(nextSquares);
    }

    const winner = calculateWinner(squares);
    
    let status; 

    if (winner) {
        status = 'Winner: ' + winner; 
    } else {
        status = 'Next player: ' + (xIsNext ? 'X': 'O');
    }

    return (
        <>
            <div className="status">{status}</div>
            <div className="board-row">
                <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
                <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
                <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
            </div>
            <div className="board-row">
                <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
                <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
                <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
            </div>
            <div className="board-row">
                <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
                <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
                <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
            </div>
        </>
    );
}

/** displays a list of past moves */
export default function Game() {

    // Add some state to track which player is next and the history of moves
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove];

    // function that will be called by the Board component to update the game
    function handlePlay(nextSquares) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }

    function jumpTo(nextMove) {
        setCurrentMove(nextMove);
    }

    // mapping over a history of moves
    // the squares argument goes through each element of history 
    // and the move argument goes through each array index
    const moves = history.map((squares, move) => {
        let description;
        if (move > 0) {
          description = 'Go to move #' + move;
        } else {
          description = 'Go to game start';
        }
        return (
          <li key={move}>
            <button onClick={() => jumpTo(move)}>{description}</button>
          </li>
        );
    });

    return (
        <div className="game">
            <div className="game-board">
                <Board
                xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}
                />
            </div>
            <div className="game-info">
                <ol>{moves}</ol>
            </div>
        </div>
    );
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        // create a new array with the same values as each winning combo. 
        // i.e. when i = 0 the new array of [a, b, c] is [0, 1, 2]
        const [a, b, c] = lines[i];

        // the if statement checks if the there are 3 of the same letters for the winning combos
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}
