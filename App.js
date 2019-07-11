import React from 'react';
import { Button, Image, View, Text, StyleSheet, Dimensions, TextInput, Alert, Platform, TouchableOpacity, AsyncStorage } from 'react-native';
//import AsyncStorage from '@react-native-community/async-storage';

import { createStackNavigator, createAppContainer } from 'react-navigation';
import WifiManager from 'react-native-wifi';
import { WebView } from 'react-native-webview';
import Wifi from 'react-native-iot-wifi';
import QRCodeScanner from 'react-native-qrcode-scanner';
import CookieManager from 'react-native-cookies';

import PasswordTextBox from './src/PasswordTextBox.js';
import InputTextBox from './src/InputTextBox.js';
import ActivityIndicatorCustom from './src/ActivityIndicatorCustom.js';

const URI = 'http://wireless.devemerald.com';
const LoginURL = 'https://www.devemerald.com/login';
const TrialSiteURL = "https://www.devemerald.com/trialsite/";
const GetHomesURL = "https://www.devemerald.com/api/v1/ops/get-homes";

class HomeScreen extends React.Component {
  static navigationOptions = ({navigation}) => ({
    headerTitle: "Welcome!",
    headerRight: <Button
        onPress={() => {navigation.navigate('Info');}}
        title="Help"
      />
  });

  constructor(props){
    super(props);
    this.state = {
      ssid: '',
      password: '',
      initialSSID: '',
    };
  }

  render() {

    if (this.state.initialSSID === ''){
      Wifi.getSSID((initialSSID) => {
        if (initialSSID != null){
          this.setState({initialSSID});
        }
      })
    }

    const scannerButton = (<Button
      title="Scan QR code"
      onPress={() => {
        this.props.navigation.navigate('Scanner',{
          currentSSID: this.state.initialSSID,
        });
      }}
    />);

    const passButton =(<Button
      title="Already connected?"
      onPress={() => {
        this.props.navigation.navigate('Details', {
          currentSSID: this.state.initialSSID,
        })
      }}
    />);

    return (
      <View style={ styles.container }>
        <Text style={ styles.instruction }>Connect to your device</Text>
        <Text>Manually enter SSID and password of your device or scan QR code.</Text>
        <InputTextBox icon="wifi" label='Device SSID' onChange={(ssid) => {this.setState({ssid})}} keyboard='default' returnKey='next'/>
        <PasswordTextBox icon='lock' label=' Device password' onChange={(password) => {this.setState({password})}} />
        <Button
          title="Connect"
          onPress={() => connectToDevice(this.state.ssid, this.state.password, this.props.navigation, this.state.initialSSID)}
        />
        { scannerButton }
        { this.state.initialSSID.includes('emerald')?passButton:null }
        <Button
          title="Register device"
          onPress={() => {this.props.navigation.navigate('Register');}}
        />
      </View>
    );
  }
}

function connectToDevice(ssid, pwd, nav, currentSSID){

  if (ssid === '' || pwd === ''){
    Alert.alert('Incomplete','Please complete both fields');
  } else {
    if (ssid === currentSSID){
      Alert.alert('You are already connected to this network');
      nav.navigate('Details', {
        ssid: ssid,
      });
    } else {
      WifiManager.connectToProtectedSSID(ssid,pwd,false).then(() => {
        Alert.alert("Connected");
        nav.navigate('Details', {
            ssid: ssid,
            initialSSID: currentSSID,
        });
      }, () => {
        Alert.alert('Cannot connect');
        nav.navigate('Home');
      })
    }
  }
}

class ScannerScreen extends React.Component {

  static navigationOptions = ({ navigation, navigationOptions }) => {
    const { params } = navigation.state;

    return {
      title: 'Scan QR code',
    };
  };

  loadOnSuccess = (initial, nav) => {
    function onSuccess(e){
      let data = JSON.parse(e.data);
      let ssid = data.ssid;
      let password = data.password;
      if (ssid == null || password == null){
        Alert.alert("Not a valid QR code.");
        this.props.navigation.navigate('Home');
      }
      connectToDevice(ssid, password, nav, initial);
    }
    return onSuccess;
  }

  render() {

    const { navigation } = this.props;
    const currentSSID = navigation.getParam('currentSSID', null);

    let {height, width} = Dimensions.get('window');

    return (
      <QRCodeScanner
        onRead={this.loadOnSuccess(currentSSID, this.props.navigation)}
        topContent={
          <Text>
              Scan the QR code attached to the bottom of device.
          </Text>
        }
        permissionDialogTitle="Permission required"
        permissionDialogMessage="This app would like to access your camera."
      />
    );
  }
}

class InfoScreen extends React.Component {
  static navigationOptions = {
    title: 'Help',
  };

  render() {
    let {height, width} = Dimensions.get('window');
    let imageWidth = width - 20;
    let imageHeight = imageWidth * 977/3920;
    return (
      <View style={ styles.container }>
        <Text style={ styles.instruction }>How to connect to your device</Text>
        <Image
          source={require('./deviceInfo.png')}
          style={{width:imageWidth, height: imageHeight, top: 40}}
        />
        <Text style={ styles.description }>To connect to your device, you need its SSID and password. Check the bottom of the device to get the necessary credentials. Make sure you use the first password to connect to the device.</Text>
      </View>
    );
  }
}

function disconnectFromDevice(ssid, initialSSID, nav){

  if (initialSSID != null){
    if (initialSSID !== 'Cannot detect SSID' && !(initialSSID.includes('emerald'))){
      WifiManager.connectToSSID(initialSSID);
      nav.navigate('Home');
    } else {
      WifiManager.disconnectFromSSID(ssid);
      nav.navigate('Home');
    }
  } else {
    WifiManager.disconnectFromSSID(ssid);
    nav.navigate('Home');
  }

}

class DetailsScreen extends React.Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    const { params } = navigation.state;

    return {
      title: params ? params.ssid : 'Connect',
      headerRight: (
        <Button
          title="Done"
          onPress={() => {disconnectFromDevice(params.ssid, params.initialSSID, navigation);}}
        />
      ),
      headerLeft:(
        <Button
          title="Back"
          onPress={() => navigation.navigate('Home')}
        />
      ),
    };
  };

  render() {

    let {height, width} = Dimensions.get('window');

    let windowHeight = height * 0.8;
    let windowWidth = width * 0.9;

    let botMargin = height * 0.1;
    let leftMargin = width * 0.05;
    let rightMargin = width * 0.05;

    return (
      <View style={{ flex: 1 }}>
        <WebView
          ref={WEBVIEW_REF => (WebViewRef = WEBVIEW_REF)}
          source={{ uri: URI }}
          style={{ width: windowWidth, height: windowHeight, flex: 1 , marginBottom: botMargin, marginLeft: leftMargin, marginRight: rightMargin }}
        />
        <Button
          title="Reload"
          onPress={() => {WebViewRef && WebViewRef.reload();}}
        />
      </View>
    );
  }
}

class RegisterScreen extends React.Component {

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
          <Button
            title="get homes"
            onPress={() => {this.props.navigation.navigate('Load')}}
          />
        </View>
      </View>
    );
  }
}

function requestData(email, password, nav){

  let sessionid;
  let csrftoken;
  let cookie;

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
      cookie = 'sessionid='+sessionid+'; csrftoken='+csrftoken;
      function navigateToLoad(){
        nav.navigate('Load', {
          'sessionid': sessionid,
          'cookie': cookie,
          'csrftoken': csrftoken,
        });
      }
      navigateToLoad();
    });
  }).catch((error) => {
    console.log(error.message);
  });
}

function getHomes(sessionID, csrftoken, cookie){

  console.log(sessionID);
  console.log(csrftoken);
  console.log(cookie);

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

class LoadScreen extends React.Component {

  render(){

    const sessionID = this.props.navigation.getParam('sessionid',null);
    const csrftoken = this.props.navigation.getParam('csrftoken',null);
    const cookie = this.props.navigation.getParam('cookie', null);

    return(
      <View>
        <Text>Load Screen</Text>
        <Text>session id: {sessionID}</Text>
        <Text>csrftoken: {csrftoken}</Text>
        <Text>cookie: {cookie}</Text>
        <Button
          title="get Homes"
          onPress={() => {getHomes(sessionID, csrftoken, cookie)}}
        />
      </View>
    );
  }
}

const RootStack = createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
    },
    Details: {
      screen: DetailsScreen,
    },
    Info: {
      screen: InfoScreen,
    },
    Scanner: {
      screen: ScannerScreen,
    },
    Register: {
      screen: RegisterScreen,
    },
    Load: {
      screen: LoadScreen,
    }
  },
  {
    initialRouteName: 'Home',
    defaultNavigationOptions: {
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 20,
      },
    },
  }
);

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
})

const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
