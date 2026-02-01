
import { Bookmark, ChevronLeft, Heart, HeartHandshake, Map as MapLucideIcon, MapPin, MessageCircleQuestion, Plus, Stars } from 'lucide-react-native';
import React, { useContext } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContext } from './NavigationContext';
import { ThemeContext } from './ThemeContext';

export default function SavedScreen() {
    const router = useContext(NavigationContext);
    const { theme } = useContext(ThemeContext);

    const isDark = theme === 'dark';

    const themeStyles = {
        container: { backgroundColor: isDark ? '#1a1a1a' : '#fff' },
        text: { color: isDark ? '#f3f4f6' : '#1a1a1a' },
        subText: { color: isDark ? '#9ca3af' : '#6b7280' },
        header: { backgroundColor: isDark ? '#1a1a1a' : '#fff', borderBottomColor: isDark ? '#374151' : '#f3f4f6' },
        navBg: { backgroundColor: isDark ? '#1a1a1a' : '#fff', borderTopColor: isDark ? '#374151' : '#e5e7eb' },
        card: { backgroundColor: isDark ? '#2a2a2a' : '#fff', borderColor: isDark ? '#374151' : '#e5e7eb' },
        iconInactive: isDark ? '#9ca3af' : '#6b7280',
        iconPrimary: isDark ? '#f3f4f6' : '#1a1a1a',
        border: { borderBottomColor: isDark ? '#374151' : '#f3f4f6' },
    };

    const defaultLists = [
        { id: 'fav', title: 'Favoris', icon: Heart, iconColor: '#e91e63' },
        { id: 'visit', title: 'À visiter', icon: Stars, iconColor: '#0057b7' },
        { id: 'routes', title: 'Trajets enregistrés', icon: MapPin, iconColor: '#4caf50' },
    ];

    return (
        <SafeAreaView style={[styles.container, themeStyles.container]}>
            {/* Header with Back Button */}
            <View style={[styles.header, themeStyles.header]}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.push('/home')}>
                    <ChevronLeft size={28} color={themeStyles.iconPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, themeStyles.text]}>Enregistré</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* New List Button */}
                <TouchableOpacity style={[styles.newListButton, { backgroundColor: isDark ? '#374151' : '#f0f9ff' }]}>
                    <Plus size={24} color="#0057b7" />
                    <Text style={styles.newListText}>Créer une nouvelle liste</Text>
                </TouchableOpacity>

                <Text style={[styles.sectionTitle, themeStyles.text]}>Vos listes</Text>

                {defaultLists.map((list) => (
                    <TouchableOpacity key={list.id} style={[styles.listItem, themeStyles.border]}>
                        <View style={[styles.listIconContainer, { backgroundColor: list.iconColor + '20' }]}>
                            <list.icon size={22} color={list.iconColor} />
                        </View>
                        <View style={styles.listTextContainer}>
                            <Text style={[styles.listTitle, themeStyles.text]}>{list.title}</Text>
                            <Text style={[styles.listSubtitle, themeStyles.subText]}>0 lieu</Text>
                        </View>
                    </TouchableOpacity>
                ))}

                <View style={styles.divider} />

                {/* Placeholder for empty state if needed, or just more content */}
                <View style={styles.emptyInfo}>
                    <Bookmark size={40} color={themeStyles.iconInactive} strokeWidth={1.5} />
                    <Text style={[styles.emptySubtitle, themeStyles.subText]}>Enregistrez des lieux pour les retrouver rapidement ici.</Text>
                </View>
            </ScrollView>

            {/* Bottom Navigation */}
            <View style={[styles.bottomNav, themeStyles.navBg]}>
                <TouchableOpacity style={styles.tab} onPress={() => router.push('/home')}>
                    <MapLucideIcon size={24} color={themeStyles.iconInactive} />
                    <Text style={[styles.tabText, themeStyles.subText]}>Explorer</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.tab} onPress={() => router.push('/home')}>
                    <Image
                        source={require('../assets/images/more.png')}
                        style={[styles.menuIcon, { tintColor: themeStyles.iconInactive }]}
                    />
                    <Text style={[styles.tabText, themeStyles.subText]}>Menu</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.tab} onPress={() => router.push('/ask')}>
                    <MessageCircleQuestion size={24} color={themeStyles.iconInactive} />
                    <Text style={[styles.tabText, themeStyles.subText]}>Ask</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.tab} onPress={() => router.push('/home')}>
                    <HeartHandshake size={24} color={themeStyles.iconInactive} />
                    <Text style={[styles.tabText, themeStyles.subText]}>Contribute</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderBottomWidth: 1,
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 100,
    },
    newListButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        marginBottom: 30,
    },
    newListText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0057b7',
        marginLeft: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        marginBottom: 8,
    },
    listIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    listTextContainer: {
        flex: 1,
    },
    listTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    listSubtitle: {
        fontSize: 13,
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: '#f3f4f6',
        marginVertical: 20,
    },
    emptyInfo: {
        alignItems: 'center',
        marginTop: 20,
    },
    emptySubtitle: {
        fontSize: 13,
        textAlign: 'center',
        paddingHorizontal: 40,
        marginTop: 10,
        lineHeight: 18,
    },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 10,
        borderTopWidth: 1,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    tab: {
        alignItems: 'center',
        padding: 5,
        flex: 1,
    },
    tabText: {
        fontSize: 10,
        marginTop: 4,
    },
    menuIcon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
});
