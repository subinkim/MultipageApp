import {StyleSheet, Dimensions, Platform} from 'react-native';

const EMERALD_COLOUR1 = '#17AA9D';
const EMERALD_COLOUR2 = '#28B674';
const EMERALD_COLOUR3 = '#8CC641';

const {height, width} = Dimensions.get('window');

const homeStyles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 30,
    },
    instruction: {
      fontWeight: 'bold',
      fontSize: 23,
      marginBottom: 10,
      marginLeft: 10,
      marginRight: 10,
    },
    description: {
      fontSize: 15,
      marginLeft: 10,
      marginRight: 10,
    },
    wrapper:{
      marginTop: 10,
      width: '90%',
    },
    MenuStyle:{
      borderRadius: 15,
      width: width*0.9*0.4,
      height: width*0.9*0.4,
      paddingHorizontal: 20,
      paddingVertical: 20,
      marginLeft: width*0.9*0.1,
      marginBottom: width*0.9*0.1,
    },
    buttonText:{
      color: 'white',
      textAlignVertical: "center",
      textAlign: "center",
      fontSize: 17,
      fontWeight: 'bold'
    }
});


const loadStyles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 30,
      marginLeft: 10,
      marginRight: 10,
    },
    instruction: {
      fontWeight: 'bold',
      fontSize: 23,
      marginBottom: 20,
    },
    description: {
      top: 50,
      fontSize: 15,
    },
    item:{
      fontSize: 16,
      paddingTop:12,
    },
    swipeout:{
      backgroundColor: 'white',
      marginBottom: 5,
      paddingHorizontal: '3%',
      borderBottomWidth: 1.5,
      borderBottomColor: '#bcbcbc',
      borderRightWidth: 1,
      borderRightColor: '#bcbcbc',
    },
    modalWrapper:{
      backgroundColor: 'white',
      margin:0,
      borderRadius: 10,
      marginHorizontal: '5%',
      paddingTop: '5%',
      paddingHorizontal: '5%',
      flex: 0,
      height: '60%',
      top: '20%',
    },
    modalSubtitle:{
      fontSize: 12,
      color: EMERALD_COLOUR1,
      marginTop: 8,
      fontWeight: 'bold'
    },
    deviceSubtitle: {
      fontSize: 10,
      color: 'grey',
      marginTop: 3,
      fontWeight: 'bold'
    }
});

const editStyles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 30,
      marginLeft: 20,
      marginRight: 20,
    },
    instruction: {
      fontWeight: 'bold',
      fontSize: 23,
      marginBottom: 5,
    },
    description: {
      marginTop: 5,
      fontSize: 15,
    },
    descriptionSubtitle: {
      fontSize: 13,
      color: EMERALD_COLOUR1,
      fontWeight: 'bold',
      marginTop: 10,
    },
    deviceSubtitle: {
      fontSize: 12,
      color: 'grey',
      marginTop: 3,
      fontWeight: 'bold'
    },
    modalWrapper:{
      backgroundColor: 'white',
      margin:0,
      borderRadius: 10,
      marginHorizontal: '5%',
      paddingTop: '5%',
      paddingHorizontal: '5%',
      flex: 0,
      height: '60%',
      top: '20%',
    },
    modalSubtitle:{
      fontSize: 12,
      color: EMERALD_COLOUR1,
      marginVertical: 5,
      fontWeight: 'bold'
    }
});

const addHomeStyles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 30,
      marginLeft: 10,
      marginRight: 10,
    },
    instruction: {
      fontWeight: 'bold',
      fontSize: 23,
      marginBottom: 20,
    },
    description: {
      fontSize: 15,
    },
});
