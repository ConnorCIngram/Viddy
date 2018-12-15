import React, { Component } from 'react';
import ErrorOutline from '@material-ui/icons/ErrorOutline';
import InputFieldPassword from '../../components/Reusables/InputFieldPassword/InputFieldPassword';
import InputField from '../../components/Reusables/InputField/InputField';

require('./Login.scss');
var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    document.getElementById('submit').addEventListener('touchend', (e) => {
      e.target.style.backgroundColor = "#0288d1";
    });
  }
  handleSubmit(e) {
    e.preventDefault();
    this.props.dispatchLogin(this.state.email, this.state.password);
  }
  
  handleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    this.setState({ [name]: value }, () => {
      if (name === 'email') {
        if (emailRegex.test(value) && value !== '') {
          document.getElementById('emailInput').style.borderColor = '#00c07f';
        } else {
          document.getElementById('emailInput').style.borderColor = '#ff6562';
        }
      }
    });
  }
  render() {
    return (
      <div className='Login'>
      Please Login
        <form method="POST" onSubmit={this.handleSubmit}>
          <div className="Error">
            {this.props.errorMessage}
          </div>
          <label>
            <InputField type="email" name="email" id='emailInput' placeholder={"email"} onChange={this.handleChange} />
          </label>
          <label>
            <InputFieldPassword placeholder={"password"} name="password" onChange={this.handleChange} />
          </label>
          <input id='submit' type="submit" value="Login" />
        </form>
        <a id='register' href='/register'>Register</a>
        <br />
      </div>
    );
  }
}

export default Login;