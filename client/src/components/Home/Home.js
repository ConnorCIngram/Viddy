import React, { Component } from 'react';
import userFromToken from '../../container/Utils/UserFromToken';

require('./Home.scss');

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    componentDidMount() {
        userFromToken(this.props.token)
            .then(res => res.data)
            .then(user => this.setState({user: user}))
            .catch(err => console.log(err));
    }
    render() {
        return(
            <div className='Home'>
                {this.state.user && <p>Welcome, {this.state.user.name.firstname}!</p>}
            </div>
        );
    }
}

export default Home;