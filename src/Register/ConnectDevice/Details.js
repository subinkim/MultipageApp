import React from 'react';
import { Button, Image, View, Text, StyleSheet, Dimensions, Alert, TouchableOpacity } from 'react-native';

import WifiManager from 'react-native-wifi';
import { WebView } from 'react-native-webview';
import Wifi from 'react-native-iot-wifi';
import CookieManager from 'react-native-cookies';

import {MainURL, GetHomesURL} from '../../CustomClass/Storage.js';

const URI = 'http://wireless.devemerald.com';

class Details extends React.Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    const { params } = navigation.state;

    return {
      title: params ? params.ssid : 'Connect',
      // MARK: uncomment this after debugging and get rid of the other headerRight button
      // headerRight: (
      //   <Button
      //     title="Done"
      //     onPress={() => {disconnectFromDevice(params.ssid, params.initialSSID, navigation);}}
      //   />
      // ),
      headerRight:(
        <Button
          title="Done"
          onPress={()=> {disconnectFromDevice('','',navigation)}}
        />
      ),
      headerLeft:(
        <Button
          title="Back"
          onPress={() => navigation.navigate('ConnectHome')}
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

  // MARK: uncomment this later
  // if (initialSSID != null){
  //   if (initialSSID !== 'Cannot detect SSID' && !(initialSSID.includes('emerald'))){
  //     WifiManager.connectToSSID(initialSSID);
  //   } else {
  //     WifiManager.disconnectFromSSID(ssid);
  //     Alert.alert("Manually disconnect from emerald wifi in your device Settings.")
  //   }
  // } else {
  //   WifiManager.disconnectFromSSID(ssid);
  //   Alert.alert("Manually disconnect from emerald wifi in your device Settings.")
  // }

  CookieManager.getAll().then((res)=>{
    let csrftoken = res['csrftoken']['value'];

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
        nav.navigate('RegisterHome', {
          data: text,
        });
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

export default Details;
