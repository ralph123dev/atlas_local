import { Award, BookOpen, Briefcase, Camera, Check, ChevronDown, Edit3, Globe, Heart, Home, Image as ImageIcon, MapPin, MessageSquare, Navigation, Phone, PlusCircle, Send, Trash2, Utensils, X } from 'lucide-react-native';
import React, { useContext, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { ThemeContext } from '../app/ThemeContext';

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
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    section: {
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
    },
    profileSection: {
        marginTop: 8
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        marginRight: 16,
    },
    profileInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    userLevel: {
        fontSize: 13,
        fontWeight: '600',
        marginTop: 2,
    },
    progressContainer: {
        marginTop: 4,
    },
    progressTextRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    progressLabel: {
        fontSize: 12,
    },
    pointsText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    progressBarContainer: {
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    progressSubtitle: {
        fontSize: 11,
        marginTop: 8,
    },
    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        marginTop: 24,
        marginBottom: 8,
    },
    actionsScrollContent: {
        paddingHorizontal: 8,
    },
    actionButton: {
        alignItems: 'center',
        width: 90,
        marginHorizontal: 6,
    },
    actionIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        borderWidth: 1,
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    actionLabel: {
        fontSize: 11,
        textAlign: 'center',
        fontWeight: '500',
    },
    badgeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    badgeTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 12,
        flex: 1,
    },
    divider: {
        height: 1,
        width: '100%',
        marginBottom: 16,
    },
    taskItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    taskLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    taskIconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    taskContent: {
        flex: 1,
        marginRight: 16,
    },
    taskName: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 6,
    },
    taskProgressBg: {
        height: 4,
        width: '100%',
        borderRadius: 2,
    },
    taskProgressFill: {
        height: '100%',
        borderRadius: 2,
    },
    taskStatus: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    moreActionsBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 16,
        marginTop: 8,
        borderTopWidth: 1,
    },
    moreActionsText: {
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    emptyFeedText: {
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 18,
    },
    // Balloon Card Styles
    balloonCard: {
        alignItems: 'center',
        paddingVertical: 24,
    },
    balloonIconBg: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#fff5f5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#fee2e2',
    },
    balloonEmoji: {
        fontSize: 32,
    },
    balloonTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    balloonDescription: {
        fontSize: 14,
        textAlign: 'center',
        paddingHorizontal: 20,
        lineHeight: 20,
        marginBottom: 16,
    },
    contribNowBtn: {
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    contribNowText: {
        color: '#34a853',
        fontWeight: 'bold',
        fontSize: 15,
    },
    // Modal Styles
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    modalContent: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        minHeight: 450,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    galleryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    galleryItem: {
        width: '31%',
        aspectRatio: 1,
        marginBottom: 12,
        borderRadius: 12,
        overflow: 'hidden',
    },
    galleryImage: {
        width: '100%',
        height: '100%',
    },
    galleryItemSelected: {
        borderWidth: 4,
        borderColor: '#0057b7',
    },
    checkOverlay: {
        position: 'absolute',
        top: 6,
        right: 6,
        backgroundColor: '#0057b7',
        borderRadius: 12,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    publishButton: {
        marginTop: 24,
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
    },
    publishButtonDisabled: {
        opacity: 0.5,
    },
    publishButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    popupOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    popupContent: {
        width: '85%',
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        borderWidth: 1,
    },
    popupTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    popupSubtitle: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 20,
    },
    popupInput: {
        width: '100%',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        minHeight: 80,
        textAlignVertical: 'top',
        marginBottom: 24,
    },
    popupActions: {
        flexDirection: 'row',
        width: '100%',
    },
    popupButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 24,
        alignItems: 'center',
    },
    popupButtonText: {
        fontWeight: 'bold',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        marginTop: 15,
    },
    mapPreviewContainer: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
    },
    mapPreview: {
        ...StyleSheet.absoluteFillObject,
    },
    mapMarkerFixed: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: -16,
        marginTop: -32,
    },
    imageUploadBtn: {
        width: '100%',
        height: 100,
        borderRadius: 12,
        borderWidth: 1,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageUploadText: {
        fontSize: 14,
        marginTop: 8,
    },
    inputGroup: {
        width: '100%',
    }
});
