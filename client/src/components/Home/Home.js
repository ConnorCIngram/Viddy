import React, { Component } from 'react';
import Login from '../../container/Login/Login';
require('./Home.scss');

class Home extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return(
            <div className='Home'>
            <Login />
            </div>
        );
    }
}

export default Home;