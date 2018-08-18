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
      user: '',
      token: '',
    }
  }

  success = response => {
    console.log('success', response)
    console.log('user', response.w3.ig)
    console.log('access token', response.accessToken)
    this.setState({user: response.w3.ig, token: response.accessToken})
  }

  error = response => {
    console.error('error', response)
  }

  loading = () => {
    console.log('loading')
  }

  logout = () => {
    console.log('logout')
    this.setState({user: '', token: ''})
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
          responseType="permission"
          isSignedIn={true}
          prompt="consent"
        > {this.state.user === '' ? 'Login' : this.state.user} </GoogleLogin>
        |<GoogleLogout 
        onLogoutSuccess={this.logout}/>
        <div>
          <Link to="/">Home</Link> |
          {/* <Link to="/login">Login</Link> | */}
          <Link to="/upload">Upload</Link> |
          <Link to="/analytics">Analytics</Link>
        </div>
        <Router>
          {/* <Login path="/login" auth={this.login} /> */}
          <Data path="/upload" user={this.state.user} token={this.state.token}/>
          <Analytics path="/analytics" user={this.state.user} token={this.state.token}/>
        </Router>
      </div>
    );
  }
}

export default App;