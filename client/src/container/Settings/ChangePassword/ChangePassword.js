import React, { Component } from 'react';
import changePassword from '../../Utils/ChangePassword';

import InputFieldPassword from '../../../components/Reusables/InputFieldPassword/InputFieldPassword';
require('./ChangePassword.scss');

class ChangePassword extends Component {
  constructor(props) {
    super(props)
    this.state = {
      password: '',
      confirmPassword: '',
      newPassword: '',
      newConfirmPassword: '',
      errors: [
      ]
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value, errors: this.state.errors.filter(error => error.field !== e.target.name) });
    let query = document.querySelectorAll('.InputPassField');
    let password = query[0];
    let confirm = query[1];
    let newPassword = query[2];
    let newConfirm = query[3];

    if (password.value === confirm.value && password.value !== '' && confirm.value !== '') {
      password.style.borderColor = confirm.style.borderColor = 'green';
    }
    if (password.value !== confirm.value && password.value !== '' && confirm.value !== '') {
      password.style.borderColor = confirm.style.borderColor = 'red';
    }
    if (password.value === '' || confirm.value === '') {
      password.style.borderColor = confirm.style.borderColor = null;
    }

    if (newPassword.value === newConfirm.value && newPassword.value !== '' && newConfirm.value !== '') {
      newPassword.style.borderColor = newConfirm.style.borderColor = 'green';
    }
    if (newPassword.value !== newConfirm.value && newPassword.value !== '' && newConfirm.value !== '') {
      newPassword.style.borderColor = newConfirm.style.borderColor = 'red';
    }
    if (newPassword.value === '' || newConfirm.value === '') {
      newPassword.style.borderColor = newConfirm.style.borderColor = null;
    }
  }
  handleSubmit(e) {
    e.preventDefault();
    const password = this.state.password,
          confirmPassword = this.state.confirmPassword,
          newPassword = this.state.newPassword,
          newConfirmPassword = this.state.newConfirmPassword;

    // check cleartext passwords match
    if (password === confirmPassword) {
      if (newPassword === newConfirmPassword) {
        changePassword(this.props.token, password, newPassword)
          .then(res => {
            this.refs.submitInput.value = "Saved!";
            setTimeout(() => {
              this.refs.submitInput.value = "Save";
            }, 5000);
          })
          .catch(err => {
            switch(err.response.status) {
              case 401:
                this.setState({errors: [...this.state.errors, {field: 'confirmPassword', message: "Incorrect Password"}]});
                break;
              case 404:
                this.setState({errors: [...this.state.errors, {field: 'newConfirmPassword', message: 'Profile Not Found!'}]});
                break;
              case 500:
                this.setState({errors: [...this.state.errors, {field: 'newConfirmPassword', message: 'Internal Server Error'}]});
            }
          });
      } else this.setState({errors: [...this.state.errors, {field: 'newConfirmPassword', message: "Passwords do not match!"}]});
    } else this.setState({errors: [...this.state.errors, {field: 'confirmPassword', message: "Passwords do not match!"}]});

  }
  render() {
    console.log(this.state.errors);
    return (
      <div className="ChangePassword">
        <div className='ContainerHeader'>
          Change Password
        </div>
        <div className='Container'>
          <form onSubmit={this.handleSubmit} ref='form'>
            <label>
              <InputFieldPassword type='password' name='password' placeholder={'Enter Password'} onChange={this.handleChange} errors={this.state.errors}/>
            </label>
            <label>
              <InputFieldPassword type='password' name='confirmPassword' placeholder={'Confirm Password'} onChange={this.handleChange} errors={this.state.errors}/>
            </label>
            <label>
              <InputFieldPassword type='password' name='newPassword' placeholder={'New Password'} onChange={this.handleChange} errors={this.state.errors}/>
            </label>
            <label>
              <InputFieldPassword type='password' name='newConfirmPassword' placeholder={'Confirm New Password'} onChange={this.handleChange} errors={this.state.errors}/>
            </label>
            <input type='submit' value='Save' ref='submitInput' />
          </form>
          {this.state.errorMessage && <p>{this.state.errorMessage}</p>}
        </div>
      </div>
    );
  }
}

export default ChangePassword;
