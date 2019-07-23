import React from "react";

import Square from "./Square";

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        selected={this.props.position === i}
        onClick={() => this.props.onClick(i)}
        winningCell={
          this.props.winningCells && this.props.winningCells.indexOf(i) > -1
        }
      />
    );
  }

  renderBoard(size) {
    const rows = [];

    for (let row = 0; row < size; row++) {
      const cols = [];
      for (let col = 0; col < size; col++) {
        cols.push(
          <React.Fragment key={col}>
            {this.renderSquare(row * size + col)}
          </React.Fragment>
        );
      }
      rows.push(
        <div key={row} className="board-row">
          {cols}
        </div>
      );
    }

    return rows;
  }

  render() {
    return <div>{this.renderBoard(this.props.size)}</div>;
  }
}

export default Board;
