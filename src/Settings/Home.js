import React, { Component } from 'react';
import { Button, Image, View, Text, StyleSheet, Alert, FlatList } from 'react-native';

import PasswordTextBox from '../../CustomClass/PasswordTextBox.js';
import InputTextBox from '../../CustomClass/InputTextBox.js';
import {MainURL, LoginURL, LogoutURL, GetHomesURL} from '../CustomClass/Storage';

import AsyncStorage from '@react-native-community/async-storage';

class Home extends Component {
  static navigationOptions = ({navigation}) => ({
    headerTitle: "Settings",
  });

  constructor(props){
    super(props);
    this.state = {

    };
  }

  _renderItem = ({item,index}) => {

  }


  render() {

    const data = [
      {
        title: 'Manage Account',
      },
      {
        title: ''
      },
      {

      },
    ]


    return (
      <View style={ styles.container }>
        <FlatList
          renderItem={this._renderItem}
          data={data}
          keyExtractor={({item,index}) => index.toString()}
        />
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

export default Home;
