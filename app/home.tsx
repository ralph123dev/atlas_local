import * as ExpoLocation from 'expo-location';
import { Banknote, Cloud, Coffee, HeartHandshake, Hotel, House, LucideLocate, Map as MapLucideIcon, MessageCircleQuestion, Mic, Search, ShoppingBag, Trees, User, Utensils, X } from 'lucide-react-native';


import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { ContributeScreen } from '../components/ContributeScreen';
import { SideMenu } from '../components/SideMenu';
import { styles } from '../constants/styles/Home.styles';
import { NavigationContext } from './NavigationContext';
import { ThemeContext } from './ThemeContext';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_MIN_HEIGHT = 120;
const SHEET_MAX_HEIGHT = SCREEN_HEIGHT * 0.8;

const categories_data = {
  hotels: [
    { id: 1, name: 'Hôtel Splendide', distance: 120, price: '45.000', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400' },
    { id: 2, name: 'Auberge du Lac', distance: 450, price: '25.000', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400' },
    { id: 3, name: 'Plaza Hotel', distance: 800, price: '60.000', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400' },
    { id: 4, name: 'Grand Horizon', distance: 1200, price: '35.000', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400' },
    { id: 5, name: 'Ocean View', distance: 1500, price: '50.000', image: 'https://images.unsplash.com/photo-1551882547-ff43c63efe8c?w=400' },
    { id: 6, name: 'City Center Inn', distance: 2000, price: '20.000', image: 'https://images.unsplash.com/photo-1445013544690-d303e898435d?w=400' },
    { id: 7, name: 'Royal Palace', distance: 2500, price: '85.000', image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400' },
    { id: 8, name: 'Nomad Lodge', distance: 3000, price: '15.000', image: 'https://images.unsplash.com/photo-1495365200463-6c74768ec287?w=400' },
  ],
  restaurants: [
    { id: 1, name: 'Chez Mamy', distance: 50, price: '5.000', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400' },
    { id: 2, name: 'Le Gourmet', distance: 200, price: '12.000', image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400' },
    { id: 3, name: 'Pasta Fina', distance: 400, price: '8.500', image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400' },
    { id: 4, name: 'Grill Master', distance: 750, price: '10.000', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400' },
    { id: 5, name: 'Sushi Zen', distance: 900, price: '15.000', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400' },
    { id: 6, name: 'Burger King', distance: 1100, price: '4.500', image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400' },
    { id: 7, name: 'Vegan Delight', distance: 1300, price: '9.000', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400' },
    { id: 8, name: 'Tacos Local', distance: 1600, price: '3.000', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400' },
  ],
  supermarkets: [
    { id: 1, name: 'Carrefour Market', distance: 300, price: 'Promo', image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=400' },
    { id: 2, name: 'Super U', distance: 600, price: 'Fresh', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400' },
    { id: 3, name: 'Casino', distance: 1000, price: 'Bio', image: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=400' },
    { id: 4, name: 'Boulangerie Local', distance: 100, price: 'Pains', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400' },
    { id: 5, name: 'Marché Central', distance: 1500, price: 'Vrac', image: 'https://images.unsplash.com/photo-1488459711612-071ef29946b9?w=400' },
  ],
  banks: [
    { id: 1, name: 'Société Générale', distance: 250, price: 'Banque', image: 'https://images.unsplash.com/photo-1541354451442-952c97f3f18e?w=400' },
    { id: 2, name: 'Eco Bank', distance: 500, price: 'ATM', image: 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=400' },
    { id: 3, name: 'UBA', distance: 900, price: 'Transfert', image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400' },
    { id: 4, name: 'Afriland First Bank', distance: 1200, price: 'Crédit', image: 'https://images.unsplash.com/photo-1454165833767-131ef24896c3?w=400' },
  ]
};

export default function HomeScreen() {
  const router = useContext(NavigationContext);
  const { theme } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState('explorer');

  // BottomSheet Logic
  const translateY = useSharedValue(SCREEN_HEIGHT - SHEET_MIN_HEIGHT);
  const context = useSharedValue({ y: 0 });

  const panGesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      let nextValue = context.value.y + event.translationY;
      if (nextValue < SCREEN_HEIGHT - SHEET_MAX_HEIGHT) {
        nextValue = SCREEN_HEIGHT - SHEET_MAX_HEIGHT - (SCREEN_HEIGHT - SHEET_MAX_HEIGHT - nextValue) * 0.2;
      }
      if (nextValue > SCREEN_HEIGHT - 40) {
        nextValue = SCREEN_HEIGHT - 40 + (nextValue - (SCREEN_HEIGHT - 40)) * 0.2;
      }
      translateY.value = nextValue;
    })
    .onEnd((event) => {
      if (event.velocityY < -500 || translateY.value < SCREEN_HEIGHT - SHEET_MAX_HEIGHT / 2) {
        translateY.value = withSpring(SCREEN_HEIGHT - SHEET_MAX_HEIGHT, { damping: 15 });
      } else {
        translateY.value = withSpring(SCREEN_HEIGHT - SHEET_MIN_HEIGHT, { damping: 15 });
      }
    });

  const animatedSheetStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

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
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'hotels' | 'restaurants' | 'supermarkets' | 'banks'>('all');
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
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=1000&type=restaurant|cafe|shopping_mall|store&key=${GOOGLE_API_KEY}`; //Carte Google maps
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
    card: { backgroundColor: isDark ? '#1a1a1a' : '#fff' },
    progressBarFill: isDark ? '#60a5fa' : '#0057b7',
    categoryBtn: { backgroundColor: isDark ? '#374151' : '#f3f4f6', borderColor: isDark ? '#4b5563' : '#e5e7eb' },
    categoryBtnText: { color: isDark ? '#9ca3af' : '#4b5563' },
    categoryMenuBorder: { borderBottomColor: isDark ? '#374151' : '#e5e7eb' },
    categoryTabInactiveText: { color: isDark ? '#6b7280' : '#9ca3af' },
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

        {/* Main Content Area */}
        <View style={[styles.content, { flex: 1 }]}>
          {renderContent()}
        </View>
      </SafeAreaView>

      {/* Persistent Bottom Sheet Explorer Overlay */}
      {activeTab === 'explorer' && (
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[
            styles.bottomSheet,
            themeStyles.card,
            animatedSheetStyle,
            { zIndex: 1000, bottom: 0 }
          ]}>
            {/* Grabber Area - Pull up/down here primarily */}
            <View style={styles.sheetHandleContainer}>
              <View style={styles.sheetHandle} />
            </View>

            {/* Weather Header */}
            <View style={styles.sheetHeader}>
              <Text style={[styles.sheetCityName, themeStyles.text]}>Yaoundé, Cameroun</Text>
              <View style={styles.weatherInfo}>
                <Cloud size={24} color={isDark ? '#60a5fa' : '#0057b7'} />
                <Text style={[styles.temperatureText, themeStyles.text]}>23°C</Text>
              </View>
            </View>

            {/* Category Menu Tabs */}
            <View style={[styles.categoryMenuContainer, themeStyles.categoryMenuBorder]}>
              {[
                { id: 'all', label: 'Tout' },
                { id: 'hotels', label: 'Hôtels' },
                { id: 'restaurants', label: 'Restaurants' },
                { id: 'supermarkets', label: 'Magasins' },
                { id: 'banks', label: 'Banques' },
              ].map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryTab,
                    selectedCategory === cat.id && styles.categoryTabActive
                  ]}
                  onPress={() => setSelectedCategory(cat.id as any)}
                >
                  <Text style={[
                    styles.categoryTabText,
                    selectedCategory !== cat.id && themeStyles.categoryTabInactiveText,
                    selectedCategory === cat.id && styles.categoryTabTextActive
                  ]}>{cat.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Scrollable Content */}
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{ paddingBottom: 140 }}
              showsVerticalScrollIndicator={false}
            // This is crucial: the pan gesture on the parent might block scroll if not coordinated.
            // In this case, we rely on the parent Pan gesture. 
            // To allow scrolling, we ensure the translateY is at max height.
            >
              <View style={styles.sheetContent}>
                {/* Hotels Section */}
                {(selectedCategory === 'all' || selectedCategory === 'hotels') && (
                  <>
                    <View style={styles.sectionHeader}>
                      <Hotel size={20} color={themeStyles.iconActive} />
                      <Text style={[styles.sectionTitle, themeStyles.text, { marginTop: 0, marginLeft: 10 }]}>Hôtels à proximité</Text>
                    </View>
                    {categories_data.hotels.map((hotel) => (
                      <View key={`hotel-${hotel.id}`} style={styles.listItem}>
                        <View style={styles.itemImageContainer}>
                          <Image source={{ uri: hotel.image }} style={styles.itemImage} />
                          <View style={styles.priceBadge}>
                            <Text style={styles.priceText}>{hotel.price} FCFA</Text>
                          </View>
                        </View>
                        <View style={styles.itemInfo}>
                          <Text style={[styles.itemName, themeStyles.text]}>{hotel.name}</Text>
                          <Text style={[styles.itemDistance, themeStyles.subText]}>{hotel.distance}m de vous</Text>
                        </View>
                      </View>
                    ))}
                  </>
                )}

                {/* Restaurants Section */}
                {(selectedCategory === 'all' || selectedCategory === 'restaurants') && (
                  <>
                    <View style={styles.sectionHeader}>
                      <Utensils size={20} color={themeStyles.iconActive} />
                      <Text style={[styles.sectionTitle, themeStyles.text, { marginTop: 0, marginLeft: 10 }]}>Restaurants populaires</Text>
                    </View>
                    {categories_data.restaurants.map((res) => (
                      <View key={`res-${res.id}`} style={styles.listItem}>
                        <View style={styles.itemImageContainer}>
                          <Image source={{ uri: res.image }} style={styles.itemImage} />
                          <View style={styles.priceBadge}>
                            <Text style={styles.priceText}>{res.price} FCFA</Text>
                          </View>
                        </View>
                        <View style={styles.itemInfo}>
                          <Text style={[styles.itemName, themeStyles.text]}>{res.name}</Text>
                          <Text style={[styles.itemDistance, themeStyles.subText]}>{res.distance}m de vous</Text>
                        </View>
                      </View>
                    ))}
                  </>
                )}

                {/* Supermarkets Section */}
                {(selectedCategory === 'all' || selectedCategory === 'supermarkets') && (
                  <>
                    <View style={styles.sectionHeader}>
                      <ShoppingBag size={20} color={themeStyles.iconActive} />
                      <Text style={[styles.sectionTitle, themeStyles.text, { marginTop: 0, marginLeft: 10 }]}>Super Marchés & Boutiques</Text>
                    </View>
                    {categories_data.supermarkets.map((m) => (
                      <View key={`shop-${m.id}`} style={styles.listItem}>
                        <View style={styles.itemImageContainer}>
                          <Image source={{ uri: m.image }} style={styles.itemImage} />
                          <View style={styles.priceBadge}>
                            <Text style={styles.priceText}>{m.price}</Text>
                          </View>
                        </View>
                        <View style={styles.itemInfo}>
                          <Text style={[styles.itemName, themeStyles.text]}>{m.name}</Text>
                          <Text style={[styles.itemDistance, themeStyles.subText]}>{m.distance}m de vous</Text>
                        </View>
                      </View>
                    ))}
                  </>
                )}

                {/* Banks Section */}
                {(selectedCategory === 'all' || selectedCategory === 'banks') && (
                  <>
                    <View style={styles.sectionHeader}>
                      <Banknote size={20} color={themeStyles.iconActive} />
                      <Text style={[styles.sectionTitle, themeStyles.text, { marginTop: 0, marginLeft: 10 }]}>Banques & Distributeurs</Text>
                    </View>
                    {categories_data.banks.map((b) => (
                      <View key={`bank-${b.id}`} style={styles.listItem}>
                        <View style={styles.itemImageContainer}>
                          <Image source={{ uri: b.image }} style={styles.itemImage} />
                          <View style={styles.priceBadge}>
                            <Text style={styles.priceText}>{b.price}</Text>
                          </View>
                        </View>
                        <View style={styles.itemInfo}>
                          <Text style={[styles.itemName, themeStyles.text]}>{b.name}</Text>
                          <Text style={[styles.itemDistance, themeStyles.subText]}>{b.distance}m de vous</Text>
                        </View>
                      </View>
                    ))}
                  </>
                )}
              </View>
            </ScrollView>
          </Animated.View>
        </GestureDetector>
      )}

      {/* Navigation Bar - Always on front/bottom */}
      <View style={[styles.bottomNav, themeStyles.navBg, {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 2000,
        backgroundColor: isDark ? 'rgba(26, 26, 26, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        borderTopWidth: 1,
        borderTopColor: isDark ? '#374151' : '#f3f4f6',
        height: 75,
        paddingBottom: 20
      }]}>
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
    </GestureHandlerRootView>
  );
}





