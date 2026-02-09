import React, { useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView, State } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AskScreen from './app/ask';
import AuthScreen from './app/auth';
import DashboardScreen from './app/dashboard';
import EventDetailScreen from './app/event-detail';
import EventsScreen from './app/events';
import HomeScreen from './app/home';
import WelcomeScreen from './app/index';
import IntroScreen from './app/intro';
import LocationScreen from './app/location';
import { NavigationContext } from './app/NavigationContext';
import SavedScreen from './app/saved';
import { Theme, ThemeContext } from './app/ThemeContext';
import WeatherScreen from './app/weather';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
// Calcul du rayon maximal nécessaire pour couvrir l'écran depuis n'importe quel coin
const MAX_RADIUS = Math.sqrt(SCREEN_WIDTH ** 2 + SCREEN_HEIGHT ** 2);

// Aide pour Reanimated : retourne la couleur de fond selon le thème
const getThemeColor = (t: Theme) => {
  'worklet';
  return t === 'light' ? '#fff' : t === 'blue' ? '#15202b' : '#1a1a1a';
};

export default function App() {
  const [currentPath, setCurrentPath] = useState('/');
  const [currentParams, setCurrentParams] = useState<any>({});
  const [theme, setTheme] = useState<Theme>('light');

  // États de l'animation de transition
  const [previousTheme, setPreviousTheme] = useState<Theme>('light');
  const [isAnimating, setIsAnimating] = useState(false);
  const transitionCoords = React.useRef({ x: SCREEN_WIDTH / 2, y: SCREEN_HEIGHT / 2 });

  // Valeurs Reanimated
  const rippleScale = useSharedValue(0);

  const paths = ['/', '/intro', '/location', '/home', '/ask', '/weather', '/events', '/auth', '/saved', '/event-detail', '/dashboard'];
  const currentIndex = paths.indexOf(currentPath);

  const navigation = {
    push: (path: string, params?: any) => {
      if (params) setCurrentParams(params);
      setCurrentPath(path);
    },
    replace: (path: string, params?: any) => {
      if (params) setCurrentParams(params);
      setCurrentPath(path);
    },
    params: currentParams,
  };

  const setThemeWithTransition = (newTheme: Theme, coords: { x: number; y: number }) => {
    if (newTheme === theme) return;

    setPreviousTheme(theme);
    setTheme(newTheme); // Mise à jour immédiate de l'état (le nouveau contenu se prépare en arrière-plan)
    transitionCoords.current = coords;

    // Lancement de l'animation
    setIsAnimating(true);
    rippleScale.value = 0;
    rippleScale.value = withTiming(1, { duration: 600 }, (finished) => {
      if (finished) {
        runOnJS(setIsAnimating)(false);
      }
    });
  };

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      if (event.nativeEvent.translationX > 50) {
        const newIndex = Math.max(0, currentIndex - 1);
        setCurrentPath(paths[newIndex]);
      } else if (event.nativeEvent.translationX < -50) {
        const newIndex = Math.min(paths.length - 1, currentIndex + 1);
        setCurrentPath(paths[newIndex]);
      }
    }
  };
  const renderContent = () => {
    switch (currentPath) {
      case '/':
        return <WelcomeScreen />;
      case '/intro':
        return <IntroScreen />;
      case '/location':
        return <LocationScreen />;
      case '/home':
        return <HomeScreen />;
      case '/ask':
        return <AskScreen />;
      case '/weather':
        return <WeatherScreen />;
      case '/events':
        return <EventsScreen />;
      case '/auth':
        return <AuthScreen />;
      case '/saved':
        return <SavedScreen />;
      case '/event-detail':
        return <EventDetailScreen />;
      case '/dashboard':
        return <DashboardScreen />;
      default:
        return <WelcomeScreen />;
    }
  };


  const animatedStyle = useAnimatedStyle(() => {
    const scale = rippleScale.value * (MAX_RADIUS / 10); // Couvre tout l'écran
    return {
      top: transitionCoords.current.y - 10,
      left: transitionCoords.current.x - 10,
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: getThemeColor(theme),
      transform: [{ scale }],
      opacity: 1,
    };
  });


  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeContext.Provider value={{ theme, setTheme, setThemeWithTransition }}>
          <NavigationContext.Provider value={navigation}>
            <View style={{ flex: 1 }}>
              {/* Couche de base : Ancien thème ou thème actuel si pas d'animation */}
              <View style={[styles.container, { backgroundColor: getThemeColor(isAnimating ? previousTheme : theme) }]}>
                {renderContent()}
              </View>

              {/* Couche d'animation : L'onde du nouveau thème qui s'étend */}
              {isAnimating && (
                <View style={[StyleSheet.absoluteFill, { overflow: 'hidden', zIndex: 9999 }]} pointerEvents="none">
                  <Animated.View style={[styles.ripple, animatedStyle]} />
                </View>
              )}
              {/* 
                    
                */}
            </View>
          </NavigationContext.Provider>
        </ThemeContext.Provider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  ripple: {
    position: 'absolute',
  },
});
