import React, { Component } from 'react';
import { Button, Image, View, Text, Alert, Platform, PermissionsAndroid, ActivityIndicator, ScrollView } from 'react-native';

import Wifi from 'react-native-iot-wifi';
import AsyncStorage from '@react-native-community/async-storage';
import Modal from "react-native-modal";

import { DEVICE_SSID_KEY, DEVICE_PWD_KEY } from '../../CustomClass/Storage';
import { connectionStyles as styles } from '../styles';

import PasswordTextBox from '../../CustomClass/PasswordTextBox';
import InputTextBox from '../../CustomClass/InputTextBox';

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
      //Indicator
      indicatorText: 'Finishing to set up the device...',
      indicatorColour: EMERALD_COLOUR1,
      indicatorAnimating: true,

      //Device
      initialSSID: '',
      ssid: null,
      pwd: null,

      //Modal
      modalIsVisible: false,
      modalContentIndex: 0,
      modalContent: null,
    };
  }

  componentWillMount(){
    //Sleep for 30 sec
    setTimeout(()=>{
      this.setState({indicatorText:'Trying to connect to the device...'});
      if (Platform.OS === 'android'){
        requestLocationPermission();
      }

      //get initial SSID
      Wifi.getSSID((initialSSID) => {
        if (initialSSID != null){
          this.setState({initialSSID});
        }
        if (initialSSID.includes('emerald')){
          this.props.navigation.navigate('Details', {
            initialSSID: initialSSID,
            ssid: initialSSID,
          });
        }
      });

      //get device SSID and PWD and attempt to connect
      AsyncStorage.getAllKeys().then((keys)=>{
        if (keys.includes(DEVICE_SSID_KEY) && keys.includes(DEVICE_PWD_KEY)){

          AsyncStorage.getItem(DEVICE_SSID_KEY).then((ssid) => {
            AsyncStorage.getItem(DEVICE_PWD_KEY).then((pwd) => {
              this.setState({ssid: ssid, pwd: pwd}, () => this.connect()); //attempt to connect only after ssid and pwd have been saved
            });
          });

        } else{
          this.setState({modalIsVisible: true, indicatorText: 'Device SSID and Password not found', indicatorAnimating: false});
          this.updateModalContent();
        }
      });

    }, 30000); //30 sec


  }

  componentWillUpdate(){
    if (this.state.indicatorColour === EMERALD_COLOUR1){
      this.setState({indicatorColour:EMERALD_COLOUR3});
    }
  }

  connectToDevice(callback){
    if (this.state.ssid!=null && this.state.pwd!=null){
      Wifi.connectSecure(this.state.ssid,this.state.pwd,false,(error) => {
        if (error === null){callback(true)}
        else{callback(false)}
      });
    }
  }

  connect(){

    let count = Date.now();
    //IF in total less than 2 mins spent on attempting to connect
    let attemptToConnect = () => {
      this.connectToDevice(function(response){
        if (response){
          this.setState({indicatorAnimating: false}, () => this.props.navigation.navigate('Details',{initialSSID: this.state.initialSSID}))
        } else if (Date.now() - count < 75000 && !response){attemptToConnect()
        } else {
          Alert.alert("Failed to connect to device.");
          this.setState({modalIsVisible: true, indicatorText: 'Failed to connect to the device.', indicatorAnimating: false});
          this.updateModalContent();
        }
      }.bind(this))
    }

    attemptToConnect();

  }

  updateModalContent(){

    const firstPage = (
      <View>
        <Text style={styles.header}>Check if you have installed the device correctly:</Text>
        <Text style={styles.subheader}>Check if your device is powered on</Text>
        <Text style={styles.modalText}>If powered on correctly, you should be able to see an LED light on and hear the internal fan.</Text>

        <Text style={styles.subheader}>Go back to installment instructions</Text>
        <Text style={styles.modalText}>If you want to read the installment instructions again, click on the button below.</Text>
        <Button onPress={() => this.props.navigation.navigate('Instructions')} title="Instructions"/>

        <Text style={styles.subheader}>Perform another check</Text>
        <Text style={styles.modalText}>If you would like to check if there is other cause of error, press on 'next'.</Text>
        <Button onPress={() => {this.setState({modalContent: secondPage})}} title="Next"/>
      </View>
    );

    const secondPage = (
      <View>
        <Text style={styles.header}>Check if the app has scanned your QR code correctly:</Text>
        <Text style={styles.subheader}>If you do not see any text after colon (':') below, click on 'I don't see anything'. If you do, click on 'Next'.</Text>
        <Text style={styles.modalText}>Device SSID: {this.state.ssid}</Text>
        <Text style={styles.modalText}>Device PWD: {this.state.pwd}</Text>
        <Button onPress={() => {this.setState({modalIsVisible:false});this.props.navigation.navigate('Scanner')}} title="I don't see anything" style={{marginBottom: 5}}/>
        <Button onPress={() => {this.setState({modalContent: thirdPage})}} title="Next"/>
      </View>
    );

    const thirdPage = (
      <View>
        <Text style={styles.header}>Manually enter device SSID and password</Text>
        <Text style={styles.modalText}>Unfortunately, there's no other check that we can perform to identify the error. Please enter SSID and password of the device manually to connect to the device. SSID and password of your device are shown below:</Text>
        <Text style={styles.modalText}>Device SSID: {this.state.ssid}</Text>
        <Text style={styles.modalText}>Device PWD: {this.state.pwd}</Text>
        <Text style={styles.modalText}>You can also get device SSID and password from the sticker attached to the bottom of your device.</Text>
        <Button onPress={() => {this.setState({modalIsVisible: false});this.props.navigation.navigate('ConnectHome')}} title="Manually enter"/>
      </View>
    );

    //update modal content based on current index
    if (this.state.modalContentIndex === 0){this.setState({modalContent: firstPage, modalContentIndex: this.state.modalContentIndex++})}
    else if (this.state.modalContentIndex === 1){this.setState({modalContent: secondPage, modalContentIndex: this.state.modalContentIndex++})}
    else {this.setState({modalContent: thirdPage})}
  }

  render() {

    return (
        <View style={styles.container}>
          <Text>{this.state.indicatorText}</Text>
          <Text>This can take up to 2 minutes. Please don't quit the app.</Text>
          <ActivityIndicator size="large" color={this.state.indicatorColour} animating={this.state.indicatorAnimating} style={{top: '2%'}}/>

          <Modal
            isVisible={this.state.modalIsVisible}
            animationInTiming={400} animationOutTiming={400}
            backdropOpacity={0.5}
            style={ styles.modalWrapper }
          >

            <ScrollView style={{flex: 1}}>
              <Text style={styles.instruction}>Failed to connect to the device</Text>
              <Text>Failed to connect to your device's network. There may be several reasons for this. Please Follow the instructions below to make sure that the installment has been done correctly before attempting to connect to the device again.{'\n'}</Text>

              { this.state.modalContent }

            </ScrollView>
          </Modal>
        </View>
    );
  }
}

//Get location permission if the device platform is Android
async function requestLocationPermission(){
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        'title': 'Location Permission',
        'message': 'This app needs access to your location',
      }
    );
    if (!granted){
      Alert.alert("Cannot complete the registration without location permission.");
      this.props.navigation.navigate('Home');
    }
  } catch (err) {
    this.props.navigation.navigate('Home');
  }
}

export default Connection;
