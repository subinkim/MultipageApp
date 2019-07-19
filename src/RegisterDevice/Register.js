import React from 'react';
import { Button, View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';

import { createStackNavigator, createAppContainer } from 'react-navigation';
import CookieManager from 'react-native-cookies';
import AsyncStorage from '@react-native-community/async-storage';

import PasswordTextBox from '../TextBox/PasswordTextBox.js';
import InputTextBox from '../TextBox/InputTextBox.js';

const LoginURL = 'https://www.devemerald.com/login';
const GetHomesURL = "https://www.devemerald.com/api/v1/ops/get-homes";

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
      reload: 0,
      cookieValid: false,
    };
  }

  componentWillMount(){

    this.refresh();

    AsyncStorage.getAllKeys().then((item) => {
      if (item.includes(CSRF_KEY)){
        if (getItem(this.props.navigation, fetchData)){
          this.setState({
            cookieValid: true,
          })
          getItem(this.props.navigation, fetchHomes);
        } else {
          AsyncStorage.removeItem(CSRF_KEY);
        }
      }
    });
  }

  refresh = () => {
    let reload = this.state.reload;
    this.setState({
      reload: reload++,
    });
  }

  render(){

    let cookie = this.props.navigation.getParam('cookieValid');

    if (cookie != null){
      this.setState({
        cookieValid: cookie,
      })
    }

    return(
      <View style={ styles.container }>
      {!this.state.cookieValid?
        (<View><Text style={ styles.instruction }>Sign in to devemerald.com</Text>
        <Text>Enter your crendentials for devemerald.com</Text>
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
        </View>)
        :
        (<View>
          <Button
            title="Sign out"
            onPress={() => {signOut()}}
          />
        </View>
        )
        }
      </View>
    );
  }
}

async function signOut(){
  try{
    await AsyncStorage.removeItem(CSRF_KEY);
    console.log("signed out");
    AsyncStorage.getAllKeys().then((item) => console.log("keys after signout=>", item));
  } catch (e) {
    console.log(e);
  }
}

function fetchData(csrftoken, nav){
  let response;
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
      if (text['success'] != null){
        response = text['success'];
      } else {
        response = false;
      }
      console.log("response=>",response);
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
