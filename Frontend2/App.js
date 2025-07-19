/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

// import React from 'react';
// import Home from './screens/Home';
// import Settings from './screens/settings';
// import SignUpScreen from './screens/SignUp';
// const App = () => {
//   return (
//     // <Home />
//     // <Settings/>
//     <SignUpScreen/>
//   )
// };

// export default App

import React, { useState, useEffect, useContext, createContext } from 'react';
import {Platform} from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import Toast from 'react-native-toast-message';
import WelcomeScreen from './screens/Welcome';
import LogIn from './screens/LogIn';
import SignUpScreen from './screens/SignUp';
import HomeScreen from './screens/Home';
import ForgotPassword from './screens/ForgotPassword';
import AboutUsScreen from './screens/AboutUs';
import PlaylistScreen from './screens/Playlist';
import SettingsScreen from './screens/Settings';
import ChangePasswordScreen from './screens/ChangePassword';
import EditAccountScreen from './screens/EditAccount';
import StressAlerts from './screens/StressAlerts';
import RecentlyPlayed from './screens/RecentlyPlayed';
import FavoritesScreen from './screens/Favorites';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { ThemeContext } from './contexts/ThemeContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
export const AuthContext = createContext();


function TabNavigation() {
  const { colors, isDark } = useContext(ThemeContext);
  return (
    <Tab.Navigator
      initialRouteName='Home'
      screenOptions={{
        tabBarStyle: {
        backgroundColor: isDark ? colors.card : '#F8AFA6',
        height: 80,
        // paddingBottom: Platform.OS === 'android' ? 50 : 0, 
        paddingBottom: 50,
        borderTopColor: colors.border,
        borderTopWidth: isDark ? 1 : 0,
      },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 20,
          color: isDark ? colors.text : 'rgba(255,255,255,0.7)',
        },
        tabBarActiveTintColor: isDark ? colors.primary : 'white',
        tabBarInactiveTintColor: isDark ? colors.secondaryText : 'rgba(255,255,255,0.7)',
      }}
    >
      
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="house" size={24} color={color} iconStyle='solid'/>
          ),
          headerShown: false,
        }}
      />

      <Tab.Screen 
        name="Playlist" 
        component={PlaylistScreen} 
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="music" size={24} color={color} iconStyle='solid'/>
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="gear" size={24} color={color} iconStyle='solid'/>
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen 
        name="About Us" 
        component={AboutUsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="circle-info" size={24} color={color} iconStyle='solid'/>
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

// const toastConfig = {
//   success: ({ text1, props, ...rest }) => (
//     <View style={{ 
//       padding: 15, 
//       backgroundColor: 'green', 
//       borderRadius: 10,
//       marginHorizontal: 20,
//       maxWidth: '90%'
//     }}>
//       <Text style={{ 
//         color: 'white', 
//         fontSize: 18,  // Change this value for text size
//         fontWeight: 'bold' 
//       }}>
//         {text1}
//       </Text>
//       {props?.text2 && (
//         <Text style={{ 
//           color: 'white', 
//           fontSize: 16,  // Change this value for secondary text size
//           marginTop: 4 
//         }}>
//           {props.text2}
//         </Text>
//       )}
//     </View>
//   ),
//   // Add similar configurations for other types (error, info, etc.)
// };

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        setIsAuthenticated(true);
      }
    };
    checkLogin();
  }, []);


  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
              {isAuthenticated ? (
                <>
                  <Stack.Screen name="MainTabs" component={TabNavigation} />
                  <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
                  <Stack.Screen name="EditAccount" component={EditAccountScreen} />
                  <Stack.Screen name="RecentlyPlayed" component={RecentlyPlayed} />
                  <Stack.Screen name="Favorites" component={FavoritesScreen} />
                  <Stack.Screen name="StressAlerts" component={StressAlerts} />
                </>
              ) : (
                <>
                  <Stack.Screen name="Welcome" component={WelcomeScreen} />
                  <Stack.Screen name="LogIn">
                    {(props) => <LogIn {...props} onLoginSuccess={() => setIsAuthenticated(true)} />}
                  </Stack.Screen>
                  <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
                  <Stack.Screen name="SignUp" component={SignUpScreen} />
                </>
              )}
            </Stack.Navigator>
            {/* <Toast 
                config={toastConfig}
                position="bottom" 
                bottomOffset={80}
            /> */}
          </NavigationContainer>
        </AuthContext.Provider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}