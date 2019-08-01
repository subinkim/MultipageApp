import React from 'react';
import { Button, Image, View, Text, StyleSheet, Dimensions, Alert, TouchableOpacity, ScrollView } from 'react-native';

import { createStackNavigator, createAppContainer } from 'react-navigation';
import WifiManager from 'react-native-wifi';
import { WebView } from 'react-native-webview';
import Wifi from 'react-native-iot-wifi';
import QRCodeScanner from 'react-native-qrcode-scanner';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import { ENTRIES1 } from './data/entries.js';

const SLIDER_1_FIRST_ITEM = 0;
const EMERALD_COLOUR1 = '#17AA9D';
const EMERALD_COLOUR2 = '#28B674';
const EMERALD_COLOUR3 = '#8CC641';

class Instructions extends React.Component {

  static navigationOptions = ({ navigation, navigationOptions }) => {
    const { params } = navigation.state;

    return {
      title: 'Install Device',
    };
  };

  constructor (props) {
    super(props);
    this.state = {
      sliderActiveSlide: SLIDER_1_FIRST_ITEM,
      lastPage: false,
    };
  }

  componentDidUpdate(){
    if (!this.state.lastPage && this.state.sliderActiveSlide === ENTRIES1.length-1){
      this.setState({lastPage:true});
    }
  }

  _renderItem ({item, index}) {
    const {height, width} = Dimensions.get('window');
    const maxWidth = width * 0.8;

    return (
      <View style={ styles.itemContainer }>
        <View style={ styles.itemTitleContainer }>
          <Text style={ styles.itemTitle }>{ item.title }</Text>
          <Text style={ styles.itemSubtitle }>{ item.subtitle }</Text>
        </View>
        <Image source={ item.illustration } style={{width: maxWidth, resizeMode: 'contain'}}/>
      </View>
    );
  }

  render() {

    const {height, width} = Dimensions.get('window');

    const doneButton = (
      <View>
        <Button
          title="Done"
          onPress={() => {this.props.navigation.navigate('ConnectHome')}}
        />
      </View>
    );

    return (
      <ScrollView style={ styles.container }>
        <Text style={ styles.instruction }>Install your device</Text>
        <Text style={ styles.description }>Swipe to the left for instructions</Text>
        <Pagination
          dotsLength={ENTRIES1.length}
          activeDotIndex={this.state.sliderActiveSlide}
          dotColor={EMERALD_COLOUR2}
          dotStyle={styles.paginationDot}
          inactiveDotColor={'black'}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
          carouselRef={this._carousel}
          tappableDots={!!this._carousel}
          containerStyle={ styles.paginationContainer }
        />
        <Carousel
          ref={(c) => { this._carousel = c; }}
          data={ENTRIES1}
          renderItem={this._renderItem}
          sliderWidth={width}
          itemWidth={width}
          sliderHeight={height*0.8}
          firstItem={SLIDER_1_FIRST_ITEM}
          inactiveSlideScale={0.94}
          inactiveSlideOpacity={0.7}
          contentContainerCustomStyle={styles.sliderContentContainer}
          layout={'default'}
          onSnapToItem={(index) => {this.setState({ sliderActiveSlide: index })}}
        />
        {this.state.lastPage?doneButton:null}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      top: 30,
    },
    instruction: {
      fontWeight: 'bold',
      fontSize: 23,
      bottom: 5,
      left: 20,
    },
    description: {
      fontSize: 15,
      bottom: 10,
      left: 20,
      top: 5,
    },
    paginationDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginHorizontal: 8,
    },
    itemTitle:{
      fontSize: 15,
      fontWeight: 'bold',
      color: 'white'
    },
    itemSubtitle:{
      fontSize: 13,
      color: 'white'
    },
    itemTitleContainer:{
      padding: 10,
      backgroundColor: EMERALD_COLOUR3,
      borderRadius: 5,
      width: '80%',
    },
    sliderContentContainer:{
      bottom: 10,
      top: 10,
    },
    itemContainer:{
      justifyContent: 'center',
      left: '10%',
    },
    paginationContainer:{
      alignItems:'center',
    },
});

export default Instructions;
