import React , {useContext} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThemeContext } from '../contexts/ThemeContext';

const Heading = ( props ) => {
  const { colors, isDark } = useContext(ThemeContext);
  return (
    <View style={ styles.container }>
      <Text style={[styles.heading, { color: colors.text }]}>{props.name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 17,
    paddingHorizontal: 16,
    paddingTop: 20
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default Heading;