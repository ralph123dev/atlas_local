/**
 * @Project: Atlas Local
 * @Author: Ralph <ralphurgue@gmail.com>
 * @Date: 2026-01-12
 * @Last Modified: 2026-01-24
 * @Description: Application mobile d'exploration.
 */
import { Coffee, HeartHandshake, Hotel, House, Map as MapLucideIcon, MessageCircleQuestion, Mic, Search, Trees, User, Utensils } from 'lucide-react-native';
import React, { useContext, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { ContributeScreen } from '../components/ContributeScreen';
import { SideMenu } from '../components/SideMenu';
import { TrendingPanel } from '../components/TrendingPanel';
import { NavigationContext } from './NavigationContext';
import { ThemeContext } from './ThemeContext';

export default function HomeScreen() {
  const router = useContext(NavigationContext);
  const { theme } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState('explorer');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const isDark = theme === 'dark';
  const [searchText, setSearchText] = useState('');

  const themeStyles = {
    container: { backgroundColor: isDark ? '#1a1a1a' : '#fff' },
    text: { color: isDark ? '#f3f4f6' : '#1a1a1a' },
    subText: { color: isDark ? '#9ca3af' : '#6b7280' },
    header: { backgroundColor: isDark ? '#1a1a1a' : '#fff', borderBottomColor: isDark ? '#374151' : '#f3f4f6' },
    searchContainer: { backgroundColor: isDark ? '#374151' : '#f3f4f6' },
    searchInput: { color: isDark ? '#f3f4f6' : '#1a1a1a' },
    navBg: { backgroundColor: isDark ? '#1a1a1a' : '#fff', borderTopColor: isDark ? '#374151' : '#e5e7eb' },
    activeTab: { backgroundColor: isDark ? '#374151' : '#f0f9ff' },
    activeTabText: { color: isDark ? '#60a5fa' : '#0057b7' },
    iconActive: isDark ? '#60a5fa' : '#0057b7',
    iconInactive: isDark ? '#9ca3af' : '#6b7280',
    iconPrimary: isDark ? '#f3f4f6' : '#1a1a1a',
    border: { borderBottomColor: isDark ? '#374151' : '#f3f4f6' },
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'explorer':
        return (
          <View style={{ flex: 1, width: '100%' }}>
            {isMapLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={themeStyles.iconActive} />
                <Text style={[styles.loadingText, themeStyles.text]}>Chargement de la carte...</Text>
              </View>
            )}
            <WebView
              source={{ uri: 'https://www.bing.com/maps?&cp=5.452391~10.0683&lvl=11&v=2&sV=1&mepi=59~~Embedded~LargeMapLink&FORM=MIRE' }}
              style={{ flex: 1 }}
              onLoadStart={() => setIsMapLoading(true)}
              onLoadEnd={() => setIsMapLoading(false)}
              injectedJavaScript={`
                (function() {
                  const hideElements = () => {
                    const selectors = ['#search-box-container', '.search-box-container', '.header', '.footer', '#msHeader'];
                    selectors.forEach(selector => {
                      const el = document.querySelector(selector);
                      if (el) el.style.display = 'none';
                    });
                  };
                  hideElements();
                  setTimeout(hideElements, 1000);
                  setTimeout(hideElements, 3000);
                })();
                true;
              `}
            />
            {/* Floating Search Bar */}
            <View style={styles.floatingHeader}>
              <View style={[styles.floatingSearchContainer, themeStyles.searchContainer, styles.shadow]}>
                <Image source={require('../assets/images/logo.jpg')} style={styles.searchLogo} />
                <TextInput
                  style={[styles.searchInput, themeStyles.searchInput]}
                  placeholder="Rechercher ici"
                  placeholderTextColor={isDark ? '#8899a6' : '#9ca3af'}
                  value={searchText}
                  onChangeText={setSearchText}
                />
                <TouchableOpacity style={styles.searchIconBtn}>
                  <Mic size={20} color={themeStyles.iconPrimary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.searchIconBtn} onPress={() => router.push('/auth')}>
                  <User size={20} color={themeStyles.iconPrimary} />
                </TouchableOpacity>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickActionsScroll} contentContainerStyle={styles.quickActionsContent}>
                {[
                  { label: 'Domicile', icon: House },
                  { label: 'Restaurants', icon: Utensils },
                  { label: 'Hôtels', icon: Hotel },
                  { label: 'Cafés', icon: Coffee },
                  { label: 'Parcs', icon: Trees }
                ].map((item) => (
                  <TouchableOpacity key={item.label} style={[styles.quickActionBtn, themeStyles.searchContainer, styles.shadow]} onPress={() => setSearchText(item.label)}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      {item.icon && <item.icon size={16} color={themeStyles.text.color} style={{ marginRight: 6 }} />}
                      <Text style={[styles.quickActionText, themeStyles.text]}>{item.label}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        );
      case 'ask':
        return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={[styles.contentText, themeStyles.text]}>Posez vos questions ici</Text>
          </View>
        );
      case 'contribute':
        return <ContributeScreen />;
      default:
        return null;
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={[styles.container, themeStyles.container]}>
        <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

        {/* Header Conditional */}
        {activeTab === 'contribute' ? (
          <View style={[styles.header, themeStyles.header]}>
            <View style={styles.logoHeaderContainer}>
              <Image
                source={require('../assets/images/logo.jpg')}
                style={[styles.logo, { borderRadius: 8 }]}
              />
              <Text style={[styles.logoText, themeStyles.text]}>Nexora</Text>
            </View>
            <View style={{ flex: 1 }} />
            <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/auth')}>
              <User size={24} color={themeStyles.iconPrimary} />
            </TouchableOpacity>
          </View>
        ) : activeTab === 'explorer' ? null : (
          <View style={[styles.header, themeStyles.header]}>
            <View style={[styles.searchContainer, themeStyles.searchContainer]}>
              <Search size={20} color={themeStyles.iconInactive} style={styles.searchIcon} />
              <TextInput
                style={[styles.searchInput, themeStyles.searchInput]}
                placeholder="Rechercher un lieu..."
                placeholderTextColor={isDark ? '#8899a6' : '#9ca3af'}
              />
            </View>
            <TouchableOpacity style={styles.iconButton}>
              <Mic size={24} color={themeStyles.iconPrimary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/auth')}>
              <User size={24} color={themeStyles.iconPrimary} />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.content}>
          {renderContent()}
        </View>



        <View style={[styles.bottomNav, themeStyles.navBg]}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'explorer' && [styles.activeTab, themeStyles.activeTab]]}
            onPress={() => setActiveTab('explorer')}
          >
            <MapLucideIcon size={24} color={activeTab === 'explorer' ? themeStyles.iconActive : themeStyles.iconInactive} />
            <Text style={[styles.tabText, themeStyles.subText, activeTab === 'explorer' && [styles.activeTabText, themeStyles.activeTabText]]}>Explorer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'menu' && [styles.activeTab, themeStyles.activeTab]]}
            onPress={() => setIsMenuOpen(true)}
          >
            <Image
              source={require('../assets/images/more.png')}
              style={[styles.menuIcon, { tintColor: activeTab === 'menu' ? themeStyles.iconActive : themeStyles.iconInactive }]}
            />
            <Text style={[styles.tabText, themeStyles.subText, activeTab === 'menu' && [styles.activeTabText, themeStyles.activeTabText]]}>Menu</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tab}
            onPress={() => router.push('/ask')}
          >
            <MessageCircleQuestion size={24} color={themeStyles.iconInactive} />
            <Text style={[styles.tabText, themeStyles.subText]}>Ask</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'contribute' && [styles.activeTab, themeStyles.activeTab]]}
            onPress={() => setActiveTab('contribute')}
          >
            <HeartHandshake size={24} color={activeTab === 'contribute' ? themeStyles.iconActive : themeStyles.iconInactive} />
            <Text style={[styles.tabText, themeStyles.subText, activeTab === 'contribute' && [styles.activeTabText, themeStyles.activeTabText]]}>Contribute</Text>
          </TouchableOpacity>
        </View>

        {/* Trending Panel Overlay */}
        {activeTab === 'explorer' && <TrendingPanel />}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    marginTop: 18,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    paddingHorizontal: 10,
    height: 40,
    marginRight: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
  },
  iconButton: {
    padding: 8,
    marginLeft: 5,
  },
  content: {
    flex: 1,
  },
  contentText: {
    fontSize: 18,
    color: '#1a1a1a',
  },
  fabWeather: {
    position: 'absolute',
    bottom: 105, // Juste au-dessus de la nav bar
    right: 20,
    backgroundColor: '#0057b7',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 10,

  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  tab: {
    alignItems: 'center',
    padding: 5,
    flex: 1,
  },
  activeTab: {
    backgroundColor: '#f0f9ff',
    borderRadius: 10,
  },
  tabText: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: 4,
  },
  activeTabText: {
    color: '#0057b7',
    fontWeight: '600',
  },
  menuIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  logoHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 32,
    height: 32,
    marginRight: 10,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  floatingHeader: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  floatingSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 15,
    borderRadius: 24,
    paddingHorizontal: 12,
    height: 48,
  },
  searchLogo: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 10,
  },
  searchIconBtn: {
    padding: 8,
  },
  quickActionsScroll: {
    marginTop: 12,
  },
  quickActionsContent: {
    paddingHorizontal: 15,
  },
  quickActionBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
});


/**
 * @Project: Atlas Local
 * @Author: Ralph <ralphurgue@gmail.com>
 * @Date: 2026-01-12
 * @Last Modified: 2026-01-24
 * @Description: Application mobile d'exploration.
 */
