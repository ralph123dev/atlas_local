import { PlusCircle, User } from 'lucide-react-native';
import React, { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomNavigation } from '../components/BottomNavigation';
import { NavigationContext } from './NavigationContext';
import { ThemeContext } from './ThemeContext';

export default function DashboardScreen() {
    const { theme } = useContext(ThemeContext);
    const router = useContext(NavigationContext);

    const isDark = theme === 'dark';
    const isBlue = theme === 'blue';

    const themeStyles = {
        container: { backgroundColor: isDark ? '#1a1a1a' : isBlue ? '#15202b' : '#fff' },
        text: { color: isDark || isBlue ? '#f3f4f6' : '#1a1a1a' },
        subText: { color: isDark || isBlue ? '#8899a6' : '#6b7280' },
        header: { borderBottomColor: isDark ? '#374151' : isBlue ? '#38444d' : '#f3f4f6' },
        profileIconBg: { backgroundColor: isDark || isBlue ? '#333' : '#f3f4f6' },
    };

    return (
        <SafeAreaView style={[styles.container, themeStyles.container]}>
            {/* Header */}
            <View style={[styles.header, themeStyles.header]}>
                <Text style={[styles.headerTitle, themeStyles.text]}>Tableau de bord</Text>
                <View style={[styles.profileIcon, themeStyles.profileIconBg]}>
                    <User size={24} color={themeStyles.text.color} />
                </View>
            </View>

            {/* Content */}
            <View style={styles.content}>
                <View style={styles.emptyState}>
                    <Text style={[styles.emptyTitle, themeStyles.text]}>Aucun événement créé</Text>
                    <Text style={[styles.emptySubtitle, themeStyles.subText]}>
                        Vous n&apos;avez pas encore créé d&apos;événements. Commencez à partager avec la communauté dès aujourd&apos;hui !
                    </Text>

                    <TouchableOpacity
                        style={styles.createBtn}
                        onPress={() => router.push('/events')}
                    >
                        <PlusCircle size={20} color="#fff" />
                        <Text style={styles.createBtnText}>Créer un événement</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <BottomNavigation
                activeTab="menu"
                onTabPress={() => { }}
                isHome={false}
                onMenuPress={() => { }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    profileIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyState: {
        alignItems: 'center',
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 30,
    },
    createBtn: {
        backgroundColor: '#0057b7',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 30,
        gap: 10,
    },
    createBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    }
});
