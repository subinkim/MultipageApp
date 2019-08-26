import {StyleSheet} from 'react-native';

export const homeStyles = StyleSheet.create({
    container: {
      flex: 1,
      marginHorizontal: 10,
      marginTop: 30,
    },
    instruction: {
      fontWeight: 'bold',
      fontSize: 25,
      marginBottom: 10,
    },
    header: {
      fontSize: 13,
    },
    account:{
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingVertical: 13,
      paddingHorizontal: 10,
      marginVertical: 10,
      backgroundColor: '#e6e6e6',
      borderRadius: 5,
    },
    listItem: {
      paddingVertical: 7,
      borderBottomWidth: 1,
      borderBottomColor: '#cfcfcf',
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
    },
    itemText:{
      fontSize: 17,
    }
});

export const serverStyles = StyleSheet.create({
    container: {
      flex: 1,
      marginHorizontal: '5%',
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
    header: {
      fontSize: 13,
    },

});
