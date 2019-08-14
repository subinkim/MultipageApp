import React, { Component } from 'react';
import { Button, Image, View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';

import WifiManager from 'react-native-wifi';
import { WebView } from 'react-native-webview';
import Wifi from 'react-native-iot-wifi';
import AsyncStorage from '@react-native-community/async-storage';

import { DEVICE_SSID_KEY, DEVICE_PWD_KEY, INITIAL_SSID_KEY } from '../../CustomClass/Storage.js';

import PasswordTextBox from '../../CustomClass/PasswordTextBox.js';
import InputTextBox from '../../CustomClass/InputTextBox.js';

class ConnectHome extends Component {
  static navigationOptions = ({navigation}) => ({
    headerTitle: "Connect to Wifi",
    headerRight: <Button
        onPress={() => {navigation.navigate('Info');}}
        title="Help"
      />
  });

  constructor(props){
    super(props);
    this.state = {
      ssid: '',
      password: '',
      initialSSID: '',
    };
  }

  componentDidMount(){
    let initial = this.props.navigation.getParam('initialSSID');
    if(initial != null){this.setState({initialSSID: initial})}
  }

  render() {
    return (
      <View style={ styles.container }>
        <Text style={ styles.instruction }>Connect to your device</Text>
        <Text>Enter credentials to manually connect to your device.</Text>
        <InputTextBox
          icon="wifi"
          label='Device SSID'
          onChange={(ssid) => {this.setState({ssid})}}
          keyboard='default'
          returnKey='next'
          value={this.state.ssid}
        />
        <PasswordTextBox
          icon='lock'
          label=' Device password'
          onChange={(password) => {this.setState({password})}}
          value={this.state.password}
        />
        <Button
          title="Connect"
          onPress={() => connectToDevice(this.state.ssid, this.state.password, this.props.navigation, this.state.initialSSID)}
        />
        <Button
          title="Skip to Register"
          onPress={() => {this.props.navigation.navigate('RegisterHome')}}
        />
      </View>
    );
    //MARK: Get rid of skip button later
  }
}

function connectToDevice(ssid, pwd, nav, initial){

  if (ssid === '' || pwd === ''){
    Alert.alert('Incomplete','Please complete both fields');
  } else {
    if (ssid === initial){
      Alert.alert('You are already connected to this network');
      nav.navigate('Details', {
        ssid: ssid,
        initialSSID: ssid,
      });
    } else {
      Wifi.connectSecure(ssid,pwd,false).then(() => {
        Alert.alert("Connected");
        nav.navigate('Details', {
          ssid: ssid,
          initialSSID: initial,
        })
      }, () => {
        Alert.alert('Cannot connect');
      })
    }
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

export default ConnectHome;
