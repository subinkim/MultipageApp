import React from 'react'
import {Platform} from 'react-native';
import { createDrawerNavigator, createAppContainer } from 'react-navigation';
import {Icon} from 'native-base';
import TabNavigator from './src/TabNavigator.js';  //Tab Nav

const MyDrawerNavigator = createDrawerNavigator({
  TabNav:{
    screen: TabNavigator,
    navigationOptions: {
      drawerLabel: 'New Device',
      drawerIcon: ({ tintColor }) => <Icon name={"add"} size={17} />,
    }
  },
  Manage:{ //TODO:change so that it gets the list of current devices and display them - should be able to manage them
    screen: TabNavigator,
    navigationOptions: {
      drawerLabel: 'Current Devices',
      drawerIcon: ({ tintColor }) => <Icon name={"list"} size={17}/>
    }
  }
});

const App = createAppContainer(MyDrawerNavigator);

export default App;
