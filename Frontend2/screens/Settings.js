import React, { useState, useContext } from "react";
import { 
  View, 
  Text, 
  Switch, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator,
  Linking
} from "react-native";
import Icon from "@react-native-vector-icons/fontawesome6"; 
import Header from "../components/header";
import Heading from "../components/heading";
import { ThemeContext } from "../contexts/ThemeContext";
import { AuthContext } from '../App'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Settings({ navigation }) {
  const { colors, isDark, toggleTheme } = useContext(ThemeContext);
  const { setIsAuthenticated } = useContext(AuthContext);
  const [notifications, setNotifications] = useState(true);
  const [automation, setAutomation] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await AsyncStorage.clear();
    setIsAuthenticated(false); 
    setIsLoggingOut(false);
  };

  const openHelpCenter = () => {
    Linking.openURL('https://reactnative.dev/');
  };

  const contactSupport = () => {
    Linking.openURL('https://reactnative.dev/community/support');
  };

  const sendFeedback = () => {
    // Replace with your actual feedback email
    Linking.openURL('https://reactnative.dev/');
  };


  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header/>
      <Heading name='Settings'/>

      <ScrollView style={styles.scrollContainer}>
        {/* Profile Section */}
        <Text style={[styles.sectionHeader, { color: colors.secondaryText }]}>
          ACCOUNT
        </Text>
        
        <TouchableOpacity 
          style={[styles.settingItem, { backgroundColor: colors.card }]}
          onPress={() => navigation.navigate('EditAccount')}
          activeOpacity={0.7}
        >
          <Icon name="user" size={20} color={colors.text} iconStyle="solid" />
          <Text style={[styles.settingText, { color: colors.text }]}>
            Edit Profile
          </Text>
          <Icon name="chevron-right" size={16} color={colors.secondaryText} iconStyle="solid"/>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.settingItem, { backgroundColor: colors.card }]}
          onPress={() => navigation.navigate('ChangePassword')}
          activeOpacity={0.7}
        >
          <Icon name="lock" size={20} color={colors.text} iconStyle="solid" />
          <Text style={[styles.settingText, { color: colors.text }]}>
            Change Password
          </Text>
          <Icon name="chevron-right" size={16} color={colors.secondaryText} iconStyle="solid"/>
        </TouchableOpacity>

        {/* Preferences Section */}
        <Text style={[styles.sectionHeader, { color: colors.secondaryText }]}>
          PREFERENCES
        </Text>
        
        <View style={[styles.settingItem, { backgroundColor: colors.card }]}>
          <Icon name="robot" size={20} color={colors.text} iconStyle="solid" />
          <Text style={[styles.settingText, { color: colors.text }]}>
            Enable Automation
          </Text>
          <Switch 
            value={automation} 
            onValueChange={setAutomation}
            trackColor={{ false: "#767577", true: colors.primary }}
            thumbColor={automation ? "#f5dd4b" : "#f4f3f4"}
          />
        </View>

        <View style={[styles.settingItem, { backgroundColor: colors.card }]}>
          <Icon name="bell" size={20} color={colors.text} iconStyle="solid" />
          <Text style={[styles.settingText, { color: colors.text }]}>
            Notifications
          </Text>
          <Switch 
            value={notifications} 
            onValueChange={setNotifications}
            trackColor={{ false: "#767577", true: colors.primary }}
            thumbColor={notifications ? "#f5dd4b" : "#f4f3f4"}
          />
        </View>

        <View style={[styles.settingItem, { backgroundColor: colors.card }]}>
          <Icon name="moon" size={20} color={colors.text} iconStyle="solid" />
          <Text style={[styles.settingText, { color: colors.text }]}>
            Dark Mode
          </Text>
          <Switch 
            value={isDark} 
            onValueChange={toggleTheme} 
            trackColor={{ false: "#767577", true: colors.primary }}
            thumbColor={isDark ? "#f5dd4b" : "#f4f3f4"}
          />
        </View>

        {/* Customer Support Section */}
        <Text style={[styles.sectionHeader, { color: colors.secondaryText }]}>
          CUSTOMER SUPPORT
        </Text>

        <TouchableOpacity 
          style={[styles.settingItem, { backgroundColor: colors.card }]}
          onPress={openHelpCenter}
          activeOpacity={0.7}
        >
          <Icon name="circle-question" size={20} color={colors.text} iconStyle="solid" />
          <Text style={[styles.settingText, { color: colors.text }]}>
            Help Center
          </Text>
          <Icon name="chevron-right" size={16} color={colors.secondaryText} iconStyle="solid"/>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.settingItem, { backgroundColor: colors.card }]}
          onPress={contactSupport}
          activeOpacity={0.7}
        >
          <Icon name="headset" size={20} color={colors.text} iconStyle="solid" />
          <Text style={[styles.settingText, { color: colors.text }]}>
            Contact Support
          </Text>
          <Icon name="chevron-right" size={16} color={colors.secondaryText} iconStyle="solid"/>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.settingItem, { backgroundColor: colors.card }]}
          onPress={sendFeedback}
          activeOpacity={0.7}
        >
          <Icon name="comment" size={20} color={colors.text} iconStyle="solid" />
          <Text style={[styles.settingText, { color: colors.text }]}>
            Send Feedback
          </Text>
          <Icon name="chevron-right" size={16} color={colors.secondaryText} iconStyle="solid"/>
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: colors.danger }]}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Icon name="right-from-bracket" size={18} color="white" iconStyle="solid" />
          <Text style={styles.logoutText}>
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 8,
    marginLeft: 4,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  settingText: {
    fontSize: 16,
    marginLeft: 14,
    flex: 1,
    fontWeight: "500",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 30,
    marginTop: 20,
  },
  logoutText: {
    fontSize: 16,
    color: "white",
    marginLeft: 12,
    fontWeight: "600",
  },
});