import React from 'react';
import { Button, View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

import InputTextBox from '../../CustomClass/InputTextBox.js';
import {CSRF_KEY,DEVICE_UUID_KEY, RegisterURL, ModifyDeploymentURL} from '../../CustomClass/Storage.js';

//MARK: for test trials
const example_home_uuid = 'HOM-194da41f-6f80-4e0b-832f-b6ac7a5469c7';

class Register extends React.Component {

  static navigationOptions = ({navigation, navigationOptions}) => {

    const { params } = navigation.state;

    return {
      title: 'Register',
    }
  };

  constructor(props){
    super(props);
    this.state = {
      nickname:null,
      home_uuid:null,
      device_uuid:null,
      height: '1.15',
      loc_nickname:null,
    };
  }

  componentDidMount(){
    let nickname = this.props.navigation.getParam('nickname',null);
    let home_uuid = this.props.navigation.getParam('home_uuid', null);
    this.setState({
      nickname:nickname,
      home_uuid:home_uuid,
    });

    AsyncStorage.getItem(DEVICE_UUID_KEY).then((uuid)=>{
      uuid = 'EMR-31d2dc94-ceba-4a4d-8f25-bd5efda1cbb1';//For test purpose
      this.setState({device_uuid: uuid});
    });
  }

  register(){
    let data = new FormData();
    data.append("home_uuid", this.state.home_uuid);
    data.append("nickname", this.state.loc_nickname);
    data.append("register_id", this.state.device_uuid);

    AsyncStorage.getItem(CSRF_KEY).then((csrftoken) => {

      fetch(RegisterURL, {
        method: 'POST',
        mode: 'cors',
        headers: {
          Accept:'*/*',
          'Content-Type': 'multipart/form-data',
          referer: 'https://www.devemerald.com/trialsite/edit/'+this.state.home_uuid,
          'X-CSRFToken': csrftoken,
        },
        body: data,
        credentials: "include"
      }).catch((error) => {
        console.log(error);
      });

    });
  }

  render(){
    return(
      <View style={ styles.container }>
        <Text style={ styles.instruction }>Register deployment</Text>
        <Text style={ styles.description }>Register deployment to {this.state.nickname}</Text>
        <Text>{this.state.home_uuid}</Text>
        <InputTextBox
          icon="create"
          label="Deploy location name"
          onChange={(loc) => this.setState({loc_nickname:loc})}
          keyboard="default"
          value={this.state.loc_nickname}
          returnKey="next"
        />
        <InputTextBox
          icon="create"
          label="Device Height"
          onChange={(height) => this.setState({height:height.toString()})}
          keyboard="numeric"
          value={this.state.height}
          returnKey="done"
        />
        <Button
          onPress={this.register.bind(this)}
          title="Register"
        />
      </View>
    );
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
      marginTop: 20,
      fontSize: 15,
    },
});

export default Register;
