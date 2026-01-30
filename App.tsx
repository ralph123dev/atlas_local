import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';
import AskScreen from './app/ask';
import EventsScreen from './app/events';
import HomeScreen from './app/home';
import WelcomeScreen from './app/index';
import IntroScreen from './app/intro';
import LocationScreen from './app/location';
import { NavigationContext } from './app/NavigationContext';
import { Theme, ThemeContext } from './app/ThemeContext';
import TrendingScreen from './app/trending';
import WeatherScreen from './app/weather';

export default function App() {
  const [currentPath, setCurrentPath] = useState('/');
  const [theme, setTheme] = useState<Theme>('light');

  const paths = ['/', '/intro', '/location', '/home', '/ask', '/weather', '/events', '/trending', '/auth'];
  const currentIndex = paths.indexOf(currentPath);

  const navigation = {
    push: (path: string) => setCurrentPath(path),
    replace: (path: string) => setCurrentPath(path),
  };

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      if (event.nativeEvent.translationX > 50) {
        // Swipe right: go to previous page
        const newIndex = Math.max(0, currentIndex - 1);
        setCurrentPath(paths[newIndex]);
      } else if (event.nativeEvent.translationX < -50) {
        // Swipe left: go to next page
        const newIndex = Math.min(paths.length - 1, currentIndex + 1);
        setCurrentPath(paths[newIndex]);
      }
    }
  };

  const renderContent = () => {
    switch (currentPath) {
      case '/intro':
        return <IntroScreen key="intro" />;
      case '/location':
        return <LocationScreen key="location" />;
      case '/home':
        return <HomeScreen key="home" />;
      case '/ask':
        return <AskScreen key="ask" />;
      case '/weather':
        return <WeatherScreen key="weather" />;
      case '/events':
        return <EventsScreen key="events" />;
      case '/trending':
        return <TrendingScreen key="trending" />;
      case '/auth':
        return <AuthScreen key="auth" />;
      default:
        return <WelcomeScreen key="welcome" />;
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        <NavigationContext.Provider value={navigation}>
          <PanGestureHandler onHandlerStateChange={onHandlerStateChange}>
            <View style={[styles.container, { backgroundColor: theme === 'light' ? '#fff' : theme === 'blue' ? '#15202b' : '#1a1a1a' }]}>
              {renderContent()}
            </View>
          </PanGestureHandler>
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
    // backgroundColor removed here to be dynamic
  },
});
