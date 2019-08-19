import React from 'react';
import { Button, View, Text, StyleSheet, Alert, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { Icon } from 'native-base';
import { Button as RNButton } from 'react-native-elements';

import { HeaderBackButton } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import Swipeout from 'react-native-swipeout';
import Modal from "react-native-modal";

import {CSRF_KEY, COOKIE_KEY, SERVER_KEY} from '../../CustomClass/Storage.js';
import {FetchURL} from '../../CustomClass/Fetch.js';

const EMERALD_COLOUR1 = '#17AA9D';
const EMERALD_COLOUR2 = '#28B674';
const EMERALD_COLOUR3 = '#8CC641';

class Load extends React.Component {

  static navigationOptions = ({navigation, navigationOptions}) => {

    return {
      title: 'Homes',
      headerRight: (
        <RNButton
          icon={<Icon name="add"/>}
          type="clear"
          onPress={() => {addHome(navigation)}}
        />
      )
    };
  }

  constructor(){
    super();
    this.state = {
      rowID: null,
      json: null,
      selectedItem: null,
      fetchInstance: null,
      updated: true,

      //Modal
      modalIsVisible: false,
      modalDevices: null,
      modalHomeUUID: null,
      modalNickname: null,
      modalTrialName: null,
    }
  }

  componentWillMount(){
    //Check the server - if none exists, set it to default servdr
    AsyncStorage.getItem(SERVER_KEY).then((server) => {
      if (server === null){
        server = 'www.devemerald.com';
        AsyncStorage.setItem(SERVER_KEY, server);
      }
      let fetchInstance = new FetchURL(server)
      this.setState({fetchInstance: fetchInstance});

      //GetHomes
      AsyncStorage.getItem(CSRF_KEY).then((csrftoken) => {
        fetch(fetchInstance.GetHomesURL, {
          credentials: "include",
          headers: {
            'X-CSRFToken': csrftoken,
            referer: 'https://www.devemerald.com/',
            Accept: '*/*',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          method: 'POST',
          mode: 'cors',
        }).then((response) => {
          return response.text().then((res) => {
            if (res != null){this.setState({json: JSON.parse(res)})}
          });
        });
      });

    });
  }

  componentWillUpdate(){
    AsyncStorage.getItem(CSRF_KEY).then((csrftoken) => {
      fetch(this.state.fetchInstance.GetHomesURL, {
        credentials: "include",
        headers: {
          'X-CSRFToken': csrftoken,
          referer: 'https://www.devemerald.com/',
          Accept: '*/*',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
        mode: 'cors',
      }).then((response) => {
        return response.text().then((res) => {
          if (res!=null){res = JSON.parse(res);this.setState({json: res});}
        });
      });
    });
  }

  toggleModal = () => {
    this.setState({ modalIsVisible: !this.state.modalIsVisible });
  };

  editItem = () => {
    this.props.navigation.navigate('Edit', {
      data: this.state.selectedItem,
    });
  }

  confirmDelete = () => {
    Alert.alert(
      'Deregister Home',
      'Are you sure you want to deregister '+this.state.selectedItem.nickname+'? You will be signed out automatically.',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => {this.deleteItem()},
        },
      ],
      {cancelable: false},
    );
  }

  deleteItem = () => {
    AsyncStorage.getItem(CSRF_KEY).then((csrftoken) => {
      fetch(this.state.fetchInstance.DeregisterHomeURL,{
        credentials: "include",
        headers:{
          'X-CSRFToken': csrftoken,
          referer: 'https://www.devemerald.com/trialsite/edit/'+this.state.selectedItem.uuid,
          Accept: '*/*',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'uuid='+this.state.selectedItem.uuid,
        method: 'POST',
        mode: 'cors'
      }).then((response) => {
        this.setState({updated: false});
      }).catch((error) => {
        console.log(error);
      })
    });

  }

  render(){

    var swipeoutBtns = [
      {
        text: 'Edit',
        type: 'primary',
        onPress: () => this.editItem(),
      },
      {
        text: 'Deregister',
        type: 'delete',
        onPress: () => this.confirmDelete(),
      }
    ]


    let items = null;
    if(this.state.json != null){
      items = this.state.json.data.map((item, i) => {

        if (!item['deregistered']){
          return (
            <Swipeout
              right={swipeoutBtns}
              key={i}
              style={styles.swipeout}
              autoClose={true}
              onOpen={(sectionID, rowID) => {
                this.setState({
                  rowID: rowID,
                  selectedItem: item,
                });
              }}
              >
              <TouchableOpacity onPress={() => {
                this.setState({
                  modalIsVisible: true,
                  modalDevices: item.devices,
                  modalHomeUUID: item.uuid,
                  modalNickname: item.nickname,
                  modalTrialName: item.trialname,
                })
              }}>
                <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                  <Icon name="home" style={{fontSize: 20, paddingVertical: 11, paddingRight: 7}}/>
                  <Text style={styles.item}>{item.nickname}</Text>
                </View>
              </TouchableOpacity>
            </Swipeout>
          );
        }

      });

    }

    return(
      <ScrollView style={styles.container}>
        <Text style={styles.instruction}>Manage Home</Text>

        <Modal
          isVisible={this.state.modalIsVisible}
          animationInTiming={400} animationOutTiming={400}
          backdropOpacity={0.5}
          style={ styles.modalWrapper }
          onBackdropPress={() => {this.setState({ modalIsVisible: !this.state.modalIsVisible })}}
        >

          <ScrollView style={{ flex: 1 }}>

            <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
              <Icon name="home" style={{fontSize: 23, marginRight: 5}}/>
              <Text style={{fontWeight: 'bold', fontSize: 20}}>{this.state.modalNickname}</Text>
            </View>

            <Text style={ styles.modalSubtitle }>Home uuid</Text>
            <Text>{this.state.modalHomeUUID}</Text>

            <Text style={ styles.modalSubtitle }>Trial</Text>
            <Text>{this.state.modalTrialName}</Text>

            <Text style={ styles.modalSubtitle }>Devices</Text>
            {this.state.modalDevices!==null?this.state.modalDevices.map((item, i) => {
              if (!item['deregistered']){
                return(
                  <View style={{marginBottom: 20}} key={i}>
                    <Text style={ styles.deviceSubtitle }>Deployment Location</Text>
                    <Text>{item.nickname}</Text>

                    <Text style={ styles.deviceSubtitle }>Deployment uuid</Text>
                    <Text>{item.uuid}</Text>

                    <Text style={ styles.deviceSubtitle }>Device uuid</Text>
                    <Text>{item.physical_device.uuid}</Text>
                  </View>
                );
              }
            }):null}

          </ScrollView>

        </Modal>

        { items }
      </ScrollView>
    );
  }
}

function addHome(navigation){
  AsyncStorage.getItem(SERVER_KEY).then((server) => {

    let fetchInstance = new FetchURL(server);

    AsyncStorage.getItem(CSRF_KEY).then((csrftoken) => {

      fetch(fetchInstance.GetTrialsURL, {
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
          navigation.navigate('AddHome', {
            list: txt,
          })
        })
      }).catch((error) => {
        console.log(error);
      });

    })


  })

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
      marginBottom: 20,
    },
    description: {
      top: 50,
      fontSize: 15,
    },
    item:{
      fontSize: 16,
      paddingVertical:12,
    },
    swipeout:{
      backgroundColor: 'white',
      borderColor: '#cecece',
      marginBottom: 2,
      borderTopWidth: 0.5,
      borderBottomWidth: 0.5
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
      marginTop: 8,
      fontWeight: 'bold'
    },
    deviceSubtitle: {
      fontSize: 10,
      color: 'grey',
      marginTop: 3,
      fontWeight: 'bold'
    }
});

export default Load;
