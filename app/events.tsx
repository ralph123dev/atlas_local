import { Calendar, LayoutDashboard, MapPin, Plus, Search, X } from 'lucide-react-native';
import React, { useContext, useState } from 'react';
import { Alert, FlatList, Image, KeyboardAvoidingView, Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomNavigation } from '../components/BottomNavigation';
import { SideMenu } from '../components/SideMenu';
import { styles } from '../constants/styles/Events.styles';
import { NavigationContext } from './NavigationContext';
import { ThemeContext } from './ThemeContext';

interface Event {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    location: string;
    description: string;
    type: string;
    thumbnail: string;
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
    }
];

export default function EventsScreen() {
    const router = useContext(NavigationContext);
    const { theme } = useContext(ThemeContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('menu');

    const [events, setEvents] = useState<Event[]>(MOCK_EVENTS);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

    // Filtres
    const [selectedType, setSelectedType] = useState('Tous');
    const [searchQuery, setSearchQuery] = useState('');

    // Formulaire nouvel événement
    const [newEvent, setNewEvent] = useState<Partial<Event>>({
        name: '',
        startDate: '',
        endDate: '',
        location: '',
        description: '',
        type: 'Général',
        thumbnail: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
    });

    const isDark = theme === 'dark';
    const isBlue = theme === 'blue';

    const themeStyles = {
        container: { backgroundColor: isDark ? '#1a1a1a' : isBlue ? '#15202b' : '#fff' },
        header: { borderBottomColor: isDark ? '#374151' : isBlue ? '#38444d' : '#f3f4f6' },
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
        });
        Alert.alert('Succès', 'Votre événement a été ajouté !');
    };

    const filteredEvents = events.filter(e => {
        const matchesType = selectedType === 'Tous' || e.type === selectedType;
        const matchesSearch = e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            e.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
            e.startDate.includes(searchQuery);
        return matchesType && matchesSearch;
    });

    const renderEventItem = ({ item }: { item: Event }) => (
        <TouchableOpacity
            style={[styles.eventCard, themeStyles.cardBg]}
            onPress={() => router.push('/event-detail', { event: item })}
        >
            <Image source={{ uri: item.thumbnail }} style={styles.eventThumbnail} />
            <View style={styles.eventInfo}>
                <View style={[styles.eventTag, { backgroundColor: isDark || isBlue ? 'rgba(0, 87, 183, 0.2)' : 'rgba(0, 87, 183, 0.1)' }]}>
                    <Text style={styles.eventTagText}>{item.type}</Text>
                </View>
                <Text style={[styles.eventTitle, themeStyles.text]}>{item.name}</Text>

                <View style={styles.eventDetailRow}>
                    <Calendar size={14} color="#0057b7" />
                    <Text style={[styles.eventDetailText, themeStyles.subText]}>
                        Du {item.startDate} au {item.endDate || item.startDate}
                    </Text>
                </View>

                <View style={styles.eventDetailRow}>
                    <MapPin size={14} color="#0057b7" />
                    <Text style={[styles.eventDetailText, themeStyles.subText]}>{item.location}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    const types = ['Tous', 'Musique', 'Culture', 'Sport', 'Général', 'Pro'];

    return (
        <SafeAreaView style={[styles.container, themeStyles.container]}>
            <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

            {/* Header */}
            <View style={[styles.header, themeStyles.header]}>
                <TouchableOpacity
                    style={[styles.headerButton, styles.createButton]}
                    onPress={() => setIsCreateModalVisible(true)}
                >
                    <Plus size={20} color="#fff" />
                    <Text style={[styles.buttonText, styles.createText]}>Créer</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.headerButton, styles.dashboardButton, { backgroundColor: isDark || isBlue ? '#333' : '#f3f4f6' }]}>
                    <LayoutDashboard size={20} color={isDark || isBlue ? '#fff' : '#1a1a1a'} />
                    <Text style={[styles.buttonText, isDark || isBlue ? styles.createText : styles.dashboardText]}>Tableau de bord</Text>
                </TouchableOpacity>
            </View>

            {/* Filtres */}
            <View style={[styles.filterSection, themeStyles.header]}>
                <View style={{ paddingHorizontal: 16, marginBottom: 12 }}>
                    <View style={[styles.input, themeStyles.inputBg, { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 }]}>
                        <Search size={18} color={themeStyles.subText.color} />
                        <TextInput
                            style={{ flex: 1, color: themeStyles.text.color }}
                            placeholder="Rechercher par lieu ou date..."
                            placeholderTextColor={themeStyles.subText.color}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                </View>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.filterScroll}
                >
                    {types.map(type => (
                        <TouchableOpacity
                            key={type}
                            onPress={() => setSelectedType(type)}
                            style={[
                                styles.filterChip,
                                themeStyles.filterChip(selectedType === type)
                            ]}
                        >
                            <Text style={[
                                styles.filterChipText,
                                themeStyles.filterText(selectedType === type)
                            ]}>
                                {type}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <View style={styles.content}>
                <FlatList
                    data={filteredEvents}
                    keyExtractor={item => item.id}
                    renderItem={renderEventItem}
                    contentContainerStyle={styles.eventList}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Search size={48} color={themeStyles.subText.color} />
                            <Text style={[styles.emptyStateText, themeStyles.subText]}>Aucun événement trouvé</Text>
                        </View>
                    }
                />
            </View>

            {/* Modal Création */}
            <Modal
                visible={isCreateModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsCreateModalVisible(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.modalOverlay}
                >
                    <View style={[styles.modalContent, themeStyles.modalBg]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, themeStyles.text]}>Créer un événement</Text>
                            <TouchableOpacity onPress={() => setIsCreateModalVisible(false)}>
                                <X size={24} color={themeStyles.text.color} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, themeStyles.text]}>Nom de l'événement</Text>
                                <TextInput
                                    style={[styles.input, themeStyles.inputBg]}
                                    placeholder="Ex: Soirée Networking"
                                    placeholderTextColor={themeStyles.subText.color}
                                    value={newEvent.name}
                                    onChangeText={text => setNewEvent({ ...newEvent, name: text })}
                                />
                            </View>

                            <View style={{ flexDirection: 'row', gap: 12 }}>
                                <View style={[styles.inputGroup, { flex: 1 }]}>
                                    <Text style={[styles.label, themeStyles.text]}>Date de début</Text>
                                    <TextInput
                                        style={[styles.input, themeStyles.inputBg]}
                                        placeholder="AAAA-MM-JJ"
                                        placeholderTextColor={themeStyles.subText.color}
                                        value={newEvent.startDate}
                                        onChangeText={text => setNewEvent({ ...newEvent, startDate: text })}
                                    />
                                </View>
                                <View style={[styles.inputGroup, { flex: 1 }]}>
                                    <Text style={[styles.label, themeStyles.text]}>Date de fin</Text>
                                    <TextInput
                                        style={[styles.input, themeStyles.inputBg]}
                                        placeholder="AAAA-MM-JJ"
                                        placeholderTextColor={themeStyles.subText.color}
                                        value={newEvent.endDate}
                                        onChangeText={text => setNewEvent({ ...newEvent, endDate: text })}
                                    />
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, themeStyles.text]}>Lieu</Text>
                                <TextInput
                                    style={[styles.input, themeStyles.inputBg]}
                                    placeholder="Adresse ou nom du lieu"
                                    placeholderTextColor={themeStyles.subText.color}
                                    value={newEvent.location}
                                    onChangeText={text => setNewEvent({ ...newEvent, location: text })}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, themeStyles.text]}>Type d'événement</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    {types.slice(1).map(type => (
                                        <TouchableOpacity
                                            key={type}
                                            onPress={() => setNewEvent({ ...newEvent, type })}
                                            style={[
                                                styles.filterChip,
                                                themeStyles.filterChip(newEvent.type === type)
                                            ]}
                                        >
                                            <Text style={[
                                                styles.filterChipText,
                                                themeStyles.filterText(newEvent.type === type)
                                            ]}>
                                                {type}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, themeStyles.text]}>Thumbnail (URL de l'image)</Text>
                                <TextInput
                                    style={[styles.input, themeStyles.inputBg]}
                                    placeholder="https://..."
                                    placeholderTextColor={themeStyles.subText.color}
                                    value={newEvent.thumbnail}
                                    onChangeText={text => setNewEvent({ ...newEvent, thumbnail: text })}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, themeStyles.text]}>Description</Text>
                                <TextInput
                                    style={[styles.input, themeStyles.inputBg, styles.textArea]}
                                    placeholder="Décrivez votre événement..."
                                    placeholderTextColor={themeStyles.subText.color}
                                    multiline
                                    numberOfLines={4}
                                    value={newEvent.description}
                                    onChangeText={text => setNewEvent({ ...newEvent, description: text })}
                                />
                            </View>

                            <TouchableOpacity
                                style={styles.submitButton}
                                onPress={handleCreateEvent}
                            >
                                <Text style={styles.submitButtonText}>Créer l'événement</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            <BottomNavigation
                activeTab={activeTab}
                onTabPress={setActiveTab}
                isHome={false}
                onMenuPress={() => setIsMenuOpen(true)}
            />
        </SafeAreaView>
    );
}
