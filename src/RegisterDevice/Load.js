import React from 'react';
import { Button, View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';

import { createStackNavigator, createAppContainer } from 'react-navigation';
import CookieManager from 'react-native-cookies';


class Load extends React.Component {

  render(){
    const csrftoken = this.props.navigation.getParam('csrftoken',null);

    return(
      <View>
        <Text>Load Screen</Text>
        <Text>csrftoken: {csrftoken}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 30,
      marginLeft: 10,
      marginRight: 10,
    },
    instruction: {
      fontWeight: 'bold',
      fontSize: 23,
      marginBottom: 10,
    },
    description: {
      top: 50,
      fontSize: 15,
    },
});

export default Load;
