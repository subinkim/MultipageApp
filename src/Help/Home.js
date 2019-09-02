import React, { Component } from 'react';
import { View, Text, Alert, SectionList, TouchableOpacity, ScrollView } from 'react-native';
import {Icon} from 'native-base';

import {homeStyles as styles} from './styles';
import {data} from './data';
import {descriptions} from './descriptions';

import AsyncStorage from '@react-native-community/async-storage';
import Modal from 'react-native-modal';

class Home extends Component {

  static navigationOptions = ({navigation, navigationOptions}) => {

    return {
      title: 'Help',
    }
  };

  constructor(props){
    super(props);
    this.state={
      modalIsVisible: false,
      modalDescription: null,
      modalKeys: null,

      search: '',
    }
  }

  itemOnPress = (index, sectionIndex) => {
    let description = descriptions[sectionIndex][index];
    let keys = Object.keys(description);
    this.setState({modalDescription: description, modalKeys: keys}, this.toggleModal());
  }

  _renderItem = ({item, index, section}) => {
    return (
      <TouchableOpacity
        onPress={() => this.itemOnPress(index, section.index)}
        style={ styles.item }
      >
        <Text>{item}</Text>
      </TouchableOpacity>
    )
  }

  _renderSectionHeader = ({section}) => {
    return (
      <Text style={ styles.section }>{section.title}</Text>
    )
  }

  toggleModal = () => {
    this.setState({modalIsVisible: !this.state.modalIsVisible});
  }

  render() {

    return (
      <ScrollView style={ styles.container }>
        <Text style={ styles.instruction }>Help</Text>
        <Text style={{ marginBottom: 10 }}>Look up solutions to any technical issues that you have.</Text>
        
        <SectionList
           sections={data}
           renderItem={this._renderItem}
           renderSectionHeader={this._renderSectionHeader}
           keyExtractor={(item, index) => index}
         />
        <Modal
          isVisible={this.state.modalIsVisible}
          animationInTiming={400} animationOutTiming={400}
          backdropOpacity={0.5}
          style={ styles.modalWrapper }
          onBackdropPress={() => {this.toggleModal()}}
        >
          <ScrollView style={{height: '100%'}}>
          {this.state.modalKeys?
            this.state.modalKeys.map((item, i) => {
              if (item === 'title'){
                return (<Text style={ styles.modalTitle } key={i}>{this.state.modalDescription[item]}</Text>)
              } else if (item.includes('header')){
                return (<Text style={ styles.modalSubtitle } key={i}>{this.state.modalDescription[item]}</Text>)
              } else {
                return (<Text style={ styles.description } key={i}>{this.state.modalDescription[item]}</Text>)
              }
            })
           :null
          }
          </ScrollView>

        </Modal>
      </ScrollView>
    );
  }
}

export default Home;
