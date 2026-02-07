
import * as ExpoLocation from 'expo-location';
import { Coffee, HeartHandshake, Hotel, House, LucideLocate, Map as MapLucideIcon, MessageCircleQuestion, Mic, Search, Trees, User, Utensils, X } from 'lucide-react-native';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Image, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { ContributeScreen } from '../components/ContributeScreen';
import { SideMenu } from '../components/SideMenu';
import { styles } from '../constants/styles/Home.styles';
import { NavigationContext } from './NavigationContext';
import { ThemeContext } from './ThemeContext';

export default function HomeScreen() {
  const router = useContext(NavigationContext);
  const { theme } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState('explorer');

  useEffect(() => {
    if (router.params?.activeTab) {
      setActiveTab(router.params.activeTab);
    }
  }, [router.params?.activeTab]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const isDark = theme === 'dark';
  const [searchText, setSearchText] = useState('');
  const [searchLocation, setSearchLocation] = useState<{ latitude: number, longitude: number } | null>(null);
  const [is3D, setIs3D] = useState(false);
  const mapRef = React.useRef<MapView>(null);
  const [location, setLocation] = useState<ExpoLocation.LocationObject | null>(null);
  const [region, setRegion] = useState({
    latitude: 5.452391,
    longitude: 10.0683,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [places, setPlaces] = useState<any[]>([]);
  const [streetViewCoords, setStreetViewCoords] = useState<{ latitude: number, longitude: number } | null>(null);
  const [isStreetViewVisible, setIsStreetViewVisible] = useState(false);
  const GOOGLE_API_KEY = "AIzaSyAOAGJB7TlVNo01s0-zVx_ObVRCkivqaNs";

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
      fetchNearbyPlaces(location.coords.latitude, location.coords.longitude);
    })();
  }, []);

  const fetchNearbyPlaces = async (lat: number, lng: number) => {
    try {
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=1000&type=restaurant|cafe|shopping_mall|store&key=${GOOGLE_API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.results) {
        setPlaces(data.results);
      }
    } catch (error) {
      console.log('Error fetching places:', error);
    }
  };

  const handleRecenter = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
      fetchNearbyPlaces(location.coords.latitude, location.coords.longitude);
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
        fetchNearbyPlaces(latitude, longitude);
      }
    } catch (error) {
      console.log('Search error:', error);
    }
  };

  const openStreetView = (lat: number, lng: number) => {
    setStreetViewCoords({ latitude: lat, longitude: lng });
    setIsStreetViewVisible(true);
  };

  const toggle3D = () => {
    if (mapRef.current) {
      const newPitch = is3D ? 0 : 45;
      mapRef.current.animateCamera({
        pitch: newPitch,
        heading: is3D ? 0 : 20,
      }, { duration: 1000 });
      setIs3D(!is3D);
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
              showsMyLocationButton={false}
              showsPointsOfInterest={true}
              showsCompass={false}
              showsBuildings={true}
              showsIndoors={true}
              customMapStyle={isDark ? darkMapStyle : []}
              userInterfaceStyle={isDark ? 'dark' : 'light'}
              onMapReady={() => setIsMapLoading(false)}
            >
              {searchLocation && (
                <Marker
                  coordinate={searchLocation}
                  title={searchText}
                  pinColor="#0057b7"
                  onPress={() => openStreetView(searchLocation.latitude, searchLocation.longitude)}
                />
              )}

              {places.map((place) => (
                <Marker
                  key={place.place_id}
                  coordinate={{
                    latitude: place.geometry.location.lat,
                    longitude: place.geometry.location.lng,
                  }}
                  onPress={() => openStreetView(place.geometry.location.lat, place.geometry.location.lng)}
                >
                  <View style={styles.placeMarkerContainer}>
                    {place.photos && place.photos.length > 0 ? (
                      <Image
                        source={{ uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=100&photoreference=${place.photos[0].photo_reference}&key=${GOOGLE_API_KEY}` }}
                        style={styles.placeMarkerImage}
                      />
                    ) : (
                      <View style={[styles.placeMarkerIcon, { backgroundColor: '#0057b7' }]}>
                        <Utensils size={12} color="#fff" />
                      </View>
                    )}
                  </View>
                  <Callout>
                    <View style={styles.calloutContainer}>
                      <Text style={styles.calloutTitle}>{place.name}</Text>
                      <Text style={styles.calloutSub}>Appuyez pour voir Street View</Text>
                    </View>
                  </Callout>
                </Marker>
              ))}
            </MapView>
            {/* Floating Search Bar */}
            <View style={styles.floatingHeader}>
              <View style={[styles.floatingSearchContainer, themeStyles.searchContainer, styles.shadow]}>
                <View style={styles.searchBranding}>
                  <Image source={require('@/assets/images/logo.png')} style={styles.searchLogo} />
                  <Text style={[styles.brandingText, themeStyles.text]}></Text>
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

              <ScrollView horizontal showsHorizontalScrollIndicator={false} decelerationRate="fast" style={styles.quickActionsScroll} contentContainerStyle={styles.quickActionsContent}>
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

            {/* Map Controls */}
            <View style={styles.mapControlsContainer}>
              <TouchableOpacity
                style={[styles.mapControlButton, styles.shadow, { backgroundColor: isDark ? '#374151' : '#fff' }]}
                onPress={toggle3D}
              >
                <Text style={{ fontWeight: 'bold', color: is3D ? '#0057b7' : '#6b7280', fontSize: 13 }}>3D</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.mapControlButton, styles.shadow, { backgroundColor: isDark ? '#374151' : '#fff' }]}
                onPress={handleRecenter}
              >
                <LucideLocate size={22} color="#0057b7" />
              </TouchableOpacity>
            </View>

            {/* Street View Modal */}
            <Modal
              visible={isStreetViewVisible}
              animationType="slide"
              transparent={false}
              onRequestClose={() => setIsStreetViewVisible(false)}
            >
              <View style={{ flex: 1, backgroundColor: '#000' }}>
                <SafeAreaView style={{ flex: 1 }}>
                  <View style={styles.streetViewHeader}>
                    <TouchableOpacity onPress={() => setIsStreetViewVisible(false)} style={styles.closeBtn}>
                      <X size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.streetViewTitle}>Vue Street View (360°)</Text>
                  </View>
                  {streetViewCoords && (
                    <WebView
                      source={{ uri: `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${streetViewCoords.latitude},${streetViewCoords.longitude}` }}
                      style={{ flex: 1 }}
                    />
                  )}
                </SafeAreaView>
              </View>
            </Modal>
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
                source={require('@/assets/images/logo.png')}
                style={[styles.logo, { borderRadius: 8 }]}
              />
              <Text style={[styles.logoText, themeStyles.text]}>Atlas Local</Text>
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
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}





