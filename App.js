import React from 'react'
import {Platform} from 'react-native';

import { createDrawerNavigator, createAppContainer } from 'react-navigation';
import {Icon} from 'native-base';

import RegisterStack from './src/Register';
import ManageStack from './src/Manage/TabNavigator.js';

const MyDrawerNavigator = createDrawerNavigator({
  Register:{
    screen: RegisterStack,
    navigationOptions: {
      drawerLabel: 'Register',
      drawerIcon: ({ tintColor }) => <Icon name={"add"} size={17} />,
    }
  },
  Manage:{
    screen: ManageStack,
    navigationOptions: {
      drawerLabel: 'Manage',
      drawerIcon: ({ tintColor }) => <Icon name={"list"} size={17}/>
    }
  }
});

const App = createAppContainer(MyDrawerNavigator);

export default App;
