import React, { createContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import WelcomeScreen from './app/index';
import IntroScreen from './app/intro';
import LocationScreen from './app/location';

export const NavigationContext = createContext({
  push: (path: string) => {},
  replace: (path: string) => {},
});

export default function App() {
  const [currentPath, setCurrentPath] = useState('/');
  const paths = ['/', '/intro', '/location'];
  const currentIndex = paths.indexOf(currentPath);

  const navigation = {
    push: (path: string) => setCurrentPath(path),
    replace: (path: string) => setCurrentPath(path),
  };

  const onHandlerStateChange = (event) => {
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
      default:
        return <WelcomeScreen key="welcome" />;
    }
  };

  return (
    <NavigationContext.Provider value={navigation}>
      <PanGestureHandler onHandlerStateChange={onHandlerStateChange}>
        <View style={styles.container}>{renderContent()}</View>
      </PanGestureHandler>
    </NavigationContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
  },
});
