import React from 'react';
import { Button, View, Text, Alert, TouchableOpacity, Dimensions, Image, ScrollView, Platform } from 'react-native';
import {Icon} from 'native-base';

import AsyncStorage from '@react-native-community/async-storage';
import CookieManager from 'react-native-cookies';

import PasswordTextBox from '../CustomClass/PasswordTextBox';
import InputTextBox from '../CustomClass/InputTextBox';

import {CSRF_KEY,COOKIE_KEY, EMAIL_KEY, SERVER_KEY} from '../CustomClass/Storage';
import {FetchURL} from '../CustomClass/Fetch';

import {homeStyles as styles} from './styles';

class Home extends React.Component {

  static navigationOptions = ({navigation, navigationOptions}) => {

    const { params } = navigation.state;

    return {
      header: null,
    }

  };

  constructor(props){
    super(props);
    this.state = {
      email: '',
      password: '',
      cookieValid: false,
      fetchInstance: null,
      invalid: false,
      server: null,
      email_item: null,
    };
  }

  componentWillMount(){
    //Check if there's cookie stored on app
    AsyncStorage.getAllKeys().then((res) => {
      if (res.includes(CSRF_KEY)){
        //Check if cookie is valid
        AsyncStorage.getItem(CSRF_KEY).then((csrftoken) => {
          this.checkToken(csrftoken);
        });
      }
    });
    AsyncStorage.getItem(EMAIL_KEY).then((email) => {this.setState({email_item: email})})
    //Check the server - if none exists, set it to default servdr
    AsyncStorage.getItem(SERVER_KEY).then((server) => {
      if (server === null){
        server = 'www.devemerald.com';
        AsyncStorage.setItem(SERVER_KEY, server);
      }
      let fetchInstance = new FetchURL(server)
      this.setState({server: server, fetchInstance: fetchInstance});
    });
  }

  //Change view based on cookie validity
  componentDidMount(){
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("didFocus", () => {
      AsyncStorage.getItem(COOKIE_KEY).then((cookieValid) => {
        if (cookieValid === 'true'){this.setState({cookieValid:true})}
        else {this.setState({cookieValid:false})}
      });
    });
  }

  componentWillUpdate(){
    AsyncStorage.getItem(COOKIE_KEY).then((cookie) => {
      if (cookie!=null){
        if (cookie==='true'){cookie = true}
        else {cookie = false}
        if (cookie!=this.state.cookieValid){
          this.setState({cookieValid: cookie});
        }
      }
    });
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }

  checkToken(csrftoken){
    fetch(this.state.fetchInstance.GetHomesURL, {
      credentials:"include",
      headers: {
          'X-CSRFToken': csrftoken,
          referer: this.state.fetchInstance.MainURL+'/',
          Accept: '*/*',
          'Content-Type': 'application/x-www-form-urlencoded',
      },
      method:'POST',
      mode:'cors',
    }).then(function(response){
      return response.text().then(function(text){
        text = JSON.parse(text);
        if (text['success'] != null){
          if (text['success']){AsyncStorage.setItem(COOKIE_KEY, 'true')}
          else{AsyncStorage.setItem(COOKIE_KEY, 'false'); AsyncStorage.removeItem(CSRF_KEY);AsyncStorage.removeItem(EMAIL_KEY)}
        } else {
          AsyncStorage.setItem(COOKIE_KEY, 'false');
          AsyncStorage.removeItem(CSRF_KEY);
          AsyncStorage.removeItem(EMAIL_KEY);
        }
      });
    }).catch((error) => {
      AsyncStorage.setItem(COOKIE_KEY, 'false');
      AsyncStorage.removeItem(CSRF_KEY);
      AsyncStorage.removeItem(EMAIL_KEY);
    });
  }

  signIn(){
    fetch(this.state.fetchInstance.LoginURL, {
      method: 'POST',
      headers: {
        Accept:'*/*',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'email='+this.state.email+'&password='+this.state.password,
      credentials: "include",
    }).then((response) => {

      CookieManager.get(this.state.fetchInstance.LoginURL).then((res) => {
        let csrftoken = res.csrftoken
        if (res.sessionid == null){
          this.setState({
            invalid: true,
            email: '',
            password: ''
          });
        } else {
          AsyncStorage.setItem(EMAIL_KEY, this.state.email);
          AsyncStorage.setItem(COOKIE_KEY, 'true');
          AsyncStorage.setItem(CSRF_KEY, csrftoken);
          this.setState({cookieValid: true, invalid: false, email_item: this.state.email}, () => this.props.navigation.navigate('Scanner'));
        }
      });

    }).catch((error) => {
      Alert.alert(JSON.stringify(error));
      console.log(error);
    });
  }

  signOut(){
    AsyncStorage.getItem(CSRF_KEY).then((csrftoken) => {
      fetch(this.state.fetchInstance.LogoutURL, {
        credentials:"include",
        headers: {
            'X-CSRFToken': csrftoken,
            referer: this.state.fetchInstance.MainURL+'/',
            Accept: '*/*',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        method:'GET',
        mode:'cors',
      });
      AsyncStorage.removeItem(CSRF_KEY);
    });
    AsyncStorage.setItem(COOKIE_KEY, 'false');
    AsyncStorage.removeItem(EMAIL_KEY);
    this.setState({cookieValid: false});
  }

  resumeRegister(){

  }

  render(){

    const inputs = (
      <View>
        <Text style={ styles.instruction }>Sign in</Text>
        <View style={{marginHorizontal:10}}>
        <Text style={{textAlign: 'center'}}>Enter your crendentials for {this.state.server}</Text>
        {this.state.invalid?<Text style={{color: 'red', fontSize: 16}}>Invalid credentials.</Text>:null}
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
            onPress={() => {this.signIn()}}
          />
          </View>
      </View>
    );

    const menu = (
    <View>
      <Text style= { styles.instructionMenu }>Emerald</Text>

      <Text style = { styles.descriptionMenu }>Welcome back, {this.state.email_item}!</Text>

      <Image source={require('../logos/only-icon.png')}
        style={{
          width: '40%', height: '30%', marginLeft: '35%',
          shadowColor: "#000",
          shadowOffset: {
          	width: 0,
          	height: 4,
          }, shadowOpacity: 0.30, shadowRadius: 4.65,}}
      />

      <View style={styles.wrapper}>

          <TouchableOpacity
            onPress={() => {this.props.navigation.navigate('Scanner')}}
            style={styles.MenuStyle}
            accessibilityLabel="Register a new deployment">
            <Icon name="add" style={styles.menuIcon}/>
            <Text style={styles.buttonText} adjustsFontSizeToFit numberOfLines={2}>Register New deployment</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {this.props.navigation.navigate('Load')}}
            style={styles.MenuStyle}
            accessibilityLabel="Manage existing homes and deployments">
            <Icon name="clipboard" style={styles.menuIcon}/>
            <Text style={styles.buttonText} adjustsFontSizeToFit numberOfLines={2}>Manage Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {this.props.navigation.navigate('CNHome')}}
            style={styles.MenuStyle}
            accessibilityLabel="Connect your EMERALD device to your home Wifi">
            <Icon name="wifi" style={styles.menuIcon}/>
            <Text style={styles.buttonText} adjustsFontSizeToFit numberOfLines={2}>Connect Device to Wifi</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {this.signOut()}}
            style={styles.MenuStyle}
            accessibilityLabel="Sign out from your devemerald account">
              <Icon name="log-out" style={styles.menuIcon}/>
              <Text style={styles.buttonText} adjustsFontSizeToFit numberOfLines={2}>Sign out from your account</Text>
          </TouchableOpacity>

      </View>
    </View>);
    return(
      <View style = { styles.background }>
        <ScrollView style={ styles.container } contentContainerStyle={{flexGrow: 1}}>
          {!this.state.cookieValid?inputs:menu}
        </ScrollView>
      </View>
    );
  }
}

export default Home;
