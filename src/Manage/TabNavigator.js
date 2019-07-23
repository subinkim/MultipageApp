import React from 'react';

import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import ManageHomeStack from './ManageHome'
import ConnectDeviceStack from './ConnectDevice';
import { Icon } from 'native-base';

const navigatorTab = createBottomTabNavigator(
  {
    ManageHome:{
      screen: ManageHomeStack,
      navigationOptions: {
        title: "Manage",
        tabBarIcon: ({ focused, tintColor }) => (
          <Icon
            name="wifi" //TODO: change this
            size={11}
            active={focused?true:false}
          />
        )
      },
    },
    ConnectDevice:{
      screen: ConnectDeviceStack,
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
    }
  },
);

export default createStackNavigator({ navigatorTab }, { headerMode: "none" });
