import React, { Component } from 'react';
import { Button, View, Text, Alert, Platform, PermissionsAndroid } from 'react-native';

import Wifi from 'react-native-iot-wifi';

import PasswordTextBox from '../../CustomClass/PasswordTextBox';
import InputTextBox from '../../CustomClass/InputTextBox';
import {basicStyles as styles} from './styles';

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

    if (this.state.initialSSID === null){this.getInitialSSID()}
  }

  getInitialSSID(){
    Wifi.getSSID((initialSSID) => {
      if (initialSSID != null){
        this.setState({initialSSID});
      }
    });
  }

  connectToDevice(){

    this.getInitialSSID();

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

        Wifi.connectSecure(this.state.ssid,this.state.password,false, (error)  => {
          if (error != null){Alert.alert("Did not connect")}
          else{
            this.props.navigation.navigate('Details', {
              ssid: this.state.ssid,
              initialSSID: this.state.initialSSID,
            })
          }
        })

      }
    }

  }

  render() {

    const scannerButton = (<Button
      title="Scan QR code"
      onPress={() => {
        this.getInitialSSID();
        this.props.navigation.navigate('Scanner',{
          initialSSID: this.state.initialSSID,
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

export default Home;
