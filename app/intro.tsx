
import { Package, Search, Star } from 'lucide-react-native';
import React, { useContext } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OnboardingButton } from '../components/OnboardingButton';
import { OnboardingDots } from '../components/OnboardingDots';
import { styles } from '../constants/styles/Intro.styles';
import { NavigationContext } from './NavigationContext';
import { ThemeContext } from './ThemeContext';

export default function IntroScreen() {
  const router = useContext(NavigationContext);
  const { theme } = useContext(ThemeContext);

  const isDark = theme === 'dark';

  const themeStyles = {
    container: { backgroundColor: isDark ? '#1a1a1a' : '#fff' },
    text: { color: isDark ? '#f3f4f6' : '#1a1a1a' },
    subText: { color: isDark ? '#9ca3af' : '#6b7280' },
  };

  return (
    <SafeAreaView style={[styles.container, themeStyles.container]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => router.push('/location')}
        >
          <Text style={styles.skipText}>Passer</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Text style={styles.mapEmoji}>🗺️</Text>
        </View>

        <Text style={[styles.title, themeStyles.text]}>Simple et pratique</Text>
        <Text style={[styles.subtitle, themeStyles.subText]}>
          Trouvez ce dont vous avez besoin en un coup d&apos;œil sur la carte
        </Text>

        <View style={styles.featuresContainer}>
          <View style={styles.feature}>
            <View style={styles.featureIcon}>
              <Search size={24} color="#007bff" />
            </View>
            <Text style={[styles.featureText, themeStyles.text]}>Recherche instantanée</Text>
          </View>

          <View style={styles.feature}>
            <View style={styles.featureIcon}>
              <Package size={24} color="#28a745" />
            </View>
            <Text style={[styles.featureText, themeStyles.text]}>Services à proximité</Text>
          </View>

          <View style={styles.feature}>
            <View style={styles.featureIcon}>
              <Star size={24} color="#ffc107" />
            </View>
            <Text style={[styles.featureText, themeStyles.text]}>Enregistrez vos favoris</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <OnboardingDots total={3} current={1} />
        <View style={styles.buttonContainer}>
          <OnboardingButton
            text="Suivant"
            onPress={() => router.push('/location')}
            icon="arrow"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}







