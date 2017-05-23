import React, { Component } from 'React';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';

import Home from './containers/Home.jsx';

const Root = () => {
  return (
    <Router>
      <Route exact path='/' component={ Home } />
    </Router>
  )
};

export default Root;
