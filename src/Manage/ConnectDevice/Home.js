import React, { Component } from 'react';
import { Button, View, Text, Alert, Platform, PermissionsAndroid, ActivityIndicator } from 'react-native';

import Wifi from 'react-native-iot-wifi';
import Modal from 'react-native-modal';

import PasswordTextBox from '../../CustomClass/PasswordTextBox';
import InputTextBox from '../../CustomClass/InputTextBox';
import {basicStyles as styles} from './styles';

class CNHome extends Component {
  static navigationOptions = ({navigation}) => ({
    headerTitle: "Connect to Device",
    headerRight: <Button
        onPress={() => {navigation.navigate('CNInfo');}}
        title="Help"
      />
  });

  constructor(props){
    super(props);
    this.state = {
      ssid: '',
      password: '',
      initialSSID: null,

      modalIsVisible: false,
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

    let ssid = this.state.ssid;
    let pwd = this.state.password;

    if (ssid === '' || pwd === ''){
      Alert.alert('Incomplete','Please complete both fields');
    } else {
      //If already connected to the device
      if (ssid === this.state.initialSSID){
        Alert.alert('You are already connected to this network');
        this.setState({ssid: '', password: ''});
        this.props.navigation.navigate('CNDetails', {
          ssid: ssid,
        });
      } else {

        this.setState({modalIsVisible: true});
        Wifi.connectSecure(ssid,pwd,false, (error)  => {
          this.setState({modalIsVisible:false, ssid: '', password: ''});
          if (error != null){Alert.alert("Did not connect")}
          else{
            this.props.navigation.navigate('CNDetails', {
              ssid: ssid,
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
        this.props.navigation.navigate('CNScanner',{
          initialSSID: this.state.initialSSID,
        });
      }}
    />);

    return (
      <View style={{flex:1}}>
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
        <Modal
          isVisible={this.state.modalIsVisible}
          animationInTiming={400} animationOutTiming={400}
          style={{ height: '100%', backgroundColor: 'rgba(0,0,0,0.2)', margin: 0}}
        >
          <ActivityIndicator size="large" color="red" animating={this.state.modalIsVisible} style={{}}/>
          <Text style={{ textAlign: 'center', color: 'white' }}>Connecting to the device network...</Text>
        </Modal>
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

export default CNHome;
