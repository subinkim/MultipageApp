import React from 'react';

import { createStackNavigator, createAppContainer } from 'react-navigation';

import Home from './Home.js';
import Scanner from './Scanner.js';
import Instructions from './Instructions.js';
import ConnectDeviceStack from './ConnectDevice';
import RegisterDeviceStack from './RegisterDevice';

export default createStackNavigator({
  Home,
  Scanner,
  Instructions,
  ConnectDeviceStack,
  RegisterDeviceStack,
});
