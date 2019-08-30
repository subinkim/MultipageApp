import React, { Component } from 'react';
import { View, Text, Alert, SectionList, TouchableOpacity } from 'react-native';
import {Icon} from 'native-base';

import {CSRF_KEY,COOKIE_KEY, EMAIL_KEY} from '../CustomClass/Storage';
import {homeStyles as styles} from './styles';

import AsyncStorage from '@react-native-community/async-storage';

class Home extends Component {

  static navigationOptions = ({navigation, navigationOptions}) => {

    const { params } = navigation.state;

    return {
      title: 'Help',
    }
  };

  constructor(props){
    super(props);
    this.state={

    }
  }

  componentWillMount(){

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {

    return (
      <View style={ styles.container }>
        <Text style={ styles.instruction }>Help</Text>
      </View>
    );
  }
}

export default Home;
