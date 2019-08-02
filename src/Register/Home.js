import React from 'react';
import { Button, View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';

import PasswordTextBox from '../CustomClass/PasswordTextBox.js';
import InputTextBox from '../CustomClass/InputTextBox.js';
import {CSRF_KEY} from '../CustomClass/Storage';
import {MainURL, LoginURL, LogoutURL, GetHomesURL} from '../CustomClass/Storage';

import AsyncStorage from '@react-native-community/async-storage';
import CookieManager from 'react-native-cookies';

const COOKIE_KEY = '@cookieValid';

class Home extends React.Component {

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
    AsyncStorage.getAllKeys().then((res) => {
      if (res.includes(CSRF_KEY)){
        AsyncStorage.getItem(CSRF_KEY).then((csrftoken) => {
          this.checkToken(csrftoken);
        });
      }
    });
  }

  componentDidMount(){
    AsyncStorage.getItem(COOKIE_KEY).then((cookieValid) => {
      if (cookieValid === 'true'){this.setState({cookieValid:true})}
      else {this.setState({cookieValid:false})}
    });

    if (this.state.cookieValid){
      this.props.navigation.navigate('Scanner');
    }
  }

  componentWillUpdate(){
    var cookie = this.props.navigation.getParam('cookieValid', null);
    if (cookie!=null){
      if (cookie){cookie = 'true'}
      else {cookie = 'false'}
      AsyncStorage.setItem(COOKIE_KEY, cookie);
      if (cookie != this.state.cookieValid){
        this.setState({
          cookieValid: cookie,
          email: '',
          password: '',
        })
      }
    }
  }

  signIn(email, password, nav){
    fetch(LoginURL, {
      method: 'POST',
      headers: {
        Accept:'*/*',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'email='+email+'&password='+password,
      credentials: "include",
    }).then((response) => {
      CookieManager.getAll() //TODO: This doesn't work for Android
      .then((res) => {
        let csrftoken = res['csrftoken']['value'];
        AsyncStorage.setItem(COOKIE_KEY, 'true');
        AsyncStorage.setItem(CSRF_KEY, csrftoken);
        this.props.navigation.navigate('Scanner');
      });
    }).catch((error) => {
      console.log(error);
    });
  }

  checkToken(csrftoken){
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
          if (text['success']){AsyncStorage.setItem(COOKIE_KEY, 'true');}
          else{AsyncStorage.setItem(COOKIE_KEY, 'false'); AsyncStorage.removeItem(CSRF_KEY)}
        } else {
          AsyncStorage.setItem(COOKIE_KEY, 'false');
          AsyncStorage.removeItem(CSRF_KEY);
        }
      });
    });
  }

  signOut(){
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
    AsyncStorage.setItem(COOKIE_KEY, 'false');
    this.setState({cookieValid: false});
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
            onPress={() => {this.signIn(this.state.email, this.state.password, this.props.navigation);}}
          />
        </View>
      );
    const signOutButton = (
    <View>
      <Text style= { styles.instruction }>Sign out from devemerald.com</Text>
      <Button
        title="Sign out"
        onPress={() => {this.signOut()}}
      />
      <Button
        title="Scan QR code"
        onPress={() => {this.props.navigation.navigate('Scanner')}}
      />
    </View>);

    return(
      <View style={ styles.container }>
      {!this.state.cookieValid?inputField:signOutButton}
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
      marginBottom: 10,
    },
    description: {
      top: 50,
      fontSize: 15,
    },
});

export default Home;
