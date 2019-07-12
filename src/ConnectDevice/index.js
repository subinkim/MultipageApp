import React from 'react';

import { createStackNavigator, createAppContainer } from 'react-navigation';

import Home from './Home.js';
import Details from './Details.js';
import Info from './Info.js';
import Scanner from './Scanner.js';

export default createStackNavigator({
  Home,
  Details,
  Info,
  Scanner
});
