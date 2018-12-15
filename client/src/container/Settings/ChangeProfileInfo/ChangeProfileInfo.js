import React, { Component } from 'react';
import userFromToken from '../../Utils/UserFromToken';
import changeProfileInfo from '../../Utils/ChangeProfileInfo';

require('./ChangeProfileInfo.scss');

class ChangeProfileInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {
        firstname: '',
        lastname: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount() {
    if (this.props.token) {
      userFromToken(this.props.token)
        .then(res => res.data)
        .then(user => {
          if (user) {
            this.setState({firstname: user.name.firstname, lastname: user.name.lastname});
          } else throw new Error();
        })
        .catch(err => console.log(err));
    }
  }
  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value }, () => console.log(this.state));
  }
  handleSubmit(e) {
    e.preventDefault();
    this.setState({loading: true}, () => {
      this.refs.submitInput.value = "Saving...";
    })
    changeProfileInfo(this.props.token, {name: this.state})
      .then(res => {
        if (res.status === 200) {
          this.setState({loading: false}, () => {
            this.refs.submitInput.value = "Saved!";
            resetSubmitValue(this.refs.submitInput);
          })
        }
      })
      .catch(err => {
        this.setState({loading: false}, () => {
          this.refs.submitInput.value = "Error saving";
          resetSubmitValue(this.refs.submitInput);
        });
      });
      function resetSubmitValue(elem) {
        setTimeout(() => {
          elem.value = 'Save';
        }, 5000);
      }
  }
  render() {
    return (
      <div className="ChangeProfileInfo">
        <div className='ContainerHeader'>
          Change Name
        </div>
        <div className='Container'>
          <form onSubmit={this.handleSubmit}>
            <label>
              <input type='text' name='firstname' value={this.state.firstname} placeholder={'First Name'} onChange={this.handleChange}/>
            </label>
            <br/>
            <label>
              <input type='text' name='lastname' value={this.state.lastname} placeholder={'Last Name'} onChange={this.handleChange} />
            </label>
            <br/>
            <input type='submit' value='Save' ref='submitInput' />
          </form>
        </div>
      </div>
    );
  }
}

export default ChangeProfileInfo;
