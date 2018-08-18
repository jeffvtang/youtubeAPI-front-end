import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Router, Link } from "@reach/router"
import Analytics from './Analytics'
import Login from './Login'
import Data from './Data'
import { GoogleLogin, GoogleLogout } from 'react-google-login';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authkey: '',
      user: ''
    }
  }

  success = response => {
    console.log('success', response)
    this.setState({user: response.w3.ig})
  }

  error = response => {
    console.error('error', response)
  }

  loading = () => {
    console.log('loading')
  }

  logout = () => {
    console.log('logout')
    this.setState({user: ''})
  }

  render() {
    return (
      <div className="App">
        <GoogleLogin
          clientId="721555634747-lnb3tang4qeiluuo09k4hvcedct6nf9c.apps.googleusercontent.com"
          scope="https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtubepartner https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/yt-analytics.readonly"
          onSuccess={this.success}
          onFailure={this.error}
          onRequest={this.loading}
          responseType="id_token"
          isSignedIn={true}
          prompt="consent"
        > {this.state.user === '' ? 'Login' : this.state.user} </GoogleLogin>
        <GoogleLogout 
        onLogoutSuccess={this.logout}/>
        <div>
          <Link to="/">Home</Link> |
          {/* <Link to="/login">Login</Link> | */}
          <Link to="/data">Data</Link> |
          <Link to="/analytics">Analytics</Link>
        </div>
        <Router>
          {/* <Login path="/login" auth={this.login} /> */}
          <Data path="/data" />
          <Analytics path="/analytics" />
        </Router>
      </div>
    );
  }
}

export default App;