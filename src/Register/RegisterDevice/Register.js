import React from 'react';
import { Button, View, Text, Alert, Keyboard } from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import { basicStyles as styles } from '../styles';

import InputTextBox from '../../CustomClass/InputTextBox.js';
import {CSRF_KEY,DEVICE_UUID_KEY, SERVER_KEY} from '../../CustomClass/Storage.js';
import {FetchURL} from '../../CustomClass/Fetch.js';

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

      //Required for register
      home_uuid:null,
      device_uuid:null,
      height: 1.15,
      loc_nickname:null,
      fetchInstance: null,

      //Error message conditions
      deviceRegistered: false,
      completed: true,
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

  componentDidMount(){
    let nickname = this.props.navigation.getParam('nickname',null);
    let home_uuid = this.props.navigation.getParam('home_uuid', null);
    this.setState({
      nickname:nickname,
      home_uuid:home_uuid,
    });

    AsyncStorage.getItem(DEVICE_UUID_KEY).then((uuid)=>{
      this.setState({device_uuid: uuid});
    });
  }

  register(){

    let home_uuid = this.state.home_uuid;
    let loc_nickname = this.state.loc_nickname;
    let device_uuid = this.state.device_uuid;
    let height = this.state.height;

    if (home_uuid===null||loc_nickname===null||device_uuid===null||height===null){
      this.setState({completed: false});
    } else {

      let data = new FormData();
      data.append("home_uuid", home_uuid);
      data.append("nickname", loc_nickname);
      data.append("register_id", device_uuid);
      data.append("height", height);

      AsyncStorage.getItem(CSRF_KEY).then((csrftoken) => {

        fetch(this.state.fetchInstance.RegisterURL, {
          method: 'POST',
          mode: 'cors',
          headers: {
            Accept:'*/*',
            'Content-Type': 'multipart/form-data',
            referer: this.state.fetchInstance.MainURL+'/edit/'+this.state.home_uuid,
            'X-CSRFToken': csrftoken,
          },
          body: data,
          credentials: "include"
        }).then((response) => {
          //if register failed
          if (response['status'] ===500){
            this.setState({deviceRegistered: true});
            Alert.alert("Device already registered.");
          } else if (response['status'] === 200){ //if succeeded - returns deployment uuid
            Alert.alert("Successfully registered!");
            this.props.navigation.navigate('Home');
          }
        }).catch((error) => {
          console.log(error);
        });

      });
    }

  }

  render(){
    return(
      <View style={ styles.container }>

        {/*INSTRUCTIONS*/}
        <Text style={ styles.instruction }>Register deployment</Text>
        <Text style={{ fontSize: 15, marginTop: 5}}>Register deployment to {this.state.nickname}</Text>
        <Text style={{ marginBottom: 3 }}>HOME uuid:{this.state.home_uuid}</Text>
        <Text>Device uuid:{this.state.device_uuid}</Text>

        {/*ERROR MESSAGES depending on type of error*/}
        {this.state.completed?null:<Text style={{color:'red', fontSize: 15}}>Complete all the fields.</Text>}
        {this.state.deviceRegistered?<Text style={{color: 'red', fontSize: 17}}>"ERROR: This Device has already been registered."</Text>:null}

        {/*INPUT FIELDS*/}
        <Text style={{ marginTop: 5, fontWeight: 'bold' }}>Enter deployment location nickname</Text>
        <InputTextBox
          icon="locate"
          label="e.g. Living room"
          onChange={(loc) => this.setState({loc_nickname:loc})}
          keyboard="default"
          value={this.state.loc_nickname}
          returnKey="next"
          onEndEditing={Keyboard.dismiss}
          autoFocus={true}
        />
        <Text style={{ marginTop: 5, fontWeight: 'bold' }}>Enter deployment height</Text>
        <InputTextBox
          icon="create"
          label="e.g. 1.15"
          onChange={(height) => this.setState({height:height})}
          keyboard="numeric"
          value={this.state.height.toString()}
          returnKey="done"
          onEndEditing={Keyboard.dismiss}
        />
        <Button
          onPress={this.register.bind(this)}
          title="Register"
        />
        {this.state.deviceRegistered?<Button style={{marginTop: 10}} onPress={() => this.props.navigation.navigate('Home')} title="Cancel register?"/>:null}
      </View>
    );
  }
}

export default Register;
