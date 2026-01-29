
import { ChevronLeft, HeartHandshake, Map as MapLucideIcon, MessageCircleQuestion } from 'lucide-react-native';
import React, { useContext } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NavigationContext } from '../app/NavigationContext';
import { ThemeContext } from '../app/ThemeContext';

interface BottomNavigationProps {
    activeTab: string;
    onTabPress: (tab: string) => void;
    isHome?: boolean;
    onMenuPress: () => void;
}

export const BottomNavigation = ({ activeTab, onTabPress, isHome = true, onMenuPress }: BottomNavigationProps) => {
    const { theme } = useContext(ThemeContext);
    const router = useContext(NavigationContext);

    const isDark = theme === 'dark';

    const themeStyles = {
        navBg: { backgroundColor: isDark ? '#1a1a1a' : '#fff', borderTopColor: isDark ? '#374151' : '#e5e7eb' },
        activeTab: { backgroundColor: isDark ? '#374151' : '#f0f9ff' },
        activeTabText: { color: isDark ? '#60a5fa' : '#0057b7' },
        iconActive: isDark ? '#60a5fa' : '#0057b7',
        iconInactive: isDark ? '#9ca3af' : '#6b7280',
        subText: { color: isDark ? '#9ca3af' : '#6b7280' },
    };

    const handleBackPress = () => {
        router.push('/home');
    };

    return (
        <View style={[styles.bottomNav, themeStyles.navBg]}>
            {/* Tab 1: Explorer (Home) OR Back */}
            {isHome ? (
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'explorer' && [styles.activeTab, themeStyles.activeTab]]}
                    onPress={() => onTabPress('explorer')}
                >
                    <MapLucideIcon size={24} color={activeTab === 'explorer' ? themeStyles.iconActive : themeStyles.iconInactive} />
                    <Text style={[styles.tabText, themeStyles.subText, activeTab === 'explorer' && themeStyles.activeTabText]}>Explorer</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity
                    style={styles.tab}
                    onPress={handleBackPress}
                >
                    <ChevronLeft size={24} color={themeStyles.iconInactive} />
                    <Text style={[styles.tabText, themeStyles.subText]}>Retour</Text>
                </TouchableOpacity>
            )}

            {/* Tab 2: Menu (Replaces Evenements) */}
            <TouchableOpacity
                style={[styles.tab, activeTab === 'menu' && [styles.activeTab, themeStyles.activeTab]]}
                onPress={onMenuPress}
            >
                <Image
                    source={require('../assets/images/more.png')}
                    style={[styles.menuIcon, { tintColor: activeTab === 'menu' ? themeStyles.iconActive : themeStyles.iconInactive }]}
                />
                <Text style={[styles.tabText, themeStyles.subText, activeTab === 'menu' && themeStyles.activeTabText]}>Menu</Text>
            </TouchableOpacity>

            {/* Tab 3: Ask */}
            <TouchableOpacity
                style={styles.tab}
                onPress={() => router.push('/ask')}
            >
                <MessageCircleQuestion size={24} color={themeStyles.iconInactive} />
                <Text style={[styles.tabText, themeStyles.subText]}>Ask</Text>
            </TouchableOpacity>

            {/* Tab 4: Contribute */}
            <TouchableOpacity
                style={[styles.tab, activeTab === 'contribute' && [styles.activeTab, themeStyles.activeTab]]}
                onPress={() => onTabPress('contribute')}
            >
                <HeartHandshake size={24} color={activeTab === 'contribute' ? themeStyles.iconActive : themeStyles.iconInactive} />
                <Text style={[styles.tabText, themeStyles.subText, activeTab === 'contribute' && themeStyles.activeTabText]}>Contribute</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        backgroundColor: '#fff',
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
    activeTab: {
        backgroundColor: '#f0f9ff',
        borderRadius: 10,
    },
    tabText: {
        fontSize: 10,
        color: '#6b7280',
        marginTop: 4,
    },
    menuIcon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    }
});
