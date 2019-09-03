import React from 'react';
import { Button, View, Text, Dimensions, Alert } from 'react-native';

import { WebView } from 'react-native-webview';
import Wifi from 'react-native-iot-wifi';

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
      headerRight: (
        <Button
          title="Done"
          onPress={() => {disconnectFromDevice(params.ssid, params.initialSSID, navigation, urls);}}
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
          renderError={(error) => {return(<Text style={{marginBottom: '50%'}}>Error while loading page. Please reload the page. Error: {error}</Text>);}}
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

  if (initialSSID != null){
    if (initialSSID !== 'Cannot detect SSID' && !(initialSSID.includes('emerald'))){
      Wifi.connect(initialSSID, () => {});
    } else {
      Wifi.removeSSID(ssid, () => Alert.alert("Please manually reconnect to your home wifi in the Settings app."));
    }
  } else {
    Wifi.removeSSID(ssid, () => Alert.alert("Please manually reconnect to your home wifi in the Settings app."));
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

      });
    });

  });

}

export default Details;
