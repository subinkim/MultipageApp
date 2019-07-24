import React from 'react';
import { Button, View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';

import { createStackNavigator, createAppContainer } from 'react-navigation';
import CookieManager from 'react-native-cookies';
import AsyncStorage from '@react-native-community/async-storage';

import PasswordTextBox from '../TextBox/PasswordTextBox.js';
import InputTextBox from '../TextBox/InputTextBox.js';

const LoginURL = 'https://www.devemerald.com/login';
const GetHomesURL = "https://www.devemerald.com/api/v1/ops/get-homes";
const LogoutURL = 'https://www.devemerald.com/logout';

const CSRF_KEY = '@csrftoken';

class Register extends React.Component {

  static navigationOptions = ({navigation, navigationOptions}) => {

    const { params } = navigation.state;

    return {
      title: 'Sign in',
    }
  };

  constructor(props){
    super(props);
    this.state = {
      email: '',
      password: '',
      cookieValid: false,
    };
  }

  componentWillMount(){
    AsyncStorage.getAllKeys().then((item) => {
      if (item.includes(CSRF_KEY)){
        if (getItem(this.props.navigation, fetchData)){
          this.setState({cookieValid: true})
          getItem(this.props.navigation, fetchHomes);
        } else {
          AsyncStorage.removeItem(CSRF_KEY);
        }
      }
    });
  }

  componentWillUpdate(){
    let cookie = this.props.navigation.getParam('cookieValid', false);
    if (cookie!=null){
      if (cookie != this.state.cookieValid){
        this.setState({
          cookieValid: cookie,
          email: '',
          password: '',
        })
      }
    }

  }

  render(){

    const inputField = (
      <View><Text style={ styles.instruction }>Sign in to devemerald.com</Text>
        <Text>Enter your crendentials for devemerald.com</Text>
          <InputTextBox
            icon="at"
            label="Enter email"
            onChange = {(email) => this.setState({email})}
            keyboard='email-address'
            returnKey='next'
            value={ this.state.email }
          />
          <PasswordTextBox
            icon='lock'
            label=' Enter password'
            value={ this.state.password }
            onChange={(password) => {this.setState({password})}}
          />
          <Button
            title="Sign in"
            onPress={() => {requestData(this.state.email, this.state.password, this.props.navigation); this.setState({cookieValid:true})}} //TODO: check if credentials are valid before this.setState
          />
        </View>
      );
    const signOutButton = (
    <View>
      <Text style= { styles.instruction }>Sign out from devemerald.com</Text>
      <Button
        title="Sign out"
        onPress={() => {signOut()}}
      />
    </View>);

    return(
      <View style={ styles.container }>
      {!this.state.cookieValid?inputField:signOutButton}
      </View>
    );
  }
}

function signOut(){

  AsyncStorage.getItem(CSRF_KEY).then((csrftoken) => {
    fetch(LogoutURL, {
      credentials:"include",
      headers: {
          'X-CSRFToken': csrftoken,
          referer: 'https://www.devemerald.com/',
          Accept: '*/*',
          'Content-Type': 'application/x-www-form-urlencoded',
      },
      method:'GET',
      mode:'cors',
    });
    AsyncStorage.removeItem(CSRF_KEY);
  });
}

function fetchData(csrftoken, nav){
  let response = fetch(GetHomesURL, {
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
    return response.text().then(function(text){
      text = JSON.parse(text);
      if (text['success'] != null){
        return text['success'];
      } else {
        return false;
      }
    });
  });
  return response;
}

function requestData(email, password, nav){

  fetch(LoginURL, {
    method: 'POST',
    headers: {
      Accept:'*/*',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'email='+email+'&password='+password,
    credentials: "include",
  }).then((response) => {
    CookieManager.getAll()
    .then((res) => {
      let csrftoken = res['csrftoken']['value'];
      storeItem(CSRF_KEY, csrftoken);
      getItem(nav, fetchHomes);
    });
  }).catch((error) => {
    console.log(error);
  });
}

async function storeItem(key, item){
  try {
    await AsyncStorage.setItem(key, item);
  } catch (e) {
    console.log(e);
  }
}

async function getItem(nav, fetchFunc){
  var value = await AsyncStorage.getItem(CSRF_KEY).then((item) => {
    fetchFunc(item,nav);
  });
}

function fetchHomes(csrftoken, nav){
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
    return response.text().then(function(text){
      text = JSON.parse(text);
      nav.navigate('Load', {
        csrftoken: csrftoken,
        response: JSON.stringify(text),
      });
    });
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
