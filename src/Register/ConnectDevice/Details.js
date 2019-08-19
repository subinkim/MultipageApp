import React from 'react';
import { Button, View, Text, StyleSheet, Dimensions, Alert } from 'react-native';

import WifiManager from 'react-native-wifi';
import { WebView } from 'react-native-webview';
import Wifi from 'react-native-iot-wifi';
import CookieManager from 'react-native-cookies';
import AsyncStorage from '@react-native-community/async-storage';

import {FetchURL} from '../../CustomClass/Fetch.js';
import {SERVER_KEY, CSRF_KEY} from '../../CustomClass/Storage.js';

const URI = 'http://wireless.devemerald.com';

class Details extends React.Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    const { params } = navigation.state;

    return {
      title: params ? params.ssid : 'Connect',
      // MARK: comment this if testing with virtual device
      headerRight: (
        <Button
          title="Done"
          onPress={() => {disconnectFromDevice(params.ssid, params.initialSSID, navigation);}}
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
      let fetchInstance = new FetchURL(server);
      this.setState({fetchInstance: fetchInstance});
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
          renderError={(error) => {<View><Text style={{fontSize: 17, color: 'red'}}>Error while loading page. Please try reloading by clicking on the button below. If it still doesn't work, please check your wifi connection and make sure your device is connected to Emerald device. Your device should be connected to 'emerald-XXXXXX' network.</Text><Text>Error details: {error}</Text></View>}}
          renderLoading={() => {}}
          startInLoadingState={true}
          onLoadEnd={() => {}}
          onLoadStart={() => {}}
          onLoadProgress={() => {}}
        />
        <Button
          title="Reload page"
          onPress={() => {WebViewRef && WebViewRef.reload();}}
        />
      </View>
    );
  }
}

function disconnectFromDevice(ssid, initialSSID, nav, fetch) {

  // MARK: comment out the whole if statement if testing with virtual device
  if (initialSSID != null){
    if (initialSSID !== 'Cannot detect SSID' && !(initialSSID.includes('emerald'))){
      WifiManager.connectToSSID(initialSSID);
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
    fetch(fetch.GetHomesURL, {
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
        fetch(fetch.GetTrialsURL, {
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
