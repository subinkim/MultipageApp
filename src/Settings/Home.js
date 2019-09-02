import React, { Component } from 'react';
import { Button, View, Text, Alert, SectionList, TouchableOpacity } from 'react-native';
import {Icon} from 'native-base';

import {CSRF_KEY,COOKIE_KEY, EMAIL_KEY} from '../CustomClass/Storage';
import {homeStyles as styles} from './styles';

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

  signOut = () => {

    AsyncStorage.getItem(CSRF_KEY).then((csrftoken) => {
      fetch(this.state.fetchInstance.LogoutURL, {
        credentials:"include",
        headers: {
            'X-CSRFToken': csrftoken,
            referer: this.state.fetchInstance.MainURL+'/',
            Accept: '*/*',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        method:'GET',
        mode:'cors',
      });
      AsyncStorage.removeItem(CSRF_KEY);
    });
    AsyncStorage.setItem(COOKIE_KEY, 'false');
    AsyncStorage.removeItem(EMAIL_KEY);
    this.setState({cookieValid: false});

  }

  _renderSectionHeader = ({section: {title}}) => (
    <View style={styles.header}>
      <Text style={{fontWeight: 'bold'}}>{title}</Text>
    </View>
  )

  itemProps = [
    {
      onPress: [this.changeServer,this.signOut],
      icons: ["link","remove-circle"],
      iconColour: ["green", "red"]
    }
  ];

  _renderItem = ({item, index, section}) => {
    const onPressFunc = this.itemProps[section.index].onPress;
    const itemIcons = this.itemProps[section.index].icons;
    const itemColours = this.itemProps[section.index].iconColour;

    return (
      <TouchableOpacity onPress={onPressFunc[index]} style={styles.listItem}>
        <Icon active name={itemIcons[index]} style={{color: itemColours[index], fontSize: 25, marginRight: '2%'}}/>
        <Text key={index} style={styles.itemText}>{item}</Text>
      </TouchableOpacity>
    );
  }

  render() {

    const data = [
      {title: 'Manage Account', data: ['Change Server', 'Sign Out'], index: 0},
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

export default Home;
