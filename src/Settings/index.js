import React from 'react';

import { createStackNavigator } from 'react-navigation';

import Home from './Home.js';
import ChangeServer from './ChangeServer.js';

export default createStackNavigator({
  Home,
  ChangeServer
});
