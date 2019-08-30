import React from 'react';
import { Button, View, Text, Alert, ActivityIndicator } from 'react-native';

import { WebView } from 'react-native-webview';
import Wifi from 'react-native-iot-wifi';
import QRCodeScanner from 'react-native-qrcode-scanner';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-community/async-storage';
import { DEVICE_SSID_KEY, DEVICE_PWD_KEY } from '../../CustomClass/Storage';

import {basicStyles as styles} from './styles';

class Scanner extends React.Component {

  static navigationOptions = ({ navigation, navigationOptions }) => {
    const { params } = navigation.state;

    return {
      title: 'Scan QR code',
    };
  };

  constructor(props){
    super(props);
    this.state = {
      modalIsVisible: false,
      initialSSID: null,
    }
  }

  componentWillMount(){
    let initial = this.props.navigation.getParam('initialSSID', null);
    if (initial != null){this.setState({initialSSID: initial})}
  }

  componentDidMount(){
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

      this.setState({modalIsVisible: true});
      Wifi.connectSecure(ssid,pwd,false,() => {
        this.setState({modalIsVisible:false});
        if (error != null){Alert.alert("Cannot connect :(")}
        else {
          Alert.alert("Connected!");
          this.props.navigation.navigate('Details', {
              ssid: ssid,
              initialSSID: initial,
          });
        }

      });

    }
  }

  onSuccess(e){
    let data;
    try {
      data = JSON.parse(e.data);
    } catch (error) {
      Alert.alert("Invalid QR code", "This is not a valid QR code.");
      this.scanner.reactivate();
    }
    let ssid = data.ssid;
    let password = data.password;
    if (ssid == null || password == null){
      Alert.alert("Invalid QR code", "This is not a valid QR code.");
      this.scanner.reactivate();
    }
    this.connectToDevice(ssid, password, initial);
  }

  render() {

    return (
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Text>Scan the QR code attached to the bottom of device.</Text>
        <QRCodeScanner
          ref={(node) => { this.scanner = node }}
          onRead={this.onSuccess}
          permissionDialogTitle="Permission required"
          permissionDialogMessage="This app would like to access your camera."
        />
        <Modal
          isVisible={this.state.modalIsVisible}
          animationInTiming={400} animationOutTiming={400}
          style={{ height: '100%', backgroundColor: 'black', opacity: 0.2 , margin: 0}}
        >
          <ActivityIndicator size="large" color="red" animating={this.state.modalIsVisible}/>
          <Text style={{ textAlign: 'center', color: 'white' }}>Connecting to the device network...</Text>
        </Modal>
      </View>
    );
  }
}

export default Scanner;
