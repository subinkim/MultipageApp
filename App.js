import React from 'react'

import { createDrawerNavigator, createAppContainer } from 'react-navigation';

import {Icon} from 'native-base';

import RegisterStack from './src/Register';
import HelpStack from './src/Help';
import SettingStack from './src/Settings';

const MyDrawerNavigator = createDrawerNavigator(
  {
    Register:{
      screen: RegisterStack,
      navigationOptions: {
        drawerLabel: 'Register',
        drawerIcon: ({ tintColor }) => <Icon name={"add"} size={17} />,
      }
    },
    Help:{
      screen: HelpStack,
      navigationOptions: {
        drawerLabel: 'Help',
        drawerIcon: ({ tintColor }) => <Icon name={"help-circle-outline"} size={17}/>
      }
    },
    Setting:{
      screen: SettingStack,
      navigationOptions: {
        drawerLabel: 'Settings',
        drawerIcon:({ tintColor }) => <Icon name={"settings"} size={17}/>
      }
    }
  }
);

const App = createAppContainer(MyDrawerNavigator);

export default App;
