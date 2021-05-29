import React, { Component } from "react";
import PropTypes from "prop-types";
import Chess from "chess.js";
import { io } from "socket.io-client";

import Chessboard from "chessboardjsx";

var config = require("../../../config.js");

class HumanVsHuman extends Component {
  static propTypes = { children: PropTypes.func };

  state = {
    fen: "start",
    // square styles for active drop square
    dropSquareStyle: {},
    // custom square styles
    squareStyles: {},
    // square with the currently clicked piece
    pieceSquare: "",
    // currently clicked square
    square: "",
    // array of past game moves
    history: [],
    // color of player
    color: undefined,
    gameID: undefined,
    username: undefined,
    gameType: undefined,
  };

  componentDidMount() {
    this.game = new Chess();

    var gameURL = window.location.href; //http://193.219.91.103:15518/game/jkJBgdY1jn
    var gameID = gameURL.slice(-10);
    var username;
    this.state.username = username;
    this.state.gameID = gameID;

    const socket = io.connect("http://193.219.91.103:8443/");
    window.socket = socket;

    if (localStorage.getItem("token") != undefined) {
      var data = JSON.parse(localStorage.getItem("token"));
      this.state.username = data.name;
    }
    let clientData = {
      gameID: gameID,
      username: this.state.username,
    };

    var token = fetch("http://193.219.91.103:8305/getGameType", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ gameID }),
    }).then((data) => console.log(data));
    socket.emit("create_game_room", clientData);
    socket.emit("send_color", clientData);
    socket.on("get_color", (arg) => {
      console.log(arg);
      // if(arg.username == this.state.username) this.state.color = arg.color;
      if (gameID == arg.gameID) {
        console.log("MY NAME: " + this.state.username);
        console.log("WHITE: " + arg.white_username);
        console.log("BLACK: " + arg.black_username);

        let correctColor;

        if (this.state.username == arg.white_username) correctColor = 0;
        if (this.state.username == arg.black_username) correctColor = 1;

        this.state.color = correctColor;
        this.setState({});
      }
      console.log(this.state.color);
    });
    socket.on("gameTipas", (arg) => {
      arg = JSON.parse(arg);
      if (this.state.gameID == arg.gameID) this.state.gameType = arg.gameType;
      console.log(this.state.gameType);
    });
    socket.on("get_position", (data) => {
      let move = this.game.move({
        from: data.sourceSquare,
        to: data.targetSquare,
        promotion: "q", // always promote to a queen for example simplicity
      });

      this.setState(({}) => ({
        fen: data.fen,
        history: data.history,
      }));

      if (this.game.game_over()) {
        if (this.game.turn() == "w") {
          if (this.state.color == 1)
            setTimeout(function () {
              alert("You won!");
            }, 200);
          else
            setTimeout(function () {
              alert("You lost :(");
            }, 200);
        } else {
          if (this.state.color == 0)
            setTimeout(function () {
              alert("You won!");
            }, 200);
          else
            setTimeout(function () {
              alert("You lost :(");
            }, 200);
        }
      }
    });
  }

  // keep clicked square style and remove hint squares
  removeHighlightSquare = () => {
    this.setState(({ pieceSquare, history }) => ({
      squareStyles: squareStyling({ pieceSquare, history }),
    }));
  };

  // show possible moves
  highlightSquare = (sourceSquare, squaresToHighlight) => {
    const highlightStyles = [sourceSquare, ...squaresToHighlight].reduce(
      (a, c) => {
        return {
          ...a,
          ...{
            [c]: {
              background:
                "radial-gradient(circle, #fffc00 36%, transparent 40%)",
              borderRadius: "50%",
            },
          },
          ...squareStyling({
            history: this.state.history,
            pieceSquare: this.state.pieceSquare,
          }),
        };
      },
      {}
    );

    this.setState(({ squareStyles }) => ({
      squareStyles: { ...squareStyles, ...highlightStyles },
    }));
  };

  onDrop = ({ sourceSquare, targetSquare }) => {
    console.log(this.game.turn());
    console.log(this.state.color);
    if (
      (this.game.turn() == "w" && !this.state.color) ||
      (this.game.turn() == "b" && this.state.color)
    ) {
      // see if the move is legal
      let move = this.game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q", // always promote to a queen for example simplicity
      });
      // illegal move
      if (move === null) return;

      this.setState(({ history, pieceSquare }) => ({
        fen: this.game.fen(),
        history: this.game.history({ verbose: true }),
        squareStyles: squareStyling({ pieceSquare, history }),
      }));
      //console.log(this.game.history);

      let clientData = {
        gameID: this.state.gameID,
        username: this.state.username,
        fen: this.game.fen(),
        sourceSquare: sourceSquare,
        targetSquare: targetSquare,
        history: this.game.history({ verbose: true }),
      };

      //console.log(window.socket);

      window.socket.emit("send_moves", clientData);

      if (this.game.game_over()) {
        console.log(
          "Player " +
            this.game.turn() +
            " checkmated is= " +
            this.game.in_checkmate()
        );

        let winner_name, loser_name;

        if (this.game.turn() == "w") {
          winner_name = "black";
          loser_name = "white";
        } else {
          winner_name = "white";
          loser_name = "black";
        }

        let status = "finished";
        let id = this.state.gameID;
        let moves = this.state.history;
        let outcome_type = "checkmate";

        let data = {
          status: "finished",
          id: this.state.gameID,
          moves: this.state.history,
          outcome_type: "checkmate",
          winner_name: winner_name,
          loser_name: loser_name,
          type: this.state.gameType,
        };

        // let data = JSON.stringify({ status, id, moves, outcome_type, winner_name, loser_name })

        var URL = config.apiURL + "/finishgame";
        fetch(URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }).then((data) => console.log(data));
      }
    }
  };

  onMouseOverSquare = (square) => {
    // get list of possible moves for this square
    let moves = this.game.moves({
      square: square,
      verbose: true,
    });

    // exit if there are no moves available for this square
    if (moves.length === 0) return;

    let squaresToHighlight = [];
    for (var i = 0; i < moves.length; i++) {
      squaresToHighlight.push(moves[i].to);
    }

    this.highlightSquare(square, squaresToHighlight);
  };

  onMouseOutSquare = (square) => this.removeHighlightSquare(square);

  // central squares get diff dropSquareStyles
  onDragOverSquare = (square) => {
    this.setState({
      dropSquareStyle:
        square === "e4" || square === "d4" || square === "e5" || square === "d5"
          ? { backgroundColor: "cornFlowerBlue" }
          : { boxShadow: "inset 0 0 1px 4px rgb(255, 255, 0)" },
    });
  };

  onSquareClick = (square) => {
    this.setState(({ history }) => ({
      squareStyles: squareStyling({ pieceSquare: square, history }),
      pieceSquare: square,
    }));
  };

  onSquareRightClick = (square) =>
    this.setState({
      squareStyles: { [square]: { backgroundColor: "deepPink" } },
    });

  render() {
    const { fen, dropSquareStyle, squareStyles } = this.state;

    return this.props.children({
      squareStyles,
      position: fen,
      onMouseOverSquare: this.onMouseOverSquare,
      onMouseOutSquare: this.onMouseOutSquare,
      onDrop: this.onDrop,
      dropSquareStyle,
      onDragOverSquare: this.onDragOverSquare,
      onSquareClick: this.onSquareClick,
      onSquareRightClick: this.onSquareRightClick,
    });
  }
}

export default function WithMoveValidation(props) {
  var color = props.color;

  return (
    <div>
      <HumanVsHuman>
        {({
          position,
          onDrop,
          onMouseOverSquare,
          onMouseOutSquare,
          squareStyles,
          dropSquareStyle,
          onDragOverSquare,
          onSquareClick,
          onSquareRightClick,
        }) => (
          <Chessboard
            id="humanVsHuman"
            width={640}
            position={position}
            onDrop={onDrop}
            onMouseOverSquare={onMouseOverSquare}
            onMouseOutSquare={onMouseOutSquare}
            boardStyle={{
              borderRadius: "5px",
              boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`,
            }}
            squareStyles={squareStyles}
            dropSquareStyle={dropSquareStyle}
            onDragOverSquare={onDragOverSquare}
            onSquareClick={onSquareClick}
            onSquareRightClick={onSquareRightClick}
            orientation={color}
            myColor={color}
          />
        )}
      </HumanVsHuman>
    </div>
  );
}

const squareStyling = ({ pieceSquare, history }) => {
  const sourceSquare = history.length && history[history.length - 1].from;
  const targetSquare = history.length && history[history.length - 1].to;

  return {
    [pieceSquare]: { backgroundColor: "rgba(255, 255, 0, 0.4)" },
    ...(history.length && {
      [sourceSquare]: {
        backgroundColor: "rgba(255, 255, 0, 0.4)",
      },
    }),
    ...(history.length && {
      [targetSquare]: {
        backgroundColor: "rgba(255, 255, 0, 0.4)",
      },
    }),
  };
};
