import React, { Component } from 'react';
import ChangeProfilePic from './ChangeProfilePic/ChangeProfilePic';
import ChangeProfileInfo from './ChangeProfileInfo/ChangeProfileInfo';
import ChangePassword from './ChangePassword/ChangePassword';

require('./Settings.scss');

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: ''
    }
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(e) {
    this.setState({active: e.target.name});
  }
  render() {
    return (
      <div className='Settings'>
      <div className='Header'>Settings</div>
        <ChangeProfilePic token={this.props.token} />
        <ChangeProfileInfo token={this.props.token} />
        <ChangePassword token={this.props.token} />
      </div>
    );
  }
}

export default Settings;
