import React, { Component } from 'react';
import { ActivityIndicator, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

class ActivityIndicatorExample extends Component {
   state = { animating: false }



   render() {
     const { time, color } = this.props;

      return (
         <View style = {styles.container}>
            <ActivityIndicator
               animating = {animating}
               size = "large"
               style = {styles.activityIndicator}/>
         </View>
      )
   }
}

//TODO: find a way to use this function when the app finished loading
function closeActivityIndicator(t){
  setTimeout(() => this.setState({animating: false }), t)
}

export default ActivityIndicatorExample

const styles = StyleSheet.create ({
   container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 70
   },
   activityIndicator: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      height: 80,
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
   }
})
