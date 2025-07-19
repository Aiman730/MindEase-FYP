import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, StyleSheet, PermissionsAndroid, Platform } from 'react-native';
import Icon from '@react-native-vector-icons/fontawesome6';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Header from '../components/header';
import Heading from '../components/heading';
import useAudioPlayer from '../hooks/useAudioPlayer';
// import ProgressCircle from 'react-native-progress-circle';
// import useHeartRateBluetooth from '../hooks/BluetoothService'; 
import { useIsFocused } from '@react-navigation/native';
import { ThemeContext } from '../contexts/ThemeContext';

export default function Home({ navigation }) {
  const { colors } = useContext(ThemeContext);
  const [fullName, setFullName] = useState('');
  const [favoriteSongs, setFavoriteSongs] = useState([]);
  const { handlePlayPause, playingSongId } = useAudioPlayer();
  const isFocused = useIsFocused();
  // const bpm = useHeartRateBluetooth();

  

  useEffect(() => {
 const loadData = async () => {
      try {
        const name = await AsyncStorage.getItem('userFullName');
        if (name) setFullName(name);
        
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          const response = await axios.get(`http://192.168.17.122:3000/api/playlist/favorites/${userId}`);
          setFavoriteSongs(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch data', error);
      }
    };

  if (isFocused) {
    loadData();
  }
}, [isFocused]);





//   const requestBluetoothPermissions = async () => {
//   if (Platform.OS === 'android' && Platform.Version >= 31) {
//     try {
//       const granted = await PermissionsAndroid.requestMultiple([
//         PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
//         PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
//         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//       ]);

//       if (
//         granted['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
//         granted['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED &&
//         granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED
//       ) {
//         console.log('Bluetooth & Location permissions granted');
//         return true;
//       } else {
//         console.log('Bluetooth & Location permissions denied');
//         return false;
//       }
//     } catch (err) {
//       console.warn(err);
//       return false;
//     }
//   } else if (Platform.OS === 'android') {
//     // For Android 10 and 11
//     try {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//       );

//       return granted === PermissionsAndroid.RESULTS.GRANTED;
//     } catch (err) {
//       console.warn(err);
//       return false;
//     }
//   } else {
//     return true; // iOS handles it differently
//   }
// };



  const displayedFavorites = favoriteSongs.slice(0, 3);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header />
      <Heading name='Home' />

      <ScrollView style={[styles.scrollView, { padding: 20 }]}>
        {/* Stress Level Card */}
         <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.heading, { color: colors.text }]}>Stress Levels</Text>
          <Text style={{ color: colors.secondaryText }}>To be done in FYP-2</Text>
        </View> 

        {/* <View style={[styles.card, { backgroundColor: colors.card, alignItems: 'center' }]}>
        <Text style={[styles.heading, { color: colors.text }]}>Stress Levels</Text>
        {bpm !== null ? (
          <ProgressCircle
            percent={Math.min(bpm / 2, 100)} 
            radius={50}
            borderWidth={8}
            color="#3399FF"
            shadowColor="#e6e6e6"
            bgColor={colors.card}
          >
            <Text style={{ fontSize: 18, color: colors.text }}>{bpm} BPM</Text>
          </ProgressCircle>
        ) : (
          <Text style={{ color: colors.secondaryText, marginTop: 10 }}>
            Connecting to Heartbeat Sensor...
          </Text>
        )}
      </View> */}


        {/* Stress Alert & Notification */}
        <TouchableOpacity 
          style={[styles.alertBox, { backgroundColor: colors.alertBox }]}
          // onPress={() => navigation.navigate('StressAlerts')}
        >
          <Text style={[styles.alertBoxText, { color: colors.text }]}>
            Stress Alert & Notification
          </Text>
        </TouchableOpacity>

        {/* Favorites Section */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.heading, { color: colors.text }]}>Favorites</Text>
            {favoriteSongs.length > 3 && (
              <TouchableOpacity onPress={() => navigation.navigate('Favorites')}>
                <Text style={[styles.viewAll, { color: colors.primary }]}>View All</Text>
              </TouchableOpacity>
            )}
          </View>

          {displayedFavorites.length > 0 ? (
            displayedFavorites.map(song => (
              <View 
                key={song._id} 
                style={[
                  styles.songItem, 
                  { 
                    backgroundColor: colors.card,
                    borderColor: colors.border 
                  }
                ]}
              >
                <Text style={[styles.songTitle, { color: colors.text }]} numberOfLines={1}>
                  {song.title}
                </Text>
                <Text style={[styles.songArtist, { color: colors.secondaryText }]}>
                  {song.artist}
                </Text>
                <View style={styles.controls}>
                  <Icon 
                    name="backward" 
                    size={16} 
                    color={colors.primary} 
                    iconStyle='solid' 
                  />
                  <TouchableOpacity onPress={() => handlePlayPause(song)}>
                    <Icon 
                      name={playingSongId === song._id ? 'pause' : 'play'} 
                      size={16} 
                      color={colors.primary} 
                      iconStyle='solid'
                    />
                  </TouchableOpacity>
                  <Icon 
                    name="forward" 
                    size={16} 
                    color={colors.primary} 
                    iconStyle='solid'
                  />
                </View>
              </View>
            ))
          ) : (
            <Text style={[styles.emptyText, { color: colors.secondaryText }]}>
              No favorites yet
            </Text>
          )}
        </View>

        {/* Recently Played */}
        <TouchableOpacity 
          style={[styles.alertBox, { backgroundColor: colors.alertBox }]}
          // onPress={() => navigation.navigate('RecentlyPlayed')}
        >
          <Text style={[styles.alertBoxText, { color: colors.text }]}>
            Recently played
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
  scrollView: {
    flex: 1,
  },
  card: {
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '500',
  },
  songItem: {
    marginBottom: 12,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  songArtist: {
    fontSize: 14,
  },
  emptyText: {
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 10,
  },
  alertBox: {
    padding: 17,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  alertBoxText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: 100,
    marginTop: 8,
    padding: 10,
  },
});