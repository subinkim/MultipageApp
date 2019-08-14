import React from 'react';
import { Button, View, Text, StyleSheet, Alert, TouchableOpacity, ScrollView, FlatList } from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

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

  _renderItem = ({item, index}) => {
    if (!item['deregistered']){
      return(
        <TouchableOpacity onPress={() => {this.setState({selected:index, disabled: false})}} style={{alignItems: 'center'}}>
          <Text key={index} style={index===this.state.selected?styles.selected:styles.listItem}>{item.nickname}</Text>
        </TouchableOpacity>
      );
    } else {
      return null;
    }
  }

  render(){
    var data = this.props.navigation.getParam('data',null);
    var list = this.props.navigation.getParam('list', null);
    if (data != null){data = JSON.parse(data);data = data['data']}
    if (list != null){list = JSON.parse(list)}

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
      <View style={styles.container}>
        <View>
          <Text style={styles.instruction}>Add New Home</Text>
          <Button
            onPress={() => {this.props.navigation.navigate('AddHome', {
              list: JSON.stringify(list),
            })}}
            title="Add Home"
          />
          <Text style={styles.description}>Or</Text>
        </View>
        <View style={{flex:1}}>
          <Text style={styles.instruction}>Choose Home</Text>
          <Text style={styles.description}>Choose from existing home</Text>
          <ScrollView>
            {selectButton}
            <FlatList
              renderItem={this._renderItem}
              data={data}
              keyExtractor={(item, index) => index.toString()}
            />
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      margin: '5%',
      width: '90%',
      height: '90%',
    },
    instruction: {
      fontWeight: 'bold',
      fontSize: 23,
      marginBottom: 5,
    },
    description: {
      marginBottom: 10,
      fontSize: 15,
    },
    selected:{
      width: '100%',
      padding: 10,
      fontSize: 17,
      backgroundColor: 'grey',
      color: 'white',
      opacity: 0.8,
      marginBottom: 2,
    },
    listItem: {
      width: '100%',
      padding: 10,
      fontSize: 17,
      backgroundColor: 'grey',
      color: 'white',
      opacity: 0.5,
      marginBottom: 2,
    },
});

export default RegisterHome;
