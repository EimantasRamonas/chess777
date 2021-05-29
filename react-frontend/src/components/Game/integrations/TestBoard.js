import React, { Component } from "react";
import ChessBoard from "chessboardjsx";
import Chess from "chess.js";

class MultiplayerChess extends Component {
  state = { fen: "start" };

  componentDidMount() {
    this.game = new Chess();
  }

  render() {
    const { fen } = this.state;
    return this.props.children({ position: fen });
  }
}

export default function TestBoard(props) {
  var color = props.color;

  return (
    <MultiplayerChess>
      {({ position }) => <ChessBoard position={position} orientation={color} />}
    </MultiplayerChess>
  );
}
