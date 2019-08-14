import React from 'react';
import { Button, Image, View, Text, StyleSheet, Dimensions, Alert } from 'react-native';

import WifiManager from 'react-native-wifi';
import { WebView } from 'react-native-webview';
import Wifi from 'react-native-iot-wifi';
import CookieManager from 'react-native-cookies';
import AsyncStorage from '@react-native-community/async-storage';

import {FetchURL} from '../../CustomClass/Fetch.js';
import {SERVER_KEY} from '../../CustomClass/Storage.js';

const URI = 'http://wireless.devemerald.com';

let urls =[];

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
          onPress={()=> {disconnectFromDevice('','',navigation, urls)}}
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

  constructor(props){
    super(props);
    this.state = {
      fetchInstance: null,
    };
  }

  componentWillMount(){
    AsyncStorage.getItem(SERVER_KEY).then((server) => {
      if (server === null){
        server = 'www.devemerald.com';
        AsyncStorage.setItem(SERVER_KEY, server);
      }
      let fetchInstance = new FetchURL(server)
      this.setState({server: server, fetchInstance: fetchInstance});
    });
  }

  componentDidUpdate(){
    if (this.state.fetchInstance!=null){urls = [this.state.fetchInstance.GetHomesURL, this.state.fetchInstance.GetTrialsURL];}
  }

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

function disconnectFromDevice(ssid, initialSSID, nav, urls) {

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

    fetch(urls[0], {
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

        fetch(urls[1], {
          method: 'POST',
          mode: 'cors',
          headers: {
            Accept:'*/*',
            'Content-Type': 'application/x-www-form-urlencoded',
            referer: 'https://www.devemerald.com/',
            'X-CSRFToken': csrftoken,
          },
          credentials: "include"
        }).then((response) => {
          return response.text().then(function(txt){
            nav.navigate('RegisterHome', {
              data: text,
              list: txt,
            });
          })
        }).catch((error) => {
          console.log(error);
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
