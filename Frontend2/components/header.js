import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ThemeContext } from '../contexts/ThemeContext'; 

export default function Header() {
  const { colors, isDark } = useContext(ThemeContext);

  return (
    <View >
      <LinearGradient colors={[colors.primary, colors.primary]} style={{ paddingVertical: 23, height: 95, marginBottom: 20 }}>
        <Text style={{ fontSize: 25, fontWeight: 'bold', color: colors.text, textAlign: 'left', marginTop: 20, marginLeft: 20}}>
          <Text style={{ color: isDark ? '#2e2e2e': '#BB4768' }}>M</Text>ind
          <Text style={{ color: colors.text }}>
            <Text style={{ color: isDark ? '#2e2e2e': '#BB4768' }}>E</Text>
          </Text>
          ase
        </Text>
      </LinearGradient>
    </View>

);
}

