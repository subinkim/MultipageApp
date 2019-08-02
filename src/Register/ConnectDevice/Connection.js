import React, { Component } from 'react';
import { Button, Image, View, Text, StyleSheet, Dimensions, Alert, TouchableOpacity, Platform, PermissionsAndroid } from 'react-native';

import WifiManager from 'react-native-wifi';
import { WebView } from 'react-native-webview';
import Wifi from 'react-native-iot-wifi';
import AsyncStorage from '@react-native-community/async-storage';

import { DEVICE_SSID_KEY, DEVICE_PWD_KEY, INITIAL_SSID_KEY } from '../../CustomClass/Storage.js';

import PasswordTextBox from '../../CustomClass/PasswordTextBox.js';
import InputTextBox from '../../CustomClass/InputTextBox.js';

class Connection extends Component {
  static navigationOptions = ({navigation}) => ({
    headerTitle: "Finishing setup...",
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
    //Sleep for 30 sec
    setTimeout(function(){console.log("30sec")}, 30000);


    //Activity Indicator running for max 2 mins while attempting to connect to the wifi



  }

  connect(){
    if (Platform.OS === 'android'){
      requestLocationPermission();
    }
    if (this.state.initialSSID === ''){
      Wifi.getSSID((initialSSID) => {
        if (initialSSID != null){
          this.setState({initialSSID});
        }
        if (initialSSID.includes('emerald')){
          this.props.navigation.navigate('Details', {
            initialSSID: initialSSID,
          })
        }
      })
    }
    let nav = this.props.navigation;
    let initial = this.state.initialSSID;
    AsyncStorage.getAllKeys().then((keys)=>{
      if (keys.includes(DEVICE_SSID_KEY) && keys.includes(DEVICE_PWD_KEY)){
        AsyncStorage.getItem(DEVICE_SSID_KEY).then((ssid) => {
          AsyncStorage.getItem(DEVICE_PWD_KEY).then((pwd) => {
            connectToDevice(ssid,pwd, nav, initial);
          });
        });
      }
    });
  }

  render() {

    return (
      <View style={styles.container}>

      </View>
    );
  }
}

function connectToDevice(ssid, pwd, nav, initial){

  if (ssid === '' || pwd === ''){
    Alert.alert('Incomplete','Please complete both fields');
  } else {
    if (ssid === currentSSID){
      Alert.alert('You are already connected to this network');
      nav.navigate('Details', {
        ssid: ssid,
        initialSSID: ssid,
      });
    } else {
      WifiManager.connectToProtectedSSID(ssid,pwd,false).then(() => {
        Alert.alert("Connected");
        nav.navigate('Details', {
          ssid: ssid,
          initialSSID: initial,
        })
      }, () => {
        Alert.alert('Cannot connect');
        nav.navigate('Home', {
          initialSSID: initial,
        })
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

export default Connection;
