import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Switch, StyleSheet, Image, Alert, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import FontAwesome6 from "@react-native-vector-icons/fontawesome6";
import axios from 'axios';
import { Formik } from 'formik';
import * as Yup from 'yup';

const SignUpScreen = ({ navigation }) => {
  const [isNewMember, setIsNewMember] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required('Full Name is required'),
    childName: Yup.string().required('Child Name is required'),
    email: Yup.string().email('Invalid email address') .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Please enter a valid email (e.g., example@gmail.com)'
    ) .required('Email is required'),
    userid: Yup.string()
    .matches(
      /^(?=.*\d)(?!.*[^a-zA-Z0-9]).+$/,
      'User ID must contain at least one number and no special characters or emojis'
    )
    .required('User ID is required'),
  
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/\d/, 'Password must contain at least one number')
      .matches(/[@$!%*?&#]/, 'Password must contain at least one special character')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
    familyCode: Yup.string().when('isNewMember', {
      is: false,
      then: Yup.string().required('Family Code is required'),
    })
  });

  const handleSignUp = async (values) => {
    const role = isNewMember ? 'new' : 'family';

    try {
      const response = await axios.post('http://192.168.17.122:3000/api/register', {
        fullName: values.fullName,
        childName: values.childName,
        email: values.email,
        userid: values.userid,
        password: values.password,
        role,
        enteredCode: values.familyCode,
      });
      console.log('Server response:', response.data);

      if (response.data.familyCode) {
        setGeneratedCode(response.data.familyCode);
      }

      Alert.alert("Success", "User Registered Successfully");
      navigation.navigate('LogIn');
    } catch (err) {
      Alert.alert("Error", err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Image
            source={{ uri: "https://cdn-icons-png.flaticon.com/512/149/149071.png" }}
            style={styles.avatar}
          />
          <Text style={styles.title}>Sign up</Text>

          <Formik
            initialValues={{
              fullName: '',
              childName: '',
              email: '',
              userid: '',
              password: '',
              confirmPassword: '',
              familyCode: '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleSignUp}
            validateOnChange={true}  // Ensures validation runs on every keystroke
            validateOnBlur={true}    // Ensures validation also runs when input loses focus
          >
            {({
              values,
              handleChange,
              handleBlur,
              handleSubmit,
              touched,
              errors,
            }) => (
              <>
                <View style={styles.inputContainer}>
                  <FontAwesome6 name="user" size={17} color="#4A73E8" style={styles.icon} />
                  <TextInput
                    placeholder="Full Name"
                    style={styles.input}
                    placeholderTextColor="#888"
                    value={values.fullName}
                    onChangeText={handleChange('fullName')}
                    onBlur={handleBlur('fullName')}
                  />
                </View>
                {touched.fullName && errors.fullName && (
                  <Text style={styles.errorText}>{errors.fullName}</Text>
                )}

                <View style={styles.inputContainer}>
                  <FontAwesome6 name="child" size={17} color="#4A73E8" iconStyle="solid" style={styles.icon} />
                  <TextInput
                    placeholder="Child Name"
                    style={styles.input}
                    placeholderTextColor="#888"
                    value={values.childName}
                    onChangeText={handleChange('childName')}
                    onBlur={handleBlur('childName')}
                  />
                </View>
                {touched.childName && errors.childName && (
                  <Text style={styles.errorText}>{errors.childName}</Text>
                )}

                <View style={styles.inputContainer}>
                  <FontAwesome6 name="envelope" size={17} color="#4A73E8" style={styles.icon} />
                  <TextInput
                    placeholder="Email"
                    style={styles.input}
                    placeholderTextColor="#888"
                    keyboardType="email-address"
                    value={values.email}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                  />
                </View>
                {touched.email && errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}

                <View style={styles.inputContainer}>
                  <FontAwesome6 name="id-card" size={17} color="#4A73E8" style={styles.icon} />
                  <TextInput
                    placeholder="UserId e.g User1234"
                    style={styles.input}
                    placeholderTextColor="#888"
                    value={values.userid} 
                    onChangeText={handleChange('userid')}
                    onBlur={handleBlur('userid')}
                  />
                </View>
                {touched.userid && errors.userid && (
                  <Text style={styles.errorText}>{errors.userid}</Text>
                )}

                <View style={styles.inputContainer}>
                  <FontAwesome6 name="lock" size={17} color="#4A73E8" style={styles.icon} iconStyle="solid"/>
                  <TextInput
                    placeholder="Password"
                    secureTextEntry={!showPassword}
                    style={styles.input}
                    placeholderTextColor="#888"
                    value={values.password}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <FontAwesome6
                      name={showPassword ? "eye-slash" : "eye"}
                      size={17}
                      color="#4A73E8"
                      style={{ marginLeft: 10 }}
                    />
                  </TouchableOpacity>
                </View>

                {touched.password && errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}



                <View style={styles.inputContainer}>
                  <FontAwesome6 name="lock" size={17} color="#4A73E8" style={styles.icon} iconStyle="solid"/>
                  <TextInput
                    placeholder="Confirm Password"
                    secureTextEntry={!showConfirmPassword}
                    style={styles.input}
                    placeholderTextColor="#888"
                    value={values.confirmPassword}
                    onChangeText={handleChange('confirmPassword')}
                    onBlur={handleBlur('confirmPassword')}
                  />
                  <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <FontAwesome6
                      name={showConfirmPassword ? "eye-slash" : "eye"}
                      size={17}
                      color="#4A73E8"
                      style={{ marginLeft: 10 }}
                    />
                  </TouchableOpacity>
                </View>

                {touched.confirmPassword && errors.confirmPassword && (
                  <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                )}

                <View style={styles.switchContainer}>
                  <Text style={styles.label}>New member</Text>
                  <Switch value={isNewMember} onValueChange={setIsNewMember} />
                </View>

                {!isNewMember && (
                  <View style={styles.inputContainer}>
                    <FontAwesome6 name="key" size={17} color="#4A73E8" style={styles.icon} iconStyle="solid"/>
                    <TextInput
                      placeholder="Enter Family Code"
                      style={styles.input}
                      placeholderTextColor="#888"
                      value={values.familyCode}
                      onChangeText={handleChange('familyCode')}
                      onBlur={handleBlur('familyCode')}
                    />
                  </View>
                )}
                {touched.familyCode && errors.familyCode && (
                  <Text style={styles.errorText}>{errors.familyCode}</Text>
                )}

                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Sign up</Text>
                </TouchableOpacity>

                {generatedCode !== '' && (
                  <Text style={{ marginTop: 10, fontSize: 16, fontWeight: 'bold', color: '#4A73E8' }}>
                    Your Family Code: {generatedCode}
                  </Text>
                )}

                <TouchableOpacity onPress={() => navigation.navigate("LogIn")}>
                  <Text style={styles.loginLink}>
                    Already have an account? <Text style={{ color: "#4A73E8", fontWeight: "bold" }}>Login</Text>
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </Formik>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    paddingVertical: 80,
    alignItems: "center",
    backgroundColor: "#FCECEC",
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    width: "100%",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    fontStyle: "italic",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 3,
    marginLeft: 20,
    marginBottom: 15,
    elevation: 3,
    width: 270,
    marginLeft: -30,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 5,
    height: 45,
    fontSize: 15,
     color: '#333333'
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 18
  },
  label: {
    fontSize: 16.5,
    marginRight: 10,
    fontWeight: "bold",
    fontStyle: "italic",
    marginLeft: -110,
  },
  button: {
    backgroundColor: "#4A73E8",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginLink: {
    marginTop: 15,
    fontSize: 14,
    color: "#555",
  },
  errorText: {
    color: 'red',
    fontSize: 13,
    fontWeight: 550,
    marginBottom: 15,
    alignSelf: 'flex-start',
    marginLeft: 34, // or match the padding of inputContainer   
  }
});