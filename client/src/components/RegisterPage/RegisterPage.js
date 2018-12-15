import React, { Component } from 'react';
import registerUser from '../../container/Utils/RegisterUser';

require('./RegisterPage.scss');
const emailRegex = new RegExp(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/);

function redirectToLogin() {
  setTimeout(() => {
    window.location = '/';
  }, 3000);
}

class RegisterPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      confirmPassword: '',
      errors: []
    }
    this.handleChange = this.handleChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(e) {
    console.log(this.state)
    let name = e.target.name;
    let errors = this.state.errors.filter(err => err.field === name);
    this.setState({ [name]: e.target.value }, () => {
      console.log(errors);
      if (errors.length) {
        this.setState({errors: errors.filter(err => err.field !== name)});
      }
    });
  }
  handlePasswordChange(e) {
    let target = e.target;
    let errors = this.state.errors.filter(err => err.field === target.name);
    this.setState({ [target.name]: target.value }, () => {
      let otherForm = target.name === 'password'
        ? document.getElementById('passwordForm2')
        : document.getElementById('passwordForm1');

      if (target.value === '' && otherForm.value === '')  {
        target.style.borderColor = null;
        otherForm.style.borderColor = null;
      } else if (target.value !== otherForm.value) {
        target.style.borderColor = otherForm.style.borderColor = '#ff6562';
      } else if (target.value === otherForm.value) {
        target.style.borderColor = otherForm.style.borderColor = '#00c07f';
      }
      if (errors.length) {
        this.setState({errors: errors.filter(err => err.field !== target.name)});
      }
    });
  }
  handleSubmit(e) {
    e.preventDefault();
    console.log(this.state);
    let password = this.state.password;
    let confirmPassword = this.state.confirmPassword;
    console.log(password, confirmPassword);
    if (this.state.password && this.state.confirmPassword) {
      console.log("PASSWORDS NOT EMPTY")
      if (this.state.password === this.state.confirmPassword) {
        console.log("PASSWORDS MATCH")
        if (emailRegex.test(this.state.email) && this.state.email !== '') {
          if (this.state.firstname !== '') {
            registerUser(this.state.firstname, this.state.lastname, this.state.email, this.state.password)
              .then(res => res.data)
              .then(res => {
                console.log(res);
                if (res.auth) {
                  this.setState({successMessage: 'Registered successfully! Redirecting to login...', errorMessage: null}, redirectToLogin);
                }
              })
              .catch(err => {
                if (err.response) {
                  if (err.response.status === 409) {
                    this.setState({errors: [...this.state.errors, {field: 'email', message: 'Email already in use'}]})
                  } else {
                    this.setState({'errorMessage': "Internal server error. Please try again later"})
                  }
                }
              });
          } else this.setState({errors: [...this.state.errors, {field: 'firstname', message: 'First Name is required'}]});
        } else this.setState({errors: [...this.state.errors, {field: 'email', message: 'Email is not valid'}]});
      } else this.setState({errors: [...this.state.errors,{field: 'password', message: 'Passwords do not match'},
                            {field: 'confirmPassword', message: 'Passwords do not match'}]});
    } else this.setState({errors: [...this.state.errors, {field: 'password', message: 'Password required'}]});
  }
  render() {
    
    return (
      <div className="RegisterPage">
        <p id='title'>Register</p>
        {this.state.errorMessage && <p>{this.state.errorMessage}</p>}
        {this.state.successMessage && <p>{this.state.successMessage}</p>}
        <form method='POST' onSubmit={this.handleSubmit}>
          <Label type='text' name='firstname' placeholder='First Name*' onchange={this.handleChange} errors={this.state.errors} />
          <br />
            <Label type='text' name='lastname' placeholder='Last Name' onchange={this.handleChange} errors={this.state.errors} />
          <br />
            <Label type='text' name='email' placeholder='Email*' onchange={this.handleChange} errors={this.state.errors} />
          <br />
            <Label type='password' id='passwordForm1' name='password' placeholder='Password*' onchange={this.handlePasswordChange} errors={this.state.errors} />
          <br />
            <Label type='password' id='passwordForm2' name='confirmPassword' placeholder='Confirm Password*' onchange={this.handlePasswordChange} errors={this.state.errors} />
          <br />
          <input id='submit' type='submit' name='submit' value='Register' />
        </form>
      </div>
    );
  }
}

const Label = (props) => {
  let errors = props.errors.filter(err => err.field === props.name);
  return (
    <label>
      <input id={props.id} className={errors.length ? 'Error' : ''} type={props.type} name={props.name} placeholder={props.placeholder} onChange={props.onchange} />
      {errors.map((err,i) => <p className='ErrorMessage' key={i}>{err.message}</p>)}
    </label>
  );
}

export default RegisterPage;
