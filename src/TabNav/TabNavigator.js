import React from 'react';

import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import ConnectDeviceScreen from './ConnectDevice'
import RegisterDeviceScreen from './RegisterDevice';
import { Icon } from 'native-base';

const navigatorTab = createBottomTabNavigator(
  {
    ConnectDevice:{
      screen: ConnectDeviceScreen,
      navigationOptions: {
        title: "Connect",
        tabBarIcon: ({ focused, tintColor }) => (
          <Icon
            name="wifi"
            size={11}
            active={focused?true:false}
          />
        )
      },
    },
    RegisterDevice:{
      screen: RegisterDeviceScreen,
      navigationOptions: {
        title: "Register",
        tabBarIcon: ({ focused, tintColor }) => (
          <Icon
            name="add-circle"
            size={11}
            active={focused?true:false}
          />
        )
      },
    }
  },
);

export default createStackNavigator({ navigatorTab }, { headerMode: "none" });
