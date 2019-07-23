import React from 'react';

import { createStackNavigator } from 'react-navigation';

import Load from './Load.js';
import Register from './Register.js';

export default createStackNavigator({
  Register,
  Load,
});
