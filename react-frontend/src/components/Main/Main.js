import React, { Component, useEffect, useState } from "react";
import "./Main.css";
import { useHistory } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import { Button } from "react-bootstrap";
import { ButtonGroup } from "react-bootstrap";

import { io } from "socket.io-client";

export default function Main() {
  useEffect(() => {
    if (localStorage.getItem("token") != undefined) {
      var data = JSON.parse(localStorage.getItem("token"));
      setUsername(data.name);
    }

    const socket = io.connect("http://193.219.91.103:8443/");
    window.socket = socket;
    socket.on("gameFound", (arg) => {
      console.log("TURETU PERMEST");
      console.log(arg);
      let URL = "/game/" + arg.gameID;

      if(username == arg.user1 || username == arg.user2) 
      {
        history.push(URL);
      }
      
      
    });

  });
  const [gameType, setGameType] = useState();
  const [username, setUsername] = useState();
  var history = useHistory();
  return (
    <Container className="wrapper">
      <Row className="text-center">
        <Col sm={2}></Col>
        <Col sm={8}>
          {" "}
          <div class="middle-container">
            <div class="middle-box">
              <div class="tabs">
                <span class="active">Tab1</span>
                <span>Tab2</span>
                <span>Tab3</span>
              </div>
              <div class="middle-box-content">
                <div>
                  <div class="clock">1+0</div>
                  <div class="perf">Bullet</div>
                </div>
                <div>
                  <div class="clock">2+1</div>
                  <div class="perf">Bullet</div>
                </div>
                <div>
                  <div class="clock">3+0</div>
                  <div class="perf">Blitz</div>
                </div>
                <div>
                  <div class="clock">3+2</div>
                  <div class="perf">Blitz</div>
                </div>
                <div>
                  <div class="clock">5+0</div>
                  <div class="perf">Blitz</div>
                </div>
                <div>
                  <div class="clock">5+3</div>
                  <div class="perf">Blitz</div>
                </div>
                <div onClick={openGame}>
                  <div class="clock">10+0</div>
                  <div class="perf">Rapid</div>
                </div>
                <div>
                  <div class="clock">10+5</div>
                  <div class="perf">Rapid</div>
                </div>
                <div>
                  <div class="clock">15+10</div>
                  <div class="perf">Rapid</div>
                </div>
              </div>
            </div>
          </div>
        </Col>
        <Col sm={2}>
          <Card>
            <br></br>
            <Card.Title>Select game type:</Card.Title>
            <Card.Body>
              <ButtonGroup
                vertical
                onClick={(e) => setGameType(e.target.value)}
              >
                <Button onClick={searchForUnratedMatch} variant="secondary" value="unrated">
                  Unrated
                </Button>
                <br></br>
                <Button onClick={searchForRatedMatch} variant="secondary" value="rated">
                  Rated
                </Button>
                <br></br>
                <Button onClick={searchForMatch} variant="secondary" value="friends">
                  Play with friends
                </Button>
              </ButtonGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
  function openGame() {
    history.push("/game");
  }

  function searchForUnratedMatch()
  {
      fetch("http://193.219.91.103:8305/joinUnratedQueue", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({username}),
      }).then((data) => console.log(data));

    //console.log(JSON.stringify(username));
  }

    function searchForRatedMatch()
    {
        fetch("http://193.219.91.103:8305/joinRatedQueue", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({username}),
        }).then((data) => console.log(data));

        //console.log(JSON.stringify(username));
    }

  function searchForMatch() {
    // pagal game type ziuresim ka reikia padaryti
    // console.log(gameType);

    
      let URL = "/game/" + makeid(10);
      history.push(URL);
    
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
