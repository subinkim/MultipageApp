import React from 'react';
import { Button, Image, View, Text, StyleSheet, Dimensions, Alert, TouchableOpacity } from 'react-native';

import { createStackNavigator, createAppContainer } from 'react-navigation';
import WifiManager from 'react-native-wifi';
import { WebView } from 'react-native-webview';
import Wifi from 'react-native-iot-wifi';
import { Ionicons } from 'react-native-vector-icons/Ionicons';
import QRCodeScanner from 'react-native-qrcode-scanner';

class Scanner extends React.Component {

  static navigationOptions = ({ navigation, navigationOptions }) => {
    const { params } = navigation.state;

    return {
      title: 'Scan QR code',
    };
  };

  loadOnSuccess = (initial, nav) => {
    function onSuccess(e){
      let data = JSON.parse(e.data);
      let ssid = data.ssid;
      let password = data.password;
      if (ssid == null || password == null){
        Alert.alert("Not a valid QR code.");
        this.props.navigation.navigate('Home');
      }
      connectToDevice(ssid, password, nav, initial);
    }
    return onSuccess;
  }

  render() {

    const { navigation } = this.props;
    const currentSSID = navigation.getParam('currentSSID', null);

    let {height, width} = Dimensions.get('window');

    return (
      <QRCodeScanner
        onRead={this.loadOnSuccess(currentSSID, this.props.navigation)}
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

function connectToDevice(ssid, pwd, nav, currentSSID){

  if (ssid === '' || pwd === ''){
    Alert.alert('Incomplete','Please complete both fields');
  } else {
    if (ssid === currentSSID){
      Alert.alert('You are already connected to this network');
      nav.navigate('Details', {
        ssid: ssid,
      });
    } else {
      WifiManager.connectToProtectedSSID(ssid,pwd,false).then(() => {
        Alert.alert("Connected");
        nav.navigate('Details', {
            ssid: ssid,
            initialSSID: currentSSID,
        });
      }, () => {
        Alert.alert('Cannot connect');
        nav.navigate('Home');
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

export default Scanner;
