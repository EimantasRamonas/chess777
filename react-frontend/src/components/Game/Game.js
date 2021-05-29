import React, { useEffect, useState, useReducer } from "react";
import "./Game.css";

import WithMoveValidation from "./integrations/WithMoveValidation";
import TestBoard from "./integrations/TestBoard";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";

import { io } from "socket.io-client";

export default function Game() {
  //const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const [color, setColor] = useState();
  const [gameType, setGameType] = useState();
  useEffect(() => {
    initializeGame();
  });

  return (
    <div class="game-container">
      <div class="game" style={boardsContainer}>
        {getBoard()}
      </div>
      {getInfoBox()}
    </div>
  );

  function getBoard() {
    if (color == undefined) return <TestBoard color={color} />;
    else return <WithMoveValidation color={color} />;
  }

  function getInfoBox() {
    if (color == undefined) {
      return (
        <div class="info-box">
          <Card style={{ width: "350px", height: "550px" }}>
            <Card.Body>
              <br></br>
              Send this link to your friend:
              <Card style={{ background: "#778191", margin: "25px" }}>
                {window.location.href}
              </Card>
              After someone else clicks on it, the game will start.
            </Card.Body>
          </Card>
        </div>
      );
    } else
      return (
        <div class="info-box">
          <Card style={{ width: "350px", height: "550px" }}>
            <Card.Body>
              <br></br>
              Game has started!
            </Card.Body>
          </Card>
        </div>
      );
  }

  function initializeGame() {
    var gameURL = window.location.href; //http://193.219.91.103:15518/game/jkJBgdY1jn
    var gameID = gameURL.slice(-10);
    var username;

    if (localStorage.getItem("token") != undefined) {
      var data = JSON.parse(localStorage.getItem("token"));
      username = data.name;
    } else {
      username = makeid(15);
      var userToken = {
        type: "Anonymous",
        name: username,
      };
      localStorage.setItem("token", JSON.stringify(userToken));
    }
    const socket = io.connect("http://193.219.91.103:8443/");
    window.socket = socket;
    let clientData = {
      gameID: gameID,
      username: username,
    };


    //CIA REIKIA PAKEISTI
    socket.emit("joinGame", clientData);

    socket.on("color", (arg) => {
      if (arg == 0) setColor("white");
      else if (arg == 1) setColor("black");
      else console.log("?XD");

      // start game when u get color
    });

      socket.emit("send_color", clientData);
      socket.on("get_color", (arg) => {
      console.log(arg);
      // if(arg.username == this.state.username) this.state.color = arg.color;

      console.log(gameID == arg.gameID);
      if(gameID == arg.gameID && arg.white_username != null && arg.black_username != null)
      {
        console.log("MY NAME: " + username);
        console.log("WHITE: " + arg.white_username);
        console.log("BLACK: " + arg.black_username);

        let correctColor;

        if(username == arg.white_username) correctColor = "white";
        if(username == arg.black_username) correctColor = "black";


        setColor(correctColor);
        console.log(correctColor);
      } 
      
    });
  }

  function makeid(length) {
    var result = [];
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result.push(
        characters.charAt(Math.floor(Math.random() * charactersLength))
      );
    }
    return result.join("");
  }
}

const boardsContainer = {
  margin: "50px",
};
