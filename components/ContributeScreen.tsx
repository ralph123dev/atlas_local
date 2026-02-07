import { Award, BookOpen, Briefcase, Camera, Check, ChevronDown, Edit3, Globe, Heart, Home, Image as ImageIcon, Info, MapPin, MessageSquare, MoreVertical, Navigation, Phone, PlusCircle, Search, Send, Star, Trash2, Utensils, X, XCircle } from 'lucide-react-native';
import React, { useContext, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { ThemeContext } from '../app/ThemeContext';
import { styles } from '../constants/styles/Contribute.styles';

export const ContributeScreen = () => {
    const { theme } = useContext(ThemeContext);
    const isDark = theme === 'dark';

    const themeStyles = {
        container: { backgroundColor: isDark ? '#1a1a1a' : '#fff' },
        card: { backgroundColor: isDark ? '#2a2a2a' : '#fff', borderColor: isDark ? '#374151' : '#e5e7eb' },
        text: { color: isDark ? '#f3f4f6' : '#202124' },
        subText: { color: isDark ? '#9ca3af' : '#5f6368' },
        divider: { backgroundColor: isDark ? '#374151' : '#e5e7eb' },
        progressBarBg: isDark ? '#4b5563' : '#e6e6e6',
        progressBarFill: isDark ? '#60a5fa' : '#0057b7',
        iconActive: isDark ? '#60a5fa' : '#0057b7',
    };

    const userProfile = {
        name: 'Ralph Urgue',
        level: 'Local Guide niveau 6',
        points: 4250,
        nextLevel: 5000,
        avatar: 'https://github.com/shadcn.png' // Mock avatar
    };

    const progress = userProfile.points / userProfile.nextLevel;

    const actionButtons = [
        { label: 'Ajouter un lieu', icon: MapPin },
        { label: 'Modifier un lieu', icon: Edit3 },
        { label: 'Ajouter un avis', icon: MessageSquare },
        { label: 'Ajouter une photo', icon: Camera },
        { label: 'Modifier une route', icon: Navigation },
        { label: 'Vérifier infos', icon: Check },
    ];

    const tasks = [
        { id: 1, title: 'Publier 2 photos', current: 1, target: 2, icon: Camera },
        { id: 2, title: 'Rédiger 2 avis', current: 0, target: 2, icon: MessageSquare },
        { id: 3, title: 'Répondre à 2 questions', current: 0, target: 2, icon: MessageSquare },
    ];

    // State for interactions
    const [isGalleryVisible, setIsGalleryVisible] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
    const [isQuestionModalVisible, setIsQuestionModalVisible] = useState(false);
    const [questionResponse, setQuestionResponse] = useState('');
    const scrollRef = useRef<ScrollView>(null);
    const mainScrollRef = useRef<ScrollView>(null);
    const [isAddPlaceVisible, setIsAddPlaceVisible] = useState(false);
    const [isCategoryPickerVisible, setIsCategoryPickerVisible] = useState(false);
    const [placeData, setPlaceData] = useState({
        name: '',
        category: 'Sélectionner une catégorie',
        userAddress: '',
        phone: '',
        website: '',
        image: null as string | null
    });

    const [isAddReviewVisible, setIsAddReviewVisible] = useState(false);
    const [reviewData, setReviewData] = useState({
        placeName: '',
        review: ''
    });

    const [isAddPhotoVisible, setIsAddPhotoVisible] = useState(false);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
    const [photoComment, setPhotoComment] = useState('');

    const categories = [
        { name: 'Restaurant', icon: Utensils },
        { name: 'Magasin', icon: Briefcase },
        { name: 'Hôtel', icon: Home },
        { name: 'Religion', icon: Heart },
        { name: 'Parc', icon: MapPin },
        { name: 'École', icon: BookOpen },
        { name: 'Santé', icon: Heart },
        { name: 'Finance', icon: Briefcase },
        { name: 'Autre', icon: PlusCircle }
    ];

    const mockPlaces = [
        { id: 1, name: 'Boutique Glamour', description: 'Une boutique de mode élégante située au centre-ville.' },
        { id: 2, name: 'Boulangerie Patachou', description: 'Des croissants chauds et des pains artisanaux tous les matins.' },
        { id: 3, name: 'Café de la Gare', description: 'L\'endroit idéal pour attendre votre train avec un bon café.' },
        { id: 4, name: 'Pharmacie Centrale', description: 'Une pharmacie ouverte 24h/24 pour tous vos besoins de santé.' },
        { id: 5, name: 'Librairie des Arts', description: 'Une vaste collection de livres d\'art et de littérature classique.' }
    ];

    // State for interactions
    const [isProposedPlaceOptionsVisible, setIsProposedPlaceOptionsVisible] = useState(false);
    const [isChangeProposedPlaceVisible, setIsChangeProposedPlaceVisible] = useState(false);
    const [proposedPlace, setProposedPlace] = useState(mockPlaces[0]);

    const isFormValid = placeData.name.trim() !== '' && placeData.category !== 'Sélectionner une catégorie';
    const isReviewValid = reviewData.placeName.trim() !== '' && reviewData.review.trim() !== '';
    const isPhotoValid = capturedPhoto !== null;

    const handleAddPlacePress = () => {
        setIsAddPlaceVisible(true);
    };

    const handleSelectCategory = (cat: string) => {
        setPlaceData({ ...placeData, category: cat });
        setIsCategoryPickerVisible(false);
    };

    const handleSubmitPlace = () => {
        if (!placeData.name || placeData.category === 'Sélectionner une catégorie') {
            Alert.alert("Erreur", "Veuillez remplir au moins le nom et la catégorie.");
            return;
        }
        setIsPublishing(true);
        setTimeout(() => {
            setIsPublishing(false);
            setIsAddPlaceVisible(false);
            setPlaceData({
                name: '',
                category: 'Sélectionner une catégorie',
                userAddress: '',
                phone: '',
                website: '',
                image: null
            });
            Alert.alert("Succès", "Le lieu a été ajouté avec succès !");
        }, 1500);
    };

    const handleAddReviewPress = () => {
        setIsAddReviewVisible(true);
    };

    const handleSubmitReview = () => {
        if (!reviewData.placeName || !reviewData.review) {
            Alert.alert("Erreur", "Veuillez entrer le nom du lieu et votre avis.");
            return;
        }
        setIsPublishing(true);
        setTimeout(() => {
            setIsPublishing(false);
            setIsAddReviewVisible(false);
            setReviewData({ placeName: '', review: '' });
            Alert.alert("Succès", "Votre avis a été publié avec succès !");
        }, 1500);
    };

    const handleAddPhotoActionPress = () => {
        Alert.alert(
            "Autorisation",
            "Nexora souhaite accéder à votre appareil photo pour prendre des photos des lieux.",
            [
                { text: "Refuser", style: "cancel" },
                {
                    text: "Accepter", onPress: () => {
                        setIsAddPhotoVisible(true);
                        setIsCameraActive(true);
                        setCapturedPhoto(null);
                        setPhotoComment('');
                    }
                }
            ]
        );
    };

    const handleCapturePhoto = () => {
        // Mock capture - use a random image from picsum
        const mockPhoto = `https://picsum.photos/800/600?random=${Date.now()}`;
        setCapturedPhoto(mockPhoto);
        setIsCameraActive(false);
    };

    const handleSubmitPhoto = () => {
        if (!capturedPhoto) return;
        setIsPublishing(true);
        setTimeout(() => {
            setIsPublishing(false);
            setIsAddPhotoVisible(false);
            setCapturedPhoto(null);
            setPhotoComment('');
            Alert.alert("Succès", "Votre photo a été postée avec succès !");
        }, 1500);
    };

    const handleTaskPress = (taskId: number) => {
        if (taskId === 1) { // Publier photos
            handleAddPhotoActionPress();
        } else if (taskId === 3) { // Répondre à des questions
            setIsQuestionModalVisible(true);
        }
    };

    const handlePhotoSelection = (photoId: string) => {
        setSelectedPhoto(photoId);
    };

    const handlePublishPhoto = () => {
        if (!selectedPhoto) return;
        setIsPublishing(true);
        setTimeout(() => {
            setIsPublishing(false);
            setIsGalleryVisible(false);
            setSelectedPhoto(null);
            Alert.alert("Succès", "Votre photo a été publiée avec succès !");
        }, 1500);
    };

    const closeQuestionModal = () => {
        setIsQuestionModalVisible(false);
        setQuestionResponse('');
    };

    const handleIgnoreProposedPlace = () => {
        setIsProposedPlaceOptionsVisible(false);
        setIsChangeProposedPlaceVisible(true);
    };

    const handleSelectNewProposedPlace = (place: typeof mockPlaces[0]) => {
        setProposedPlace(place);
        setIsChangeProposedPlaceVisible(false);
    };

    return (
        <View style={[styles.mainContainer, themeStyles.container]}>
            <ScrollView
                ref={mainScrollRef}
                showsVerticalScrollIndicator={false}
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: 150, flexGrow: 1 }}
            >
                {/* Profile Section */}
                <View style={[styles.section, styles.profileSection, themeStyles.card]}>
                    <View style={styles.profileHeader}>
                        <Image source={{ uri: userProfile.avatar }} style={styles.avatar} />
                        <View style={styles.profileInfo}>
                            <Text style={[styles.userName, themeStyles.text]}>{userProfile.name}</Text>
                            <Text style={[styles.userLevel, { color: '#e85d04' }]}>{userProfile.level}</Text>
                        </View>
                    </View>

                    <View style={styles.progressContainer}>
                        <View style={styles.progressTextRow}>
                            <Text style={[styles.progressLabel, themeStyles.subText]}>Progression du niveau</Text>
                            <Text style={[styles.pointsText, themeStyles.subText]}>{userProfile.points} / {userProfile.nextLevel}</Text>
                        </View>
                        <View style={[styles.progressBarContainer, { backgroundColor: themeStyles.progressBarBg }]}>
                            <View style={[styles.progressBarFill, { width: `${progress * 100}%`, backgroundColor: themeStyles.progressBarFill }]} />
                        </View>
                        <Text style={[styles.progressSubtitle, themeStyles.subText]}>Plus que {userProfile.nextLevel - userProfile.points} points pour le niveau suivant</Text>
                    </View>
                </View>

                {/* Horizontal Action Menu */}
                <View style={styles.actionsContainer}>

                    <ScrollView
                        ref={scrollRef}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.actionsScrollContent}
                    >
                        {actionButtons.map((btn, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.actionButton}
                                onPress={() => {
                                    if (btn.label === 'Ajouter un lieu') handleAddPlacePress();
                                    else if (btn.label === 'Ajouter un avis') handleAddReviewPress();
                                    else if (btn.label === 'Ajouter une photo') handleAddPhotoActionPress();
                                }}
                            >
                                <View style={[styles.actionIconContainer, themeStyles.card, styles.shadow]}>
                                    <btn.icon size={24} color="#0057b7" />
                                </View>
                                <Text style={[styles.actionLabel, themeStyles.subText]}>{btn.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                </View>

                {/* Badge Challenge Section */}
                <View style={[styles.section, themeStyles.card]}>
                    <View style={styles.badgeHeader}>
                        <Award size={24} color="#f59e0b" />
                        <Text style={[styles.badgeTitle, themeStyles.text]}>Obtenez votre badge Nouveau contributeur</Text>
                    </View>

                    <View style={[styles.divider, themeStyles.divider]} />

                    {tasks.map((task) => (
                        <TouchableOpacity
                            key={task.id}
                            style={styles.taskItem}
                            onPress={() => handleTaskPress(task.id)}
                        >
                            <View style={styles.taskLeft}>
                                <View style={[styles.taskIconCircle, { backgroundColor: isDark ? '#374151' : '#f0f4f8' }]}>
                                    <task.icon size={18} color={isDark ? '#9ca3af' : '#5f6368'} />
                                </View>
                                <View style={styles.taskContent}>
                                    <Text style={[styles.taskName, themeStyles.text]}>{task.title}</Text>
                                    <View style={[styles.taskProgressBg, { backgroundColor: themeStyles.progressBarBg }]}>
                                        <View style={[styles.taskProgressFill, { width: `${(task.current / task.target) * 100}%`, backgroundColor: themeStyles.progressBarFill }]} />
                                    </View>
                                </View>
                            </View>
                            <Text style={[styles.taskStatus, themeStyles.subText]}>{task.current}/{task.target}</Text>
                        </TouchableOpacity>
                    ))}

                    <TouchableOpacity style={[styles.moreActionsBtn, { borderTopColor: themeStyles.divider.backgroundColor }]}>
                        <PlusCircle size={20} color={themeStyles.progressBarFill} />
                        <Text style={[styles.moreActionsText, { color: themeStyles.progressBarFill }]}>Autres façons de contribuer</Text>
                    </TouchableOpacity>
                </View>

                {/* Balloon Contribution Card */}
                <View style={[styles.section, styles.balloonCard, themeStyles.card]}>
                    <View style={styles.balloonIconBg}>
                        <Text style={styles.balloonEmoji}>🎈</Text>
                    </View>
                    <Text style={[styles.balloonTitle, themeStyles.text]}>Contribuer</Text>
                    <Text style={[styles.balloonDescription, themeStyles.subText]}>
                        Vos contributions aident des millions de personnes à découvrir de nouveaux lieux et à prendre de meilleures décisions.
                    </Text>
                    <TouchableOpacity style={styles.contribNowBtn}>
                        <Text style={styles.contribNowText}>Contribuer maintenant</Text>
                    </TouchableOpacity>
                </View>

                {/* Proposed Place Rating Section */}
                {proposedPlace && (
                    <View style={[styles.section, themeStyles.card, styles.proposedPlaceCard]}>
                        <View style={styles.proposedPlaceHeader}>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.proposedPlaceTitle, themeStyles.text]}>{proposedPlace.name}</Text>
                                <Text style={[styles.proposedPlaceDesc, themeStyles.subText]}>{proposedPlace.description}</Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => setIsProposedPlaceOptionsVisible(true)}
                                style={styles.moreOptionsBtnSmall}
                            >
                                <MoreVertical size={20} color={themeStyles.subText.color} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.ratingStarsContainer}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} size={32} color="#dadce0" style={{ marginHorizontal: 4 }} />
                            ))}
                        </View>
                        <Text style={[styles.noterLieuText, { color: themeStyles.progressBarFill }]}>Noter ce lieu</Text>

                        <TouchableOpacity style={styles.ignoreLink} onPress={handleIgnoreProposedPlace}>
                            <Text style={styles.blueLinkText}>Ignorer</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Additional Section */}
                <View style={[styles.section, themeStyles.card, { alignItems: 'center', padding: 30 }]}>
                    <Text style={[styles.emptyFeedText, themeStyles.subText]}>Rédigez des avis, importez des photos et aidez les autres usagers en partageant vos expériences locales.</Text>
                </View>
            </ScrollView>

            {/* Modal Ajouter un lieu */}
            <Modal
                visible={isAddPlaceVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsAddPlaceVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={[styles.modalContent, themeStyles.card, { height: '90%' }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, themeStyles.text]}>Ajouter un lieu</Text>
                            <TouchableOpacity onPress={() => setIsAddPlaceVisible(false)}>
                                <X size={24} color={themeStyles.subText.color} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                            {/* Nom du lieu */}
                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, themeStyles.text]}>Nom du lieu</Text>
                                <TextInput
                                    style={[styles.popupInput, { minHeight: 45, color: themeStyles.text.color, borderColor: themeStyles.divider.backgroundColor }]}
                                    placeholder="Ex: Restaurant Le Gourmet"
                                    placeholderTextColor={themeStyles.subText.color}
                                    value={placeData.name}
                                    onChangeText={(text) => setPlaceData({ ...placeData, name: text })}
                                />
                            </View>

                            {/* Catégorie (Menu déroulant simulé) */}
                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, themeStyles.text]}>Catégorie</Text>
                                <TouchableOpacity
                                    style={[styles.popupInput, { minHeight: 45, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderColor: themeStyles.divider.backgroundColor }]}
                                    onPress={() => setIsCategoryPickerVisible(true)}
                                >
                                    <Text style={{ color: placeData.category === 'Sélectionner une catégorie' ? (isDark ? '#9ca3af' : '#5f6368') : (isDark ? '#f3f4f6' : '#202124') }}>
                                        {placeData.category}
                                    </Text>
                                    <ChevronDown size={20} color={isDark ? '#9ca3af' : '#5f6368'} />
                                </TouchableOpacity>
                            </View>

                            {/* Votre adresse */}
                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, themeStyles.text]}>Votre adresse</Text>
                                <TextInput
                                    style={[styles.popupInput, { minHeight: 45, color: themeStyles.text.color, borderColor: themeStyles.divider.backgroundColor }]}
                                    placeholder="Ex: 123 Rue de la Paix, Paris"
                                    placeholderTextColor={themeStyles.subText.color}
                                    value={placeData.userAddress}
                                    onChangeText={(text) => setPlaceData({ ...placeData, userAddress: text })}
                                />
                            </View>

                            {/* Carte */}
                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, themeStyles.text]}>Localisation sur la carte</Text>
                                <View style={[styles.mapPreviewContainer, { borderColor: themeStyles.divider.backgroundColor, height: 200, borderRadius: 12, overflow: 'hidden', marginVertical: 10 }]}>
                                    <MapView
                                        provider={PROVIDER_GOOGLE}
                                        style={StyleSheet.absoluteFillObject}
                                        initialRegion={{
                                            latitude: 5.452391,
                                            longitude: 10.0683,
                                            latitudeDelta: 0.01,
                                            longitudeDelta: 0.01,
                                        }}
                                        customMapStyle={isDark ? [
                                            { "elementType": "geometry", "stylers": [{ "color": "#242f3e" }] },
                                            { "elementType": "labels.text.fill", "stylers": [{ "color": "#746855" }] },
                                            { "elementType": "labels.text.stroke", "stylers": [{ "color": "#242f3e" }] },
                                            { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#17263c" }] }
                                        ] : []}
                                    />
                                    <View style={{ position: 'absolute', top: '50%', left: '50%', marginLeft: -16, marginTop: -32 }}>
                                        <MapPin size={32} color="#ea4335" />
                                    </View>
                                </View>
                            </View>

                            {/* Image du lieu */}
                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, themeStyles.text]}>Image du lieu</Text>
                                <TouchableOpacity
                                    style={[styles.imageUploadBtn, { backgroundColor: isDark ? '#374151' : '#f0f4f8', padding: 20, borderRadius: 12, alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: themeStyles.divider.backgroundColor }]}
                                    onPress={() => setIsGalleryVisible(true)}
                                >
                                    <ImageIcon size={32} color={isDark ? '#60a5fa' : '#0057b7'} />
                                    <Text style={[styles.imageUploadText, themeStyles.subText, { marginTop: 8 }]}>Ajouter une photo</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Contact */}
                            <View style={styles.inputGroup}>
                                <View style={{ flexDirection: 'row', gap: 10 }}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.label, themeStyles.text]}>Téléphone</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, height: 45, borderColor: themeStyles.divider.backgroundColor }}>
                                            <Phone size={18} color={isDark ? '#9ca3af' : '#5f6368'} />
                                            <TextInput
                                                style={{ flex: 1, marginLeft: 8, color: themeStyles.text.color }}
                                                placeholder="+33..."
                                                placeholderTextColor={themeStyles.subText.color}
                                                keyboardType="phone-pad"
                                                value={placeData.phone}
                                                onChangeText={(text) => setPlaceData({ ...placeData, phone: text })}
                                            />
                                        </View>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.label, themeStyles.text]}>Site Web</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, height: 45, borderColor: themeStyles.divider.backgroundColor }}>
                                            <Globe size={18} color={isDark ? '#9ca3af' : '#5f6368'} />
                                            <TextInput
                                                style={{ flex: 1, marginLeft: 8, color: themeStyles.text.color }}
                                                placeholder="www..."
                                                placeholderTextColor={themeStyles.subText.color}
                                                value={placeData.website}
                                                onChangeText={(text) => setPlaceData({ ...placeData, website: text })}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <TouchableOpacity
                                style={[styles.publishButton, {
                                    backgroundColor: isFormValid ? themeStyles.progressBarFill : themeStyles.progressBarBg,
                                    opacity: isFormValid ? 1 : 0.6
                                }]}
                                onPress={handleSubmitPlace}
                                disabled={!isFormValid || isPublishing}
                            >
                                {isPublishing ? <ActivityIndicator color="#fff" /> : <Text style={[styles.publishButtonText, { color: isFormValid ? '#fff' : themeStyles.subText.color }]}>Ajouter le lieu</Text>}
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Picker de Catégories */}
            <Modal
                visible={isCategoryPickerVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsCategoryPickerVisible(false)}
            >
                <View style={[styles.popupOverlay, { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
                    <View style={[styles.popupContent, themeStyles.card, { maxHeight: '70%', width: '90%', alignItems: 'stretch' }]}>
                        <View style={[styles.modalHeader, { marginBottom: 15 }]}>
                            <Text style={[styles.popupTitle, themeStyles.text]}>Choisir une catégorie</Text>
                            <TouchableOpacity onPress={() => setIsCategoryPickerVisible(false)}>
                                <X size={20} color={themeStyles.subText.color} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView>
                            {categories.map((cat) => (
                                <TouchableOpacity
                                    key={cat.name}
                                    style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: themeStyles.divider.backgroundColor }}
                                    onPress={() => handleSelectCategory(cat.name)}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
                                        <cat.icon size={20} color={themeStyles.progressBarFill} />
                                        <Text style={{ fontSize: 16, color: themeStyles.text.color }}>{cat.name}</Text>
                                    </View>
                                    {placeData.category === cat.name && <Check size={18} color={themeStyles.progressBarFill} />}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Modal Ajouter un avis */}
            <Modal
                visible={isAddReviewVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsAddReviewVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={[styles.modalContent, themeStyles.card, { height: '85%' }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, themeStyles.text]}>Ajouter un avis</Text>
                            <TouchableOpacity onPress={() => setIsAddReviewVisible(false)}>
                                <X size={24} color={themeStyles.subText.color} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {/* Nom du lieu */}
                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, themeStyles.text]}>Nom du lieu</Text>
                                <TextInput
                                    style={[styles.popupInput, { minHeight: 45, color: themeStyles.text.color, borderColor: themeStyles.divider.backgroundColor }]}
                                    placeholder="Ex: Musée National"
                                    placeholderTextColor={themeStyles.subText.color}
                                    value={reviewData.placeName}
                                    onChangeText={(text) => setReviewData({ ...reviewData, placeName: text })}
                                />
                            </View>

                            {/* Carte */}
                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, themeStyles.text]}>Localisation du lieu</Text>
                                <View style={[styles.mapPreviewContainer, { borderColor: themeStyles.divider.backgroundColor, height: 180, borderRadius: 12, overflow: 'hidden', marginVertical: 10 }]}>
                                    <MapView
                                        provider={PROVIDER_GOOGLE}
                                        style={StyleSheet.absoluteFillObject}
                                        initialRegion={{
                                            latitude: 5.452391,
                                            longitude: 10.0683,
                                            latitudeDelta: 0.01,
                                            longitudeDelta: 0.01,
                                        }}
                                        customMapStyle={isDark ? [
                                            { "elementType": "geometry", "stylers": [{ "color": "#242f3e" }] },
                                            { "elementType": "labels.text.fill", "stylers": [{ "color": "#746855" }] },
                                            { "elementType": "labels.text.stroke", "stylers": [{ "color": "#242f3e" }] },
                                            { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#17263c" }] }
                                        ] : []}
                                    />
                                    <View style={{ position: 'absolute', top: '50%', left: '50%', marginLeft: -16, marginTop: -32 }}>
                                        <MapPin size={32} color="#ea4335" />
                                    </View>
                                </View>
                            </View>

                            {/* Avis */}
                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, themeStyles.text]}>Votre avis</Text>
                                <TextInput
                                    style={[styles.popupInput, { minHeight: 120, textAlignVertical: 'top', color: themeStyles.text.color, borderColor: themeStyles.divider.backgroundColor }]}
                                    placeholder="Partagez votre expérience ici..."
                                    placeholderTextColor={themeStyles.subText.color}
                                    multiline
                                    value={reviewData.review}
                                    onChangeText={(text) => setReviewData({ ...reviewData, review: text })}
                                />
                            </View>

                            <TouchableOpacity
                                style={[styles.publishButton, {
                                    backgroundColor: isReviewValid ? themeStyles.progressBarFill : themeStyles.progressBarBg,
                                    opacity: isReviewValid ? 1 : 0.6,
                                    marginTop: 20
                                }]}
                                onPress={handleSubmitReview}
                                disabled={!isReviewValid || isPublishing}
                            >
                                {isPublishing ? <ActivityIndicator color="#fff" /> : (
                                    <>
                                        <Send size={20} color={isReviewValid ? "#fff" : themeStyles.subText.color} />
                                        <Text style={[styles.publishButtonText, { color: isReviewValid ? '#fff' : themeStyles.subText.color }]}>Envoyer l'avis</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Modal Ajouter une photo (Appareil Photo) */}
            <Modal
                visible={isAddPhotoVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsAddPhotoVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={[styles.modalContent, themeStyles.card, { height: '90%' }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, themeStyles.text]}>{isCameraActive ? "Prendre une photo" : "Détails de la photo"}</Text>
                            <TouchableOpacity onPress={() => setIsAddPhotoVisible(false)}>
                                <X size={24} color={themeStyles.subText.color} />
                            </TouchableOpacity>
                        </View>

                        {isCameraActive ? (
                            <View style={{ flex: 1, backgroundColor: '#000', borderRadius: 12, justifyContent: 'flex-end', paddingBottom: 40, alignItems: 'center' }}>
                                <Text style={{ color: '#fff', position: 'absolute', top: 20, textAlign: 'center' }}>Viseur de l'appareil photo</Text>
                                <TouchableOpacity
                                    style={{ width: 70, height: 70, borderRadius: 35, backgroundColor: '#fff', borderWidth: 5, borderColor: '#ccc' }}
                                    onPress={handleCapturePhoto}
                                />
                            </View>
                        ) : (
                            <ScrollView showsVerticalScrollIndicator={false}>
                                {capturedPhoto && (
                                    <View style={{ width: '100%', height: 300, borderRadius: 12, overflow: 'hidden', marginBottom: 20 }}>
                                        <Image source={{ uri: capturedPhoto }} style={{ width: '100%', height: '100%' }} />
                                        <TouchableOpacity
                                            style={{ position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.5)', padding: 8, borderRadius: 20 }}
                                            onPress={() => setIsCameraActive(true)}
                                        >
                                            <Trash2 size={20} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                )}

                                <View style={styles.inputGroup}>
                                    <Text style={[styles.label, themeStyles.text]}>Commentaire</Text>
                                    <TextInput
                                        style={[styles.popupInput, { minHeight: 80, textAlignVertical: 'top', color: themeStyles.text.color, borderColor: themeStyles.divider.backgroundColor }]}
                                        placeholder="Décrivez ce qui se passe sur cette photo..."
                                        placeholderTextColor={themeStyles.subText.color}
                                        multiline
                                        value={photoComment}
                                        onChangeText={setPhotoComment}
                                    />
                                </View>

                                <TouchableOpacity
                                    style={[styles.publishButton, { backgroundColor: themeStyles.progressBarFill, marginTop: 20 }]}
                                    onPress={handleSubmitPhoto}
                                >
                                    {isPublishing ? <ActivityIndicator color="#fff" /> : <Text style={styles.publishButtonText}>Poster la photo</Text>}
                                </TouchableOpacity>
                            </ScrollView>
                        )}
                    </View>
                </View>
            </Modal>

            {/* Simulated Gallery Modal */}
            <Modal
                visible={isGalleryVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsGalleryVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={[styles.modalContent, themeStyles.card]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, themeStyles.text]}>Choisir une photo</Text>
                            <TouchableOpacity onPress={() => setIsGalleryVisible(false)}>
                                <X size={24} color={themeStyles.subText.color} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.galleryGrid}>
                            {[1, 2, 3, 4, 5, 6].map((item) => (
                                <TouchableOpacity
                                    key={item}
                                    style={[
                                        styles.galleryItem,
                                        selectedPhoto === `photo_${item}` && styles.galleryItemSelected
                                    ]}
                                    onPress={() => handlePhotoSelection(`photo_${item}`)}
                                >
                                    <Image
                                        source={{ uri: `https://picsum.photos/200/200?random=${item}` }}
                                        style={styles.galleryImage}
                                    />
                                    {selectedPhoto === `photo_${item}` && (
                                        <View style={styles.checkOverlay}>
                                            <Check size={16} color="#fff" />
                                        </View>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TouchableOpacity
                            style={[
                                styles.publishButton,
                                !selectedPhoto && styles.publishButtonDisabled,
                                { backgroundColor: themeStyles.progressBarFill }
                            ]}
                            onPress={handlePublishPhoto}
                            disabled={!selectedPhoto || isPublishing}
                        >
                            {isPublishing ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.publishButtonText}>Publier la photo</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Answer Questions Popup */}
            <Modal
                visible={isQuestionModalVisible}
                animationType="fade"
                transparent={true}
                onRequestClose={closeQuestionModal}
            >
                <View style={styles.popupOverlay}>
                    <View style={[styles.popupContent, themeStyles.card]}>
                        <Text style={[styles.popupTitle, themeStyles.text]}>Aidez la communauté</Text>
                        <Text style={[styles.popupSubtitle, themeStyles.subText]}>Connaissez-vous les horaires d'ouverture de "Chez Marcel" ?</Text>

                        <TextInput
                            style={[styles.popupInput, { color: themeStyles.text.color, borderColor: themeStyles.divider.backgroundColor }]}
                            placeholder="Votre réponse ici..."
                            placeholderTextColor={themeStyles.subText.color}
                            value={questionResponse}
                            onChangeText={setQuestionResponse}
                            multiline
                        />

                        <View style={styles.popupActions}>
                            <TouchableOpacity
                                style={[styles.popupButton, { backgroundColor: themeStyles.progressBarBg }]}
                                onPress={closeQuestionModal}
                            >
                                <Text style={[styles.popupButtonText, themeStyles.text]}>Fermer</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.popupButton, { backgroundColor: themeStyles.progressBarFill, marginLeft: 10 }]}
                                onPress={() => {
                                    Alert.alert("Merci !", "Votre réponse a été enregistrée.");
                                    closeQuestionModal();
                                }}
                            >
                                <Text style={[styles.popupButtonText, { color: '#fff' }]}>Envoyer</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Options Modal for Proposed Place */}
            <Modal
                visible={isProposedPlaceOptionsVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsProposedPlaceOptionsVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlayTransparent}
                    activeOpacity={1}
                    onPress={() => setIsProposedPlaceOptionsVisible(false)}
                >
                    <View style={[styles.menuPopup, themeStyles.card]}>
                        <TouchableOpacity style={styles.menuItem} onPress={handleIgnoreProposedPlace}>
                            <Trash2 size={20} color={themeStyles.subText.color} />
                            <Text style={[styles.menuItemText, themeStyles.text]}>Ignorer ce lieu</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItem} onPress={() => setIsProposedPlaceOptionsVisible(false)}>
                            <XCircle size={20} color={themeStyles.subText.color} />
                            <Text style={[styles.menuItemText, themeStyles.text]}>Lieu non visité</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItem} onPress={() => setIsProposedPlaceOptionsVisible(false)}>
                            <Info size={20} color={themeStyles.subText.color} />
                            <Text style={[styles.menuItemText, themeStyles.text]}>En savoir plus sur ce lieu</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItem} onPress={() => {
                            setIsProposedPlaceOptionsVisible(false);
                            setIsChangeProposedPlaceVisible(true);
                        }}>
                            <Search size={20} color={themeStyles.subText.color} />
                            <Text style={[styles.menuItemText, themeStyles.text]}>Rechercher un autre lieu</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* Change Proposed Place Modal */}
            <Modal
                visible={isChangeProposedPlaceVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsChangeProposedPlaceVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={[styles.modalContent, themeStyles.card]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, themeStyles.text]}>Choisir un lieu</Text>
                            <TouchableOpacity onPress={() => setIsChangeProposedPlaceVisible(false)}>
                                <X size={24} color={themeStyles.subText.color} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {mockPlaces.map((place) => (
                                <TouchableOpacity
                                    key={place.id}
                                    style={styles.placeItem}
                                    onPress={() => handleSelectNewProposedPlace(place)}
                                >
                                    <View style={styles.placeIconCircle}>
                                        <MapPin size={20} color="#0057b7" />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.placeItemName, themeStyles.text]}>{place.name}</Text>
                                        <Text style={[styles.placeItemDesc, themeStyles.subText]} numberOfLines={1}>{place.description}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
};


