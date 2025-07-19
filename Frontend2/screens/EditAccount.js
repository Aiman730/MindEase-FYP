import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ActivityIndicator, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import ScreenName from '../components/screenName';
import { ThemeContext } from '../contexts/ThemeContext';
import { AuthContext } from '../App';

const EditAccountScreen = () => {
  const { colors } = useContext(ThemeContext);
  const { setIsAuthenticated } = useContext(AuthContext);
  const [fullName, setFullName] = useState('');
  const [childName, setChildName] = useState('');
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  const [editableFields, setEditableFields] = useState({
    fullName: false,
    childName: false,
    email: false
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      const storedFullName = await AsyncStorage.getItem('userFullName');
      const storedChildName = await AsyncStorage.getItem('userChildName');
      const storedEmail = await AsyncStorage.getItem('userEmail');
      const storedUserId = await AsyncStorage.getItem('userId');

      setFullName(storedFullName || '');
      setChildName(storedChildName || '');
      setEmail(storedEmail || '');
      setUserId(storedUserId || '');
    };

    fetchUserInfo();
  }, []);

  const toggleEditField = (fieldName) => {
    setEditableFields(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }));
  };

  const handleSaveChanges = async () => {
    try {
      setLoading(true);

      const response = await fetch('http://192.168.17.122:3000/api/settings/update-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userid: userId, fullName, childName, email }),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem('userFullName', fullName);
        await AsyncStorage.setItem('userChildName', childName);

        setEditableFields({
          fullName: false,
          childName: false,
        });

        Alert.alert('Success', 'Account updated successfully');
      } else {
        Alert.alert('Error', data.message || 'Failed to update account');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  
  const handleDeleteAccount = async () => {
    if (confirmEmail !== email) {
      Alert.alert('Error', 'Email does not match');
      return;
    }

    try {
      setDeleteLoading(true);
      
      const response = await fetch('http://192.168.17.122:3000/api/settings/delete-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userid: userId, email: confirmEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.clear();
        setIsAuthenticated(false);
        Alert.alert('Success', 'Account deleted successfully');
      } else {
        Alert.alert('Error', data.message || 'Failed to delete account');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setDeleteLoading(false);
      setDeleteModalVisible(false);
    }
  };

  return (
    <>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ScreenName name='Edit Profile (Account)'/>

        <View style={styles.container2}>
          {/* Profile Picture */}
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }}
            style={styles.avatar}
          />

          {/* email */}
          <Text style={[styles.useridText, { color: colors.secondaryText }]}>{email}</Text>

          {/* Full Name Field */}
          <View style={[styles.inputContainer, { borderBottomColor: colors.border }]}>
            <FontAwesome6 name="user" size={20} color={colors.primary} style={styles.icon} iconStyle='solid'/>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="Full Name"
              placeholderTextColor={colors.secondaryText}
              style={[styles.input, { color: colors.text }]}
              editable={editableFields.fullName}
            />
            <TouchableOpacity onPress={() => toggleEditField('fullName')}>
              <FontAwesome6 
                name={editableFields.fullName ? 'check' : 'pen-to-square'} 
                size={20} 
                color={colors.primary} 
                style={styles.editIcon} 
              />
            </TouchableOpacity>
          </View>

          {/* Child Name Field */}
          <View style={[styles.inputContainer, { borderBottomColor: colors.border }]}>
            <FontAwesome6 name="child" size={20} color={colors.primary} style={styles.icon} iconStyle='solid'/>
            <TextInput
              value={childName}
              onChangeText={setChildName}
              placeholder="Child Name"
              placeholderTextColor={colors.secondaryText}
              style={[styles.input, { color: colors.text }]}
              editable={editableFields.childName}
            />
            <TouchableOpacity onPress={() => toggleEditField('childName')}>
              <FontAwesome6 
                name={editableFields.childName ? 'check' : 'pen-to-square'} 
                size={20} 
                color={colors.primary} 
                style={styles.editIcon} 
              />
            </TouchableOpacity>
          </View>

          {/* Save Button */}
          {(editableFields.fullName || editableFields.childName) && (
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: colors.primary }]} 
              onPress={handleSaveChanges} 
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          )}

          {/* Delete Account Button */}
          <TouchableOpacity 
            style={[styles.deleteButton, { backgroundColor: colors.danger }]}
            onPress={() => setDeleteModalVisible(true)}
          >
            <FontAwesome6 name="trash-can" size={16} color="white" style={styles.deleteIcon} />
            <Text style={styles.deleteButtonText}>Delete Account</Text>
          </TouchableOpacity>
        </View>

        {/* Delete Account Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={deleteModalVisible}
          onRequestClose={() => setDeleteModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Delete Account</Text>
              <Text style={[styles.modalText, { color: colors.text }]}>
                This action cannot be undone. All your data will be permanently deleted.
              </Text>
              <Text style={[styles.modalText, { color: colors.text }]}>
                To confirm, please enter your email:
              </Text>
              <Text style={[styles.modalEmail, { color: colors.primary }]}>{email}</Text>
              
              <TextInput
                style={[styles.modalInput, { 
                  color: colors.text, 
                  borderColor: colors.border,
                  backgroundColor: colors.background 
                }]}
                placeholder="Enter your email"
                placeholderTextColor={colors.secondaryText}
                value={confirmEmail}
                onChangeText={setConfirmEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.modalButton, { backgroundColor: colors.border }]}
                  onPress={() => setDeleteModalVisible(false)}
                >
                  <Text style={[styles.modalButtonText, { color: colors.text }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.modalButton, { backgroundColor: colors.danger }]}
                  onPress={handleDeleteAccount}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={styles.modalButtonText}>Delete</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  container2: {
    padding: 20,
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    marginVertical: 20,
    borderRadius: 50,
  },
  useridText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    marginBottom: 15,
    borderBottomWidth: 1,
    paddingVertical: 5,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  editIcon: {
    marginLeft: 10,
  },
  button: {
    marginTop: 30,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  deleteIcon: {
    marginRight: 8,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '85%',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  modalEmail: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
  },
  modalInput: {
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default EditAccountScreen;