import { Calendar, CloudSun, HeartHandshake, Map as MapLucideIcon, MessageCircleQuestion, Mic, Search, User } from 'lucide-react-native';
import React, { useContext, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContext } from './NavigationContext';
import { ThemeContext } from './ThemeContext';

export default function HomeScreen() {
  const router = useContext(NavigationContext);
  const { theme } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState('explorer');

  const isDark = theme === 'dark';
  const isBlue = theme === 'blue';

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
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'explorer':
        return <Text style={[styles.contentText, themeStyles.text]}>Contenu de l'onglet Explorer</Text>;
      case 'evenements':
        return <Text style={[styles.contentText, themeStyles.text]}>Contenu de l'onglet Événements</Text>;
      case 'ask':
        return <Text style={[styles.contentText, themeStyles.text]}>Posez vos questions ici</Text>;
      case 'contribute':
        return <Text style={[styles.contentText, themeStyles.text]}>Contenu de l'onglet Contribute</Text>;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[styles.container, themeStyles.container]}>
      {/* Header avec recherche */}
      <View style={[styles.header, themeStyles.header]}>
        <View style={[styles.searchContainer, themeStyles.searchContainer]}>
          <Search size={20} color={themeStyles.iconInactive} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, themeStyles.searchInput]}
            placeholder="Rechercher un ser..."
            placeholderTextColor={isDark || isBlue ? '#8899a6' : '#9ca3af'}
          />
        </View>
        <TouchableOpacity style={styles.iconButton}>
          <Mic size={24} color={themeStyles.iconPrimary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <User size={24} color={themeStyles.iconPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {renderContent()}
      </View>

      {/* FAB Météo */}
      <TouchableOpacity style={styles.fabWeather}>
        <CloudSun size={24} color="#fff" />
      </TouchableOpacity>

      <View style={[styles.bottomNav, themeStyles.navBg]}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'explorer' && [styles.activeTab, themeStyles.activeTab]]}
          onPress={() => setActiveTab('explorer')}
        >
          <MapLucideIcon size={24} color={activeTab === 'explorer' ? themeStyles.iconActive : themeStyles.iconInactive} />
          <Text style={[styles.tabText, themeStyles.subText, activeTab === 'explorer' && [styles.activeTabText, themeStyles.activeTabText]]}>Explorer</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'evenements' && [styles.activeTab, themeStyles.activeTab]]}
          onPress={() => setActiveTab('evenements')}
        >
          <Calendar size={24} color={activeTab === 'evenements' ? themeStyles.iconActive : themeStyles.iconInactive} />
          <Text style={[styles.tabText, themeStyles.subText, activeTab === 'evenements' && [styles.activeTabText, themeStyles.activeTabText]]}>Événements</Text>
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
    </SafeAreaView>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
});
