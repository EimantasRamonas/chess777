import React, { useState } from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";

import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

var config = require("../../config.js");

async function passwordCode(code) {
  var URL = config.apiURL + "/forgotcode";
  return fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(code),
  }).then((data) => data.json());
}

export default function Forgot() {
  const [code, setCode] = useState();
  var history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = await passwordCode({
      code,
    });

    console.log(token.placeholder);
    if (token.placeholder == "PasswordResetSuccess") {
      alert("Your password has been sent to your email.");
      history.push("/");
    } else {
      alert("Something went wrong, try again.");
    }
  };

  return (
    <Container className="topMargin">
      <Row>
        <Col sm={4}></Col>
        <Col sm={4}>
          <Card>
            <Card.Header>
              <h3>Enter the code sent to your e-mail.</h3>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group>
                  <Form.Control
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Code"
                  />
                </Form.Group>
                <Button
                  variant="secondary"
                  type="submit"
                  className="float-right"
                >
                  Reset Password
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
