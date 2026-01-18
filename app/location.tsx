import React, { useContext } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NavigationContext } from '../App';
import LandLayerLocation from '../assets/images/land-layer-location.svg';
import MapMarker from '../assets/images/map-marker.svg';
import { OnboardingDots } from '../components/OnboardingDots';

export default function LocationScreen() {
  const router = useContext(NavigationContext);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.locationIconContainer}>
          <View style={styles.circle}>
             <MapMarker width={40} height={40} fill="#fff" />
          </View>
          <View style={styles.stem} />
        </View>

        <Text style={styles.title}>Localisation</Text>
        <Text style={styles.subtitle}>
          Autorisez l'accès à votre position pour découvrir les services près de chez vous
        </Text>
      </View>

      <View style={styles.footer}>
        <OnboardingDots total={3} current={2} />
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.customButton}
            onPress={() => alert('Localisation activée')}
          >
            <View style={styles.buttonInner}>
              <LandLayerLocation width={20} height={20} fill="#fff" />
              <Text style={styles.buttonText}>Activer la localisation</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => router.replace('/')}
          >
            <Text style={styles.secondaryButtonText}>Plus tard</Text>
          </TouchableOpacity>
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
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  locationIconContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  circle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ec4899',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  pin: {
    fontSize: 40,
  },
  stem: {
    width: 4,
    height: 30,
    backgroundColor: '#d1d5db',
    borderRadius: 2,
    marginTop: -2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
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
  customButton: {
    backgroundColor: '#0057b7',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
  secondaryButton: {
    alignItems: 'center',
    paddingVertical: 15,
    marginTop: 10,
  },
  secondaryButtonText: {
    color: '#0057b7',
    fontSize: 18,
    fontWeight: '600',
  },
});
