import React, { Component } from 'react';
import { Button, View, Text, StyleSheet, Alert } from 'react-native';
import {Picker} from 'native-base';

import AsyncStorage from '@react-native-community/async-storage';
import { basicStyles as styles } from '../styles';

import InputTextBox from '../../CustomClass/InputTextBox.js';
import {FetchURL} from '../../CustomClass/Fetch.js';
import {CSRF_KEY, SERVER_KEY} from '../../CustomClass/Storage.js';

class AddHome extends Component {
  static navigationOptions = ({navigation}) => ({
    headerTitle: "Register home",
  });

  constructor(props){
    super(props);
    this.state = {
      trial: null,
      home: null,
      incomplete: false,
      trialList:null,
      fetchInstance: null,
    };
  }

  componentWillMount(){
    let trialList = this.props.navigation.getParam('list', null);
    this.setState({trialList: trialList});
    AsyncStorage.getItem(SERVER_KEY).then((server) => {
      if (server === null){
        server = 'www.devemerald.com';
        AsyncStorage.setItem(SERVER_KEY, server);
      }
      let fetchInstance = new FetchURL(server)
      this.setState({server: server, fetchInstance: fetchInstance});
    });
  }

  addHome(){

    let nickname = this.state.home;
    let trial_uuid = this.state.trial;
    let nav = this.props.navigation;

    if (nickname == null||trial_uuid == null){this.setState({incomplete: true})}
    else {

      AsyncStorage.getItem(CSRF_KEY).then((csrftoken) => {

        fetch(this.state.fetchInstance.RegisterHomeURL, {
          method: 'POST',
          mode: 'cors',
          headers: {
            Accept:'*/*',
            'Content-Type': 'application/x-www-form-urlencoded',
            referer: this.state.fetchInstance.Main+'/register',
            'X-CSRFToken': csrftoken,
          },
          body: 'nickname='+nickname+'&trial_uuid='+trial_uuid,
          credentials: "include"
        }).then((response) => {
          return response.text().then(function(text){
            text = JSON.parse(text);
            let home_uuid = text['data']['uuid'];
            nav.navigate('Register', {
              home_uuid: home_uuid,
              nickname: nickname,
            })
          })
        }).catch((error) => {
          Alert.alert("Could not register home successfully.");
        });

      });

    }

  }

  render() {

    let trialList = JSON.parse(this.state.trialList)['data'].map((item, i) => {
      return (<Picker.Item label={item.nickname} value={item.uuid} key={i}/>);
    });

    return (
      <View style={ styles.container }>
        <Text style={styles.instruction}>Register new home</Text>
        {this.state.incomplete?<Text style={{color: 'red', marginBottom: 20, fontSize: 17}}>Please complete ALL the fields</Text>:null}
        <Text style={{fontSize: 15}}>Enter home nickname</Text>
        <InputTextBox
          icon="home"
          label="Home Nickname"
          onChange={(home) => this.setState({home:home})}
          keyboard="default"
          value={this.state.home}
          returnKey="done"
        />
        <Text style={{fontSize: 15, marginTop: 20}}>Select trial type</Text>
        <Picker
          mode="dropdown"
          selectedValue = {this.state.trial}
          onValueChange = {(trial)=>this.setState({trial:trial})}
          placeholder = 'Select trial'
          style={{borderWidth: 1, borderRadius: 3, borderColor: 'grey', marginVertical: 20, width: '100%'}}>
        {this.state.trialList!=null?trialList:null}
        </Picker>
        <Button
          onPress={this.addHome.bind(this)}
          title="Register new Home"
        />
      </View>
    );
  }
}

export default AddHome;
