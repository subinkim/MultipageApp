import React from 'react';
import { Button, Image, View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';

import Carousel, {Pagination} from 'react-native-snap-carousel';
import { ENTRIES1 } from './data/entries.js';
import { instructionsStyles as styles } from './styles';

const SLIDER_1_FIRST_ITEM = 0;
const EMERALD_COLOUR1 = '#17AA9D';
const EMERALD_COLOUR2 = '#28B674';
const EMERALD_COLOUR3 = '#8CC641';

class Instructions extends React.Component {

  static navigationOptions = ({ navigation, navigationOptions }) => {
    const { params } = navigation.state;

    return {
      title: 'Install Device',
      headerRight: (navigation.getParam('lastPage', false) ? <Button title="Done" onPress={() => {navigation.navigate('Connection')}}/> : null),
    };
  };

  constructor (props) {
    super(props);
    this.state = {
      sliderActiveSlide: SLIDER_1_FIRST_ITEM,
    };
  }

  componentDidUpdate(){
    let lastPage = this.props.navigation.getParam('lastPage', false);
    if (this.state.sliderActiveSlide === ENTRIES1.length-1 && !lastPage){
      this.props.navigation.setParams({lastPage: true});
    } else if (this.state.sliderActiveSlide !== ENTRIES1.length-1 && lastPage){
      this.props.navigation.setParams({lastPage: false});
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

    return (
      <ScrollView style={ styles.container } contentContainerStyle={{flexGrow:1}}>
        <Text style={ styles.instruction }>Install your device</Text>
        <Text style={ styles.description }>Swipe to the left for instructions</Text>
        <View style={{height: '80%'}}>
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
        </View>
      </ScrollView>
    );
  }
}

export default Instructions;
