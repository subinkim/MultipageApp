import React from 'react';
import { Button, View, Text, StyleSheet, Alert, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import Modal from "react-native-modal";
import { Icon, Picker } from 'native-base';

import AsyncStorage from '@react-native-community/async-storage';

import {CSRF_KEY, COOKIE_KEY, SERVER_KEY} from '../../CustomClass/Storage.js';
import {FetchURL} from '../../CustomClass/Fetch.js';

const EMERALD_COLOUR1 = '#17AA9D';
const EMERALD_COLOUR2 = '#28B674';
const EMERALD_COLOUR3 = '#8CC641';

class Edit extends React.Component {

  static navigationOptions = ({navigation, navigationOptions}) => {

    return {
      title: "Edit",
      modalIsVisible: false,
    };
  }

  constructor(){
    super();
    this.state = {
      data: null,
      fetchInstance: null,
      availableDevices:null,
      selectedItem: null,

      //For making edits
      deviceID: null,
      height: 1.15,
      deployLoc: null,
      deployID: null,

      //text inputs
      isFocusedOne: false,
      isFocusedTwo: false,
    }
  }

  //Get server and data
  componentWillMount(){
    let data = this.props.navigation.getParam('data',null);
    this.setState({data:data});
    //Check the server - if none exists, set it to default servdr
    AsyncStorage.getItem(SERVER_KEY).then((server) => {
      let fetchInstance = new FetchURL(server);
      this.setState({fetchInstance: fetchInstance});
    });
  }

  //Get available physical devices
  componentDidMount(){
    AsyncStorage.getItem(CSRF_KEY).then((csrftoken) => {
      fetch(this.state.fetchInstance.GetPhysicalDevicesURL, {
        credentials:"include",
        headers: {
            'X-CSRFToken': csrftoken,
            referer: this.state.fetchInstance.MainURL+'/edit/'+this.state.data.uuid,
            Accept: '*/*',
            'Content-Type': 'application/json',
        },
        method:'POST',
        mode:'cors',
      }).then((response) => {
        return response.text().then((text) => {
          if (text != null){
            text = JSON.parse(text);
            this.setState({availableDevices: text['data']});
          }
        });
      });
    })
  }

  modalOnSubmit(){

    let deployID = this.state.deployID;
    let deviceID = this.state.deviceID;
    let deployLoc = this.state.deployLoc;
    let height = this.state.height;

    if (deviceID == null || deployLoc == null || height == null){
      Alert.alert("Please complete all fields.");
    } else {
      let data = new FormData();
      data.append('home_uuid', this.state.data.uuid);
      data.append('resource_uuid', deployID);
      data.append('modified_id', deviceID);
      data.append('nickname', deployLoc);
      data.append('height', height);

      AsyncStorage.getItem(CSRF_KEY).then((csrftoken) => {
        fetch(this.state.fetchInstance.ModifyDeploymentURL, {
          credentials: "include",
          headers: {
            'X-CSRFToken': csrftoken,
            referer: this.state.fetchInstance.MainURL+'/edit/'+this.state.data.uuid,
            Accept: '*/*',
            'Content-Type': 'application/json',
          },
          method:'POST',
          mode: 'cors',
          body: data,
        }).then((response) => {
          this.toggleModal();
          this.reloadData();
        }).catch((error) => {
          console.log(error);
        })
      });
    }

  }

  toggleModal = () => {
    this.setState({modalIsVisible: !this.state.modalIsVisible});
  }

  reloadData(){

    let data = new FormData();
    data.append('home_uuid', this.state.data.uuid);
    data.append('only_registered', true);

    AsyncStorage.getItem(CSRF_KEY).then((csrftoken) => {
      fetch(this.state.fetchInstance.GetHomeByUUIDURL, {
        credentials: "include",
        headers: {
          'X-CSRFToken': csrftoken,
          referer: this.state.fetchInstance.MainURL+'/edit/'+this.state.data.uuid,
          Accept: '*/*',
          'Content-Type': 'application/json',
        },
        method: 'POST',
        mode: 'cors',
        body: data,
      }).then((response) => {
        return response.text().then((text) => {
          text = JSON.parse(text);
          this.setState({data: text.data});
        });
      });
    });
  }

  render(){
    let deviceList = null;
    if (this.state.selectedItem != null){

      //Add currently selected device to the available devices array
      let availableDevices = this.state.availableDevices;
      let currentDeviceUUID = this.state.selectedItem.physical_device.uuid;
      if (!availableDevices.some(e => e.uuid == currentDeviceUUID)){
        availableDevices.push({"uuid":currentDeviceUUID});
      }
      if (this.state.availableDevices !== availableDevices){this.setState({availableDevices: availableDevices})}

      //Map available devices list to create picker item
      deviceList = this.state.availableDevices.map((item, i) => {
        //Current device marked with (Current) label
        if (i === this.state.availableDevices.length - 1){
          return (<Picker.Item label={item.uuid+ " (Current)"} value={item.uuid} key={i}/>);
        }
        return (<Picker.Item label={item.uuid} value={item.uuid} key={i}/>);
      });

    }
    let modal = null;
    //Modal for making edits
    if (this.state.deviceID != null){
      modal = (
        <Modal
          isVisible={this.state.modalIsVisible}
          animationInTiming={400} animationOutTiming={400}
          backdropOpacity={0.5}
          style={ styles.modalWrapper }
          onBackdropPress={() => {this.toggleModal()}}
        >
          <View style={{height: '100%'}}>
            <Text style={{ fontWeight: 'bold', marginBottom: 5, fontSize: 16 }}>Edit deployment</Text>

            <Text style={ styles.modalSubtitle }>Deployment uuid</Text>
            <Text style={ styles.description }>{this.state.deployID}</Text>

            <Text style={ styles.modalSubtitle }>Deployment Location</Text>
            <TextInput
              style={[{height: 20, borderBottomWidth: 1},this.state.isFocusedOne?{borderColor: EMERALD_COLOUR1}:{borderColor: 'grey'}]}
              onChangeText={(deployLoc) => this.setState({deployLoc})} value={this.state.deployLoc}
              onFocus={() => {this.setState({isFocusedOne: true})}} onBlur={() => {this.setState({isFocusedOne: false})}}
              placeholder="Deployment location nickname"
            />

            <Text style={ styles.modalSubtitle }>Device</Text>
            <Picker
              mode="dropdown" placeholder={this.state.deviceID} selectedValue = {this.state.deviceID}
              onValueChange = {(deviceID)=>this.setState({deviceID:deviceID})}
              textStyle={{maxWidth: '100%'}}
              style={{borderWidth: 1, borderRadius: 3, borderColor: 'grey', width: '100%'}}>
              {this.state.availableDevices!=null?deviceList:null}
            </Picker>

            <Text style={ styles.modalSubtitle }>Deployment height</Text>
            <TextInput
              style={[{height: 20, borderBottomWidth: 1},this.state.isFocusedTwo?{borderColor: EMERALD_COLOUR1}:{borderColor: 'grey'}]}
              onChangeText={(height) => this.setState({height})} value={this.state.height.toString()}
              onFocus={() => {this.setState({isFocusedTwo: true})}} onBlur={() => {this.setState({isFocusedTwo: false})}}
              placeholder="Enter deployment height" keyboardType="numeric"
            />
            <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'}}>
            <Button
              onPress={() => {this.toggleModal()}}
              title="Cancel"
            />
            <Button
              onPress={() => {this.modalOnSubmit()}}
              title="Done"
            />
            </View>
          </View>

        </Modal>
      );
    }

    let devices = null;
    if (this.state.data.devices != null){
      devices = this.state.data.devices.map((item, i) => {
        if (!item['deregistered']){
          return(
            <TouchableOpacity style={{marginBottom: 20}} key={i}
              onPress={() => this.setState({
                  modalIsVisible: !this.state.modalIsVisible,
                  deviceID: item.physical_device.uuid,
                  height: item.height,
                  deployLoc: item.nickname,
                  deployID: item.uuid,
                  selectedItem: item,
            })}>
              <View>
                <Text style={ styles.deviceSubtitle }>Deployment Location</Text>
                <Text>{item.nickname}</Text>

                <Text style={ styles.deviceSubtitle }>Deployment uuid</Text>
                <Text>{item.uuid}</Text>

                <Text style={ styles.deviceSubtitle }>Device uuid</Text>
                <Text>{item.physical_device.uuid}</Text>

                <Text style={ styles.deviceSubtitle }>Deployment Height</Text>
                <Text>{item.height}</Text>
              </View>
            </TouchableOpacity>
          );
        }
      });
    }

    return(
      <View style={ styles.container }>
        <Text style={ styles.instruction }>{this.state.data.nickname}</Text>

        <Text style={ styles.descriptionSubtitle }>Home uuid</Text>
        <Text style={ styles.description }>{this.state.data.uuid}</Text>

        <Text style={ styles.descriptionSubtitle }>Deployments</Text>
        {devices}

        {modal}
      </View>
    );
  }
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 30,
      marginLeft: 20,
      marginRight: 20,
    },
    instruction: {
      fontWeight: 'bold',
      fontSize: 23,
      marginBottom: 5,
    },
    description: {
      marginTop: 5,
      fontSize: 15,
    },
    descriptionSubtitle: {
      fontSize: 13,
      color: EMERALD_COLOUR1,
      fontWeight: 'bold',
      marginTop: 10,
    },
    deviceSubtitle: {
      fontSize: 12,
      color: 'grey',
      marginTop: 3,
      fontWeight: 'bold'
    },
    modalWrapper:{
      backgroundColor: 'white',
      margin:0,
      borderRadius: 10,
      marginHorizontal: '5%',
      paddingTop: '5%',
      paddingHorizontal: '5%',
      flex: 0,
      height: '60%',
      top: '20%',
    },
    modalSubtitle:{
      fontSize: 12,
      color: EMERALD_COLOUR1,
      marginVertical: 5,
      fontWeight: 'bold'
    }
});

export default Edit;
