import React, { Component } from 'react';

require('./InputField.scss');
class InputField extends Component {
  constructor(props) {
    super(props)
    this.state = {
      errors: []
    }
  }
  render() {
    return (
      <div className="InputField">
        <input {...this.props} />
      </div>
    );
  }
}

export default InputField;
