import React from 'react';
import { Button, View, Text, StyleSheet, Alert, TouchableOpacity, Dimensions, PixelRatio } from 'react-native';

import PasswordTextBox from '../CustomClass/PasswordTextBox.js';
import InputTextBox from '../CustomClass/InputTextBox.js';
import {CSRF_KEY,COOKIE_KEY, EMAIL_KEY, SERVER_KEY} from '../CustomClass/Storage.js';
import {FetchURL} from '../CustomClass/Fetch.js';

import AsyncStorage from '@react-native-community/async-storage';
import CookieManager from 'react-native-cookies';

const EMERALD_COLOUR1 = '#17AA9D';
const EMERALD_COLOUR2 = '#28B674';
const EMERALD_COLOUR3 = '#8CC641';

class Home extends React.Component {

  static navigationOptions = ({navigation, navigationOptions}) => {

    const { params } = navigation.state;

    return {
      title: params ? params.title : 'Sign in',
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
      server: null
    };
  }

  componentWillMount(){
    //Check if there's cookie stored on app
    AsyncStorage.getAllKeys().then((res) => {
      if (res.includes(CSRF_KEY)){
        //Check if cookie is valid
        AsyncStorage.getItem(CSRF_KEY).then((csrftoken) => {
          this.checkToken(csrftoken);
          this.props.navigation.setParams({title: 'Home'});
        });
      }
    });
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
      if (cookie != this.state.cookieValid){
        this.setState({
          cookieValid: cookie,
          email: '',
          password: '',
        })
      }
      if (cookie){cookie = 'true'}
      else {cookie = 'false'}
      AsyncStorage.setItem(COOKIE_KEY, cookie);
    } else {
      AsyncStorage.getItem(COOKIE_KEY).then((cookie) => {
        if (cookie!=null){
          if (cookie==='true'){cookie = true}
          else {cookie = false}
          if (cookie!=this.state.cookieValid){
            this.setState({cookieValid: cookie});
          }
        }
      })
    }
  }

  signIn(email, password, nav){
    fetch(this.state.fetchInstance.LoginURL, {
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
        if (res['sessionid'] == null){
          this.setState({
            invalid: true,
            email: '',
            password: ''
          });
        }
        else {
          AsyncStorage.setItem(EMAIL_KEY, email);
          AsyncStorage.setItem(COOKIE_KEY, 'true');
          AsyncStorage.setItem(CSRF_KEY, csrftoken);
          this.props.navigation.setParams({title: 'Home'});
          this.setState({cookieValid: true});
          this.props.navigation.navigate('Scanner');
        }
      });
    }).catch((error) => {
      console.log(error);
    });
  }

  checkToken(csrftoken){
    fetch(this.state.fetchInstance.GetHomesURL, {
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
      fetch(this.state.fetchInstance.LogoutURL, {
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
            onPress={() => {this.signIn(this.state.email, this.state.password, this.props.navigation);}}
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
            accessibilityLabel="Sign out from your devemerald account">
            <Text style={styles.buttonText} adjustsFontSizeToFit numberOfLines={3}>Sign out from your account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {this.props.navigation.navigate('Scanner')}}
            style={[styles.MenuStyle, {backgroundColor: EMERALD_COLOUR1}]}
            accessibilityLabel="Add a new deployment">
            <Text style={styles.buttonText} adjustsFontSizeToFit numberOfLines={2}>New deployment</Text>
          </TouchableOpacity>

        </View>

        <View style={{flexDirection:'row'}}>

          <TouchableOpacity
            onPress={()=>{this.props.navigation.navigate('Details')}}
            style={[styles.MenuStyle, {backgroundColor: EMERALD_COLOUR3}]}>
            <Text style={styles.buttonText} adjustsFontSizeToFit numberOfLines={2}>Skip to connection</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={()=>{this.props.navigation.navigate('Setting')}}
            style={[styles.MenuStyle, {backgroundColor: EMERALD_COLOUR2}]}>
            <Text style={styles.buttonText} adjustsFontSizeToFit numberOfLines={1}>Settings</Text>
          </TouchableOpacity>

        </View>

        <View style={{flexDirection:'row'}}>

          <TouchableOpacity
            onPress={() => {this.props.navigation.navigate('Manage')}}
            style={[styles.MenuStyle, {backgroundColor: EMERALD_COLOUR2}]}>
            <Text style={styles.buttonText} adjustsFontSizeToFit numberOfLines={3}>Manage Home</Text>
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

const {height,width} = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 30,
    },
    instruction: {
      fontWeight: 'bold',
      fontSize: 23,
      marginBottom: 10,
      marginLeft: 10,
      marginRight: 10,
    },
    description: {
      fontSize: 15,
      marginLeft: 10,
      marginRight: 10,
    },
    wrapper:{
      marginTop: 10,
      width: '90%',
    },
    MenuStyle:{
      borderRadius: 15,
      width: width*0.9*0.4,
      height: width*0.9*0.4,
      paddingHorizontal: 20,
      paddingVertical: 20,
      marginLeft: width*0.9*0.1,
      marginBottom: width*0.9*0.1,
    },
    buttonText:{
      color: 'white',
      textAlignVertical: "center",
      textAlign: "center",
      fontSize: 17,
      fontWeight: 'bold'
    }
});

export default Home;
