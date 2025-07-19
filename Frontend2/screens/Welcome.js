import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const Welcome = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('LogIn');
    }, 4000); // 4 seconds

    return () => clearTimeout(timer); // cleanup
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/Logo-2.png')}
        style={styles.logo}
      />
      <Text style={styles.subtitle}>A stress management app for Autistic Children .</Text>
    </View>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCECEC",
    // justifyContent: 'center',
    alignItems: 'center',
  },

  logo: {
    width: '96%', 
    height: 230, 
    marginTop: 270,
    resizeMode: 'contain',
  },

  subtitle: {
    fontSize: 16,
    color: '#555',
  },
});
