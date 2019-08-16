import React, { Component } from 'react';
import { Button, View, Text, StyleSheet, Alert } from 'react-native';
import {Picker} from 'native-base';

import AsyncStorage from '@react-native-community/async-storage';

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
    AsyncStorage.getItem(SERVER_KEY).then((server) => {
      if (server === null){
        server = 'www.devemerald.com';
        AsyncStorage.setItem(SERVER_KEY, server);
      }
      let fetchInstance = new FetchURL(server);
      this.setState({fetchInstance: fetchInstance});
    });
    let trialList = this.props.navigation.getParam('list', null);
    if (trialList !== null){this.setState({trialList: trialList})}
  }

  addHome(){

    let nickname = this.state.home;
    let trial_uuid = this.state.trial;

    if (nickname == null||trial_uuid == null){this.setState({incomplete: true})}
    else {

      //TODO: Alert to get final confirmation from the user if entered info is correct
      AsyncStorage.getItem(CSRF_KEY).then((csrftoken) => {

        fetch(this.state.fetchInstance.RegisterHomeURL, {
          method: 'POST',
          mode: 'cors',
          headers: {
            Accept:'*/*',
            'Content-Type': 'application/x-www-form-urlencoded',
            referer: 'https://www.devemerald.com/trialsite/register',
            'X-CSRFToken': csrftoken,
          },
          body: 'nickname='+nickname+'&trial_uuid='+trial_uuid,
          credentials: "include"
        }).then((response) => {
          if (response['status'] === 200){this.reload()}
          else {Alert.alert("Failed to add new home.")}
        }).catch((error) => {
          Alert.alert("Failed to add new home. Error:"+error);
        });

      });

    }
  }

  reload(){
    AsyncStorage.getItem(CSRF_KEY).then((csrftoken) => {

      fetch(this.state.fetchInstance.GetHomesURL, {
        method: 'POST',
        mode: 'cors',
        headers: {
          Accept: '*/*',
          'Content-Type': 'application/x-www-form-urlencoded',
          referer: 'https://www.devemerald.com/',
          'X-CSRFToken': csrftoken,
        },
        credentials: 'include'
      }).then((response) => {
        return response.text().then((text) => {
          this.props.navigation.navigate('Load', {
            json: text,
            updated: 'false',
          });
        })
      })

    })
  }

  render() {

    let trialList = JSON.parse(this.state.trialList)['data'].map((item, i) => {
      return (<Picker.Item label={item.nickname} value={item.uuid} key={i}/>);
    });

    return (
      <View style={ styles.container }>
        <Text style={styles.instruction}>Register new home</Text>
        {this.state.incomplete?<Text style={{color: 'red', marginBottom: 20, fontSize: 17}}>Please complete ALL the fields</Text>:null}
        <Text style={styles.description}>Enter home nickname</Text>
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
      marginBottom: 20,
    },
    description: {
      fontSize: 15,
    },
});

export default AddHome;
