
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../constants/styles/OnboardingButton.styles';

interface Props {
  text: string;
  onPress: () => void;
  icon?: 'arrow' | 'location';
}

export const OnboardingButton: React.FC<Props> = ({ text, onPress, icon }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.inner}>
        {icon === 'arrow' && <Text style={styles.icon}>›</Text>}
        {icon === 'location' && <Text style={styles.icon}>🎯</Text>}
        <Text style={styles.text}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};


