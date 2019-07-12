import React from 'react';
import { Button, Image, View, Text, StyleSheet, Dimensions, Alert, TouchableOpacity } from 'react-native';

import { createStackNavigator, createAppContainer } from 'react-navigation';
import WifiManager from 'react-native-wifi';
import { WebView } from 'react-native-webview';
import Wifi from 'react-native-iot-wifi';
import CookieManager from 'react-native-cookies';

const URI = 'http://wireless.devemerald.com';

class Details extends React.Component {
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

export default Details;
