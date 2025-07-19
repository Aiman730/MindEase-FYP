import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Please enter your email');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://192.168.17.122:3000/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', data.message);
        navigation.goBack();
      } else {
        Alert.alert('Error', data.message || 'Something went wrong');
      }
    } catch (err) {
      Alert.alert('Error', 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your registered email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TouchableOpacity style={styles.button} onPress={handleForgotPassword} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Sending...' : 'Send Reset Link'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      justifyContent: 'center',
      padding: 24,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#4A73E8',
      marginBottom: 30,
      alignSelf: 'center',
    },
    input: {
      height: 50,
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 10,
      paddingHorizontal: 15,
      fontSize: 16,
      marginBottom: 20,
      color: '#333',
    },
    button: {
      backgroundColor: '#4A73E8',
      paddingVertical: 14,
      borderRadius: 10,
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
  });
  
