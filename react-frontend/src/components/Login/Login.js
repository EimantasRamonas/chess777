import React, { useState } from "react";
import PropTypes from "prop-types";
import "./Login.css";
import { useHistory } from "react-router-dom";

import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

async function loginUser(credentials) {
  return fetch("http://193.219.91.103:8305/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  }).then((data) => data.json());
}

async function forgotPasssword() {
  fetch("http://193.219.91.103:8305/forgot", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ asdfasdf: "3dawmdwaimdawidmim" }),
  }).then((data) => data.json());
}

export default function Login({ setToken }) {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  var history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = await loginUser({
      username,
      password,
    });
    setToken(token);
    console.log(token);

    if (token.placeholder == "Incorrect username or password") {
      alert("Incorrect username or password");
    } else {
      alert("Login successful");
      history.push("/");
    }
  };

  return (
    <Container className="topMargin">
      <Row>
        <Col sm={4}></Col>
        <Col sm={4}>
          <Card>
            <Card.Header>
              <h3>Sign in</h3>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group>
                  <Form.Control
                    type="text"
                    value={username}
                    onChange={(e) => setUserName(e.target.value)}
                    // placeholder="Email address"
                    placeholder="username"
                  />
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>
                <Button
                  variant="secondary"
                  type="submit"
                  className="float-right"
                  // disabled={!validateForm()}
                >
                  Login
                </Button>
                <footer><a href="/forgotpassword">Forgot password?</a></footer>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={4}></Col>
      </Row>
    </Container>
  );
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired,
};
