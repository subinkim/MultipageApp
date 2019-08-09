import React, { Component } from 'react';
import { Button, Image, View, Text, StyleSheet, Alert, SectionList, TouchableOpacity } from 'react-native';

import PasswordTextBox from '../CustomClass/PasswordTextBox.js';
import InputTextBox from '../CustomClass/InputTextBox.js';
import {CSRF_KEY,COOKIE_KEY} from '../CustomClass/Storage';

import AsyncStorage from '@react-native-community/async-storage';

class Home extends Component {
  static navigationOptions = ({navigation}) => ({
    headerTitle: "Settings",
  });

  changeServer = () => {
    console.log("change server");
  }

  deleteCookies = () => {
    Alert.alert(
      'Delete Cookies',
      'Are you sure you want to delete cookies? You will be signed out automatically.',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Confirm', onPress: () => {AsyncStorage.removeItem(CSRF_KEY);AsyncStorage.setItem(COOKIE_KEY,'false')}},
      ],
      {cancelable: false},
    );
  }

  _renderSectionHeader = ({section: {title}}) => (
    <View style={styles.header}>
      <Text style={{fontWeight: 'bold'}}>{title}</Text>
    </View>
  )

  _renderItem = ({item, index, section}) => {
    const onPressFunc = [this.changeServer,this.deleteCookies];
    return (
      <TouchableOpacity onPress={onPressFunc[index]} style={styles.listItem}>
        <Text key={index} style={styles.itemText}>{item}</Text>
      </TouchableOpacity>
    );
  }


  render() {

    const data = [
      {title: 'Manage Account', data: ['Change Server', 'Delete Cookies']},
    ]

    return (
      <View style={ styles.container }>
        <SectionList
          renderItem={this._renderItem}
          renderSectionHeader={this._renderSectionHeader}
          sections={data}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
}



const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginLeft: 10,
      marginTop: 30,
    },
    header: {
      fontSize: 13,
    },
    listItem: {
      paddingVertical: 5,
      borderBottomWidth: 1,
      borderBottomColor: '#cfcfcf',
    },
    itemText:{
      fontSize: 16,
    }
});

export default Home;
