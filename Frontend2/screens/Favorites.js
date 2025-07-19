import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  ScrollView, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacity,
  Image 
} from 'react-native';
import axios from 'axios';
import ScreenName from '../components/screenName';
import useAudioPlayer from '../hooks/useAudioPlayer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../contexts/ThemeContext';
import Icon from '@react-native-vector-icons/fontawesome6';

const FavoritesScreen = ({ navigation }) => {
  const { colors } = useContext(ThemeContext);
  const [favorites, setFavorites] = useState([]);
  const { handlePlayPause, playingSongId } = useAudioPlayer();
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await axios.get(`http://192.168.17.122:3000/api/playlist/favorites/${userId}`);
      setFavorites(response.data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchFavorites);
    return unsubscribe;
  }, [navigation]);

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenName name='My Favourites'/>
      
      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.secondaryText }]}>
            No favorites yet
          </Text>
        </View>
      ) : (
        <ScrollView style={[styles.scrollView, { padding: 20 }]}>
          {favorites.map(song => (
            <View 
              key={song._id} 
              style={[styles.songCard, { 
                backgroundColor: colors.card,
                borderColor: colors.border 
              }]}
            >
              <Image 
                source={require('../assets/kids.jpg')} 
                style={styles.songImage} 
              />
              <View style={styles.songDetails}>
                <Text 
                  style={[styles.songTitle, { color: colors.text }]}
                  numberOfLines={1}
                >
                  {song.title}
                </Text>
                <Text 
                  style={[styles.songArtist, { color: colors.secondaryText }]}
                  numberOfLines={1}
                >
                  {song.artist}
                </Text>
                <View style={styles.controls}>
                  <Icon 
                    name="backward" 
                    size={20} 
                    color={colors.primary} 
                    iconStyle='solid' 
                  />
                  <TouchableOpacity onPress={() => handlePlayPause(song)}>
                    <Icon 
                      name={playingSongId === song._id ? 'pause' : 'play'} 
                      size={20} 
                      color={colors.primary} 
                      iconStyle='solid'
                    />
                  </TouchableOpacity>
                  <Icon 
                    name="forward" 
                    size={20} 
                    color={colors.primary} 
                    iconStyle='solid'
                  />
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  songCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  songImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  songDetails: {
    flex: 1,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  songArtist: {
    fontSize: 14,
    marginBottom: 8,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: 120,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontStyle: 'italic',
  },
});

export default FavoritesScreen;