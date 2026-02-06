import {
    AlertTriangle,
    ArrowLeft,
    Calendar,
    Compass,
    Heart,
    Menu,
    MessageSquare,
    Share,
    Share2,
    X
} from 'lucide-react-native';
import React, { useContext, useState } from 'react';
import {
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../constants/styles/EventDetail.styles';
import { NavigationContext } from './NavigationContext';
import { ThemeContext } from './ThemeContext';

export default function EventDetailScreen() {
    const router = useContext(NavigationContext);
    const { theme } = useContext(ThemeContext);
    const { event } = router.params || {};

    const [isLiked, setIsLiked] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    const isDark = theme === 'dark';
    const isBlue = theme === 'blue';

    const themeStyles = {
        container: { backgroundColor: isDark ? '#1a1a1a' : isBlue ? '#15202b' : '#fff' },
        card: { backgroundColor: isDark ? '#262626' : isBlue ? '#1e2732' : '#fff' },
        text: { color: isDark || isBlue ? '#f3f4f6' : '#1a1a1a' },
        subText: { color: isDark || isBlue ? '#8899a6' : '#6b7280' },
        border: { borderBottomColor: isDark ? '#374151' : isBlue ? '#38444d' : '#f3f4f6' },
        sidebar: { backgroundColor: isDark ? '#1a1a1a' : isBlue ? '#15202b' : '#fff' },
    };

    if (!event) {
        return (
            <SafeAreaView style={[styles.container, themeStyles.container]}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={themeStyles.text}>Chargement de l'événement...</Text>
                    <TouchableOpacity onPress={() => router.push('/events')} style={{ marginTop: 20 }}>
                        <Text style={{ color: '#0057b7' }}>Retour aux événements</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const shareOptions = [
        { label: 'Facebook', icon: require('@/assets/images/socials/facebook.png'), onPress: () => alert('Partage sur Facebook...') },
        { label: 'Instagram', icon: require('@/assets/images/socials/instagram.png'), onPress: () => alert('Partage sur Instagram...') },
        { label: 'WhatsApp', icon: require('@/assets/images/socials/social.png'), onPress: () => alert('Partage sur WhatsApp...') },
        { label: 'Telegram', icon: require('@/assets/images/socials/telegram.png'), onPress: () => alert('Partage sur Telegram...') },
        {
            label: 'Copier', icon: require('@/assets/images/socials/link.png'), onPress: () => {
                alert('Lien copié dans le presse-papier !');
                setIsShareModalOpen(false);
            }
        },
    ];

    const menuItems = [
        { label: 'Itinéraire', icon: Compass, onPress: () => { setIsMenuOpen(false); alert('Itinéraire lancé'); } },
        { label: 'Contacter', icon: MessageSquare, onPress: () => { setIsMenuOpen(false); alert('Contacter l\'organisateur'); } },
        { label: 'Calendrier', icon: Calendar, onPress: () => { setIsMenuOpen(false); alert('Ajouté au calendrier'); } },
        { label: 'Partager', icon: Share2, onPress: () => { setIsMenuOpen(false); setIsShareModalOpen(true); } },
        { label: 'Signaler', icon: AlertTriangle, color: '#ef4444', onPress: () => { setIsMenuOpen(false); alert('Signalement envoyé'); } },
        { label: 'Retour', icon: ArrowLeft, onPress: () => { setIsMenuOpen(false); router.push('/home'); } },
    ];

    return (
        <SafeAreaView style={[styles.container, themeStyles.container]}>
            <ScrollView style={styles.content} bounces={false}>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: event.thumbnail }} style={styles.eventImage} />

                    {/* Header Overlay */}
                    <View style={[StyleSheet.absoluteFill, styles.header]}>
                        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/events')}>
                            <ArrowLeft size={24} color="#fff" />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.menuButton} onPress={() => setIsMenuOpen(true)}>
                            <Menu size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={[styles.detailsContainer, themeStyles.container]}>
                    <Text style={[styles.title, themeStyles.text]}>{event.name}</Text>

                    <View style={styles.infoRow}>
                        <Calendar size={20} color="#0057b7" />
                        <Text style={[styles.infoText, themeStyles.text]}>
                            {event.startDate} {event.endDate ? `- ${event.endDate}` : ''}
                        </Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Compass size={20} color="#0057b7" />
                        <Text style={[styles.infoText, themeStyles.text]}>{event.location}</Text>
                    </View>

                    <Text style={[styles.descriptionTitle, themeStyles.text]}>À propos</Text>
                    <Text style={[styles.description, themeStyles.subText]}>
                        {event.description || "Aucune description fournie pour cet événement."}
                    </Text>

                    <View style={styles.actionButtonsRow}>
                        <TouchableOpacity
                            style={styles.participateButton}
                            onPress={() => alert('Vous avez été enregistré.')}
                        >
                            <Share size={20} color="#fff" />
                            <Text style={styles.participateText}>Participer</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.likeButton, isLiked && { backgroundColor: '#fee2e2' }]}
                            onPress={() => setIsLiked(!isLiked)}
                        >
                            <Heart size={24} color={isLiked ? '#ef4444' : '#1a1a1a'} fill={isLiked ? '#ef4444' : 'transparent'} />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            {/* Sidebar Menu Modal */}
            <Modal
                visible={isMenuOpen}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsMenuOpen(false)}
            >
                <View style={styles.overlay}>
                    <TouchableOpacity
                        style={StyleSheet.absoluteFill}
                        activeOpacity={1}
                        onPress={() => setIsMenuOpen(false)}
                    />
                    <View style={[styles.sidebarMenu, themeStyles.sidebar]}>
                        <View style={styles.sidebarHeader}>
                            <Text style={[styles.sidebarTitle, themeStyles.text]}>Options</Text>
                            <TouchableOpacity onPress={() => setIsMenuOpen(false)}>
                                <X size={24} color={themeStyles.text.color} />
                            </TouchableOpacity>
                        </View>

                        {menuItems.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[styles.sidebarItem, themeStyles.border]}
                                onPress={item.onPress}
                            >
                                <item.icon size={22} color={item.color || themeStyles.text.color} />
                                <Text style={[styles.sidebarText, { color: item.color || themeStyles.text.color }]}>
                                    {item.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </Modal>

            {/* Share Modal */}
            <Modal
                visible={isShareModalOpen}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setIsShareModalOpen(false)}
            >
                <View style={[styles.overlay, { justifyContent: 'flex-end' }]}>
                    <TouchableOpacity
                        style={StyleSheet.absoluteFill}
                        activeOpacity={1}
                        onPress={() => setIsShareModalOpen(false)}
                    />
                    <View style={[styles.shareModal, themeStyles.sidebar]}>
                        <Text style={[styles.shareTitle, themeStyles.text]}>Partager via</Text>
                        <View style={styles.shareGrid}>
                            {shareOptions.map((option, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.shareOption}
                                    onPress={option.onPress}
                                >
                                    <Image source={option.icon} style={styles.socialIcon} />
                                    <Text style={[styles.socialText, themeStyles.text]}>{option.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <TouchableOpacity
                            style={[styles.submitButton, { marginTop: 30 }]}
                            onPress={() => setIsShareModalOpen(false)}
                        >
                            <Text style={styles.submitButtonText}>Annuler</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
