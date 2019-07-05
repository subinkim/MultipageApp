import React from 'react';
import { Button, Image, View, Text, StyleSheet, Dimensions, TextInput, Alert, Platform, TouchableOpacity } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import WifiManager from 'react-native-wifi';
import { WebView } from 'react-native-webview';
import Wifi from 'react-native-iot-wifi';
import QRCodeScanner from 'react-native-qrcode-scanner';
import PasswordTextBox from './PasswordTextBox/PasswordTextBox.js';
import SSIDTextBox from './SSIDTextBox/SSIDTextBox.js';

const URI = 'http://wireless.devemerald.com';

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
        <SSIDTextBox label='Device SSID' onChange={(ssid) => {this.setState({ssid})}}/>
        <PasswordTextBox icon='lock' label=' Device password' onChange={(password) => {this.setState({password})}} />
        <Button
          title="Connect"
          onPress={() => connectToDevice(this.state.ssid, this.state.password, this.props.navigation, this.state.initialSSID)}
        />
        { scannerButton }
        { this.state.initialSSID.includes('emerald')?passButton:null }
      </View>
    );
  }
}

function connectToDevice(ssid, pwd, nav, currentSSID){

  Wifi.getSSID((initial) => {
    if (initial != null && initial !== currentSSID){
      Alert.alert(initial);
      currentSSID = initial
    }
  })

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
        style={{ height: scannerHeight, width: scannerWidth }}
        reactivate={true}
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
          source={{ uri: URI }}
          style={{ width: windowWidth, height: windowHeight, flex: 1 , marginBottom: botMargin, marginLeft: leftMargin, marginRight: rightMargin }}
        />
        <Button
          title="Reload"
          onPress={() => {this.props.navigation.push('Details',{
            initialSSID: this.props.navigation.getParam('initialSSID'),
            ssid: this.props.navigation.getParam('ssid'),
          })}}
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
