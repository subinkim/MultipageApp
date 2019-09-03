import React from 'React';
import {StyleSheet, Dimensions, Platform} from 'react-native';

const EMERALD_COLOUR1 = '#17AA9D';
const EMERALD_COLOUR2 = '#28B674';
const EMERALD_COLOUR3 = '#8CC641';

const {height, width} = Dimensions.get('window');

//Home.js
export const homeStyles = StyleSheet.create({
    background:{
      flex:1
    },
    container: {
      flex: 1,
      marginTop: 40,
    },
    instruction: {
      fontWeight: 'bold',
      fontSize: 23,
      marginBottom: 20,
      textAlign: 'center',
      marginTop: 20,
    },
    instructionMenu: {
      fontWeight: 'bold',
      fontSize: 30,
      marginBottom: 10,
      marginTop: 10,
      textAlign: 'center',
    },
    description: {
      fontSize: 15,
      marginLeft: 10,
      marginRight: 10,
    },
    descriptionMenu: {
      fontSize: 17,
      textAlign: 'center',
      textAlignVertical: 'center'
    },
    wrapper:{
      marginTop: 10,
      justifyContent: 'center',
      alignItems: 'center'
    },
    menuIcon:{
      textAlign: 'center',
      textAlignVertical: 'center',
      fontSize: 40,
    },
    MenuStyle:{
      backgroundColor: 'rgba(140,198,65,0.6)',
      marginBottom: 15,
      width: '80%',
      paddingVertical: '8%',
      borderRadius: 15,
      borderBottomWidth: 2,
      borderRightWidth: 2,
      borderBottomColor: '#a1a1a1',
      borderRightColor: '#a1a1a1'
    },
    buttonText:{
      textAlignVertical: "center",
      textAlign: "center",
      fontSize: 17,
    }
});

//Load.js
export const loadStyles = StyleSheet.create({
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

//Edit.js
export const editStyles = StyleSheet.create({
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

//AddHome.js
export const addHomeStyles = StyleSheet.create({
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
