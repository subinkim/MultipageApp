import React, { Component } from 'react';
import { Button, Image, View, Text, StyleSheet, Alert } from 'react-native';

import InputTextBox from '../CustomClass/InputTextBox.js';
import {SERVER_KEY, COOKIE_KEY, CSRF_KEY, EMAIL_KEY} from '../CustomClass/Storage.js';

import {FetchURL} from '../CustomClass/Fetch.js';

import AsyncStorage from '@react-native-community/async-storage';

class ChangeServer extends Component {
  static navigationOptions = ({navigation}) => ({
    headerTitle: "Change Server",
  });

  constructor(props){
    super(props);
    this.state = {
      server: null,
      serverChanged: false,
      serverInvalid: false,
    };
  }

  componentDidMount(){
    AsyncStorage.getItem(SERVER_KEY).then((server) => {
      this.setState({server:server});
    });
  }

  componentDidUpdate(){
    //Remove original login credentials once server changes
    if (this.state.serverChanged){
      AsyncStorage.setItem(SERVER_KEY, this.state.server);
      AsyncStorage.removeItem(CSRF_KEY);
      AsyncStorage.setItem(COOKIE_KEY, false);
      AsyncStorage.removeItem(EMAIL_KEY);
      this.props.navigation.navigate('Home');
    }
  }

  confirmChange(){
    Alert.alert(
      'Change server',
      'Are you sure you want to change server? You will be signed out automatically.',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Confirm', onPress: () => {this.changeServer()}},
      ],
      {cancelable: false},
    );
  }

  changeServer(){

    //Checking if the new server exists and is valid
    let fetchInstance = new FetchURL(this.state.server);
    fetch(fetchInstance.LoginURL, {
      method: 'POST',
      mode: 'cors',
      headers: {
        Accept:'*/*',
        'Content-Type': 'application/x-www-form-urlencoded',
        referer: this.state.fetchInstance.MainURL+'/register',
      },
      credentials: "include"
    }).then((response)=>{
      Alert.alert("Server successfully changed! You will be signed out.");
      this.setState({serverChanged: true});
    }).catch((error) => {
      Alert.alert("Invalid server!");
      this.setState({serverInvalid: true});
    });

  }

  render() {

    return (
      <View style={ styles.container }>
        <Text style={ styles.instruction }>Change server</Text>
        <Text style={ styles.description }>Enter new server in the following way: {"\n\t"}www.(server name).com{"\n"}Example: www.devemerald.com</Text>

        {/*ERROR MESSAGE*/}
        {this.state.serverInvalid?<Text style={{color: 'red'}}>ERROR: Invalid server. Please check your entry once again.</Text>:null}

        <InputTextBox
          icon="desktop"
          label="New server"
          onChange = {(server) => this.setState({server})}
          keyboard='default'
          returnKey='done'
          value={ this.state.server }
        />
        <Button
          onPress={() => this.confirmChange()}
          title="Submit"
        />
      </View>
    );
  }
}



const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginHorizontal: '5%',
      marginTop: 30,
    },
    instruction: {
      fontWeight: 'bold',
      fontSize: 23,
      marginBottom: 10,
    },
    description: {
      fontSize: 15,
    },
    header: {
      fontSize: 13,
    },

});

export default ChangeServer;
