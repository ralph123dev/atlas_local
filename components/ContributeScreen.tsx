import * as ImagePicker from 'expo-image-picker';
import { Award, BookOpen, Briefcase, Camera, Check, ChevronDown, ChevronRight, Edit3, Globe, Heart, Home, Image as ImageIcon, Info, MapPin, MessageSquare, MoreVertical, Navigation, Phone, PlusCircle, Send, Star, Utensils, X } from 'lucide-react-native';
import React, { useContext, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Image, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
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

    const [isProposedPlaceOptionsVisible, setIsProposedPlaceOptionsVisible] = useState(false);
    const [isChangeProposedPlaceVisible, setIsChangeProposedPlaceVisible] = useState(false);
    const [proposedPlace, setProposedPlace] = useState(mockPlaces[0]);

    // State for "Other Ways to Contribute"
    const [isOtherWayVisible, setIsOtherWayVisible] = useState(false);
    const [otherWayTab, setOtherWayTab] = useState('services');
    const [otherWayData, setOtherWayData] = useState({
        name: '',
        address: '',
        category: 'Sélectionner une catégorie',
        eventDate: '',
        eventTime: '',
        website: '',
        phone: '',
        email: '',
        file: null as string | null
    });
    const [isOtherCategoryPickerVisible, setIsOtherCategoryPickerVisible] = useState(false);

    const otherCategories = [
        { name: 'Restauration', icon: Utensils },
        { name: 'Mode & Beauté', icon: Briefcase },
        { name: 'Éducation', icon: BookOpen },
        { name: 'Santé & Bien-être', icon: Heart },
        { name: 'Loisirs & Parcs', icon: MapPin },
        { name: 'Services Publics', icon: Home },
        { name: 'Technologie', icon: Briefcase },
        { name: 'Art & Culture', icon: Award },
        { name: 'Finance & Banque', icon: Briefcase },
        { name: 'Sport', icon: PlusCircle },
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

    const handleAddPhotoActionPress = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("Permission", "Nexora souhaite accéder à votre appareil photo pour prendre des photos des lieux.");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled) {
            setCapturedPhoto(result.assets[0].uri);
            setIsAddPhotoVisible(true);
            setIsCameraActive(false);
            setPhotoComment('');
        }
    };

    const handleCapturePhoto = async () => {
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled) {
            setCapturedPhoto(result.assets[0].uri);
        }
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
                <View style={[styles.section, themeStyles.card, styles.badgeCard]}>
                    <View style={styles.badgeHeader}>
                        <View style={styles.badgeIconBg}>
                            <Award size={28} color="#f59e0b" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.badgeTitle, themeStyles.text]}>Obtenez votre badge</Text>
                            <Text style={[styles.badgeSubtitle, themeStyles.subText]}>Nouveau contributeur</Text>
                        </View>
                    </View>

                    <View style={[styles.divider, themeStyles.divider, { marginVertical: 12 }]} />

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
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                                        <Text style={[styles.taskName, themeStyles.text]}>{task.title}</Text>
                                        <Text style={[styles.taskStatus, themeStyles.subText]}>{task.current}/{task.target}</Text>
                                    </View>
                                    <View style={[styles.taskProgressBg, { backgroundColor: themeStyles.progressBarBg }]}>
                                        <View style={[styles.taskProgressFill, { width: `${(task.current / task.target) * 100}%`, backgroundColor: themeStyles.progressBarFill }]} />
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}

                    <TouchableOpacity
                        style={[styles.moreActionsBtn, { borderTopColor: themeStyles.divider.backgroundColor }]}
                        onPress={() => setIsOtherWayVisible(true)}
                    >
                        <PlusCircle size={20} color={themeStyles.progressBarFill} />
                        <Text style={[styles.moreActionsText, { color: themeStyles.progressBarFill }]}>Autres façons de contribuer</Text>
                        <ChevronRight size={16} color={themeStyles.progressBarFill} style={{ marginLeft: 'auto' }} />
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
                                {isPublishing ? <ActivityIndicator color="#fff" /> : <Text style={styles.publishButtonText}>Envoyer l'avis</Text>}
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
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

            {/* Modal Autres façons de contribuer */}
            <Modal
                visible={isOtherWayVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsOtherWayVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={[styles.modalContent, themeStyles.card, { height: '95%' }]}>
                        {/* Menu Horizontal en haut */}
                        <View style={styles.otherWayHeader}>
                            <TouchableOpacity onPress={() => setIsOtherWayVisible(false)} style={styles.closeBtnOther}>
                                <X size={24} color={themeStyles.text.color} />
                            </TouchableOpacity>
                            <Text style={[styles.modalTitle, themeStyles.text, { flex: 1, textAlign: 'center' }]}>Contribuer</Text>
                            <View style={{ width: 40 }} />
                        </View>

                        <View style={styles.otherWayMenu}>
                            {[
                                { id: 'services', label: 'Services', icon: Briefcase },
                                { id: 'evenements', label: 'Événements', icon: Award },
                                { id: 'signaler', label: 'Signaler', icon: Info },
                                { id: 'partager', label: 'Partager', icon: Send }
                            ].map((tab) => (
                                <TouchableOpacity
                                    key={tab.id}
                                    style={[
                                        styles.otherWayTab,
                                        otherWayTab === tab.id && styles.otherWayTabActive,
                                        otherWayTab === tab.id && { borderBottomColor: themeStyles.progressBarFill }
                                    ]}
                                    onPress={() => setOtherWayTab(tab.id)}
                                >
                                    <tab.icon size={18} color={otherWayTab === tab.id ? themeStyles.progressBarFill : themeStyles.subText.color} />
                                    <Text style={[
                                        styles.otherWayTabText,
                                        { color: otherWayTab === tab.id ? themeStyles.progressBarFill : themeStyles.subText.color },
                                        otherWayTab === tab.id && { fontWeight: 'bold' }
                                    ]}>
                                        {tab.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, themeStyles.text]}>Nom du service</Text>
                                <TextInput
                                    style={[styles.popupInput, { minHeight: 45, color: themeStyles.text.color, borderColor: themeStyles.divider.backgroundColor }]}
                                    placeholder="ex: café du coin"
                                    placeholderTextColor={themeStyles.subText.color}
                                    value={otherWayData.name}
                                    onChangeText={(text) => setOtherWayData({ ...otherWayData, name: text })}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, themeStyles.text]}>Adresse</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, height: 45, borderColor: themeStyles.divider.backgroundColor }}>
                                    <Text style={{ color: themeStyles.progressBarFill, fontWeight: 'bold', fontSize: 18 }}>@</Text>
                                    <TextInput
                                        style={{ flex: 1, marginLeft: 8, color: themeStyles.text.color }}
                                        placeholder="Entrez l'adresse"
                                        placeholderTextColor={themeStyles.subText.color}
                                        value={otherWayData.address}
                                        onChangeText={(text) => setOtherWayData({ ...otherWayData, address: text })}
                                    />
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, themeStyles.text]}>Catégorie</Text>
                                <TouchableOpacity
                                    style={[styles.popupInput, { minHeight: 45, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderColor: themeStyles.divider.backgroundColor }]}
                                    onPress={() => setIsOtherCategoryPickerVisible(true)}
                                >
                                    <Text style={{ color: otherWayData.category === 'Sélectionner une catégorie' ? themeStyles.subText.color : themeStyles.text.color }}>
                                        {otherWayData.category}
                                    </Text>
                                    <ChevronDown size={20} color={themeStyles.subText.color} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, themeStyles.text]}>Date et heure de l'événement</Text>
                                <View style={{ flexDirection: 'row', gap: 10 }}>
                                    <TextInput
                                        style={[styles.popupInput, { flex: 1, minHeight: 45, color: themeStyles.text.color, borderColor: themeStyles.divider.backgroundColor }]}
                                        placeholder="JJ/MM/AAAA"
                                        placeholderTextColor={themeStyles.subText.color}
                                        value={otherWayData.eventDate}
                                        onChangeText={(text) => setOtherWayData({ ...otherWayData, eventDate: text })}
                                    />
                                    <TextInput
                                        style={[styles.popupInput, { flex: 1, minHeight: 45, color: themeStyles.text.color, borderColor: themeStyles.divider.backgroundColor }]}
                                        placeholder="HH:MM"
                                        placeholderTextColor={themeStyles.subText.color}
                                        value={otherWayData.eventTime}
                                        onChangeText={(text) => setOtherWayData({ ...otherWayData, eventTime: text })}
                                    />
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, themeStyles.text]}>Moyens de contact</Text>
                                <View style={{ gap: 10 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, height: 45, borderColor: themeStyles.divider.backgroundColor }}>
                                        <Globe size={18} color={themeStyles.subText.color} />
                                        <TextInput
                                            style={{ flex: 1, marginLeft: 8, color: themeStyles.text.color }}
                                            placeholder="Lien du site"
                                            placeholderTextColor={themeStyles.subText.color}
                                            value={otherWayData.website}
                                            onChangeText={(text) => setOtherWayData({ ...otherWayData, website: text })}
                                        />
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, height: 45, borderColor: themeStyles.divider.backgroundColor }}>
                                        <Phone size={18} color={themeStyles.subText.color} />
                                        <TextInput
                                            style={{ flex: 1, marginLeft: 8, color: themeStyles.text.color }}
                                            placeholder="Numéro de tél"
                                            placeholderTextColor={themeStyles.subText.color}
                                            keyboardType="phone-pad"
                                            value={otherWayData.phone}
                                            onChangeText={(text) => setOtherWayData({ ...otherWayData, phone: text })}
                                        />
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, height: 45, borderColor: themeStyles.divider.backgroundColor }}>
                                        <Send size={18} color={themeStyles.subText.color} />
                                        <TextInput
                                            style={{ flex: 1, marginLeft: 8, color: themeStyles.text.color }}
                                            placeholder="Email"
                                            placeholderTextColor={themeStyles.subText.color}
                                            keyboardType="email-address"
                                            value={otherWayData.email}
                                            onChangeText={(text) => setOtherWayData({ ...otherWayData, email: text })}
                                        />
                                    </View>
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, themeStyles.text]}>Ajouter une photo ou vidéo (optionnel)</Text>
                                <TouchableOpacity
                                    style={[styles.imageUploadBtn, { backgroundColor: isDark ? '#374151' : '#f0f4f8', borderColor: themeStyles.divider.backgroundColor }]}
                                    onPress={async () => {
                                        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                                        if (status === 'granted') {
                                            const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, mediaTypes: ImagePicker.MediaTypeOptions.All, quality: 0.7 });
                                            if (!result.canceled) setOtherWayData({ ...otherWayData, file: result.assets[0].uri });
                                        }
                                    }}
                                >
                                    <ImageIcon size={32} color={themeStyles.progressBarFill} />
                                    <Text style={[styles.imageUploadText, themeStyles.subText]}>Cliquer pour choisir un fichier</Text>
                                </TouchableOpacity>
                                {otherWayData.file && (
                                    <View style={{ marginTop: 10, height: 150, borderRadius: 12, overflow: 'hidden' }}>
                                        <Image source={{ uri: otherWayData.file }} style={{ width: '100%', height: '100%' }} />
                                    </View>
                                )}
                            </View>

                            <TouchableOpacity
                                style={[styles.publishButton, { backgroundColor: themeStyles.progressBarFill, marginTop: 30 }]}
                                onPress={() => {
                                    Alert.alert("Succès", "Votre contribution a été soumise avec succès !");
                                    setIsOtherWayVisible(false);
                                }}
                            >
                                <Text style={styles.publishButtonText}>Soumettre</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Picker de Catégories pour "Autres façons" */}
            <Modal
                visible={isOtherCategoryPickerVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsOtherCategoryPickerVisible(false)}
            >

                <View style={[styles.popupOverlay, { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
                    <View style={[styles.popupContent, themeStyles.card, { maxHeight: '70%', width: '90%', alignItems: 'stretch' }]}>
                        <View style={[styles.modalHeader, { marginBottom: 15 }]}>
                            <Text style={[styles.popupTitle, themeStyles.text]}>Choisir une catégorie</Text>
                            <TouchableOpacity onPress={() => setIsOtherCategoryPickerVisible(false)}>
                                <X size={20} color={themeStyles.subText.color} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView>
                            {otherCategories.map((cat) => (
                                <TouchableOpacity
                                    key={cat.name}
                                    style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: themeStyles.divider.backgroundColor }}
                                    onPress={() => {
                                        setOtherWayData({ ...otherWayData, category: cat.name });
                                        setIsOtherCategoryPickerVisible(false);
                                    }}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
                                        <cat.icon size={20} color={themeStyles.progressBarFill} />
                                        <Text style={{ fontSize: 16, color: themeStyles.text.color }}>{cat.name}</Text>
                                    </View>
                                    {otherWayData.category === cat.name && <Check size={18} color={themeStyles.progressBarFill} />}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
};
