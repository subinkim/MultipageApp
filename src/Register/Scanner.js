import React from 'react';
import { Button, Image, View, Text, StyleSheet, Dimensions, Alert, TouchableOpacity } from 'react-native';

import { HeaderBackButton } from 'react-navigation';
import WifiManager from 'react-native-wifi';
import { WebView } from 'react-native-webview';
import Wifi from 'react-native-iot-wifi';
import QRCodeScanner from 'react-native-qrcode-scanner';
import AsyncStorage from '@react-native-community/async-storage';

import {DEVICE_UUID_KEY, DEVICE_SSID_KEY, DEVICE_PWD_KEY} from '../CustomClass/Storage.js';

class Scanner extends React.Component {

  static navigationOptions = ({ navigation, navigationOptions }) => {
    const { params } = navigation.state;

    return {
      title: 'Scan QR code',
      headerLeft:(
        <HeaderBackButton
          title="Back"
          onPress={() => {
            navigation.navigate('Home', {
              cookieValid: 'true',//TODO: this doesn't work
            })
          }}
        />
      )
    };
  };

  componentDidMount(){
    AsyncStorage.removeItem(DEVICE_UUID_KEY);
    AsyncStorage.removeItem(DEVICE_SSID_KEY);
    AsyncStorage.removeItem(DEVICE_PWD_KEY);
  }

  onSuccess = (e) => {
    let data = JSON.parse(e.data);
    let ssid = data.ssid;
    let password = data.password;
    let uuid = data.uuid;
    if (ssid == null || password == null || uuid == null){
      Alert.alert("Not a valid QR code.");
      this.scanner.reactivate();
    }
    AsyncStorage.setItem(DEVICE_SSID_KEY, ssid);
    AsyncStorage.setItem(DEVICE_PWD_KEY, password);
    AsyncStorage.setItem(DEVICE_UUID_KEY, uuid);
    this.props.navigation.navigate('Instructions');
  }

  render() {

    const { navigation } = this.props;
    const currentSSID = navigation.getParam('currentSSID', null);

    let {height, width} = Dimensions.get('window');

    return (
      <QRCodeScanner
        ref={(node) => { this.scanner = node }}
        onRead={this.onSuccess}
        topContent={
          <Text>
              Scan the QR code attached to the bottom of device.
          </Text>
        }
        bottomContent={
          <Button
            title="skip qr code for now"
            onPress={() => {this.props.navigation.navigate('Instructions')}}
          />
        }
        permissionDialogTitle="Permission required"
        permissionDialogMessage="This app would like to access your camera."
      />
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

export default Scanner;
