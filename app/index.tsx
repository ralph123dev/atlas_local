
import React, { useContext } from 'react';
import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { OnboardingButton } from '../components/OnboardingButton';
import { OnboardingDots } from '../components/OnboardingDots';
import { NavigationContext } from './NavigationContext';
import { ThemeContext } from './ThemeContext';

export default function WelcomeScreen() {
  const router = useContext(NavigationContext);
  const { theme } = useContext(ThemeContext);

  const isDark = theme === 'dark';
  const isBlue = theme === 'blue';

  const themeStyles = {
    container: { backgroundColor: isDark ? '#1a1a1a' : isBlue ? '#15202b' : '#fff' },
    title: { color: isDark || isBlue ? '#f3f4f6' : '#1a1a1a' },
    subtitle: { color: isDark ? '#9ca3af' : isBlue ? '#8899a6' : '#6b7280' },
  };

  return (
    <SafeAreaView style={[styles.container, themeStyles.container]}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logoBox}>
            <Image source={require('@/assets/images/premier.png')} style={styles.logoImage} />
          </View>
        </View>

        <Text style={[styles.title, themeStyles.title]}>Ravie de vous rencontrer ici</Text>
        <Text style={[styles.subtitle, themeStyles.subtitle]}>
          Découvrez les services et événements à proximité dans la région Ottawa-Gatineau
        </Text>
      </View>

      <View style={styles.footer}>
        <OnboardingDots total={3} current={0} />
        <View style={styles.buttonContainer}>
          <OnboardingButton
            text="Commencer"
            onPress={() => router.push('/intro')}
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
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 120,
    height: 280,
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


