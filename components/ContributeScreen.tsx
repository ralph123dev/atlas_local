
import { Award, Camera, Check, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Edit3, MapPin, MessageSquare, Navigation, PlusCircle, X } from 'lucide-react-native';
import React, { useContext, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
    const [scrollOffset, setScrollOffset] = useState(0);
    const [verticalOffset, setVerticalOffset] = useState(0);

    const scrollActions = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const newOffset = direction === 'left' ? Math.max(0, scrollOffset - 200) : scrollOffset + 200;
            scrollRef.current.scrollTo({ x: newOffset, animated: true });
            setScrollOffset(newOffset);
        }
    };

    const handleVerticalScroll = (direction: 'up' | 'down') => {
        if (mainScrollRef.current) {
            const newOffset = direction === 'down' ? verticalOffset + 300 : Math.max(0, verticalOffset - 300);
            mainScrollRef.current.scrollTo({ y: newOffset, animated: true });
            setVerticalOffset(newOffset);
        }
    };

    const handleTaskPress = (taskId: number) => {
        if (taskId === 1) { // Publier photos
            setIsGalleryVisible(true);
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
                onScroll={(e) => setVerticalOffset(e.nativeEvent.contentOffset.y)}
                scrollEventThrottle={16}
            >
                {/* Profile Section */}
                <View style={[styles.section, styles.profileSection, themeStyles.card]}>
                    <View style={styles.profileHeader}>
                        <Image source={{ uri: userProfile.avatar }} style={styles.avatar} />
                        <View style={styles.profileInfo}>
                            <Text style={[styles.userName, themeStyles.text]}>{userProfile.name}</Text>
                            <Text style={[styles.userLevel, { color: '#e85d04' }]}>{userProfile.level}</Text>
                        </View>
                        <TouchableOpacity>
                            <ChevronRight size={20} color={themeStyles.subText.color} />
                        </TouchableOpacity>
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
                    <TouchableOpacity style={styles.chevronButton} onPress={() => scrollActions('left')}>
                        <ChevronLeft size={20} color={themeStyles.subText.color} />
                    </TouchableOpacity>

                    <ScrollView
                        ref={scrollRef}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.actionsScrollContent}
                        onScroll={(event) => setScrollOffset(event.nativeEvent.contentOffset.x)}
                        scrollEventThrottle={16}
                    >
                        {actionButtons.map((btn, index) => (
                            <TouchableOpacity key={index} style={styles.actionButton}>
                                <View style={[styles.actionIconContainer, themeStyles.card, styles.shadow]}>
                                    <btn.icon size={24} color="#0057b7" />
                                </View>
                                <Text style={[styles.actionLabel, themeStyles.subText]}>{btn.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <TouchableOpacity style={styles.chevronButton} onPress={() => scrollActions('right')}>
                        <ChevronRight size={20} color={themeStyles.subText.color} />
                    </TouchableOpacity>
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

            {/* Vertical Scroll Chevrons */}
            <View style={styles.verticalScrollContainer}>
                <TouchableOpacity
                    style={[styles.scrollFab, styles.shadow, { backgroundColor: isDark ? '#374151' : '#fff' }]}
                    onPress={() => handleVerticalScroll('down')}
                >
                    <ChevronDown size={28} color="#0057b7" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.scrollFab, styles.shadow, { backgroundColor: isDark ? '#374151' : '#fff' }]}
                    onPress={() => handleVerticalScroll('up')}
                >
                    <ChevronUp size={28} color="#0057b7" />
                </TouchableOpacity>
            </View>

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
    chevronButton: {
        padding: 8,
        backgroundColor: 'rgba(0,0,0,0.03)',
        borderRadius: 20,
        zIndex: 1,
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
    verticalScrollContainer: {
        position: 'absolute',
        bottom: 80,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        zIndex: 100,
    },
    scrollFab: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
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
    }
});
