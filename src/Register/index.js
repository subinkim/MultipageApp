import React from 'react';

import { createStackNavigator, createAppContainer } from 'react-navigation';

import Home from './Home.js';
import Scanner from './Scanner.js';
import Instructions from './Instructions.js';
import Connection from './ConnectDevice/Connection.js';
import ConnectHome from './ConnectDevice/Home.js';
import Details from './ConnectDevice/Details.js';
import Info from './ConnectDevice/Info.js';
import RegisterHome from './RegisterDevice/Home.js';
import AddHome from './RegisterDevice/AddHome.js';
import Register from './RegisterDevice/Register.js';

export default createStackNavigator({
  Home,
  Scanner,
  Instructions,
  Connection,
  ConnectHome,
  Details,
  Info,
  RegisterHome,
  AddHome,
  Register,
});
