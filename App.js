import React from 'react'
import { createDrawerNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome5';
import TabNavigator from './src/TabNavigator.js';  //Tab Nav

export default createDrawerNavigator({
  TabNav: {
    screen: TabNavigator,
    navigationOptions: {
      drawerLabel: 'Device Management',
      drawerIcon: ({ tintColor }) => <Icon name="clipboard" size={17} />,
    }
  },
});
