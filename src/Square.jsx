import React from "react";
import classNames from "classnames";

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

export default Square;
