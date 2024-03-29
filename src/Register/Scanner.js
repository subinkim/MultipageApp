import React from 'react';
import { Button, View, Text, StyleSheet, Dimensions, Alert } from 'react-native';

import Wifi from 'react-native-iot-wifi';
import QRCodeScanner from 'react-native-qrcode-scanner';
import AsyncStorage from '@react-native-community/async-storage';

import {DEVICE_UUID_KEY, DEVICE_SSID_KEY, DEVICE_PWD_KEY} from '../CustomClass/Storage.js';
import {scannerStyles as styles} from './styles';

class Scanner extends React.Component {

  static navigationOptions = ({ navigation, navigationOptions }) => {
    const { params } = navigation.state;

    return {
      title: 'Scan QR code',
    };
  };

  componentDidMount(){
    AsyncStorage.removeItem(DEVICE_UUID_KEY);
    AsyncStorage.removeItem(DEVICE_SSID_KEY);
    AsyncStorage.removeItem(DEVICE_PWD_KEY);
  }

  onSuccess = (e) => {
    let data;
    try {
      data = JSON.parse(e.data);

      let ssid = data.ssid;
      let password = data.password;
      let uuid = data.uuid;

      if (ssid == null || password == null || uuid == null){
        Alert.alert("Invalid QR code", "This is not a valid QR code.", [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => this.scanner.reactivate(),
          },
          {text: 'OK', onPress: () => this.scanner.reactivate()},
        ]);

      } else {
        AsyncStorage.setItem(DEVICE_SSID_KEY, ssid);
        AsyncStorage.setItem(DEVICE_PWD_KEY, password);
        AsyncStorage.setItem(DEVICE_UUID_KEY, uuid);
        this.props.navigation.navigate('Instructions');
      }

    } catch (error) {
      Alert.alert("Invalid QR code", "This is not a valid QR code.", [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => this.scanner.reactivate(),
        },
        {text: 'OK', onPress: () => this.scanner.reactivate()},
      ]);
    }
  }

  render() {

    return (
      <QRCodeScanner
        ref={(node) => { this.scanner = node }}
        onRead={this.onSuccess}
        topContent={
          <Text>
              Scan the QR code attached to the bottom of device.
          </Text>
        }
        permissionDialogTitle="Permission required"
        permissionDialogMessage="This app would like to access your camera."
      />
    );
  }
}

export default Scanner;
