import React from 'react';
import { Button, View, Text, Dimensions, Alert } from 'react-native';

import WifiManager from 'react-native-wifi';
import { WebView } from 'react-native-webview';
import Wifi from 'react-native-iot-wifi';
import CookieManager from 'react-native-cookies';

const URI = 'http://wireless.devemerald.com';

import {basicStyles as styles} from './styles';

class CNDetails extends React.Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    const { params } = navigation.state;

    return {
      title: params ? params.ssid : 'Connect',
      headerRight: (
        <Button
          title="Done"
          onPress={() => {disconnectFromDevice(params.ssid, params.initialSSID, navigation)}}
        />
      ),
      headerLeft:(
        <Button
          title="Back"
          onPress={() => navigation.navigate('CNHome')}
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
          onPress={() => {WebViewRef && WebViewRef.reload()}}
        />
      </View>
    );
  }
}

function disconnectFromDevice(ssid, initialSSID, navigation){

  if (initialSSID != null){
    if (!(initialSSID.includes('emerald'))){
      Wifi.connect(initialSSID, (error) => {
        if (error != null){Alert.alert("Please manually disconnect from the device in the Settings.")}
      });
    } else {
      Wifi.removeSSID(ssid, (error) => {
        if (error != null){Alert.alert("Please manually disconnect from the device in the Settings.")}
      });
    }
  } else {
    Wifi.removeSSID(ssid, (error) => {
      if (error != null){Alert.alert("Please manually disconnect from the device in the Settings.")}
    });
  }
  navigation.navigate('CNHome');
}

export default CNDetails;
