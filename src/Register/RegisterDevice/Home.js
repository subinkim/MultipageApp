import React from 'react';
import { Button, View, Text, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';

import { createStackNavigator, createAppContainer } from 'react-navigation';
import CookieManager from 'react-native-cookies';
import AsyncStorage from '@react-native-community/async-storage';

import PasswordTextBox from '../../CustomClass/PasswordTextBox.js';
import InputTextBox from '../../CustomClass/InputTextBox.js';

import {MainURL, GetHomesURL} from '../../CustomClass/Storage.js';

const CSRF_KEY = '@csrftoken';

class RegisterHome extends React.Component {

  static navigationOptions = ({navigation, navigationOptions}) => {

    const { params } = navigation.state;

    return {
      title: 'Choose Home',
    }
  };

  constructor(){
    super();
    this.state = {
      csrftoken: '',
    }
  }

  componentWillMount(){
    CookieManager.get(MainURL).then((res)=>{this.setState({csrftoken: res['csrftoken']['value']})});
  }
  //TODO: get data from getHomes

  getHomes(csrftoken){
    fetch(GetHomesURL, {
      credentials:"include",
      headers: {
          'X-CSRFToken': csrftoken,
          referer: 'https://www.devemerald.com/',
          Accept: '*/*',
          'Content-Type': 'application/x-www-form-urlencoded',
      },
      method:'POST',
      mode:'cors',
    }).then(function(response){
      return response.text().then(function(text){
        text = JSON.parse(text);
      });
    });
  }

  render(){
    let data = JSON.parse();

    return(
      <ScrollView style={styles.container}>
        <FlatList
          data={data}
          keyExtractor={(item, index) => {item.uuid}}
          renderItem={this._renderItem}
        />
      </ScrollView>
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

export default RegisterHome;
