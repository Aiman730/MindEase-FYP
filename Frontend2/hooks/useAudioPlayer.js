import { useState, useRef, useEffect } from 'react';
import { Audio } from 'expo-av';
export default function useAudioPlayer() {
  const [playingSongId, setPlayingSongId] = useState(null);
  const soundRef = useRef(null);

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

  return { handlePlayPause, playingSongId, setPlayingSongId };
}