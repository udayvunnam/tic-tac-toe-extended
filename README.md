## In this Repo, I have extended react tic-tac-toe game with below improvements

For more clear understanding Game, Board, Square components are moved to thier own files

<details>
<summary>1. Display the location for each move in the format (col, row) in the move history list.</summary>

```javascript
// calculate and show row and col postions like below in Game.jsx
const position = step.position;
const row = Math.floor(position / 3) + 1;
const col = (position % 3) + 1;
const desc = move
  ? `Go to move #${move}. row:${row}, col: ${col}`
  : "Go to game start";
```

</details>

<details>
<summary>2. Bold the currently selected item in the move list.</summary>

```css
/* We can think of a simple solution with css. but it takes a click even if someone has won the game or if a Square is already filled */
.square:focus {
  font-weight: bold;
}
```

```javascript
//We should map between the current clicked postion and squate index like below
// Add a new property in state that holds the current position
this.state = {
  history: [
    {
      squares: Array(9).fill(null),
      position: null
    }
  ],
  stepNumber: 0,
  xIsNext: true
};
```

```html
// pass the poition from Game --> Board and pass selected boolean value from Board--> Suqare

// In Game.jsx
<Board
  squares={current.squares}
  position={current.position}
  onClick={i => this.handleClick(i)}
/>

// In Board.jsx
<Square
  value={this.props.squares[i]}
  selected={this.props.position === i}
  onClick={() => this.props.onClick(i)}
/>

// In Square.jsx
<button
  className={classNames("square", { "square-selected": props.selected })}
  onClick={props.onClick}
    >
  {props.value}
</button>

// in index.csss
.square-selected {
  font-weight: bold;
}
```

</details>

<details>
<summary>3. Rewrite Board to use two loops to make the squares instead of hardcoding them.
</summary>

```javascript
// In Board.jsx
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

// Also we have to idenitify winning moves based on the cell size.
// In Game.jsx
function calculateWinner(squares, lines) {
  for (let i = 0; i < lines.length; i++) {
    const winningCells = lines[i];
    const firstCell = winningCells[0];

    const winningMove = winningCells.every(cell => {
      return squares[firstCell] && squares[cell] === squares[firstCell];
    });

    if (winningMove) {
      return squares[firstCell];
    }
  }
  return null;
}

function getWinningLines(size) {
  debugger;

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
```

</details>

<details>
<summary>4. Add a toggle button that lets you sort the moves in either ascending or descending order.</summary>

```javascript
// add moves and sortAsc properties to state
this.state = {
  ....
  moves: [],
  sortAsc: true
  ....
}

toggleSort() {
  const moves = this.state.moves.reverse();

  this.setState({
    moves: moves,
    sortAsc: !this.state.sortAsc
  });
}
```

```html
render(){
  return(
    ...
    <div>
      <button onClick={() => this.toggleSort()}>
        Toggle Moves Order
      </button>
    </div>
    <ol>{this.state.moves}</ol>
    ...
  )
}
```

</details>

<details>
<summary>5. When someone wins, highlight the three squares that caused the win.</summary>

```javascript
function calculateWinner(squares, lines) {
...
  if (winningMove) {
    return { winningCells, winner: squares[firstCell] };
  }
...
}

function Square(props) {
  return (
    <button
      className={classNames(
        "square",
        { "square-selected": props.selected },
        { "square-won": props.winningCell }
      )}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}
```

```css
.square-won {
  font-weight: bold;
  background-color: rgba(0, 128, 128, 0.33);
  color: rgb(0, 128, 128);
}
```

</details>

<details>
<summary>6. When no one wins, display a message about the result being a draw.</summary>

```javascript
render(){
  return (
    ...
    if (winner) {
      status = "Winner: " + winner;
    } else if (this.state.stepNumber === this.size * this.size) {
      status = "Draw";
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }
    ...
  )
}
```

</details>

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
