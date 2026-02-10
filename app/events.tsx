import { ChevronLeft, ChevronRight, Cloud, Heart, LayoutDashboard, LocateFixed, MessageCircleQuestion, Mic, Plus, Search, Share2, User, X } from 'lucide-react-native';
import React, { useContext, useRef, useState } from 'react';
import { Alert, Dimensions, Image, KeyboardAvoidingView, Modal, Platform, ScrollView, Share, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SideMenu } from '../components/SideMenu';
import { styles } from '../constants/styles/Events.styles';
import { NavigationContext } from './NavigationContext';
import { ThemeContext } from './ThemeContext';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const SHEET_MIN_HEIGHT = 160;
const SHEET_MAX_HEIGHT = SCREEN_HEIGHT * 0.85;

interface Event {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    location: string;
    description: string;
    type: string;
    thumbnail: string;
    distance: string;
}

const MOCK_EVENTS: Event[] = [
    {
        id: '1',
        name: 'Festival de Jazz d\'Ottawa',
        startDate: '2026-06-20',
        endDate: '2026-06-30',
        location: 'Parc de la Confédération, Ottawa',
        description: 'Le plus grand festival de jazz de la région avec des artistes internationaux.',
        type: 'Musique',
        thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80',
        distance: '1.2 km',
    },
    {
        id: '2',
        name: 'Gatineau en Couleurs',
        startDate: '2026-10-10',
        endDate: '2026-10-12',
        location: 'Parc Jacques-Cartier, Gatineau',
        description: 'Célébration de l\'automne avec des activités pour toute la famille.',
        type: 'Culture',
        thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80',
        distance: '3.5 km',
    },
    {
        id: '3',
        name: 'Match de Gala',
        startDate: '2026-02-15',
        endDate: '2026-02-15',
        location: 'Stade Omnisports, Yaoundé',
        description: 'Un événement sportif majeur réunissant les légendes du football.',
        type: 'Sport',
        thumbnail: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80',
        distance: '0.8 km',
    }
];

export default function EventsScreen() {
    const router = useContext(NavigationContext);
    const { theme } = useContext(ThemeContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [likedEvents, setLikedEvents] = useState<string[]>([]);

    const [events, setEvents] = useState<Event[]>(MOCK_EVENTS);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

    // Filtres
    const [selectedType, setSelectedType] = useState('Tous');
    const [searchQuery, setSearchQuery] = useState('');

    // Map Logic
    const mapRef = useRef<MapView>(null);
    const [is3D, setIs3D] = useState(false);

    // BottomSheet Logic
    const translateY = useSharedValue(SCREEN_HEIGHT - SHEET_MIN_HEIGHT);
    const context = useSharedValue({ y: 0 });

    const panGesture = Gesture.Pan()
        .onStart(() => {
            context.value = { y: translateY.value };
        })
        .onUpdate((event) => {
            let nextValue = context.value.y + event.translationY;
            // Clamping
            if (nextValue < SCREEN_HEIGHT - SHEET_MAX_HEIGHT) {
                nextValue = SCREEN_HEIGHT - SHEET_MAX_HEIGHT;
            }
            if (nextValue > SCREEN_HEIGHT - SHEET_MIN_HEIGHT) {
                nextValue = SCREEN_HEIGHT - SHEET_MIN_HEIGHT;
            }
            translateY.value = nextValue;
        })
        .onEnd((event) => {
            if (event.velocityY < -500 || translateY.value < SCREEN_HEIGHT - (SHEET_MAX_HEIGHT + SHEET_MIN_HEIGHT) / 2) {
                translateY.value = withSpring(SCREEN_HEIGHT - SHEET_MAX_HEIGHT, { damping: 20, stiffness: 100 });
            } else {
                translateY.value = withSpring(SCREEN_HEIGHT - SHEET_MIN_HEIGHT, { damping: 20, stiffness: 100 });
            }
        });

    const animatedSheetStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY.value }],
        };
    });

    // Formulaire nouvel événement
    const [newEvent, setNewEvent] = useState<Partial<Event>>({
        name: '',
        startDate: '',
        endDate: '',
        location: '',
        description: '',
        type: 'Général',
        thumbnail: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
        distance: '0 km',
    });

    const isDark = theme === 'dark';
    const isBlue = theme === 'blue';

    const themeStyles = {
        container: { backgroundColor: isDark ? '#1a1a1a' : isBlue ? '#15202b' : '#fff' },
        header: { borderBottomColor: isDark ? '#374151' : isBlue ? '#38444d' : '#f3f4f6' },
        headerBg: { backgroundColor: isDark ? '#1a1a1a' : isBlue ? '#15202b' : '#fff' },
        text: { color: isDark || isBlue ? '#f3f4f6' : '#1a1a1a' },
        subText: { color: isDark || isBlue ? '#8899a6' : '#6b7280' },
        cardBg: { backgroundColor: isDark ? '#262626' : isBlue ? '#1e2732' : '#fff' },
        inputBg: {
            backgroundColor: isDark ? '#333' : isBlue ? '#273340' : '#f9f9f9',
            borderColor: isDark ? '#444' : isBlue ? '#38444d' : '#e5e7eb',
            color: isDark || isBlue ? '#fff' : '#1a1a1a'
        },
        modalBg: { backgroundColor: isDark ? '#1a1a1a' : isBlue ? '#15202b' : '#fff' },
        filterChip: (active: boolean) => ({
            backgroundColor: active ? '#0057b7' : (isDark ? '#333' : isBlue ? '#273340' : '#f3f4f6'),
            borderColor: active ? '#0057b7' : (isDark ? '#444' : isBlue ? '#38444d' : '#e5e7eb'),
        }),
        filterText: (active: boolean) => ({
            color: active ? '#fff' : (isDark || isBlue ? '#8899a6' : '#6b7280'),
        })
    };

    const handleCreateEvent = () => {
        if (!newEvent.name || !newEvent.startDate || !newEvent.location) {
            Alert.alert('Champs requis', 'Veuillez remplir au moins le nom, la date et le lieu.');
            return;
        }

        const eventToAdd: Event = {
            ...newEvent as Event,
            id: Date.now().toString(),
        };

        setEvents([eventToAdd, ...events]);
        setIsCreateModalVisible(false);
        setNewEvent({
            name: '',
            startDate: '',
            endDate: '',
            location: '',
            description: '',
            type: 'Général',
            thumbnail: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
            distance: '0 km',
        });
        Alert.alert('Succès', 'Votre événement a été ajouté !');
    };

    const handleShare = async (event: Event) => {
        try {
            const result = await Share.share({
                message: `Découvrez cet événement : ${event.name}\nLieu : ${event.location}\nLien : https://nexora.app/events/${event.id}`,
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error: any) {
            Alert.alert('Erreur', error.message);
        }
    };

    const toggleLike = (id: string) => {
        if (likedEvents.includes(id)) {
            setLikedEvents(likedEvents.filter(eId => eId !== id));
        } else {
            setLikedEvents([...likedEvents, id]);
        }
    };

    const filteredEvents = events.filter(e => {
        const matchesType = selectedType === 'Tous' || e.type === selectedType;
        const matchesSearch = e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            e.location.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesType && matchesSearch;
    });

    const types = ['Tous', 'Musique', 'Culture', 'Sport', 'Général', 'Pro', 'Festivals'];

    const handleTypeSelect = (type: string) => {
        setSelectedType(type);
        translateY.value = withSpring(SCREEN_HEIGHT - SHEET_MAX_HEIGHT, { damping: 25, stiffness: 150 });
    };

    const handleRecenter = () => {
        mapRef.current?.animateToRegion({
            latitude: 3.848,
            longitude: 11.5021,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
        }, 1000);
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
        { "elementType": "geometry", "stylers": [{ "color": "#242f3e" }] },
        { "elementType": "labels.text.fill", "stylers": [{ "color": "#746855" }] },
        { "elementType": "labels.text.stroke", "stylers": [{ "color": "#242f3e" }] },
        { "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
        { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
        { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#263c3f" }] },
        { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [{ "color": "#6b9a76" }] },
        { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#38414e" }] },
        { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "color": "#212a37" }] },
        { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#9ca5b3" }] },
        { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#746855" }] },
        { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#1f2835" }] },
        { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [{ "color": "#f3d19c" }] },
        { "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#2f3948" }] },
        { "featureType": "transit.station", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
        { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#17263c" }] },
        { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#515c6d" }] },
        { "featureType": "water", "elementType": "labels.text.stroke", "stylers": [{ "color": "#17263c" }] }
    ];

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={[styles.container, themeStyles.container]}>
                <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

                {/* Navigation Header (Top Bar) (Optionally visible depending on UX preference) */}
                <View style={[styles.navHeader, themeStyles.headerBg, themeStyles.header]}>
                    <View style={styles.headerRight}>
                        <TouchableOpacity
                            style={styles.navTabBtn}
                            onPress={() => router.push('/dashboard')}
                        >
                            <LayoutDashboard size={18} color={themeStyles.text.color} />
                            <Text style={[styles.navTabText, themeStyles.text]}>Tableau de bord</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.createEventBtn}
                            onPress={() => setIsCreateModalVisible(true)}
                        >
                            <Plus size={18} color="#fff" />
                            <Text style={styles.createEventText}>Créer un événement</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Main View Area with Map */}
                <View style={{ flex: 1 }}>
                    <MapView
                        ref={mapRef}
                        provider={PROVIDER_GOOGLE}
                        style={{ ...Dimensions.get('window'), position: 'absolute' }}
                        initialRegion={{
                            latitude: 3.848,
                            longitude: 11.5021,
                            latitudeDelta: 0.1,
                            longitudeDelta: 0.1,
                        }}
                        customMapStyle={isDark || isBlue ? darkMapStyle : []}
                    >
                    </MapView>

                    {/* Floating Search Bar */}
                    <View style={styles.floatingHeader}>
                        <View style={[styles.floatingSearchContainer, styles.shadow, themeStyles.modalBg]}>
                            <View style={styles.searchBranding}>
                                <Image source={require('@/assets/images/logo.png')} style={styles.searchLogo} />
                            </View>
                            <TextInput
                                style={[styles.searchInput, { color: themeStyles.text.color }]}
                                placeholder="Rechercher des événements"
                                placeholderTextColor={themeStyles.subText.color}
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                            <TouchableOpacity style={styles.searchIconBtn}>
                                <Mic size={20} color={themeStyles.text.color} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.searchIconBtn}
                                onPress={() => router.push('/auth')}
                            >
                                <User size={20} color={themeStyles.text.color} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickActionsScroll} contentContainerStyle={styles.quickActionsContent}>
                            {types.map((type) => (
                                <TouchableOpacity key={type} style={[styles.quickActionBtn, styles.shadow, themeStyles.filterChip(selectedType === type)]} onPress={() => handleTypeSelect(type)}>
                                    <Text style={[styles.quickActionText, themeStyles.filterText(selectedType === type)]}>{type}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Map Controls */}
                    <View style={{ position: 'absolute', right: 15, bottom: SHEET_MIN_HEIGHT + 100, gap: 10 }}>
                        <TouchableOpacity style={[{ width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' }, styles.shadow, themeStyles.modalBg]} onPress={toggle3D}>
                            <Text style={{ fontWeight: 'bold', color: is3D ? '#0057b7' : themeStyles.subText.color }}>3D</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[{ width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' }, styles.shadow, themeStyles.modalBg]} onPress={handleRecenter}>
                            <LocateFixed size={22} color="#0057b7" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Bottom Sheet for Events */}
                <Animated.View style={[styles.bottomSheet, themeStyles.modalBg, animatedSheetStyle]}>
                    <GestureDetector gesture={panGesture}>
                        <View style={{ backgroundColor: 'transparent' }}>
                            <View style={styles.sheetHandleContainer}><View style={styles.sheetHandle} /></View>
                            <View style={[styles.sheetHeader, { borderBottomWidth: 0, marginBottom: 10 }]}>
                                <View><Text style={[styles.sheetCityName, themeStyles.text]}>Yaoundé, Cameroun</Text></View>
                                <View style={styles.weatherInfo}>
                                    <Cloud size={24} color="#0057b7" />
                                    <Text style={[styles.temperatureText, themeStyles.text]}>23°C</Text>
                                </View>
                            </View>
                        </View>
                    </GestureDetector>

                    <ScrollView
                        style={[styles.sheetContent, { flex: 1 }]}
                        contentContainerStyle={{ paddingBottom: 250 }}
                        showsVerticalScrollIndicator={false}
                        nestedScrollEnabled={true}
                    >
                        {filteredEvents.length > 0 ? (
                            <View style={styles.carouselContainer}>
                                <Text style={[themeStyles.subText, { alignSelf: 'flex-start', marginBottom: 15, fontSize: 16, fontWeight: '600' }]}>
                                    Événements : {selectedType}
                                </Text>
                                <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={{ width: SCREEN_WIDTH }} contentContainerStyle={{ paddingHorizontal: 20 }} nestedScrollEnabled={true}>
                                    {Array.from({ length: Math.ceil(filteredEvents.length / 2) }).map((_, pageIdx) => (
                                        <View key={pageIdx} style={[styles.cardsRow, { width: SCREEN_WIDTH - 40, marginRight: 20 }]}>
                                            {[filteredEvents[pageIdx * 2], filteredEvents[pageIdx * 2 + 1]].map((event, idx) => (
                                                event && (
                                                    <TouchableOpacity key={`event-${event.id}`} style={styles.twinCard} onPress={() => router.push('/event-detail', { event })}>
                                                        <View style={styles.twinBlackFrame}>
                                                            <Image source={{ uri: event.thumbnail }} style={styles.fullImage} resizeMode="cover" />
                                                            <TouchableOpacity
                                                                style={{ position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 15, padding: 5 }}
                                                                onPress={() => toggleLike(event.id)}
                                                            >
                                                                <Heart size={16} color={likedEvents.includes(event.id) ? '#ff4b4b' : '#fff'} fill={likedEvents.includes(event.id) ? '#ff4b4b' : 'transparent'} />
                                                            </TouchableOpacity>
                                                        </View>
                                                        <View style={styles.twinCardInfo}>
                                                            <Text style={[styles.twinCardTitle, themeStyles.text]} numberOfLines={1}>{event.name}</Text>
                                                            <Text style={[styles.twinCardSub, themeStyles.subText]}>{event.type} • ★ 4.8</Text>
                                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                <Text style={[styles.twinCardDistance, themeStyles.subText]}>{event.distance}</Text>
                                                                <TouchableOpacity
                                                                    style={{ padding: 4 }}
                                                                    onPress={() => handleShare(event)}
                                                                >
                                                                    <Share2 size={16} color={themeStyles.subText.color} />
                                                                </TouchableOpacity>
                                                            </View>
                                                        </View>
                                                    </TouchableOpacity>
                                                )
                                            ))}
                                        </View>
                                    ))}
                                </ScrollView>

                                <TouchableOpacity style={styles.seeAllTrendingBtn}>
                                    <Text style={styles.seeAllTrendingText}>See all trending</Text>
                                    <ChevronRight size={16} color="#6b7280" />
                                </TouchableOpacity>

                                <View style={{ width: '100%', marginTop: 30 }}>
                                    <Text style={[themeStyles.text, { fontSize: 18, fontWeight: 'bold', marginBottom: 15 }]}>Découvrir aussi</Text>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false} nestedScrollEnabled={true}>
                                        {MOCK_EVENTS.map((item) => (
                                            <TouchableOpacity key={`suggested-${item.id}`} style={{ marginRight: 20, width: 160 }} onPress={() => router.push('/event-detail', { event: item })}>
                                                <View style={styles.twinBlackFrame}><Image source={{ uri: item.thumbnail }} style={styles.fullImage} /></View>
                                                <Text style={[themeStyles.text, { fontWeight: 'bold', marginTop: 10, fontSize: 14 }]} numberOfLines={1}>{item.name}</Text>
                                                <Text style={[themeStyles.subText, { fontSize: 12, marginTop: 2 }]}>{item.distance}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>
                            </View>
                        ) : (
                            <View style={styles.emptyState}>
                                <Search size={48} color={themeStyles.subText.color} />
                                <Text style={[styles.emptyStateText, themeStyles.subText]}>Aucun événement trouvé</Text>
                            </View>
                        )}
                    </ScrollView>
                </Animated.View>

                {/* Bottom Navigation */}
                <View style={[styles.bottomNav, { height: 90, paddingBottom: 30 }]}>
                    <TouchableOpacity style={styles.navTab} onPress={() => router.push('/home')}>
                        <ChevronLeft size={24} color="#6b7280" />
                        <Text style={styles.navTabTextBtn}>Retour</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.navTab} onPress={() => setIsMenuOpen(true)}>
                        <Image source={require('../assets/images/more.png')} style={{ width: 24, height: 24, tintColor: '#6b7280' }} />
                        <Text style={styles.navTabTextBtn}>Menu</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.navTab, { backgroundColor: '#f0f9ff', borderRadius: 20 }]} onPress={() => { }}>
                        <Search size={24} color="#0057b7" />
                        <Text style={[styles.navTabTextBtn, styles.activeNavText]}>Événements</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.navTab} onPress={() => router.push('/ask')}>
                        <MessageCircleQuestion size={24} color="#6b7280" />
                        <Text style={styles.navTabTextBtn}>Ask</Text>
                    </TouchableOpacity>
                </View>

                {/* Create Modal */}
                <Modal visible={isCreateModalVisible} animationType="slide" transparent={true} onRequestClose={() => setIsCreateModalVisible(false)}>
                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
                        <View style={[styles.modalContent, themeStyles.modalBg]}>
                            <View style={styles.modalHeader}>
                                <Text style={[styles.modalTitle, themeStyles.text]}>Créer un événement</Text>
                                <TouchableOpacity onPress={() => setIsCreateModalVisible(false)}><X size={24} color={themeStyles.text.color} /></TouchableOpacity>
                            </View>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View style={styles.inputGroup}><Text style={[styles.label, themeStyles.text]}>Nom de l'événement</Text><TextInput style={[styles.input, themeStyles.inputBg]} placeholder="Ex: Soirée Networking" placeholderTextColor={themeStyles.subText.color} value={newEvent.name} onChangeText={text => setNewEvent({ ...newEvent, name: text })} /></View>
                                <View style={{ flexDirection: 'row', gap: 12 }}>
                                    <View style={[styles.inputGroup, { flex: 1 }]}><Text style={[styles.label, themeStyles.text]}>Date de début</Text><TextInput style={[styles.input, themeStyles.inputBg]} placeholder="AAAA-MM-JJ" placeholderTextColor={themeStyles.subText.color} value={newEvent.startDate} onChangeText={text => setNewEvent({ ...newEvent, startDate: text })} /></View>
                                    <View style={[styles.inputGroup, { flex: 1 }]}><Text style={[styles.label, themeStyles.text]}>Date de fin</Text><TextInput style={[styles.input, themeStyles.inputBg]} placeholder="AAAA-MM-JJ" placeholderTextColor={themeStyles.subText.color} value={newEvent.endDate} onChangeText={text => setNewEvent({ ...newEvent, endDate: text })} /></View>
                                </View>
                                <View style={styles.inputGroup}><Text style={[styles.label, themeStyles.text]}>Lieu</Text><TextInput style={[styles.input, themeStyles.inputBg]} placeholder="Adresse ou nom du lieu" placeholderTextColor={themeStyles.subText.color} value={newEvent.location} onChangeText={text => setNewEvent({ ...newEvent, location: text })} /></View>
                                <View style={styles.inputGroup}><Text style={[styles.label, themeStyles.text]}>Thumbnail (URL)</Text><TextInput style={[styles.input, themeStyles.inputBg]} placeholder="https://..." placeholderTextColor={themeStyles.subText.color} value={newEvent.thumbnail} onChangeText={text => setNewEvent({ ...newEvent, thumbnail: text })} /></View>
                                <View style={styles.inputGroup}><Text style={[styles.label, themeStyles.text]}>Description</Text><TextInput style={[styles.input, themeStyles.inputBg, styles.textArea]} placeholder="Décrivez votre événement..." placeholderTextColor={themeStyles.subText.color} multiline numberOfLines={4} value={newEvent.description} onChangeText={text => setNewEvent({ ...newEvent, description: text })} /></View>
                                <TouchableOpacity style={styles.submitButton} onPress={handleCreateEvent}><Text style={styles.submitButtonText}>Créer l'événement</Text></TouchableOpacity>
                            </ScrollView>
                        </View>
                    </KeyboardAvoidingView>
                </Modal>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}
