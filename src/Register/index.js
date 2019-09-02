import React from 'react';

import { createStackNavigator, createAppContainer } from 'react-navigation';

import Home from './Home';
import Scanner from './Scanner';
import Instructions from './Instructions';
import Connection from './ConnectDevice/Connection';
import ConnectHome from './ConnectDevice/Home';
import Details from './ConnectDevice/Details';
import Info from './ConnectDevice/Info';
import RegisterHome from './RegisterDevice/Home';
import AddHome from './RegisterDevice/AddHome';
import Register from './RegisterDevice/Register';

import Load from '../Manage/ManageHome/Load';
import Edit from '../Manage/ManageHome/Edit';
import MGAddHome from '../Manage/ManageHome/AddHome';

import CNHome from '../Manage/ConnectDevice/Home';
import CNScanner from '../Manage/ConnectDevice/Scanner';
import CNDetails from '../Manage/ConnectDevice/Details';
import CNInfo from '../Manage/ConnectDevice/Info';

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

  Load,
  Edit,
  MGAddHome,

  CNHome,
  CNScanner,
  CNDetails,
  CNInfo,
});
