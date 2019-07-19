import React, { Component } from 'react';
import { Button, Image, View, Text, StyleSheet, Dimensions, Alert, TouchableOpacity, Platform, PermissionsAndroid } from 'react-native';

import { createStackNavigator, createAppContainer } from 'react-navigation';
import WifiManager from 'react-native-wifi';
import { WebView } from 'react-native-webview';
import Wifi from 'react-native-iot-wifi';

import PasswordTextBox from '../TextBox/PasswordTextBox.js';
import InputTextBox from '../TextBox/InputTextBox.js';

class Home extends Component {
  static navigationOptions = ({navigation}) => ({
    headerTitle: "Welcome!",
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
    if (Platform.OS === 'android'){
      requestLocationPermission();
    }
  }

  render() {

    if (this.state.initialSSID === ''){
      Wifi.getSSID((initialSSID) => {
        if (initialSSID != null){
          this.setState({initialSSID});
        }
      })
    }

    const scannerButton = (<Button
      title="Scan QR code"
      onPress={() => {
        this.props.navigation.navigate('Scanner',{
          currentSSID: this.state.initialSSID,
        });
      }}
    />);

    const passButton =(<Button
      title="Already connected?"
      onPress={() => {
        this.props.navigation.navigate('Details', {
          currentSSID: this.state.initialSSID,
        })
      }}
    />);

    return (
      <View style={ styles.container }>
        <Text style={ styles.instruction }>Connect to your device</Text>
        <Text>Manually enter SSID and password of your device or scan QR code.</Text>
        <InputTextBox icon="wifi" label='Device SSID' onChange={(ssid) => {this.setState({ssid})}} keyboard='default' returnKey='next'/>
        <PasswordTextBox icon='lock' label=' Device password' onChange={(password) => {this.setState({password})}} />
        <Button
          title="Connect"
          onPress={() => connectToDevice(this.state.ssid, this.state.password, this.props.navigation, this.state.initialSSID)}
        />
        { scannerButton }
        { this.state.initialSSID.includes('emerald')?passButton:null }
      </View>
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
