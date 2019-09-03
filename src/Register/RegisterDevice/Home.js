import React from 'react';
import { Button, View, Text, Alert, TouchableOpacity, ScrollView, FlatList } from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import Modal from 'react-native-modal';
import {registerStyles as styles} from '../styles'

const EMERALD_COLOUR1 = '#17AA9D';
const EMERALD_COLOUR2 = '#28B674';
const EMERALD_COLOUR3 = '#8CC641';

class RegisterHome extends React.Component {

  static navigationOptions = ({navigation, navigationOptions}) => {

    const { params } = navigation.state;

    return {
      title: 'Choose Home',
    }
  };

  constructor(){
    super();
    this.state = {
      selected: null,
      disabled: true,
    }
  }

  componentDidMount(){
    Alert.alert(
      'Register device to home',
      'Add your EMERALD device to existing home or create new home',
      [
        {
          text: 'Add Home',
          onPress: () => {this.props.navigation.navigate('AddHome', {list: this.props.navigation.getParam('list', null)})},
        },

        {
          text: 'Choose Home',
          onPress: () => {},
        },
      ],
      {cancelable: false},
    );
  }

  _renderItem = ({item, index}) => {
    if (!item['deregistered']){
      return(
        <TouchableOpacity
          onPress={() => {this.setState({selected:index, disabled: false})}}
          style={index===this.state.selected?styles.selected:styles.listItem}>
          <Text key={index} style={{textAlign: 'left', fontSize: 15}}>{item.nickname}</Text>
        </TouchableOpacity>
      );
    } else {
      return null;
    }
  }

  render(){
    var data = this.props.navigation.getParam('data',null);
    if (data != null){data = JSON.parse(data);data = data['data']}

    const selectButton = (<Button title="Select" disabled = {this.state.disabled} onPress={() => {
        let selectedData = data[this.state.selected];
        let nickname =  selectedData['nickname'];
        let home_uuid = selectedData['uuid'];
        this.props.navigation.navigate('Register', {
          nickname: nickname,
          home_uuid: home_uuid,
        })
      }}
    />);

    return(
      <View style={{flex:1}}>
        <View style={styles.container}>
          <Text style={styles.instruction}>Choose Home</Text>
          <Text style={styles.description}>Choose from existing home</Text>
          {selectButton}
        </View>
        <ScrollView style={{backgroundColor: '#bfbfbf', paddingHorizontal: 10, paddingVertical: 10, height: '90%' }}>
          <FlatList
            renderItem={this._renderItem}
            data={data}
            keyExtractor={(item, index) => index.toString()}
          />
        </ScrollView>
      </View>
    );
  }
}

export default RegisterHome;
