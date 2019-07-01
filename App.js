import React from 'react';
import { Button, Image, View, Text, StyleSheet, Dimensions, TextInput, Alert, Platform, TouchableOpacity } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import WifiManager from 'react-native-wifi';
import { WebView } from 'react-native-webview';
import Wifi from 'react-native-iot-wifi';
import QRCodeScanner from 'react-native-qrcode-scanner';

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
      ssid: 'emerald-ecf7d9',
      password: 'ahZ2,VPDip',
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

    let passButton;
    if (this.state.initialSSID.includes("emerald")){
      passButton = (<Button
      title="Already connected?"
      onPress={() => {this.props.navigation.navigate('Details', {
        ssid: this.state.initialSSID, //edit so that it passes currentSSID to the function
      });}}/>);
    } else {
      scannerButton = (<Button
        title="Scan QR code"
        onPress={() => {this.props.navigation.navigate('Scanner', {
          currentSSID: this.state.initialSSID,
        });}}
      />);
    }

    return (
      <View style={ styles.container }>
        <Text style={ styles.instruction }>Connect to your device</Text>
        <Text>Manually enter SSID and password of your device or scan QR code.</Text>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ marginTop: 10, fontSize: 15 }}>Device SSID:</Text>
          <TextInput
            style={{ height: 19, marginTop: 10, marginBottom: 10, marginLeft: 42, flex: 1 }}
            onChangeText={ (ssid) => this.setState({ssid}) }
            value={ this.state.ssid }
            placeholder='Enter device SSID'
          />
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text style={{ fontSize: 15 }}>Device password:</Text>
          <TextInput
            style={{height: 19, marginBottom: 20, marginLeft: 10, flex: 1}}
            onChangeText={(password) => this.setState({password})}
            value={this.state.password}
            placeholder='Enter device password'
          />
        </View>
        <Button
          title="Join"
          onPress={() => connectToDevice(this.state.ssid, this.state.password, this.props.navigation, this.state.initialSSID)}
        />
        { scannerButton }
        { passButton }
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
        ssid: currentSSID,
      });
    } else {
      WifiManager.connectToProtectedSSID(ssid,pwd,false).then(() => {
        console.log('connection success');
        nav.navigate('Details', {
            ssid: ssid,
            initialSSID: currentSSID,
        });
      }, () => {
        console.log('connection failed');
        Alert.alert('Wrong SSID or password');
      })
    }
  }
}

class ScannerScreen extends React.Component {

  onSuccess = (e) => {
    let data = JSON.parse(e.data);
    let ssid = data.SSID;
    let password = data.password;
    Alert.alert("ssid: " + ssid + " password: " + password);
    connectToDevice(ssid, password, this.props.navigation, null);
  }

  render() {

    const params = this.props.navigation.state;
    const currentSSID = params.currentSSID;

    return (
      <QRCodeScanner
        onRead={() => {onSuccess(currentSSID)}}
        topContent={
          <Text>
             Scan the QR code attached to the bottom of device.
          </Text>
        }
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
        <Text style={ styles.description }>{'\t'}To connect to your device, you need its SSID and password. Check the bottom of the device to get the necessary credentials. {'\n'}{'\t'}Make sure you use the first password to connect to the device.</Text>
      </View>
    );
  }
}

function disconnectFromDevice(ssid, initialSSID, nav){

  Alert.alert("Initial SSID: " + initialSSID);
  if (initialSSID !== 'Cannot detect SSID'){
    WifiManager.connectToSSID(initialSSID);
    nav.navigate('Home');
  } else {
    WifiManager.disconnectFromSSID(ssid);
    nav.navigate('Home');
  }

}

class DetailsScreen extends React.Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    const { params } = navigation.state;

    return {
      title: params ? 'Connect ' + params.ssid : 'Connect device to wifi',
      headerRight: (
        <Button
          title="Done"
          onPress={() => {disconnectFromDevice(params.ssid, params.initialSSID, navigation);}}
        />
      ),
    };
  };

  render() {

    let {height, width} = Dimensions.get('window');

    let windowHeight = height * 0.7;
    let windowWidth = width * 0.9;

    let botMargin = height * 0.1;

    return (
      <WebView
        source={{ uri: URI }}
        style={{ width: windowWidth, height: windowHeight, flex: 1 , marginBottom: botMargin, marginLeft: 10, marginRight: 10 }}
      />
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
      marginTop: 40,
      alignItems: 'center',
      marginLeft: 20,
      marginRight: 20,
    },
    instruction: {
      fontSize: 20,
      marginBottom: 10,
    },
    description: {
      top: 70,
      fontSize: 15,
    },
})

const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
