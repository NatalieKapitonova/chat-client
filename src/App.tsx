import React from "react";
import { Router, Switch, Route } from "react-router-dom";

import Home from "./home";
import ChatRoom from "./chat-room";
import "./App.css";
import * as History from "history";

const history = History.createBrowserHistory();

const App = () => {
  return (
    <Router history={history}>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/:id/room" component={ChatRoom} />
      </Switch>
    </Router>
  );
};

export default App;
