import React, { Component } from 'react';
import { Button, View, Text, StyleSheet, Alert, Platform, PermissionsAndroid } from 'react-native';

import WifiManager from 'react-native-wifi';
import { WebView } from 'react-native-webview';
import Wifi from 'react-native-iot-wifi';

import PasswordTextBox from '../../CustomClass/PasswordTextBox.js';
import InputTextBox from '../../CustomClass/InputTextBox.js';

class Home extends Component {
  static navigationOptions = ({navigation}) => ({
    headerTitle: "Connect Device",
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
      initialSSID: null,
    };
  }

  componentDidMount(){
    if (Platform.OS === 'android'){
      requestLocationPermission();
    }

    if (this.state.initialSSID === null){
      Wifi.getSSID((initialSSID) => {
        if (initialSSID != null){
          this.setState({initialSSID});
        }
      })
    }
  }

  connectToDevice(){

    if (this.state.ssid === '' || this.state.password === ''){
      Alert.alert('Incomplete','Please complete both fields');
    } else {
      //If already connected to the device
      if (this.state.ssid === this.state.initialSSID){
        Alert.alert('You are already connected to this network');
        this.props.navigation.navigate('Details', {
          ssid: this.state.ssid,
        });
      } else {

        //Connect to the deivce
        WifiManager.connectToProtectedSSID(this.state.ssid,this.state.password,false).then(() => {
          Alert.alert("Connected!");
          nav.navigate('Details', {
              ssid: this.state.ssid,
              initialSSID: this.state.currentSSID,
          });
        }, () => {
          Alert.alert('Failed to connect to the device.');
        });

      }
    }

  }

  render() {

    const scannerButton = (<Button
      title="Scan QR code"
      onPress={() => {
        this.props.navigation.navigate('Scanner',{
          currentSSID: this.state.initialSSID,
        });
      }}
    />);

    return (
      <View style={ styles.container }>
        <Text style={ styles.instruction }>Connect to your device</Text>
        <Text>Manually enter SSID and password of your device or scan QR code attached to the bottom of the device.</Text>
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
          onPress={() => {this.connectToDevice()}}
        />
        { scannerButton }
      </View>
    );
  }
}
//TODO: change 'this app' to app name
async function requestLocationPermission(){
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        'title': 'Location Permission',
        'message': 'This app needs access to your location',
      }
    );
  } catch (err) {
    console.warn(err);
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
