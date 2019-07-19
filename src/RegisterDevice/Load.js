import React from 'react';
import { Button, View, Text, StyleSheet, Alert, TouchableOpacity, FlatList, ScrollView } from 'react-native';

import { createStackNavigator, createAppContainer, HeaderBackButton } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import CookieManager from 'react-native-cookies';
import Swipeout from 'react-native-swipeout';

const CSRF_KEY = '@csrftoken';
const LogoutURL = 'https://www.devemerald.com/logout';

class Load extends React.Component {

  static navigationOptions = ({navigation, navigationOptions}) => {

    return {
      headerLeft:(
        <HeaderBackButton
          title="Back"
          onPress={() => {navigation.goBack()}}
        />
      )
    };
  }

  constructor(){
    super();
    this.state = {
      rowID: null,
      uuid: null,
    }
  }

  render(){
    const csrftoken = this.props.navigation.getParam('csrftoken',null);
    const response = this.props.navigation.getParam('response', null);

    let json = JSON.parse(response);

    var swipeoutBtns = [
      {
        text: 'Edit',
        type: 'primary',
        onPress: function(){editItem()},
      },
      {
        text: 'Delete',
        type: 'delete',
        onPress: function(){deleteItem()},
      }
    ]

    const items = json.data.map((item) => {
      return (
        <Swipeout
          right={swipeoutBtns}
          key={item.uuid}
          style={styles.swipeout}
          autoClose={true}
          onOpen={(sectionID, rowID) => {
            this.setState({
              rowID,
            })
          }}
          >
          <TouchableOpacity onPress={() => {}}>
            <View>
              <Text style={styles.item}>{item.nickname}</Text>
            </View>
          </TouchableOpacity>
        </Swipeout>
    )});

    return(
      <ScrollView style={styles.container}>
        <Button
          title="Sign out"
          onPress={()=> {signOut(csrftoken,this.props.navigation)}}
        />
        <Text style={styles.instruction}>Manage Home/Device</Text>
        { items }
      </ScrollView>
    );
  }
}

function signOut(csrftoken,nav){
  fetch(LogoutURL, {
    credentials:"include",
    headers: {
        'X-CSRFToken': csrftoken,
        referer: 'https://www.devemerald.com/',
        Accept: '*/*',
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    method:'GET',
    mode:'cors',
  });
  AsyncStorage.removeItem(CSRF_KEY);
  nav.navigate('Register',{
    cookieValid: false,
  })
}

function editItem(){
  console.log("EDIT");
}

function deleteItem(){
  console.log("DELETE");
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
    item:{
      fontSize: 18,
      padding:10,
    },
    swipeout:{
      backgroundColor: '#ffffff',
      borderColor: 'gray',
      borderWidth: 0.5,
      marginBottom: 2,
      borderRadius: 5,
    }
});

export default Load;
