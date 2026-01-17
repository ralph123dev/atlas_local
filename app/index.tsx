import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { OnboardingButton } from '../components/OnboardingButton';
import { OnboardingDots } from '../components/OnboardingDots';

export default function WelcomeScreen() {
  const navigation = useNavigation();
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logoBox}>
            <Image source={require('../assets/images/logo.png')} style={styles.logoImage} />
          </View>
        </View>

        <Text style={styles.title}>Bienvenue sur Atlas Local</Text>
        <Text style={styles.subtitle}>
          Découvrez les services et événements à proximité dans la région Ottawa-Gatineau
        </Text>
      </View>

      <View style={styles.footer}>
        <OnboardingDots total={3} current={0} />
        <View style={styles.buttonContainer}>
          <OnboardingButton 
            text="Commencer" 
            onPress={() => navigation.navigate('intro')} 
            icon="arrow"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  logoContainer: {
    marginBottom: 40,
  },
  logoBox: {
    width: 120,
    height: 120,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  logoText: {
    color: '#0057b7',
    fontWeight: '900',
    fontSize: 18,
    lineHeight: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingBottom: 40,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 30,
  },
});
