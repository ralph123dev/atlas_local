import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CalendarIcon from '../assets/images/calendar.svg';
import ContributeIcon from '../assets/images/contribute.svg';
import MapIcon from '../assets/images/map.svg';

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState('explorer');

  const renderContent = () => {
    switch (activeTab) {
      case 'explorer':
        return <Text style={styles.contentText}>Contenu de l'onglet Explorer</Text>;
      case 'evenements':
        return <Text style={styles.contentText}>Contenu de l'onglet Événements</Text>;
      case 'contribute':
        return <Text style={styles.contentText}>Contenu de l'onglet Contribute</Text>;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {renderContent()}
      </View>
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'explorer' && styles.activeTab]}
          onPress={() => setActiveTab('explorer')}
        >
          <MapIcon width={24} height={24} fill={activeTab === 'explorer' ? '#0057b7' : '#6b7280'} />
          <Text style={[styles.tabText, activeTab === 'explorer' && styles.activeTabText]}>Explorer</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'evenements' && styles.activeTab]}
          onPress={() => setActiveTab('evenements')}
        >
          <CalendarIcon width={24} height={24} fill={activeTab === 'evenements' ? '#0057b7' : '#6b7280'} />
          <Text style={[styles.tabText, activeTab === 'evenements' && styles.activeTabText]}>Événements</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'contribute' && styles.activeTab]}
          onPress={() => setActiveTab('contribute')}
        >
          <ContributeIcon width={24} height={24} fill={activeTab === 'contribute' ? '#0057b7' : '#6b7280'} />
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
    padding: 10,
  },
  activeTab: {
    backgroundColor: '#f0f9ff',
    borderRadius: 10,
  },
  tabText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  activeTabText: {
    color: '#0057b7',
    fontWeight: '600',
  },
});
