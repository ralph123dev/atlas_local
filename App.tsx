import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';
import AskScreen from './app/ask';
import HomeScreen from './app/home';
import WelcomeScreen from './app/index';
import IntroScreen from './app/intro';
import LocationScreen from './app/location';
import { NavigationContext } from './app/NavigationContext';

export default function App() {
  const [currentPath, setCurrentPath] = useState('/');
  const paths = ['/', '/intro', '/location', '/home', '/ask'];
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
      default:
        return <WelcomeScreen key="welcome" />;
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContext.Provider value={navigation}>
        <PanGestureHandler onHandlerStateChange={onHandlerStateChange}>
          <View style={styles.container}>{renderContent()}</View>
        </PanGestureHandler>
      </NavigationContext.Provider>
    </GestureHandlerRootView>
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
