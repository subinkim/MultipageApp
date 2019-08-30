import React, { Component } from 'react';
import { Button, Image, View, Text, Alert } from 'react-native';

import Wifi from 'react-native-iot-wifi';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-community/async-storage';

import { DEVICE_SSID_KEY, DEVICE_PWD_KEY, INITIAL_SSID_KEY } from '../../CustomClass/Storage';
import { basicStyles as styles } from '../styles';

import PasswordTextBox from '../../CustomClass/PasswordTextBox';
import InputTextBox from '../../CustomClass/InputTextBox';

class ConnectHome extends Component {
  static navigationOptions = ({navigation}) => ({
    headerTitle: "Connect to Wifi",
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

    if (this.state.ssid === '' || this.state.pwd === ''){
      Alert.alert('Incomplete','Please complete both fields');
    } else {
      if (this.state.ssid === this.state.initial){
        Alert.alert('You are already connected to this network');
        this.props.navigation.navigate('Details', {
          ssid: this.state.ssid,
          initialSSID: this.state.ssid,
        });
      } else {

        Wifi.connectSecure(this.state.ssid,this.state.pwd,false,(error) => {
          if (error != null){Alert.alert("Failed to connect")}
          else {
            Alert.alert("Connected");
            this.props.navigation.navigate('Details', {
              ssid: this.state.ssid,
              initialSSID: this.state.initial,
            });
          }
        });

      }
    }
  }

  render() {
    return (
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
        <Modal
          isVisible={this.state.modalIsVisible}
          animationInTiming={400} animationOutTiming={400}
          backdropOpacity={0.5}
          style={{ height: '100%', backgroundColor: 'black', opacity: 0.4}}
        >
          <ActivityIndicator size="large" color="red" animating={this.state.modalIsVisible} style={{}}/>
        </Modal>
      </View>
    );
  }
}

export default ConnectHome;
