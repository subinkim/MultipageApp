import React from 'react';
import { Image, View, Text, Dimensions } from 'react-native';

import {basicStyles as styles} from './styles';

class CNInfo extends React.Component {
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

export default CNInfo;
