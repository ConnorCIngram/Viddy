import React, { Component } from 'react';
require('./Home.scss');
const axios = require('axios');

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: []
        }
    }
    componentDidMount() {
        axios.get('/api/User')
            .then(res => {
                this.setState({ users: res.data })
            })
            .catch(err => {
                console.log(err);
            });
    }
    render() {
        return(
            <div className='Home'>
            Users:
            {this.state.users.map(user => <p key={user._id}>{user.name.firstname + ' ' + user.name.lastname}</p>)}
            </div>
        );
    }
}

export default Home;