import { Calendar, CloudSun, HeartHandshake, Map as MapLucideIcon, MessageCircleQuestion, Mic, Search, User } from 'lucide-react-native';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState('explorer');

  const renderContent = () => {
    switch (activeTab) {
      case 'explorer':
        return <Text style={styles.contentText}>Contenu de l'onglet Explorer</Text>;
      case 'evenements':
        return <Text style={styles.contentText}>Contenu de l'onglet Événements</Text>;
      case 'ask':
        return <Text style={styles.contentText}>Posez vos questions ici</Text>;
      case 'contribute':
        return <Text style={styles.contentText}>Contenu de l'onglet Contribute</Text>;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header avec recherche */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#6b7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher..."
            placeholderTextColor="#9ca3af"
          />
        </View>
        <TouchableOpacity style={styles.iconButton}>
          <Mic size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <User size={24} color="#1a1a1a" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {renderContent()}
      </View>

      {/* FAB Météo */}
      <TouchableOpacity style={styles.fabWeather}>
        <CloudSun size={24} color="#fff" />
      </TouchableOpacity>

      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'explorer' && styles.activeTab]}
          onPress={() => setActiveTab('explorer')}
        >
          <MapLucideIcon size={24} color={activeTab === 'explorer' ? '#0057b7' : '#6b7280'} />
          <Text style={[styles.tabText, activeTab === 'explorer' && styles.activeTabText]}>Explorer</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'evenements' && styles.activeTab]}
          onPress={() => setActiveTab('evenements')}
        >
          <Calendar size={24} color={activeTab === 'evenements' ? '#0057b7' : '#6b7280'} />
          <Text style={[styles.tabText, activeTab === 'evenements' && styles.activeTabText]}>Événements</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'ask' && styles.activeTab]}
          onPress={() => setActiveTab('ask')}
        >
          <MessageCircleQuestion size={24} color={activeTab === 'ask' ? '#0057b7' : '#6b7280'} />
          <Text style={[styles.tabText, activeTab === 'ask' && styles.activeTabText]}>Ask</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'contribute' && styles.activeTab]}
          onPress={() => setActiveTab('contribute')}
        >
          <HeartHandshake size={24} color={activeTab === 'contribute' ? '#0057b7' : '#6b7280'} />
          <Text style={[styles.tabText, activeTab === 'contribute' && styles.activeTabText]}>Contribute</Text>
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
    marginTop: 30,
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
    bottom: 80, // Juste au-dessus de la nav bar
    right: 20,  // Aligné au-dessus du dernier onglet (Contribute)
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
