import React, { Component } from 'react';
import Reorder from '@material-ui/icons/Reorder';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Clear from '@material-ui/icons/Clear';
import ReactSVG from 'react-svg';

require('./Navbar.scss');

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuIsOpen: false,
      isSignedIn: false
    }
    this.handleMenuClick = this.handleMenuClick.bind(this);
  }
  handleMenuClick(e) {
    e.preventDefault();
    const menuIsOpen = this.state.menuIsOpen;
    this.setState({ menuIsOpen: !menuIsOpen });
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
        <ReactSVG src='./SVG/Untitled-1.svg' className='Icon'/>
        <AccountCircle style={{float:'right'}} className='MenuIcon'/>
      </div>
    );
  }
}

export default Navbar;
