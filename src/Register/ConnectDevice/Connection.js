import React, { Component } from 'react';
import { Button, Image, View, Text, StyleSheet, Alert, TouchableOpacity, Platform, PermissionsAndroid, ActivityIndicator } from 'react-native';

import WifiManager from 'react-native-wifi';
import { WebView } from 'react-native-webview';
import Wifi from 'react-native-iot-wifi';
import AsyncStorage from '@react-native-community/async-storage';

import { DEVICE_SSID_KEY, DEVICE_PWD_KEY, INITIAL_SSID_KEY } from '../../CustomClass/Storage.js';

import PasswordTextBox from '../../CustomClass/PasswordTextBox.js';
import InputTextBox from '../../CustomClass/InputTextBox.js';

const EMERALD_COLOUR1 = '#17AA9D';
const EMERALD_COLOUR2 = '#28B674';
const EMERALD_COLOUR3 = '#8CC641';

class Connection extends Component {
  static navigationOptions = ({navigation}) => ({
    headerTitle: "Set up device",
  });

  constructor(props){
    super(props);
    this.state = {
      initialSSID: '',
      indicatorText: 'Finishing to set up the device...',
      indicatorColour: EMERALD_COLOUR1,
    };
  }

  componentDidMount(){
    //Sleep for 30 sec
    setTimeout(()=>{
      this.setState({indicatorText:'Trying to connect to the device...'});
      if (Platform.OS === 'android'){
        requestLocationPermission();
      }
      this.connect();
    }, 45000); //MARK: change this to 30 sec later

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
      });

    }

  }

  componentWillUpdate(){
    if (this.state.indicatorColour === EMERALD_COLOUR1){
      this.setState({indicatorColour:EMERALD_COLOUR3});
    }
  }

  connect(){

    let initial = this.state.initialSSID;

    AsyncStorage.getAllKeys().then((keys)=>{
      if (keys.includes(DEVICE_SSID_KEY) && keys.includes(DEVICE_PWD_KEY)){

        AsyncStorage.getItem(DEVICE_SSID_KEY).then((ssid) => {
          AsyncStorage.getItem(DEVICE_PWD_KEY).then((pwd) => {

            console.log("ssid", ssid);
            console.log("pwd", pwd);
            let count = Date.now();
            let interval = setInterval(() => {
              //TODO: check if this works
              //IF in total less than 2 mins spent on attempting to connect
              if (Date.now() - count < 75000 ){
                if (connectToDevice(ssid,pwd)){
                  clearInterval(interval); //TODO: not quitting instantly - two hypotheses: 1) connectToDevice calls already in queue 2) clearInterval is not working as expected
                  this.props.navigation.navigate('Details',{
                    ssid:ssid,
                    initialSSID:initial,
                  });
                }
                count++;
              } else {
                clearInterval(interval);
                Alert.alert("Failed to connect to device.");
                this.props.navigation.navigate('ConnectHome', {
                  initialSSID: initial,
                });
              }

            },15000);
          });
        });


      } else{
        Alert.alert("Failed to connect to the device.");
        this.props.navigation.navigate('ConnectHome', {
          initialSSID: initial,
        });
      }
    });
  }

  render() {

    return (
      <View style={styles.container}>
        <Text>{this.state.indicatorText}</Text>
        <Text>This can take up to 2 minutes. Please don't quit the app.</Text>
        <ActivityIndicator size="large" color={this.state.indicatorColour} animating={true} style={{top: '2%'}}/>
      </View>
    );
  }
}

function connectToDevice(ssid, pwd){
    WifiManager.connectToProtectedSSID(ssid,pwd,false).then(() => {
      console.log("connected");
      Alert.alert("Connected!");
      return true;
    }, () => {
      console.log("error");
    });
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
      justifyContent: 'center',
      alignItems: 'center',
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
