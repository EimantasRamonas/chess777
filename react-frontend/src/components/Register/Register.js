import Form from "react-bootstrap/Form";
import "./Register.css";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

var config = require("../../config.js");

export default function Register() {
  var history = useHistory();
  async function handleSubmit(event) {
    event.preventDefault();

    if (password != password2) {
      alert("Passwords don't match!");
    } else {
      var URL = config.apiURL + "/register";
      fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, username, password }),
      })
        .then((res) => res.json())
        .then((result) => {
          parseResponse(result);
        });
    }
  }

  function parseResponse(response) {
    alert(response.message);
    if (response.message == "Account created!") history.push("/");
  }

  function validateForm() {
    // adjust this later ofc
    return email.length > 0 && password.length > 0;
  }

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  return (
    <Container className="topMargin">
      <Row>
        <Col sm={4}></Col>
        <Col sm={4}>
          <Card>
            <Card.Header>
              <h3>Register a new account</h3>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="email">
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                  />
                </Form.Group>
                <Form.Group controlId="username">
                  <Form.Control
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                  />
                </Form.Group>
                <Form.Group controlId="password">
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                  />
                </Form.Group>
                <Form.Group controlId="repeatpassword">
                  <Form.Control
                    type="password"
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                    placeholder="Confirm password"
                  />
                </Form.Group>
                <Button
                  variant="secondary"
                  type="submit"
                  className="float-right"
                  disabled={!validateForm()}
                >
                  Register
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
