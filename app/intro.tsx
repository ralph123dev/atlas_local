import { Package, Search, Star } from 'lucide-react-native';
import React, { useContext } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { OnboardingButton } from '../components/OnboardingButton';
import { OnboardingDots } from '../components/OnboardingDots';
import { NavigationContext } from './NavigationContext';

export default function IntroScreen() {
  const router = useContext(NavigationContext);

  return (
    <SafeAreaView style={styles.container}>
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

        <Text style={styles.title}>Simple et pratique</Text>
        <Text style={styles.subtitle}>
          Trouvez ce dont vous avez besoin en un coup d'œil sur la carte
        </Text>

        <View style={styles.featuresContainer}>
          <View style={styles.feature}>
            <View style={styles.featureIcon}>
              <Search size={24} color="#007bff" />
            </View>
            <Text style={styles.featureText}>Recherche instantanée</Text>
          </View>

          <View style={styles.feature}>
            <View style={styles.featureIcon}>
              <Package size={24} color="#28a745" />
            </View>
            <Text style={styles.featureText}>Services à proximité</Text>
          </View>

          <View style={styles.feature}>
            <View style={styles.featureIcon}>
              <Star size={24} color="#ffc107" />
            </View>
            <Text style={styles.featureText}>Enregistrez vos favoris</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    width: '100%',
  },
  header: {
    height: 50,
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  skipButton: {
    padding: 10,
    marginRight: 10,
    marginTop: 10,
  },
  skipText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 20,
  },
  imageContainer: {
    marginBottom: 30,
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapEmoji: {
    fontSize: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  featuresContainer: {
    width: '100%',
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  featureIcon: {
    width: 40,
    alignItems: 'center',
    marginRight: 15,
  },
  iconText: {
    fontSize: 24,
  },
  featureText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
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
