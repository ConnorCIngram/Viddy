import React, { Component } from 'react';
import Home from './components/Home/Home';
import Navbar from './components/Navbar/Navbar';

export default class App extends Component {
  render() {
    return (
      <div className='App' style={{backgroundColor: '#fafafa'}}>
        <Navbar />
        <Home />
      </div>
    );  
  }
}