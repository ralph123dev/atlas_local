
import React from 'react';
import { View, StyleSheet } from 'react-native';

interface Props {
  total: number;
  current: number;
}

export const OnboardingDots: React.FC<Props> = ({ total, current }) => {
  const dots = [];
  for (let i = 0; i < total; i++) {
    dots.push(
      <View 
        key={`dot-${i}`} 
        style={[
          styles.dot, 
          i === current ? styles.activeDot : styles.inactiveDot
        ]} 
      />
    );
  }

  return (
    <View style={styles.container}>
      {dots}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#0057b7',
    width: 20,
  },
  inactiveDot: {
    backgroundColor: '#e5e7eb',
  },
});


/**
 * @Project: Atlas Local
 * @Author: Ralph <ralphurgue@gmail.com>
 * @Date: 2026-01-12
 * @Last Modified: 2026-01-24
 * @Description: Application mobile d'exploration.
 */