import React, { useState, useContext } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import Header from '../components/header';
import Heading from "../components/heading";
import { ThemeContext } from '../contexts/ThemeContext';

const AboutUs = () => {
  const { colors, isDark } = useContext(ThemeContext);
  const [showAboutUsText, setShowAboutUsText] = useState(false);
  const [showOurPurposeText, setShowOurPurposeText] = useState(false);

  const toggleAboutUsText = () => {
    setShowAboutUsText(!showAboutUsText);
  };

  const toggleOurPurposeText = () => {
    setShowOurPurposeText(!showOurPurposeText);
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]} 
      contentContainerStyle={{ flexGrow: 1 }}
    >
      {/* Header */}
      <Header/>

      {/* Heading */}
      <Heading name='About Us'/>

      {/* Image */}
      <View style={[ styles.imageContainer, isDark && { backgroundColor: 'rgba(0,0,0,0.3)' }]}>
        <Image 
          source={require("../assets/background.png")}
          style={[
            styles.image,
            isDark && { opacity: 0.9 }
          ]}
        />
      </View>

      {/* About Us Section */}
      <View style={styles.section}>
        <Text style={[styles.title, { color: colors.primary }]}>About Us</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          {showAboutUsText
            ? "At MindEase, we are dedicated to improving the well-being of autistic children through smart wearable technology and music therapy. Our goal is to make their lives easier by providing solutions that can help them communicate, express emotions, and develop better social skills."
            : "At MindEase, we are dedicated to improving the well-being of autistic children..."}
        </Text>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: colors.primary }]} 
          onPress={toggleAboutUsText}
        >
          <Text style={styles.buttonText}>
            {showAboutUsText ? "Show less" : "Learn more"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Our Purpose Section */}
      <View style={styles.section}>
        <Text style={[styles.title, { color: colors.primary }]}>Our Purpose</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          {showOurPurposeText
            ? "Our purpose is to provide a smart and helpful solution that helps autistic children feel safe and supported. By combining the latest wearable technology with music therapy, we aim to improve their overall quality of life."
            : "Our purpose is to provide a smart and helpful solution that helps autistic children..."}
        </Text>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: colors.primary }]} 
          onPress={toggleOurPurposeText}
        >
          <Text style={styles.buttonText}>
            {showOurPurposeText ? "Show less" : "Learn more"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  imageContainer: {
    borderRadius: 10,
    overflow: 'hidden'
  },
  image: {
    width: '100%',
    height: 200
  },
  section: { 
    padding: 20 
  },
  title: { 
    fontSize: 22, 
    fontWeight: "bold", 
    marginBottom: 10 
  },
  text: { 
    fontSize: 16, 
    lineHeight: 22 
  },
  button: { 
    width: '40%', 
    padding: 7, 
    borderRadius: 5, 
    marginTop: 10, 
    alignItems: "center" 
  },
  buttonText: { 
    color: "#fff", 
    fontSize: 16 
  },
});

export default AboutUs;