
import { Bookmark, ChevronLeft, HeartHandshake, Map as MapLucideIcon, MessageCircleQuestion, Plus } from 'lucide-react-native';
import React, { useContext } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContext } from './NavigationContext';
import { ThemeContext } from './ThemeContext';

export default function SavedScreen() {
    const router = useContext(NavigationContext);
    const { theme } = useContext(ThemeContext);

    const isDark = theme === 'dark';
    const isBlue = theme === 'blue';

    const themeStyles = {
        container: { backgroundColor: isDark ? '#1a1a1a' : isBlue ? '#15202b' : '#fff' },
        text: { color: isDark || isBlue ? '#f3f4f6' : '#1a1a1a' },
        subText: { color: isDark || isBlue ? '#9ca3af' : '#6b7280' },
        header: { backgroundColor: isDark ? '#1a1a1a' : isBlue ? '#15202b' : '#fff', borderBottomColor: isDark ? '#374151' : '#f3f4f6' },
        navBg: { backgroundColor: isDark ? '#1a1a1a' : isBlue ? '#15202b' : '#fff', borderTopColor: isDark ? '#374151' : '#e5e7eb' },
        card: { backgroundColor: isDark ? '#2a2a2a' : isBlue ? '#1c2732' : '#fff', borderColor: isDark ? '#374151' : isBlue ? '#38444d' : '#e5e7eb' },
        iconActive: isDark ? '#60a5fa' : '#0057b7',
        iconInactive: isDark ? '#9ca3af' : '#6b7280',
        iconPrimary: isDark || isBlue ? '#f3f4f6' : '#1a1a1a',
    };

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

                {/* Placeholder for saved lists */}
                <View style={styles.emptyContainer}>
                    <Bookmark size={80} color={themeStyles.iconInactive} strokeWidth={1} />
                    <Text style={[styles.emptyTitle, themeStyles.text]}>Aucune liste pour le moment</Text>
                    <Text style={[styles.emptySubtitle, themeStyles.subText]}>Enregistrez des lieux pour les retrouver facilement ici.</Text>
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
        padding: 20,
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
    emptyContainer: {
        alignItems: 'center',
        marginTop: 60,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    emptySubtitle: {
        fontSize: 14,
        textAlign: 'center',
        paddingHorizontal: 40,
        lineHeight: 20,
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
