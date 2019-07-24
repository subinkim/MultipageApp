import React from 'react';

import { createStackNavigator } from 'react-navigation';

import Home from './Home.js';
import AddHome from './AddHome.js';
import Register from './Register.js';

export default createStackNavigator({
  Home,
  AddHome,
  Register
});
