import React, { useEffect, useState, useReducer } from "react";
import "./Game.css";

import WithMoveValidation from "./integrations/VersusAi";
import TestBoard from "./integrations/TestBoard";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";


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
        if  return <VersusAi />;
    else return <VersusAi />;
    }

    function getInfoBox() {
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

}

const boardsContainer = {
    margin: "50px",
};
