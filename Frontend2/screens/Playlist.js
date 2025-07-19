import React, { useState, useEffect, useRef, useContext } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { PermissionsAndroid } from 'react-native';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
  TextInput,
} from 'react-native';
import Toast from 'react-native-toast-message';
import Icon from '@react-native-vector-icons/fontawesome6';
import Slider from '@react-native-community/slider';
import axios from 'axios';
import { Audio } from 'expo-av';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/header';
// import useAudioPlayer from '../hooks/useAudioPlayer';
import { ThemeContext } from '../contexts/ThemeContext';

const Playlist = ({ navigation }) => {
  const { colors } = useContext(ThemeContext);
  const [songs, setSongs] = useState([]);
  const [showDropdown, setShowDropdown] = useState(null);
  const soundRef = useRef(null);
  const [pickedSong, setPickedSong] = useState(null);
  const [editingSongId, setEditingSongId] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();
  const [playingSongId, setPlayingSongId] = useState(null);

  // Load favorites on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await fetchSongs();
        await loadFavorites();
        setLoading(false);
      } catch (error) {
        console.error('Initial load error:', error);
      }
    };

    if (isFocused) {
      loadData();
    }
  }, [isFocused]);
  


  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      const sdkVersion = Platform.constants?.Release || 0;
  
      // Android 13+ requires READ_MEDIA_AUDIO, older versions need READ_EXTERNAL_STORAGE
      const permission = parseInt(sdkVersion) >= 13
        ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO
        : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
  
      const granted = await PermissionsAndroid.request(permission, {
        title: 'Permission Required',
        message: 'App needs permission to access your audio files',
        buttonPositive: 'OK',
      });
  
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  


  const fetchSongs = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      console.log('Fetched userId:', userId);
      
      if (!userId) {
        Alert.alert('Error', 'User does not exist!');
        return;
      }
  
      const response = await axios.get(`http://192.168.17.122:3000/api/playlist/user/${userId}`);
    
      if (response.data && Array.isArray(response.data.songs)) {
        setSongs(response.data.songs);
      } 
      
      else {
        setSongs([]);
        // Alert.alert('Info', 'Your playlist is currently empty');
      }
    } 
    
    catch (error) {
      console.error('Error fetching songs:', error);
      if (error.response?.status !== 404) {
        Alert.alert('Error', 'Failed to load playlist');
      }
      setSongs([]);
    }
  };

  


  const addSongToBackend = async (song) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Error', 'User not logged in.');
        return;
      }

      const payload = {
        userId,
        title: song.title || 'Untitled',
        artist: song.artist || 'Unknown Artist',
        duration: song.duration || '0:00',
        fileUri: song.fileUri || 'N/A',
        image: song.image || null,
      };

      console.log(" Sending payload to backend:", payload);

      await axios.post('http://192.168.17.122:3000/api/playlist/add', payload);

      fetchSongs();
    } catch (error) {
      console.error(" Error adding song:", error);
      Alert.alert('Error', 'Failed to add song.');
    }
  };



  const openFilePicker = async () => {
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        Alert.alert('Permission Denied', 'Cannot access files without permission.');
        return;
      }
  
      if (songs.length >= 10) {
        return Alert.alert('Limit Reached', 'You can only upload up to 10 songs.');
      }
  
      const res = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true,
      });

      if (res.type === 'cancel') {
        console.log('User cancelled picker');
        return;
      }

      setPickedSong(res);
  
        // Extract the first asset (selected file)
        const selectedFile = res.assets[0];
        const sourceUri = selectedFile.uri;
        const fileName = selectedFile.name || `audio_${Date.now()}.mp3`;
        const destPath = `${FileSystem.documentDirectory}${fileName}`;
    
        await FileSystem.copyAsync({
          from: sourceUri,
          to: destPath,
        });
    
        const newSong = {
          id: Date.now(),
          title: fileName.replace(/\.[^/.]+$/, ''),
          artist: 'Unknown Artist',
          duration: '0:00',
          fileUri: destPath,
          image: require('../assets/kids.jpg'),
          isFavorite: false 
        };
    
        // Store the selected song with proper URI reference
        setPickedSong({
          ...selectedFile,
          uri: destPath, // Use the copied path for playback
        });
    
        await addSongToBackend(newSong);
        Alert.alert('Success', `${newSong.title} added to playlist!`);
      } catch (err) {
        console.error('Unexpected error:', err);
        Alert.alert('Error', err.message || 'Something went wrong while picking the file.');
      }
    };

    const handlePlayPause = async (song) => {
      try {
        // If trying to play a different song while one is playing
        if (soundRef.current && playingSongId !== song._id) {
          await soundRef.current.stopAsync();
          await soundRef.current.unloadAsync();
          soundRef.current = null;
        }
  
        // If this is the currently playing song
        if (soundRef.current && playingSongId === song._id) {
          const status = await soundRef.current.getStatusAsync();
          if (status.isPlaying) {
            await soundRef.current.pauseAsync();
            setPlayingSongId(null);
          } else {
            await soundRef.current.playAsync();
            setPlayingSongId(song._id);
          }
          return;
        }
  
        // If no song is playing or a new song is selected
        const { sound } = await Audio.Sound.createAsync(
          { uri: song.fileUri },
          { shouldPlay: true }
        );
  
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish) {
            setPlayingSongId(null);
            soundRef.current?.unloadAsync();
            soundRef.current = null;
          }
        });
  
        soundRef.current = sound;
        setPlayingSongId(song._id);
      } catch (error) {
        console.error('Playback error:', error);
        Alert.alert('Error', 'Failed to play song.');
      }
    };
  
    // Cleanup on unmount
    useEffect(() => {
      return () => {
        if (soundRef.current) {
          soundRef.current.unloadAsync();
        }
      };
    }, []);


  const deleteSongFromBackend = async (songId, userId) => {
    try {
      const url = `http://192.168.17.122:3000/api/playlist/delete/${songId}/${userId}`;
      const response = await axios.delete(url);
      Alert.alert('Deleted successfully');

      if (response.status === 200) {
        return true;
      }

      throw new Error('Failed to delete song');
    } catch (error) {
      console.error('Delete error:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        throw new Error(error.response?.data.message || 'An error occurred');
      }
      throw new Error('Network error or unknown issue occurred');
    }
  };


  
    // The function that triggers the delete action (e.g., from a button press)
  const confirmDeleteSong = (songId) => {
    Alert.alert(
      'Delete Song?',
      'Are you sure you want to delete this song?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes', onPress: () => handleRemoveSong(songId) } // Calls the actual delete logic
      ]
    );
  };

  // The actual delete function (kept as is)
  const handleRemoveSong = async (songId) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      // Stop playback if this is the currently playing song
      if (playingSongId === songId && soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
        setPlayingSongId(null);
      }

      const success = await deleteSongFromBackend(songId, userId);

      if (success) {
        setSongs((prev) => prev.filter((song) => song._id !== songId));
        setShowDropdown(null);
      } else {
        Alert.alert('Error', 'Failed to delete the song');
      }
    } catch (error) {
      console.error('Error while removing song:', error);
      Alert.alert('Error', error.message);
    }
  };

  const handleRenameSong = (songId, currentTitle) => {
    setEditingSongId(songId);
    setEditedTitle(currentTitle);
  };
  



  const handleSaveRename = async () => {
    const userId = await AsyncStorage.getItem('userId');

    try {
      console.log('hello');
      if (!userId) {
        throw new Error('User ID is undefined. Make sure it is available in the component.');
      }
      console.log('editingSongId:', editingSongId);
      console.log('editingSongId type:', typeof editingSongId);

      console.log('userId:', userId);  // Add this to confirm user is defined

      console.log('hy');
      // Assuming user is an object with id field
      
      const response = await fetch(`http://192.168.17.122:3000/api/playlist/song/${editingSongId}/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: editedTitle }),
      });
      const data = await response.json();
      console.log('Server response:', response.status, data);

      if (!response.ok) {
        throw new Error('Failed to update song');
      }
  
      // Update frontend state only if backend update succeeds
      const updatedSongs = songs.map(song =>
        song._id === editingSongId ? { ...song, title: editedTitle } : song
      );
      setSongs(updatedSongs);
  
      // Reset state
      setEditingSongId(null);
      setEditedTitle('');
    } catch (error) {
      console.error('Error updating song:', error.message);
    }
  };
  


  const handleCancelRename = () => {
    setEditingSongId(null);
    setEditedTitle('');
  };
  



  const loadFavorites = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await axios.get(`http://192.168.17.122:3000/api/playlist/favorites/${userId}`);
      // Update the songs state with favorite status
      setSongs(prevSongs => 
        prevSongs.map(song => ({
          ...song,
          isFavorite: response.data.some(fav => fav._id === song._id)
        }))
      );
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };
  

  const toggleFavorite = async (songId) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Error', 'Please login to save favorites');
        return;
      }
  
      const response = await axios.put(
        `http://192.168.17.122:3000/api/playlist/toggle-favorite/${songId}/${userId}`
      );
  
      if (response.data.success) {
        // Update local state
        setSongs(prevSongs => 
          prevSongs.map(song => 
            song._id === songId 
              ? { ...song, isFavorite: response.data.isFavorite } 
              : song
          )
        );
  
        // Show different alerts based on whether song was added or removed
        if (response.data.isFavorite) {
          Alert.alert('Success', 'Song added to Favourites');
        } else {
          Alert.alert('Success', 'Song removed from Favourites');
        }
      }
    } catch (error) {
      console.error('Toggle favorite error:', error);
      Alert.alert('Error', 'Failed to update favorite');
    }
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header />

      <Text style={[styles.playlistTitle, { color: colors.text }]}>
        Playlist <Icon name="music" size={24} color={colors.primary} iconStyle='solid'/>
      </Text>
      
      <TouchableOpacity 
        style={[styles.addButton, { backgroundColor: colors.card }]} 
        onPress={() => openFilePicker()}
      >
        <Icon name="circle-plus" size={35} color={colors.primary} iconStyle='solid'/>
      </TouchableOpacity>
      
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <ScrollView>
          {songs.length > 0 ? (
            songs.map((song) => (
              <View 
                key={song._id} 
                style={[
                  styles.songCard, 
                  { 
                    backgroundColor: colors.card,
                    borderColor: colors.border 
                  }
                ]}
              >
                <Image source={require('../assets/kids.jpg')} style={styles.songImage} />
                <View style={styles.songDetails}>
                  {editingSongId === song._id ? (
                    <>
                      <TextInput
                        style={[
                          styles.songTitle, 
                          { 
                            borderBottomWidth: 1, 
                            borderColor: colors.border, 
                            marginBottom: 4,
                            color: colors.text 
                          }
                        ]}
                        value={editedTitle}
                        onChangeText={setEditedTitle}
                      />
                      <View style={{ flexDirection: 'row', gap: 10 }}>
                        <TouchableOpacity onPress={handleSaveRename}>
                          <Text style={{ color: 'green' }}>Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleCancelRename}>
                          <Text style={{ color: 'red' }}>Cancel</Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  ) : (
                    <Text style={[styles.songTitle, { color: colors.text }]}>{song.title}</Text>
                  )}

                  <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={1}
                    value={0.3}
                    disabled
                    minimumTrackTintColor={colors.primary}
                    maximumTrackTintColor={colors.border}
                    thumbTintColor={colors.primary}
                  />
                  <View style={styles.controls}>
                    <Icon name="backward" size={20} color={colors.primary} iconStyle='solid' />
                    <TouchableOpacity onPress={() => handlePlayPause(song)}>
                      <Icon 
                        name={playingSongId === song._id ? 'pause' : 'play'} 
                        size={20} 
                        color={colors.primary} 
                        iconStyle='solid'
                      />
                    </TouchableOpacity>
                    <Icon name="forward" size={20} color={colors.primary} iconStyle='solid'/>
                  </View>
                </View>

                <TouchableOpacity 
                  onPress={() => toggleFavorite(song._id)}
                  style={styles.favoriteButton}
                >
                  <Icon 
                    name={song.isFavorite ? "heart-circle-check" : "heart"}
                    size={20}
                    color={song.isFavorite ? "red" : colors.secondaryText}
                    iconStyle='solid'
                  />
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={() => setShowDropdown(showDropdown === song._id ? null : song._id)}
                  style={styles.dropdownIcon}
                >
                  <Icon 
                    name="ellipsis-vertical" 
                    size={20} 
                    color={showDropdown === song._id ? colors.primary : colors.text} 
                    iconStyle='solid'
                  />
                </TouchableOpacity>

                {showDropdown === song._id && (
                  <View style={[
                    styles.dropdown, 
                    { 
                      backgroundColor: colors.card,
                      shadowColor: colors.text,
                      borderColor: colors.border
                    }
                  ]}>
                    <TouchableOpacity onPress={() => confirmDeleteSong(song._id)}>
                      <Text style={[styles.dropdownText, { color: colors.text }]}>Remove</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleRenameSong(song._id, song.title)}>
                      <Text style={[styles.dropdownText, { color: colors.text }]}>Rename</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))
          ) : (
            <View style={[styles.emptyContainer, { backgroundColor: colors.card }]}>
              <Icon name="music" size={40} color={colors.secondaryText} />
              <Text style={[styles.emptyText, { color: colors.secondaryText }]}>
                Your playlist is empty
              </Text>
              <TouchableOpacity 
                style={[styles.addButtonEmpty, { backgroundColor: colors.primary }]}
                onPress={openFilePicker}
              >
                <Text style={styles.addButtonText}>Add Your First Song</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  playlistTitle: {
    fontSize: 28,
    textAlign: 'center',
    marginVertical: 10,
    marginBottom: 30,
    fontWeight: 'bold'
  },
  songCard: {
    flexDirection: 'row',
    padding: 15,
    marginLeft: 18,
    marginRight: 28,
    marginVertical: 7,
    marginHorizontal: 10,
    borderRadius: 2,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1,
    position: 'relative'
  },
  songImage: { 
    width: 65, 
    height: 70, 
    borderRadius: 5, 
    marginRight: 15 
  },
  songDetails: { 
    flex: 1 
  },
  songTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2 
  },
  slider: { 
    width: '90%', 
    height: 35 
  },
  controls: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    width: '50%', 
    marginLeft: 45 
  },
  dropdownIcon: {
    padding: 10, 
    marginLeft: 10, 
    borderRadius: 20, 
    backgroundColor: 'transparent', 
  },
  dropdown: {
    position: 'absolute',
    right: 12,
    top: 73,
    padding: 12,
    borderRadius: 5,
    elevation: 5,
    zIndex: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderWidth: 1
  },
  dropdownText: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  addButton: {
    position: 'absolute',
    right: 35,
    borderRadius: 50,
    marginTop: 100,
    padding: 5,
    zIndex: 10
  },
  addButtonEmpty: {
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  favoriteButton: {
    position: 'absolute',
    right: 10,
    top: 5,
    padding: 8,
    zIndex: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    borderRadius: 10,
    margin: 20,
  },
  emptyText: {
    fontSize: 18,
    marginVertical: 10,
    textAlign: 'center',
  },
});

export default Playlist;