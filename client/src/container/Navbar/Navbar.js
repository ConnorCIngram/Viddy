import React, { Component } from 'react';
import Reorder from '@material-ui/icons/Reorder';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Clear from '@material-ui/icons/Clear';
import ReactSVG from 'react-svg';
import axios from 'axios';
import {Link} from 'react-router-dom';

require('./Navbar.scss');

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuIsOpen: false,
      loggedIn: false
    }
    this.handleMenuClick = this.handleMenuClick.bind(this);
  }
  handleMenuClick(e) {
    const menuIsOpen = this.state.menuIsOpen;
    this.setState({ menuIsOpen: !menuIsOpen }, () => {
      if (this.state.menuIsOpen) {
        document.getElementById('navmenu').className = 'NavMenu Active';
      } else {
        document.getElementById('navmenu').className = 'NavMenu';
      }
    });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.token) {
      axios.get('/api/auth', {headers: {'x-access-token': nextProps.token}})
        .then(res => {
          this.setState({loggedIn: true, _id: res.data._id, profilePicURL: res.data.profilePicURL});
        })
        .catch(err => console.log(err));
    }
  }

  render() {
    return (
      <div className='Navbar'>
        {this.state.menuIsOpen && 
          <Clear style={{float:'left', cursor: 'pointer'}} 
                  className='MenuIcon' 
                  onClick={this.handleMenuClick} 
          />
        }
        {!this.state.menuIsOpen &&
          <Reorder style={{float:'left', cursor: 'pointer'}} 
                   className='MenuIcon' 
                   onClick={this.handleMenuClick}
          />
        }
        <NavMenu handleMenuClick={this.handleMenuClick} loggedIn={this.state.loggedIn}/>
        <Link to="/">
          <ReactSVG src='/SVG/Viddy.svg' className='Icon' />
        </Link>
        {this.state.loggedIn && this.state.profilePicURL
          ? <img src={this.state.profilePicURL.split('upload')[0] + 'upload/c_fill,g_north_west,h_100,q_80,r_100,w_100,x_0,y_0' + this.state.profilePicURL.split('upload')[1]} className="MenuIcon" style={{float: 'right'}} alt="Profile"/>
          : <AccountCircle style={{float:'right'}} className='MenuIcon'/>
        }
      </div>
    );
  }
}

function logout() {
  localStorage.removeItem('token');
  window.location = '/';
}

class NavMenu extends Component {
  constructor(props) {
    super(props)
    this.state = {active: ''}
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick = (e) => {
    if (this.state.active !== '') {
    let last = document.querySelector('.' + this.state.active)
    last.className = last.className.split(' Active')[0];
    }
    this.setState({active: e.target.className});
    e.target.className += ' Active';

    this.props.handleMenuClick(e);
  }
  render() {
    return (
      <div className="NavMenu" id='navmenu'>
      {this.props.loggedIn && <Link to='/' onClick={this.handleClick} className="home">Home</Link>}
        {this.props.loggedIn && <Link to='/settings' onClick={this.handleClick} className="settings">Settings</Link>}
        
        <button onClick={this.handleClick} className='test'>test</button>
        <button onClick={logout} className='logout'>Logout</button>
      </div>
    );
  }
}

export default Navbar;
