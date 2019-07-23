import React from 'react';

import { createStackNavigator } from 'react-navigation';

import Home from './Home.js';
import Load from './Load.js';
import Edit from './Edit.js';

export default createStackNavigator({
  Home,
  Load,
  Edit,
});
