import React from 'react';
import { Button, View, Text, Alert } from 'react-native';

import WifiManager from 'react-native-wifi';
import { WebView } from 'react-native-webview';
import Wifi from 'react-native-iot-wifi';
import QRCodeScanner from 'react-native-qrcode-scanner';

import {basicStyles as styles} from './styles';

class Scanner extends React.Component {

  static navigationOptions = ({ navigation, navigationOptions }) => {
    const { params } = navigation.state;

    return {
      title: 'Scan QR code',
    };
  };

  loadOnSuccess = (initial) => {
    function onSuccess(e){
      let data = JSON.parse(e.data);
      let ssid = data.ssid;
      let password = data.password;
      let uuid = data.uuid;
      if (ssid == null || password == null || uuid == null){
        Alert.alert("Invalid QR code", "This is not a valid QR code.");
        this.scanner.reactivate();
      }
      connectToDevice(ssid, password, initial);
    }
    return onSuccess;
  }

  componentDidMount(){
    AsyncStorage.removeItem(DEVICE_UUID_KEY);
    AsyncStorage.removeItem(DEVICE_SSID_KEY);
    AsyncStorage.removeItem(DEVICE_PWD_KEY);
  }

  connectToDevice(ssid, pwd, initial){

    if (ssid === initial){
      Alert.alert('You are already connected to this network');
      this.props.navigation.navigate('Details', {
        ssid: ssid,
      });
    } else {

      WifiManager.connectToProtectedSSID(ssid,pwd,false).then(() => {
        Alert.alert("Connected!");
        this.props.navigation.navigate('Details', {
            ssid: ssid,
            initialSSID: initial,
        });
      }, () => {
        Alert.alert('Cannot connect');
        this.scanner.reactivate();
      });

    }
  }

  render() {

    const { navigation } = this.props;
    const currentSSID = navigation.getParam('currentSSID', null);

    return (
      <QRCodeScanner
        ref={(node) => { this.scanner = node }}
        onRead={this.loadOnSuccess(currentSSID)}
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
