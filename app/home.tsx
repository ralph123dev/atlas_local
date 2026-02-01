/**
 * @Project: Atlas Local
 * @Author: Ralph <ralphurgue@gmail.com>
 * @Date: 2026-01-12
 * @Last Modified: 2026-01-24
 * @Description: Application mobile d'exploration.
 */
import * as ExpoLocation from 'expo-location';
import { Coffee, HeartHandshake, Hotel, House, LucideLocate, Map as MapLucideIcon, MessageCircleQuestion, Mic, Search, Trees, User, Utensils } from 'lucide-react-native';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
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
  const [searchLocation, setSearchLocation] = useState<{ latitude: number, longitude: number } | null>(null);
  const mapRef = React.useRef<MapView>(null);
  const [location, setLocation] = useState<ExpoLocation.LocationObject | null>(null);
  const [region, setRegion] = useState({
    latitude: 5.452391,
    longitude: 10.0683,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  useEffect(() => {
    (async () => {
      let { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setIsMapLoading(false);
        return;
      }

      let location = await ExpoLocation.getCurrentPositionAsync({});
      setLocation(location);
      const newRegion = {
        ...region,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setRegion(newRegion);
      setIsMapLoading(false);
    })();
  }, []);

  const handleRecenter = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    }
  };

  const handleSearch = async () => {
    if (!searchText.trim()) return;
    try {
      const results = await ExpoLocation.geocodeAsync(searchText);
      if (results.length > 0) {
        const { latitude, longitude } = results[0];
        const newLocation = { latitude, longitude };
        setSearchLocation(newLocation);
        mapRef.current?.animateToRegion({
          latitude,
          longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }, 1000);
      }
    } catch (error) {
      console.log('Search error:', error);
    }
  };

  const darkMapStyle = [
    {
      "elementType": "geometry",
      "stylers": [{ "color": "#242f3e" }]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#746855" }]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [{ "color": "#242f3e" }]
    },
    {
      "featureType": "administrative.locality",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#d59563" }]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#d59563" }]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [{ "color": "#263c3f" }]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#6b9a76" }]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [{ "color": "#38414e" }]
    },
    {
      "featureType": "road",
      "elementType": "geometry.stroke",
      "stylers": [{ "color": "#212a37" }]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#9ca5b3" }]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [{ "color": "#746855" }]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [{ "color": "#1f2835" }]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#f3d19c" }]
    },
    {
      "featureType": "transit",
      "elementType": "geometry",
      "stylers": [{ "color": "#2f3948" }]
    },
    {
      "featureType": "transit.station",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#d59563" }]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [{ "color": "#17263c" }]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#515c6d" }]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.stroke",
      "stylers": [{ "color": "#17263c" }]
    }
  ];

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
            <MapView
              ref={mapRef}
              provider={PROVIDER_GOOGLE}
              style={{ flex: 1 }}
              region={region}
              showsUserLocation={true}
              showsPointsOfInterest={true}
              showsCompass={false}
              showsBuildings={true}
              showsIndoors={true}
              mapId={isDark ? undefined : "8b8b0cea4273e8dffe2dc07d"}
              customMapStyle={isDark ? darkMapStyle : []}
              userInterfaceStyle={isDark ? 'dark' : 'light'}
              onMapReady={() => setIsMapLoading(false)}
            >
              {searchLocation && (
                <Marker
                  coordinate={searchLocation}
                  title={searchText}
                  pinColor="#0057b7"
                />
              )}
            </MapView>
            {/* Floating Search Bar */}
            <View style={styles.floatingHeader}>
              <View style={[styles.floatingSearchContainer, themeStyles.searchContainer, styles.shadow]}>
                <View style={styles.searchBranding}>
                  <Image source={require('../assets/images/logo.jpg')} style={styles.searchLogo} />
                  <Text style={[styles.brandingText, themeStyles.text]}>Nexora</Text>
                </View>
                <View style={styles.searchDivider} />
                <TextInput
                  style={[styles.searchInput, themeStyles.searchInput]}
                  placeholder="Rechercher ici"
                  placeholderTextColor={isDark ? '#8899a6' : '#9ca3af'}
                  value={searchText}
                  onChangeText={setSearchText}
                  onSubmitEditing={handleSearch}
                  returnKeyType="search"
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

            {/* GPS Recenter Button */}
            <TouchableOpacity
              style={[styles.gpsButton, styles.shadow, { backgroundColor: isDark ? '#374151' : '#fff' }]}
              onPress={handleRecenter}
            >
              <LucideLocate size={24} color="#0057b7" />
            </TouchableOpacity>
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
  },
  searchBranding: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  brandingText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  searchDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#e5e7eb',
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
  gpsButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 101,
  },
});


/**
 * @Project: Atlas Local
 * @Author: Ralph <ralphurgue@gmail.com>
 * @Date: 2026-01-12
 * @Last Modified: 2026-01-24
 * @Description: Application mobile d'exploration.
 */
