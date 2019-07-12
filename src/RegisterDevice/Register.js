import React from 'react';
import { Button, View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';

import { createStackNavigator, createAppContainer } from 'react-navigation';
import { Ionicons } from 'react-native-vector-icons/Ionicons';
import CookieManager from 'react-native-cookies';

import PasswordTextBox from '../TextBox/PasswordTextBox.js';
import InputTextBox from '../TextBox/InputTextBox.js';

const LoginURL = 'https://www.devemerald.com/login';
const GetHomesURL = "https://www.devemerald.com/api/v1/ops/get-homes";

class Register extends React.Component {

  static navigationOptions = ({navigation}) => ({
    headerTitle: "Sign In",
  });

  constructor(props){
    super(props);
    this.state = {
      email: 'skim1@exeter.edu',
      password: 'Subin0306',
    };
  }

  render(){
    return(
      <View style={ styles.container }>
        <Text style={ styles.instruction }>Sign in to devemerald.com</Text>
        <Text>Enter your crendentials for devemerald.com</Text>
        <View>
          <InputTextBox
            icon="at"
            label="Enter email"
            onChange = {(email) => this.setState({email})}
            keyboard='email-address'
            returnKey='next'
          />
          <PasswordTextBox
            icon='lock'
            label=' Enter password'
            onChange={(password) => {this.setState({password})}}
          />
          <Button
            title="Sign in"
            onPress={() => {requestData(this.state.email, this.state.password, this.props.navigation)}}
          />
        </View>
      </View>
    );
  }
}

function requestData(email, password, nav){

  let sessionid;
  let csrftoken;

  fetch(LoginURL, {
    method: 'POST',
    headers: {
      Accept:'*/*',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'email=skim1@exeter.edu&password=Subin0306',
    credentials: "include",
    //redirect: "manual",
  }).then((response) => {
    console.log(response);
    CookieManager.getAll()
    .then((res) => {
      sessionid = res['sessionid']['value'];
      csrftoken = res['csrftoken']['value'];
      function navigateToLoad(){
        nav.navigate('Load', {
          'csrftoken': csrftoken,
        });
      }
      navigateToLoad();
    });
  }).catch((error) => {
    console.log(error.message);
  });
}

function getHomes(csrftoken){

  console.log(csrftoken);

  fetch(GetHomesURL, {
    credentials:"include",
    headers: {
        'X-CSRFToken': csrftoken,
        referer: 'https://www.devemerald.com/',
        Accept: '*/*',
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    method:'POST',
    mode:'cors',
  }).then(function(response){
    console.log("trialsite");
    console.log(response);
    return response.text();
  }).then(function(text){
    console.log(text);
  });
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

export default Register;
