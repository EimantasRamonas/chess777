import React from "react";
import { Nav, Navbar } from "react-bootstrap";
import styled from "styled-components";

const Styles = styled.div`
  .navbar {
    background-color: #222;
  }
  a,
  .navbar-nav,
  .navbar-light .nav-link {
    color: #9ac1ed;
    &:hover {
      color: white;
    }
  }
  .navbar-brand {
    font-size: 1.4em;
    color: #9ac1ed;
    &:hover {
      color: white;
    }
  }
  .form-center {
    position: absolute !important;
    left: 25%;
    right: 25%;
  }
`;

function loggedOutNavbar() {
  return (
    <Styles>
      <Navbar expand="lg">
        <Navbar.Brand href="/">chess777</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Item>
              <Nav.Link href="/login">Login</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/register">Register</Nav.Link>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </Styles>
  );
}

function logout() {
  localStorage.removeItem("token");
  alert("You have been logged out");
}

function loggedInNavbar(username) {
  return (
    <Styles>
      <Navbar expand="lg">
        <Navbar.Brand href="/">chess777</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Item>
              <Nav.Link href="/">{username}</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/" onClick={logout}>
                Logout
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </Styles>
  );
}

export const NavigationBar = () => {
  const tokenString = localStorage.getItem("token");
  const userToken = JSON.parse(tokenString);
  if (userToken != undefined) {
    if (userToken.placeholder != "Incorrect username or password" && userToken.type != "Anonymous")
      return loggedInNavbar(userToken.name);
    else return loggedOutNavbar();
  } else return loggedOutNavbar();
};
