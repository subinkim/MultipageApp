import {StyleSheet} from 'react-native';

const EMERALD_COLOUR1 = '#17AA9D';
const EMERALD_COLOUR2 = '#28B674';
const EMERALD_COLOUR3 = '#8CC641';

//home.js
export const homeStyles = StyleSheet.create({
    container: {
      flex: 1,
      marginHorizontal: 10,
      marginTop: 30,
    },
    instruction: {
      fontWeight: 'bold',
      fontSize: 23,
      marginBottom: 10,
    },
    description: {
      fontSize: 15,
    },
    section:{
      fontWeight: 'bold',
      fontSize: 17,
      paddingVertical: 5,
      paddingHorizontal: 3,
      width: '100%',
      backgroundColor: 'grey',
      color: 'white'
    },
    item:{
      fontSize: 17,
      paddingVertical: 10,
      paddingHorizontal: 3,
      borderBottomWidth: 0.5,
      borderBottomColor: 'grey'
    },
    modalTitle: {
      fontWeight: 'bold',
      marginBottom: 5,
      fontSize: 16,
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
      fontSize: 14,
      color: EMERALD_COLOUR1,
      marginTop: 8,
      fontWeight: 'bold'
    },
});
