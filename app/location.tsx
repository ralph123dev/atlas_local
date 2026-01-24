import * as Location from 'expo-location';
import { MapPin, Navigation } from 'lucide-react-native';
import React, { useContext, useState } from 'react';
import { Alert, Linking, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { OnboardingDots } from '../components/OnboardingDots';
import { NavigationContext } from './NavigationContext';

export default function LocationScreen() {
  const router = useContext(NavigationContext);
  const [isRequesting, setIsRequesting] = useState(false);

  const requestLocationPermission = async () => {
    if (isRequesting) return;
    setIsRequesting(true);

    try {
      // Vérifier si les services de localisation sont activés
      const serviceEnabled = await Location.hasServicesEnabledAsync();

      if (!serviceEnabled) {
        Alert.alert(
          'GPS désactivé',
          'Veuillez activer le GPS dans les paramètres de votre téléphone.',
          [
            { text: 'Annuler', onPress: () => setIsRequesting(false) },
            {
              text: 'Paramètres',
              onPress: () => {
                Linking.openSettings();
                setIsRequesting(false);
              }
            }
          ]
        );
        return;
      }

      // Demander la permission
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === 'granted') {
        // Permission accordée, obtenir la position
        getCurrentPosition();
      } else if (status === 'denied') {
        Alert.alert(
          'Permission refusée',
          'Vous avez refusé l\'accès à la localisation. Vous pouvez l\'activer plus tard dans les paramètres.',
          [
            { text: 'OK', onPress: () => setIsRequesting(false) },
            {
              text: 'Paramètres',
              onPress: () => {
                Linking.openSettings();
                setIsRequesting(false);
              }
            }
          ]
        );
      } else {
        // Status peut être 'undetermined' ou autre
        Alert.alert(
          'Permission requise',
          'L\'accès à la localisation est nécessaire pour utiliser cette fonctionnalité.',
          [{ text: 'OK', onPress: () => setIsRequesting(false) }]
        );
      }
    } catch (error) {
      console.error('Erreur lors de la demande de permission:', error);
      Alert.alert(
        'Erreur',
        'Une erreur est survenue lors de la demande de localisation.',
        [{ text: 'OK', onPress: () => setIsRequesting(false) }]
      );
    }
  };

  const getCurrentPosition = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = location.coords;

      // Redirection directe vers la page d'accueil
      router.push('/home');
      setIsRequesting(false);
    } catch (error) {
      console.error('Erreur de géolocalisation:', error);

      let message = 'Impossible d\'obtenir votre position.';

      if (error.code === 'E_LOCATION_SERVICES_DISABLED') {
        message = 'Les services de localisation sont désactivés. Activez le GPS dans vos paramètres.';
      } else if (error.code === 'E_LOCATION_TIMEOUT') {
        message = 'La demande a expiré. Vérifiez votre connexion GPS et réessayez.';
      } else if (error.code === 'E_LOCATION_UNAVAILABLE') {
        message = 'Position non disponible. Assurez-vous que le GPS est activé.';
      }

      Alert.alert(
        'Erreur de localisation',
        message,
        [{ text: 'OK', onPress: () => setIsRequesting(false) }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.locationIconContainer}>
          <View style={styles.circle}>
            <MapPin size={40} color="#fff" />
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
            style={[styles.customButton, isRequesting && styles.buttonDisabled]}
            onPress={requestLocationPermission}
            disabled={isRequesting}
          >
            <View style={styles.buttonInner}>
              <Navigation size={20} color="#fff" />
              <Text style={styles.buttonText}>
                {isRequesting ? 'Activation...' : 'Activer la localisation'}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push('/home')}
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
  buttonDisabled: {
    opacity: 0.6,
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


/**
 * @Project: Atlas Local
 * @Author: Ralph <ralphurgue@gmail.com>
 * @Date: 2026-01-12
 * @Last Modified: 2026-01-24
 * @Description: Application mobile d'exploration.
 */