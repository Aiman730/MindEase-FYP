import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import ScreenName from "../components/screenName";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../App';
import { ThemeContext } from "../contexts/ThemeContext"; 
import { useNavigation } from '@react-navigation/native'
import Icon from '@react-native-vector-icons/fontawesome6';

const ChangePassword = () => {
  const { colors } = useContext(ThemeContext);
  const navigation = useNavigation();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setIsAuthenticated } = useContext(AuthContext);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const validatePassword = (password) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number';
    }
    if (!/[!@#$%^&*]/.test(password)) {
      return 'Password must contain at least one special character';
    }
    return null;
  };


  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'All fields are required');
      return;
    }
  
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }
  
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      Alert.alert('Error', passwordError);
      return;
    }
    
    setLoading(true);
  
    try {
      const userid = await AsyncStorage.getItem('userId'); 
      if (!userid) {
        Alert.alert('Error', 'User ID not found.');
        return;
      }
  
      const response = await fetch('http://192.168.17.122:3000/api/settings/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userid,
          currentPassword,
          newPassword,
        }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        Alert.alert('Success', 'Password changed successfully. Please login again.');

        // Clear AsyncStorage
        await AsyncStorage.clear();

        // Update AuthContext to logout user
        setIsAuthenticated(false);
      } else {
        Alert.alert('Error', result.message || 'Failed to change password');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again.');
      console.error('Password change error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <ScreenName name='Change Password' />

      <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.text }]}>Current Password</Text>
          <View style={[
            styles.passwordInputContainer, 
            { 
              backgroundColor: colors.card,
              borderColor: colors.border,
            }
          ]}>

        <TextInput
          placeholder="Enter Here"
          placeholderTextColor={colors.secondaryText}
          secureTextEntry={!showCurrentPassword}
          style={[styles.input, { color: colors.text, borderColor: colors.border }]}
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowCurrentPassword(!showCurrentPassword)}
        >
          <Icon
            name={showCurrentPassword ? "eye" : "eye-slash"}
            size={20}
            color={colors.secondaryText}
          />
        </TouchableOpacity>
      </View>
      </View>

      <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.text }]}>New Password</Text>
          <View style={[
            styles.passwordInputContainer, 
            { 
              backgroundColor: colors.card,
              borderColor: colors.border,
            }
          ]}>
        <TextInput
          placeholder="Enter Here"
          placeholderTextColor={colors.secondaryText}
          secureTextEntry={!showNewPassword}
          style={[styles.input, { color: colors.text, borderColor: colors.border }]}
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowNewPassword(!showNewPassword)}
        >
          <Icon
            name={showNewPassword ? "eye" : "eye-slash"}
            size={20}
            color={colors.secondaryText}
          />
        </TouchableOpacity>
      </View>
      </View>


      <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.text }]}>Confirm New Password</Text>
          <View style={[
            styles.passwordInputContainer, 
            { 
              backgroundColor: colors.card,
              borderColor: colors.border,
            }
          ]}>
          <TextInput
            placeholder="Enter Here"
            placeholderTextColor={colors.secondaryText}
            secureTextEntry={!showConfirmPassword}
            style={[styles.input, { color: colors.text, borderColor: colors.border }]}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Icon
              name={showConfirmPassword ? "eye" : "eye-slash"}
              size={20}
              color={colors.secondaryText}
            />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={handleChangePassword}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Updating...' : 'Change Password'}</Text>
      </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default ChangePassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
    paddingHorizontal: 20, // Add horizontal padding globally for better spacing
  },
  inputContainer: {
    marginTop: 15,
  },
  label: {
    marginBottom: 6,
    fontSize: 16,
    fontWeight: '600',
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 20,
    height: 50, // Standard input height
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 20,
    height: 50,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
    paddingRight: 40, // Leave space for the eye icon
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
  },
  button: {
    marginTop: 10,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

