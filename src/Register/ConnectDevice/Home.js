import React, { Component } from 'react';
import { Button, Image, View, Text, Alert, ActivityIndicator } from 'react-native';

import Wifi from 'react-native-iot-wifi';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-community/async-storage';

import { DEVICE_SSID_KEY, DEVICE_PWD_KEY } from '../../CustomClass/Storage';
import { basicStyles as styles } from '../styles';

import PasswordTextBox from '../../CustomClass/PasswordTextBox';
import InputTextBox from '../../CustomClass/InputTextBox';

class ConnectHome extends Component {
  static navigationOptions = ({navigation}) => ({
    headerTitle: "Connect to Device",
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

      modalIsVisible: false,
    };
  }

  componentDidMount(){
    let initial = this.props.navigation.getParam('initialSSID');
    if(initial != null){this.setState({initialSSID: initial})}
  }

  connectToDevice(){

    let ssid = this.state.ssid;
    let pwd = this.state.pwd;

    if (ssid === '' || pwd === ''){
      Alert.alert('Incomplete','Please complete both fields');
    } else {
      if (ssid === this.state.initial){
        Alert.alert('You are already connected to this network');
        this.setState({ssid: '', password: ''});
        this.props.navigation.navigate('Details', {
          ssid: ssid,
        });
      } else {
        this.setState({modalIsVisible: true});
        Wifi.connectSecure(ssid,pwd,false,(error) => {
          this.setState({modalIsVisible:false, ssid: '', password: ''});
          if (error != null){Alert.alert("Failed to connect")}
          else {
            Alert.alert("Connected");
            this.props.navigation.navigate('Details', {
              ssid: ssid,
              initialSSID: this.state.initial,
            });
          }
        });

      }
    }
  }

  render() {
    return (
      <View style={{flex:1}}>
        <View style={ styles.container }>
          <Text style={ styles.instruction }>Connect to your device</Text>
          <Text>Enter credentials to manually connect to your device.</Text>
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
            onChange={(password) => this.setState({password})}
            value={this.state.password}
          />
          <Button
            title="Connect"
            onPress={() => this.connectToDevice()}
          />
        </View>
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

export default ConnectHome;
