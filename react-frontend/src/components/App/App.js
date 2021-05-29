import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import "./App.css";
import Main from "../Main/Main";
import Login from "../Login/Login";
import Register from "../Register/Register";
import Game from "../Game/Game";
import ForgotPassword from "../ForgotPassword/ForgotPassword";
import ForgotCode from "../ForgotCode/ForgotCode";
import useToken from "./useToken";
import { NavigationBar } from "../NavigationBar";

function App() {
  const { token, setToken } = useToken();

  // if (!token) {
  //   return <Login setToken={setToken} />;
  // }

  // if (token) {
  //   /// change navbar insert code here
  // }

  return (
    <React.Fragment>
      <BrowserRouter>
        <NavigationBar />
        <Switch>
          <Route exact path="/">
            <Main />
          </Route>
          <Route path="/login">
            <Login setToken={setToken} />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/game">
            <Game />
          </Route>
          <Route path="/game/:id">
            <Game />
          </Route>
          <Route path="/forgotpassword">
            <ForgotPassword />
          </Route>
            <Route path="/forgotcode">
            <ForgotCode />
            </Route>
        </Switch>
      </BrowserRouter>
    </React.Fragment>
  );
}

export default App;
