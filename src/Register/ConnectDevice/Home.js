import React, { Component } from 'react';
import { Button, Image, View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';

import WifiManager from 'react-native-wifi';
import { WebView } from 'react-native-webview';
import Wifi from 'react-native-iot-wifi';
import AsyncStorage from '@react-native-community/async-storage';

import { DEVICE_SSID_KEY, DEVICE_PWD_KEY, INITIAL_SSID_KEY } from '../../CustomClass/Storage';
import { basicStyles as styles } from '../styles'

import PasswordTextBox from '../../CustomClass/PasswordTextBox';
import InputTextBox from '../../CustomClass/InputTextBox';

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
      </View>
    );
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
      WifiManager.connectToProtectedSSID(ssid,pwd,false).then(() => {
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

export default ConnectHome;
