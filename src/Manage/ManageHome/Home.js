import React from 'react';
import { Button, View, Text, StyleSheet, Alert, TouchableOpacity, Dimensions } from 'react-native';

import PasswordTextBox from '../../CustomClass/PasswordTextBox';
import InputTextBox from '../../CustomClass/InputTextBox';
import {CSRF_KEY,COOKIE_KEY, EMAIL_KEY, SERVER_KEY} from '../../CustomClass/Storage';
import {FetchURL} from '../../CustomClass/Fetch';
import {homeStyles as styles} from './styles';

import AsyncStorage from '@react-native-community/async-storage';
import CookieManager from 'react-native-cookies';

const EMERALD_COLOUR1 = '#17AA9D';
const EMERALD_COLOUR2 = '#28B674';
const EMERALD_COLOUR3 = '#8CC641';

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
      csrftoken: null,

      fetchInstance: null,
      invalid: false,
      server: null,
    };
  }

  componentWillMount(){

    //Check the server - if none exists, set it to default servdr
    AsyncStorage.getItem(SERVER_KEY).then((server) => {
      if (server === null){
        server = 'www.devemerald.com';
        AsyncStorage.setItem(SERVER_KEY, server);
      }
      let fetchInstance = new FetchURL(server)
      this.setState({server: server, fetchInstance: fetchInstance}, () => {
        //Check if there's cookie stored on app
        //Use callback to make sure setState happens before this
        AsyncStorage.getAllKeys().then((res) => {
          if (res.includes(CSRF_KEY)){
            //Check if cookie is valid
            AsyncStorage.getItem(CSRF_KEY).then((csrftoken) => {
              this.setState({csrftoken: csrftoken});
              this.checkToken(csrftoken);
            });
          }
        });

      });

    });

  }

  //Change view based on cookie validity
  componentDidMount(){

    AsyncStorage.getItem(COOKIE_KEY).then((cookieValid) => {
      if (cookieValid === 'true'){this.setState({cookieValid:true})}
      else {this.setState({cookieValid:false})}
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
        let csrftoken = res.csrftoken;
        if (res.sessionid == null){
          this.setState({
            invalid: true,
            email: '',
            password: ''
          });
        }
        else {
          AsyncStorage.setItem(EMAIL_KEY, this.state.email);
          AsyncStorage.setItem(COOKIE_KEY, 'true');
          AsyncStorage.setItem(CSRF_KEY, csrftoken);
          this.setState({csrftoken: csrftoken});
        }
      });
    }).catch((error) => {
      Alert.alert("Sign in failed! ERROR: "+ error);
      this.setState({invalid: true, email:'', password: ''});
    });
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
    }).then((response) => {
      return response.text().then((text) => {
        text = JSON.parse(text);
        if (text['success'] != null){
          if (text['success']){AsyncStorage.setItem(COOKIE_KEY, 'true')}
          else{AsyncStorage.setItem(COOKIE_KEY, 'false'); AsyncStorage.removeItem(CSRF_KEY)}
        } else {
          AsyncStorage.setItem(COOKIE_KEY, 'false');
          AsyncStorage.removeItem(CSRF_KEY);
        }
      });
    });
  }

  signOut(){
    fetch(this.state.fetchInstance.LogoutURL, {
      credentials:"include",
      headers: {
          'X-CSRFToken': this.state.csrftoken,
          referer: this.state.fetchInstance.MainURL+'/',
          Accept: '*/*',
          'Content-Type': 'application/x-www-form-urlencoded',
      },
      method:'GET',
      mode:'cors',
    });
    AsyncStorage.removeItem(CSRF_KEY);
    AsyncStorage.setItem(COOKIE_KEY, 'false');
    AsyncStorage.removeItem(EMAIL_KEY);
    this.setState({cookieValid: false});
    this.setState({email: '', password: ''})
  }

  render(){

    const inputs = (
      <View>
        <Text style={ styles.instruction }>Sign in to {this.state.server}</Text>
        <View style={{marginHorizontal:10}}>
        <Text>Enter your crendentials for devemerald.com</Text>
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
            onPress={() => {this.signIn();}}
          />
          </View>
      </View>
    );

    const menu = (
    <View>
      <Text style= { styles.instruction }>{this.state.server}</Text>
      <Text style={ styles.description }>Select an action.</Text>
      <View style={ styles.wrapper }>

        <View style={{flexDirection:'row'}}>

          <TouchableOpacity
            onPress={() => {this.signOut()}}
            style={[styles.MenuStyle, {backgroundColor: EMERALD_COLOUR2}]}
            accessibilityLabel="Sign out from your account">
            <Text style={styles.buttonText} adjustsFontSizeToFit numberOfLines={3}>Sign out from your account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {this.props.navigation.navigate('Load')}}
            style={[styles.MenuStyle, {backgroundColor: EMERALD_COLOUR1}]}
            accessibilityLabel="Manage Home">
            <Text style={styles.buttonText} adjustsFontSizeToFit numberOfLines={2}>Manage Home</Text>
          </TouchableOpacity>

        </View>

        <View style={{flexDirection:'row'}}>

          <TouchableOpacity
            onPress={()=>{this.props.navigation.navigate('Register')}}
            style={[styles.MenuStyle, {backgroundColor: EMERALD_COLOUR3}]}>
            <Text style={styles.buttonText} adjustsFontSizeToFit numberOfLines={2}>Register new deployment</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={()=>{this.props.navigation.navigate('Setting')}}
            style={[styles.MenuStyle, {backgroundColor: EMERALD_COLOUR2}]}>
            <Text style={styles.buttonText} adjustsFontSizeToFit numberOfLines={1}>Settings</Text>
          </TouchableOpacity>

        </View>

      </View>
    </View>);
    //MARK:get rid of skip button later
    return(
      <View style={ styles.container }>
      {!this.state.cookieValid?inputs:menu}
      </View>
    );
  }
}

export default Home;
