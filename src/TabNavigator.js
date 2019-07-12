import React from 'react';

import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import ConnectDeviceScreen from './ConnectDevice';
import RegisterDeviceScreen from './RegisterDevice';

const navigatorTab = createBottomTabNavigator({
  ConnectDevice:{
    screen: ConnectDeviceScreen,
    navigationOptions: {
      title: "Connect",
      tabBarIcon: ({ tintColor }) => (
        <Icon
          name="wifi"
          size={17}
          color={tintColor}
        />
      )
    },
  },
  RegisterDevice:{
    screen: RegisterDeviceScreen,
    navigationOptions: {
      title: "Register",
      tabBarIcon: ({ tintColor }) => (
        <Icon
          name="add-circle"
          size={17}
          color={tintColor}
        />
      )
    },
  }
});

export default createStackNavigator({ navigatorTab }, { headerMode: "none" });
