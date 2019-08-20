import React, { Component } from 'react';
import { Button, View, Text, StyleSheet, Alert, SectionList, TouchableOpacity } from 'react-native';
import {Icon} from 'native-base';
import { withNavigation } from "react-navigation";

import {CSRF_KEY,COOKIE_KEY, EMAIL_KEY} from '../CustomClass/Storage';

import AsyncStorage from '@react-native-community/async-storage';

class Home extends Component {

  static navigationOptions = ({navigation, navigationOptions}) => {

    const { params } = navigation.state;

    return {
      title: 'Settings',
    }
  };

  constructor(props){
    super(props);
    this.state={
      email: null,
    }
  }

  //TODO: find a way to reload so that email gets updated
  //(not updated when travelling from Settings Home -> Register Home -> Sign into account -> back to Settings Home)
  componentWillMount(){
    AsyncStorage.getItem(EMAIL_KEY).then((email) => {
      if (email != null){
        this.setState({email: email});
      }
    })
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("didFocus", () => {
      AsyncStorage.getItem(EMAIL_KEY).then((email) => {
        if (email != null){
          this.setState({email: email});
        }
      });
    });
  }

  componentWillUnmount() {
    // Remove the event listener
    this.focusListener.remove();
  }

  changeServer = () => {
    this.props.navigation.navigate('ChangeServer');
  }

  deleteCookies = () => {
    Alert.alert(
      'Delete Cookies',
      'Are you sure you want to delete cookies? You will be signed out automatically.',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Confirm', onPress: () =>
          {
            AsyncStorage.removeItem(CSRF_KEY);
            AsyncStorage.setItem(COOKIE_KEY,'false');
            AsyncStorage.removeItem(EMAIL_KEY);
            this.setState({email: null});
          }
        },
      ],
      {cancelable: false},
    );
  }

  _renderSectionHeader = ({section: {title}}) => (
    <View style={styles.header}>
      <Text style={{fontWeight: 'bold'}}>{title}</Text>
    </View>
  )

  _renderItem = ({item, index, section}) => {
    const onPressFunc = [this.changeServer,this.deleteCookies];
    const itemIcons = ["link","remove-circle"];
    const itemColours = ["green", "red"];
    return (
      <TouchableOpacity onPress={onPressFunc[index]} style={styles.listItem}>
        <Icon active name={itemIcons[index]} style={{color: itemColours[index], fontSize: 25, marginRight: '2%'}}/>
        <Text key={index} style={styles.itemText}>{item}</Text>
      </TouchableOpacity>
    );
  }

  render() {

    const data = [
      {title: 'Manage Account', data: ['Change Server', 'Delete Cookies']},
    ]

    return (
      <View style={ styles.container }>
        <Text style={ styles.instruction }>App Settings</Text>

        {/*Checking if the user is signed in*/}
        {this.state.email !== null?
          <View style={ styles.account }>
            <Icon active name="contact" style={{fontSize: 50, marginRight: '5%'}}/>
            <View>
              <Text>Your are signed in as:</Text>
              <Text style={{fontSize: 17}}>{this.state.email}</Text>
            </View>
          </View>
          :
          <TouchableOpacity onPress={() => {this.props.navigation.navigate('Register', {cookieValid: false})}}>
            <View style={ styles.account }>
              <Icon active name="contact" style={{fontSize: 50, marginRight: '5%'}}/>
                <Text style={{fontSize: 20}}>Sign in</Text>
            </View>
          </TouchableOpacity>
        }

        {/*Settings functionality*/}
        <SectionList
          scrollEnabled={false}
          renderItem={this._renderItem}
          renderSectionHeader={this._renderSectionHeader}
          sections={data}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
}



const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginHorizontal: 10,
      marginTop: 30,
    },
    instruction: {
      fontWeight: 'bold',
      fontSize: 25,
      marginBottom: 10,
    },
    header: {
      fontSize: 13,
    },
    account:{
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingVertical: 13,
      paddingHorizontal: 10,
      marginVertical: 10,
      backgroundColor: '#e6e6e6',
      borderRadius: 5,
    },
    listItem: {
      paddingVertical: 7,
      borderBottomWidth: 1,
      borderBottomColor: '#cfcfcf',
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
    },
    itemText:{
      fontSize: 17,
    }
});

export default Home;
