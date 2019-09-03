import React from 'react';
import { Button, View, Text, StyleSheet, Alert, TouchableOpacity, FlatList, ScrollView, ActivityIndicator } from 'react-native';
import { Icon } from 'native-base';
import { Button as ElementsButton } from 'react-native-elements';

import AsyncStorage from '@react-native-community/async-storage';
import Swipeout from 'react-native-swipeout';
import Modal from 'react-native-modal';

import {CSRF_KEY, COOKIE_KEY, SERVER_KEY} from '../../CustomClass/Storage';
import {FetchURL} from '../../CustomClass/Fetch';
import {loadStyles as styles} from './styles';

class Load extends React.Component {

  _isMounted = false;

  static navigationOptions = ({navigation, navigationOptions}) => {

    return {
      title: 'Homes',
      headerRight: (
        <ElementsButton
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
      dataLoaded: false,

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
            referer: fetchInstance.MainURL+'/',
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

  componentDidMount(){
    this._isMounted = true;
  }

  componentWillUpdate(){
    AsyncStorage.getItem(CSRF_KEY).then((csrftoken) => {
      fetch(this.state.fetchInstance.GetHomesURL, {
        credentials: "include",
        headers: {
          'X-CSRFToken': csrftoken,
          referer: this.state.fetchInstance.MainURL+'/',
          Accept: '*/*',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
        mode: 'cors',
      }).then((response) => {
        return response.text().then((res) => {
          if (res!=null && this._isMounted){res = JSON.parse(res);this.setState({json: res, dataLoaded: true})}
        });
      });
    });
  }

  componentWillUnmount(){
    this._isMounted = false;
  }

  //If screen is still mounted, change modalIsVisible state
  toggleModal = () => {
    if (this._isMounted){this.setState({ modalIsVisible: !this.state.modalIsVisible })}
  };

  editItem = () => {
    this.props.navigation.navigate('Edit', {
      data: this.state.selectedItem,
    });
  }

  //User confirms delete
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
          referer: this.state.fetchInstance.MainURL+'/edit/'+this.state.selectedItem.uuid,
          Accept: '*/*',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'uuid='+this.state.selectedItem.uuid,
        method: 'POST',
        mode: 'cors'
      }).then((response) => {
        if (this._isMounted){this.setState({updated: false})}
      });
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
                if (this._isMounted){
                  this.setState({
                    rowID: rowID,
                    selectedItem: item,
                  });
                }
              }}
              >
              <TouchableOpacity onPress={() => {
                if (this._isMounted){
                  this.setState({
                    modalIsVisible: true,
                    modalDevices: item.devices,
                    modalHomeUUID: item.uuid,
                    modalNickname: item.nickname,
                    modalTrialName: item.trialname,
                  });
                }
              }}>
                <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                  <Icon name="home" style={{fontSize: 28, paddingVertical: 11, paddingRight: 7}}/>
                  <View>
                    <Text style={styles.item}>{item.nickname}</Text>
                    <Text style={{fontSize: 12, paddingBottom: 12}}>{item.trialname}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Swipeout>
          );
        }

      });

    }

    return(
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.instruction}>Manage Home</Text>

          <Modal
            isVisible={this.state.modalIsVisible}
            animationInTiming={400} animationOutTiming={400}
            backdropOpacity={0.5}
            style={ styles.modalWrapper }
            onBackdropPress={() => {this.toggleModal()}}
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
        </View>
        <View style={this.state.dataLoaded?{backgroundColor: '#dfdfdf', paddingHorizontal: 7, paddingVertical: 5}:{}}>
        { this.state.dataLoaded?items:
          <View>
            <ActivityIndicator size="large" color="red" animating={this.state.indicatorAnimating}/>
            <Text style={{textAlign: 'center', fontSize: 13}}>Getting homes...</Text>
          </View>
        }
        </View>
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
          referer: fetchInstance.MainURL+'/',
          'X-CSRFToken': csrftoken,
        },
        credentials: "include"
      }).then((response) => {
        return response.text().then(function(txt){
          navigation.navigate('MGAddHome', {
            list: txt,
          })
        })
      }).catch((error) => {
        console.log(error);
      });

    })


  })

}

export default Load;
