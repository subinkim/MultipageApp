import React, { Component } from 'react';
import { Button, View, Text, StyleSheet, Alert } from 'react-native';
import {Picker} from 'native-base';

import AsyncStorage from '@react-native-community/async-storage';

import InputTextBox from '../../CustomClass/InputTextBox.js';
import {RegisterHomeURL,CSRF_KEY} from '../../CustomClass/Storage.js';

//MARK: Trial UUIDs - make this into an array later when API is given
const internal_test_trial = "TRL-9d09cc43-159b-4950-b6a4-37f35f2d6136";
const heritage_trial = 'TRL-b7380558-aba3-4457-908c-36083ed36148';
const production_test = 'TRL-56dfdb89-1a77-4264-886c-284b8921158c';
const novartis_internal_trialsite = 'TRL-dea43a32-f0a1-4d8a-844c-ecd2da0f3c1b';

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
    };
  }

  addHome(){

    let nickname = this.state.home;
    let trial_uuid = this.state.trial;
    let nav = this.props.navigation;

    if (nickname == null||trial_uuid == null){this.setState({incomplete: true})}
    else {

      //TODO: Alert to get final confirmation from the user if entered info is correct
      AsyncStorage.getItem(CSRF_KEY).then((csrftoken) => {

        fetch(RegisterHomeURL, {
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
          return response.text().then(function(text){
            text = JSON.parse(text);
            let home_uuid = text['data']['uuid'];
            nav.navigate('Register', {
              home_uuid: home_uuid,
              nickname: nickname,
            })
          })
        }).catch((error) => {
          console.log(error);
        });

      });

    }

  }

  render() {
    //TODO: make picker into a map function that maps a trial uuid list into picker items
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
           <Picker.Item label = "Internal Test Trial" value = {internal_test_trial} />
           <Picker.Item label = "Heritage Trial" value = {heritage_trial} />
           <Picker.Item label = "Production Test" value = {production_test} />
           <Picker.Item label = "Novartis Internal Trialsite" value = {novartis_internal_trialsite} />
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
