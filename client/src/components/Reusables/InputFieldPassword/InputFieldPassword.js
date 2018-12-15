import React, { Component } from 'react';
import RemoveRedEye from '@material-ui/icons/RemoveRedEye';

require('./InputFieldPassword.scss');

const svgStyle = {
  position: 'absolute',
  top: 0,
  cursor: 'pointer'
};
export default class InputPassword extends Component {
  constructor(props) {
      super(props);
      this.state = {
          passwordShowing: false
      }
      this.changePasswordShow = this.changePasswordShow.bind(this);
  }
  changePasswordShow(e) {
      this.setState({passwordShowing: !this.state.passwordShowing}, () => {
          this.refs.input.children[0].type = this.state.passwordShowing ? "text" : "password";
          this.refs.input.children[1].id = this.state.passwordShowing ? 'InputFieldPasswordSVGActive' : 'InputFieldPasswordSVG';
      });
  }
  
  render() {
    const errors = this.props.errors || [];
      return (
          <div className="InputFieldPassword" ref='input' style={{position: 'relative'}}>
              <input className="InputPassField" type='password' {...this.props} style={{width: '100%'}} maxLength="128"/>
              <RemoveRedEye id="InputFieldPasswordSVG" onClick={this.changePasswordShow} style={svgStyle}/>
              {errors.filter(err => err.field === this.props.name).map((err, i) => (
                <div className='ErrorMessage' key={i}>
                  {err.message}
                </div>
              ))}
          </div>
      );
  }
}