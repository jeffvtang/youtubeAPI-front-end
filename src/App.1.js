import React, { Component } from 'react';
import './App.css';
import { Router, Link } from "@reach/router"


class App1 extends Component {
  render() {
    return (
      <div className="App">
      <div>
      </div>
        <p className="App-intro">
          To get started,  <code>src/App.js</code> and save to reload.
          <Link to="/about">About</Link>
        </p>
      </div>
    );
  }
}

export default App1;
