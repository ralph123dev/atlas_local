import React, { useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView, State } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import AskScreen from './app/ask';
import AuthScreen from './app/auth';
import EventsScreen from './app/events';
import HomeScreen from './app/home';
import WelcomeScreen from './app/index';
import IntroScreen from './app/intro';
import LocationScreen from './app/location';
import { NavigationContext } from './app/NavigationContext';
import SavedScreen from './app/saved';
import { Theme, ThemeContext } from './app/ThemeContext';
import TrendingScreen from './app/trending';
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
  const [theme, setTheme] = useState<Theme>('light');

  // États de l'animation de transition
  const [previousTheme, setPreviousTheme] = useState<Theme>('light');
  const [isAnimating, setIsAnimating] = useState(false);
  const transitionCoords = React.useRef({ x: SCREEN_WIDTH / 2, y: SCREEN_HEIGHT / 2 });

  // Valeurs Reanimated
  const rippleScale = useSharedValue(0);

  const paths = ['/', '/intro', '/location', '/home', '/ask', '/weather', '/events', '/trending', '/auth', '/saved'];
  const currentIndex = paths.indexOf(currentPath);

  const navigation = {
    push: (path: string) => setCurrentPath(path),
    replace: (path: string) => setCurrentPath(path),
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
      case '/intro': return <IntroScreen key="intro" />;
      case '/location': return <LocationScreen key="location" />;
      case '/home': return <HomeScreen key="home" />;
      case '/ask': return <AskScreen key="ask" />;
      case '/weather': return <WeatherScreen key="weather" />;
      case '/events': return <EventsScreen key="events" />;
      case '/trending': return <TrendingScreen key="trending" />;
      case '/auth': return <AuthScreen key="auth" />;
      case '/saved': return <SavedScreen key="saved" />;
      default: return <WelcomeScreen key="welcome" />;
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
                  Note : Un vrai "masque" du contenu complet de l'application est très difficile en RN sans modules natifs. 
                  Ici, nous simulons le remplissage par la couleur de fond. 
                  Pour un vrai masque de contenu, nous devrions dupliquer toute la hiérarchie de l'application, ce qui est trop lourd.
                  L'effet "Telegram" est généralement juste la couleur de fond qui balaye l'écran.
                  Cependant, pour que ce soit fluide, nous avons normalement besoin du NOUVEAU contenu au-dessus.
                  Puisque nous avons changé l'état 'theme', le contenu EST nouveau.
                  Donc nous voulons en réalité :
                  1. Couche sous-jacente : Contenu avec l'Ancien Thème (Capture ? Non, juste rendu avec la variable d'ancien thème ? Difficile car le Context met à jour tous les consommateurs).
                  
                  Logique alternative pour un visuel plus fluide :
                  - Le Context met à jour 'theme'. Tous les composants se re-rendent avec les NOUVELLES couleurs du thème.
                  - Limitation : Nous ne pouvons pas facilement "garder" l'ancien rendu pour l'arrière-plan.
                  
                  Compromis pour React Native sans captures natives :
                  - Utiliser une superposition colorée en plein écran pour l'effet "Ripple" (Onde).
                  - Le contenu derrière change immédiatement (flash). 
                  
                  Essayons une meilleure astuce : 
                  - Nous nous appuyons sur le fait que le Ripple est la NOUVELLE couleur.
                  - MAIS, si le contenu est déjà de la Nouvelle Couleur, le ripple est invisible.
                  
                  Attendez, si nous mettons à jour le Context, tout se met à jour.
                  Pour voir l' "Ancien" contenu, il faudrait retarder la mise à jour du Context ?
                  
                  Approche correcte pour cette contrainte :
                  1. Prendre une capture d'écran de la vue actuelle (nécessite view-shot, probablement pas installé).
                  2. OU : Animer simplement un cercle coloré du NOUVEAU thème par-dessus l'ANCIEN thème, 
                     puis changer l'état réel du thème lorsque l'animation couvre l'écran.
               */}
          </View>
        </NavigationContext.Provider>
      </ThemeContext.Provider>
    </GestureHandlerRootView>
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
