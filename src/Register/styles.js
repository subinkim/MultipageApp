import React from 'React';
import {StyleSheet, Dimensions} from 'react-native';

const EMERALD_COLOUR1 = '#17AA9D';
const EMERALD_COLOUR2 = '#28B674';
const EMERALD_COLOUR3 = '#8CC641';

const {height, width} = Dimensions.get('window');

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

export const scannerStyles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 30,
      marginLeft: 10,
      marginRight: 10,
    },
    instruction: {
      fontWeight: 'bold',
      fontSize: 23,
      marginBottom: 10,
    },
    description: {
      top: 50,
      fontSize: 15,
    },
});

export const instructionsStyles = StyleSheet.create({
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

export const connectionStyles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    instruction: {
      fontWeight: 'bold',
      fontSize: 23,
      marginBottom: 10,
    },
    description: {
      top: 50,
      fontSize: 15,
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
    header: {
      fontWeight: 'bold',
      fontSize: 15,
    },
    subheader: {
      fontWeight: 'bold',
      fontSize: 13,
      color: 'grey',
      marginTop: 5,
    },
    text: {
      fontSize: 12
    }
});

export const basicStyles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 30,
      marginLeft: 10,
      marginRight: 10,
    },
    instruction: {
      fontWeight: 'bold',
      fontSize: 23,
      marginBottom: 10,
    },
    description: {
      top: 50,
      fontSize: 15,
    },
});
