import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Router, Link } from "@reach/router"
import App1 from './App.1'


class App extends Component {
  render() {
    return (
      <div className="App">
      <div>
        <Router>
          <Login path="/login"/> 
          <Data path="/data"/> 
          <Analytics path="/analytics"/> 
        </Router>
      </div>
        <p className="App-intro">
          To get started,  <code>src/App.js</code> and save to reload.
          <Link to="/login">About</Link>
          <Link to="/data">Data</Link>
          <Link to="/analytics">Analytics</Link>
        </p>
      </div>
    );

  }
}

export default App;
