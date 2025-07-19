import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import FontAwesome6 from "@react-native-vector-icons/fontawesome6";
import AsyncStorage from '@react-native-async-storage/async-storage';

const LogIn = ({ navigation, onLoginSuccess }) => {
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('Navigation object:', navigation);
  }, [navigation]);

  const handleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://192.168.17.122:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem('userToken', data.token);
        await AsyncStorage.setItem('userFullName', data.fullName);
        await AsyncStorage.setItem('userChildName', data.childName);
        await AsyncStorage.setItem('userId', data.userid);
        await AsyncStorage.setItem('userEmail', data.email);
        onLoginSuccess();
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: "https://cdn-icons-png.flaticon.com/512/149/149071.png" }} style={styles.avatar} />
      <Text style={styles.title}>Sign in</Text>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.inputContainer}>
        <FontAwesome6 name="envelope" size={17} color="#4A73E8" style={styles.icon} />
        <TextInput
          placeholder="Enter Email"
          style={styles.input}
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputContainer}>
        <FontAwesome6 name="lock" size={17} color="#4A73E8" style={styles.icon} iconStyle="solid"/>
        <TextInput
          placeholder="Enter Password"
          secureTextEntry={!showPassword}
          style={styles.input}
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity 
          onPress={() => setShowPassword(!showPassword)} 
          style={styles.eyeIcon}
        >
          <FontAwesome6
            name={showPassword ? "eye-slash" : "eye"}
            size={17}
            color="#4A73E8"
          />
        </TouchableOpacity>
      </View>


      {/* <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
        <Text style={styles.forgotLink}>Forgot Password?</Text>
      </TouchableOpacity> */}

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Sign in'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
        <Text style={styles.signupLink}> Don’t have an account?{" "}
          <Text style={{ color: "#4A73E8", fontWeight: "bold" }}>Sign up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LogIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCECEC",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputContainer: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#fff",
  borderRadius: 10,
  paddingHorizontal: 15,
  marginBottom: 15,
  elevation: 3,
  width: "90%",
  height: 50,
},
icon: {
  marginRight: 10,
},
input: {
  flex: 1,
  fontSize: 16,
  paddingVertical: 10,
  color: '#333333'
},
eyeIcon: {
  padding: 10
},
  forgotLink: {
    color: '#4A73E8',
    alignSelf: 'flex-end',
    marginVertical: 8,
    marginRight: 10,
    fontWeight: '500',
  },  
  button: {
    backgroundColor: "#4A73E8",
    paddingVertical: 12,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  signupLink: {
    marginTop: 15,
    fontSize: 14,
    color: "#555",
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  }
});