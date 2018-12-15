import React, { Component } from 'react';
import { Switch, Route, Redirect } from "react-router-dom";
import RegisterPage from './components/RegisterPage/RegisterPage';

import verifyToken from './container/Utils/VerifyToken';
import loginUser from './container/Utils/LoginUser';

import Home from './components/Home/Home';
import Profile from './components/Profile/Profile';
import Navbar from './container/Navbar/Navbar';
import Login from './container/Login/Login';
import Settings from './container/Settings/Settings';
import ChangeProfilePic from './container/Settings/ChangeProfilePic/ChangeProfilePic';
import ChangeProfileInfo from './container/Settings/ChangeProfileInfo/ChangeProfileInfo';

require('./App.scss');

export default class AppRouter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      loading: true
    }
    this.login = this.login.bind(this);
  }
  componentDidMount() {
    // check for valid login token in localstorage
    const token = localStorage.getItem('token');
    if (token) {
      // user has a login token, check auth
      verifyToken(token)
        .then(res => {
          if (res.data) {
            // auth passed, user is logged in
            this.setState({loggedIn: true, token: token, loading: false});
          } else this.setState({errorMessage: "Authentification failed"}, () => {
            localStorage.removeItem('token');
          })
        })
        .catch(err => {
          console.log(err.response.status);
          if (err.response.status === 401) {
            // token is expired
            this.setState({errorMessage: "Session has expired. Please login again.", loading: false}, () => {
              // remove token
              localStorage.removeItem('token');
            })
          } else {
            this.setState({errorMessage: err.message, loading: false}, () => {
            // remove invalid token
            localStorage.removeItem('token');
            });
          }
        });
    }
    else {
      // no saved token
      this.setState({loading: false});
    }
  }
  login(email, password) {
    loginUser(email, password)
      .then(res => res.data)
      .then(auth => {
        if (auth.auth) {
          localStorage.setItem('token', auth.token);
          this.setState({loggedIn: true, token: auth.token});
        }
      })
      .catch(err => this.setState({errorMessage: "Incorrect email or password"}));
  }
  render() {
    return (
      <div className='App'>
      <Navbar token={this.state.token} />
      <Switch>
          <Route exact path='/'>
            {!this.state.loggedIn && this.state.loading ? <p>Loading...</p> : !this.state.loggedIn && !this.state.loading 
            ? <Login dispatchLogin={this.login} errorMessage={this.state.errorMessage}/>
            // : <Home token={this.state.token} />}
            : <Home token={this.state.token}/>}
          </Route>
          <Route path='/register' component={RegisterPage} />
          {/* <Route path='/settings' component={Settings} token={this.state.token} /> */}
          <PrivateRoute authed={this.state.loggedIn} exact path='/settings' token={this.state.token} component={Settings}/>
          <PrivateRoute authed={this.state.loggedIn} exact path='/settings/profile/pic' token={this.state.token} component={ChangeProfilePic} />
          <PrivateRoute authed={this.state.loggedIn} exact path='/settings/profile/info' token={this.state.token} component={ChangeProfileInfo} />
      </Switch>
      </div>
    )
  }
}

const PrivateRoute = ({component: Component, authed, token: token, ...rest}) => {
  return (
    <Route
      {...rest}
      render={(props) => authed === true
        ? <Component token={token} {...props} />
        : <Redirect to={{pathname: '/', state: {from: props.location}}} />}
    />
  )
}