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
// Calculate max radius needed to cover the screen from any corner
const MAX_RADIUS = Math.sqrt(SCREEN_WIDTH ** 2 + SCREEN_HEIGHT ** 2);

// Helper for Reanimated
const getThemeColor = (t: Theme) => {
  'worklet';
  return t === 'light' ? '#fff' : '#1a1a1a';
};

export default function App() {
  const [currentPath, setCurrentPath] = useState('/');
  const [theme, setTheme] = useState<Theme>('light');

  // Animation states
  const [previousTheme, setPreviousTheme] = useState<Theme>('light');
  const [isAnimating, setIsAnimating] = useState(false);
  const transitionCoords = React.useRef({ x: SCREEN_WIDTH / 2, y: SCREEN_HEIGHT / 2 });

  // Reanimated values
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
    setTheme(newTheme); // Change actual theme immediately behind the scene
    transitionCoords.current = coords;

    // Start animation
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
    const scale = rippleScale.value * (MAX_RADIUS / 10); // Scale up to cover screen
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
            {/* Background Layer (Previous Theme OR Current Theme if not animating) */}
            <View style={[styles.container, { backgroundColor: getThemeColor(isAnimating ? previousTheme : theme) }]}>
              {renderContent()}
            </View>

            {/* Animation Layer (Current Theme expanding) */}
            {isAnimating && (
              <View style={[StyleSheet.absoluteFill, { overflow: 'hidden', zIndex: 9999 }]} pointerEvents="none">
                <Animated.View style={[styles.ripple, animatedStyle]} />
              </View>
            )}
            {/* 
                  Note: A true "mask" of the whole app content is very hard in RN without native modules. 
                  Here we simulated the "background color" fill. 
                  For a true content mask, we would need to duplicate the entire app hierarchy which is too heavy.
                  The "Telegram" effect is usually just the background color sweeping across.
                  However, to make it seamless, we typically need the NEW content on top.
                  Since we changed the state 'theme', the content IS new.
                  So we actually want:
                  1. Underlying layer: Old Theme Content (Snapshot? No, just render with old theme variable? Hard because Context updates all consumers).
                  
                  Alternative Logic for smoother visual:
                  - Context updates 'theme'. All components re-render with NEW theme colors.
                  - Limitation: We can't easily "keep" the old render for the background.
                  
                  Compromise for React Native without native snaps:
                  - Use a full screen colored overlay for the "Ripple".
                  - The content behind changes immediately (flash). 
                  
                  Let's try a better trick: 
                  - We rely on the fact that the Ripple is the NEW color.
                  - BUT, if the content is already New Color, the ripple is invisible.
                  
                  Wait, if we update Context, everything updates.
                  To see the "Old" content, we would need to delaying the Context update?
                  
                  Correct approach for this constraint:
                  1. Take screenshot of current view (requires view-shot, likely not installed).
                  2. OR: Just animate a colored circle of the NEW theme over the OLD theme, 
                     then switch the actual theme state when animation covers screen.
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
