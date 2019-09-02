import React from 'react';
import { Button, View, Text, Alert, ActivityIndicator } from 'react-native';

import Wifi from 'react-native-iot-wifi';
import QRCodeScanner from 'react-native-qrcode-scanner';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-community/async-storage';

import { DEVICE_SSID_KEY, DEVICE_PWD_KEY } from '../../CustomClass/Storage';

import {basicStyles as styles} from './styles';

class CNScanner extends React.Component {

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
      ssid: null,
      pwd: null,
    }
  }

  componentWillMount(){
    Wifi.getSSID((initialSSID) => {
      if (initialSSID != null){
        this.setState({initialSSID});
      }
    });
  }

  componentDidMount(){
    AsyncStorage.removeItem(DEVICE_SSID_KEY);
    AsyncStorage.removeItem(DEVICE_PWD_KEY);
  }

  connectToDevice = () => {

    if (this.state.ssid === this.state.initialSSID){
      Alert.alert('You are already connected to this network');
      this.props.navigation.navigate('Details', {
        ssid: this.state.ssid,
      });
    } else {

      this.setState({modalIsVisible: true});
      Wifi.connectSecure(this.state.ssid, this.state.pwd, false, (error) => {
        this.setState({modalIsVisible:false});
        if (error != null){Alert.alert("Cannot connect :(")}
        else {
          this.props.navigation.navigate('Details', {
              ssid: this.state.ssid,
              initialSSID: this.state.initialSSID,
          });
        }
      });

    }

  }

  onSuccess = (e) => {
    let data;
    try {

      data = JSON.parse(e.data);

      let ssid = data.ssid;
      let password = data.password;

      if (ssid == null || password == null){
        Alert.alert("Invalid QR code", "This is not a valid QR code.", [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => this.scanner.reactivate(),
          },
          {text: 'OK', onPress: () => this.scanner.reactivate()},
        ]);

      } else {
        this.setState({ssid: ssid, pwd: password}, () => this.connectToDevice());
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
          style={{ height: '100%', backgroundColor: 'rgba(0,0,0,0.2)', margin: 0}}
        >
          <ActivityIndicator size="large" color="red" animating={this.state.modalIsVisible}/>
          <Text style={{ textAlign: 'center', color: 'white' }}>Connecting to the device network...</Text>
        </Modal>
      </View>
    );
  }
}

export default CNScanner;
