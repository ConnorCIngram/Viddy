import React, { Component } from 'react';
import userFromToken from '../../container/Utils/UserFromToken';
require('./Profile.scss');

const emptyUser = {
  name: {
    firstname: '',
    lastname: ''
  },
  email: '',
  uploads: [],
  comments: [],
  profilePicURL: ''
}

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: emptyUser
    }
  }
  componentDidMount() {
    const _token = this.props.token;
    userFromToken(_token)
      .then(res => res.data)
      .then(user => this.setState({user: user}))
      .catch(err => console.log(err));
  }
  render() {
    /*
      TODO IN PROGRESS
    */
    return (
      <div className='Profile'>
        <div className="ProfilePic">
          <img src={this.state.user.profilePicURL} alt="Profile" />
          <div className="ProfilePicHover">
            change
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
