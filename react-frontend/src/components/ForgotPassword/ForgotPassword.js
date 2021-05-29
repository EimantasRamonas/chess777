import React, { useState } from "react";
import PropTypes from "prop-types";
import "./ForgotPassword.css";
import { useHistory } from "react-router-dom";

import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

var config = require("../../config.js");

async function forgotPasssword(email) {
  var URL = config.apiURL + "/forgot";
  return fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(email),
    //body: JSON.stringify({ asdfasdf: "3dawmdwaimdawidmim" }),
  }).then((data) => data.json());
}

export default function Forgot() {
  const [email, setEmail] = useState();
  var history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = await forgotPasssword({
      email,
    });
    if (token.placeholder == "EmailSent") {
      alert("Enter the code sent to your email.");
      history.push("/forgotcode");
    } else {
      alert("User not found.");
    }
  };

  return (
    <Container className="topMargin">
      <Row>
        <Col sm={4}></Col>
        <Col sm={4}>
          <Card>
            <Card.Header>
              <h3>Forgot Password?</h3>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group>
                  <Form.Control
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                  />
                </Form.Group>
                <Button
                  variant="secondary"
                  type="submit"
                  className="float-right"
                >
                  Remind me
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={4}></Col>
      </Row>
    </Container>
  );
}
