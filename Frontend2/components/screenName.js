import React, {useContext} from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from '@react-native-vector-icons/fontawesome6';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../contexts/ThemeContext';

export default function ScreenName(props) {
  const navigation = useNavigation();
  const { colors, isDark } = useContext(ThemeContext);
  
  return (
    <View style={[styles.header, { 
      backgroundColor: colors.card, 
      borderBottomColor: colors.border 
    }]}>
      <TouchableOpacity 
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Icon name="arrow-left" size={20} color={colors.text} iconStyle="solid" />
        <Text style={[styles.backText, { color: colors.text }]}>{props.name}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    padding: 15,
    paddingTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    marginBottom: 40
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    marginLeft: 30,
    fontSize: 20,
  },
});