import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6'; 
import { useNavigation } from '@react-navigation/native';

export default function Footer() {
  const navigation = useNavigation();

  return (
    <View style={styles.footer}>
      <TouchableOpacity onPress={() => navigation.navigate('Playlist')}>
        <FontAwesome6 name="music" size={24} color="white" iconStyle="solid"/>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <FontAwesome6 name="house" size={24} color="white" iconStyle="solid" />
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
        <FontAwesome6 name="gear" size={24} color="white" iconStyle="solid"/>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: '#F8AFA6',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});