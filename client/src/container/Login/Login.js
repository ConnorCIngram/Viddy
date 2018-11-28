import React, { Component } from 'react';
const axios = require('axios');

function reset() {
  localStorage.removeItem('token');
  console.log(localStorage.getItem('token'));
}

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      msg: ''
    }
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    
  }
  componentDidMount() {
    const token = localStorage.getItem('token');
    if (token) {
      // user has saved token in browser
      axios.get('/api/auth', {headers: {'x-access-token': token}})
        .then(res => { this.setState({msg: "Logged in as " + res.data.name.firstname + ' ' + res.data.name.lastname}) })
        .catch(err => console.log({err}))
    }
  }
  handleSubmit(e) {
    e.preventDefault();
    const email = this.state.email,
          password = this.state.password;
    localStorage.removeItem('token');
    if (email && password) {
      axios.post('/api/auth', { email: email, password: password })
        .then(res => {
          console.log(res);
          if (res.data.auth) {
            // token = res.data.token;
            localStorage.setItem('token', res.data.token);
            console.log(res.data.token);
          }
        })
        .then(res => {
          axios.get('/api/auth', {headers: {'x-access-token': localStorage.getItem('token')}})
            .then(res => {
              this.setState({ msg: "Logged in as " + res.data.name.firstname + ' ' + res.data.name.lastname });
            })
            .catch(err => this.setState({msg: 'Cannot authenticate'}));
        })
        .catch(err => {
          this.setState({msg: "Username or password is incorrect" });
        })
    }
  }
  
  handleEmailChange(e) {
    this.setState({ email: e.target.value });
  }
  handlePasswordChange(e) {
    this.setState({ password: e.target.value });
  }
  render() {
    return (
      <div className='Login'>LOGIN:
        <form onSubmit={this.handleSubmit}>
          <label>
            Email:
            <input type="text" name="email" onChange={this.handleEmailChange} />
          </label>
          <br />
          <label>
            Password:
            <input type="text" name="password" onChange={this.handlePasswordChange} />
          </label>
          <br />
          <input type="submit" value="Submit" />
        </form>
        <button onClick={reset}>Reset</button>
        <br />
        {this.state.msg && <p>{this.state.msg}</p>}
      </div>
    );
  }
}

export default Login;