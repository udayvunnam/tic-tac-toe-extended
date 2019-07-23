import React from "react";
import Board from "./Board";

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.size = 3;
    this.winningLines = getWinningLines(this.size);

    this.state = {
      history: [
        {
          squares: Array(this.size * this.size).fill(null),
          position: null
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      moves: [],
      sortAsc: true
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares, this.winningLines || squares[i])) {
      return;
    }

    squares[i] = this.state.xIsNext ? "X" : "O";

    const moves = this.getMoves(history);

    this.setState({
      history: history.concat([
        {
          squares: squares,
          position: i
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      moves: moves,
      sortAsc: this.state.sortAsc
    });
  }

  getMoves(history) {
    const moves = history.map((step, move) => {
      const position = step.position;
      const row = Math.floor(position / this.size) + 1;
      const col = (position % this.size) + 1;
      const desc = move
        ? `Go to move #${move}. row:${row}, col: ${col}`
        : "Go to game start";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    return this.state.sortAsc ? moves : moves.reverse();
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0
    });
  }

  toggleSort() {
    const moves = this.state.moves.reverse();

    this.setState({
      moves: moves,
      sortAsc: !this.state.sortAsc
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winningMove = calculateWinner(current.squares, this.winningLines);

    let status;
    let winningCells;

    if (winningMove) {
      winningCells = winningMove.winningCells;
      status = "Winner: " + winningMove.winner;
    } else if (this.state.stepNumber === this.size * this.size) {
      status = "Draw";
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            position={current.position}
            size={this.size}
            onClick={i => this.handleClick(i)}
            winningCells={winningCells}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>
            <button onClick={() => this.toggleSort()}>
              Toggle Moves Order
            </button>
          </div>
          <ol>{this.state.moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares, lines) {
  for (let i = 0; i < lines.length; i++) {
    const winningCells = lines[i];
    const firstCell = winningCells[0];

    const winningMove = winningCells.every(cell => {
      return squares[firstCell] && squares[cell] === squares[firstCell];
    });

    if (winningMove) {
      return { winningCells, winner: squares[firstCell] };
    }
  }
  return null;
}

function getWinningLines(size) {
  // matcing lines = all cols + all rows + diagnols(2)
  const lines = Array(size * 2)
    .fill(null)
    .map(item => []);
  let rowLine = 0;
  let colLine = size;

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      lines[rowLine].push(i * size + j);
      lines[colLine].push(i + j * size);
    }
    rowLine++;
    colLine++;
  }

  const diagonal1 = [0]; //diagonal 1
  const diagonal2 = [size - 1]; //diagonal 2

  for (let i = 1; i < size; i++) {
    diagonal1.push(diagonal1[i - 1] + size + 1);
    diagonal2.push(diagonal2[i - 1] + size - 1);
  }
  lines.push(diagonal1);
  lines.push(diagonal2);

  return lines;
}

export default Game;
