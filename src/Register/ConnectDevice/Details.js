import React from 'react';
import { Button, View, Text, StyleSheet, Dimensions, Alert } from 'react-native';

import WifiManager from 'react-native-wifi';
import { WebView } from 'react-native-webview';
import Wifi from 'react-native-iot-wifi';
import CookieManager from 'react-native-cookies';
import AsyncStorage from '@react-native-community/async-storage';

import {FetchURL} from '../../CustomClass/Fetch';
import {SERVER_KEY, CSRF_KEY} from '../../CustomClass/Storage';
import {basicStyles as styles} from '../styles';

const URI = 'http://wireless.devemerald.com';

let urls = [];

class Details extends React.Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    const { params } = navigation.state;

    return {
      title: params ? params.ssid : 'Connect',
      // MARK: comment this if testing with virtual device
      headerRight: (
        <Button
          title="Done"
          onPress={() => {disconnectFromDevice(params.ssid, params.initialSSID, navigation, urls);}}
        />
      ),
      //MARK: uncomment this if testing with virtual device
      // headerRight:(
      //   <Button
      //     title="Done"
      //     onPress={()=> {disconnectFromDevice('','',navigation, urls)}}
      //   />
      // ),
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
      this.setState({fetchInstance: new FetchURL(server)}, () => {urls.push(this.state.fetchInstance.GetHomesURL); urls.push(this.state.fetchInstance.GetTrialsURL)});

    });
  }

  render() {

    let {height, width} = Dimensions.get('window');

    let windowHeight = height * 0.8;
    let windowWidth = width * 0.9;

    let botMargin = height * 0.1;
    let horMargin = width * 0.05;
    let rightMargin = width * 0.05;

    return (
      <View style={{ flex: 1 }}>
        <WebView
          ref={WEBVIEW_REF => (WebViewRef = WEBVIEW_REF)}
          source={{ uri: URI }}
          style={{ width: windowWidth, height: windowHeight, flex: 1 , marginBottom: botMargin, marginHorizontal: horMargin }}
          renderError={(error) => {return(<Text style={{justifyContent: 'center', alignItems: 'center'}}>Error while loading page. Please try reloading by clicking on the button below. If it still doesn't work, please check your wifi connection and make sure your device is connected to Emerald device. Your device should be connected to 'emerald-XXXXXX' network.</Text>);}}
          renderLoading={() => {}}
          startInLoadingState={true}
          onLoadEnd={() => {}}
          onLoadStart={() => {}}
          onLoadProgress={() => {}}
        />
        <Button
          title="Reload page"
          onPress={() => {WebViewRef && WebViewRef.reload();}}
          style={{marginBottom: 10}}
        />
      </View>
    );
  }
}

function disconnectFromDevice(ssid, initialSSID, nav, urls) {

  // MARK: comment out the whole if statement if testing with virtual device
  if (initialSSID != null){
    if (initialSSID !== 'Cannot detect SSID' && !(initialSSID.includes('emerald'))){
      WifiManager.connectToSSID(initialSSID);
      console.log("This is called");
    } else {
      WifiManager.disconnectFromSSID(ssid);
      Alert.alert("Manually disconnect from emerald wifi in your device Settings.")
    }
  } else {
    WifiManager.disconnectFromSSID(ssid);
    Alert.alert("Manually disconnect from emerald wifi in your device Settings.")
  }

  AsyncStorage.getItem(CSRF_KEY).then((csrftoken)=>{

    //Get list of homes
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

        //Get Trial uuids
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
        });
        //END
      });
    });
    //END
  });
  //END
}

export default Details;
