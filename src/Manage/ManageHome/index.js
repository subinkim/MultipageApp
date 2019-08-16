import React from 'react';

import { createStackNavigator } from 'react-navigation';

import Home from './Home';
import Load from './Load';
import Edit from './Edit';
import AddHome from './AddHome';

export default createStackNavigator({
  Home,
  Load,
  Edit,
  AddHome
});
