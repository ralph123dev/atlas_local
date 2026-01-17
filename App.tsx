
import React, { useState, createContext } from 'react';
import { View, StyleSheet } from 'react-native';
import WelcomeScreen from './app/index';
import IntroScreen from './app/intro';
import LocationScreen from './app/location';

export const NavigationContext = createContext({
  push: (path: string) => {},
  replace: (path: string) => {},
});

export default function App() {
  const [currentPath, setCurrentPath] = useState('/');

  const navigation = {
    push: (path: string) => setCurrentPath(path),
    replace: (path: string) => setCurrentPath(path),
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
      <View style={styles.outerContainer}>
        <View style={styles.mobileFrame}>
          {renderContent()}
        </View>
      </View>
    </NavigationContext.Provider>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileFrame: {
    width: '100%',
    height: '100%',
    maxWidth: 450,
    maxHeight: 900,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    overflow: 'hidden',
  }
});
