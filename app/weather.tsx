
import { CloudSun } from 'lucide-react-native';
import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomNavigation } from '../components/BottomNavigation';
import { SideMenu } from '../components/SideMenu';
import { ThemeContext } from './ThemeContext';

export default function WeatherScreen() {
    const { theme } = useContext(ThemeContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('menu');

    const isDark = theme === 'dark';
    const isBlue = theme === 'blue';

    const themeStyles = {
        container: { backgroundColor: isDark ? '#1a1a1a' : isBlue ? '#15202b' : '#fff' },
        text: { color: isDark || isBlue ? '#f3f4f6' : '#1a1a1a' },
        subText: { color: isDark ? '#9ca3af' : isBlue ? '#8899a6' : '#6b7280' },
    };

    return (
        <SafeAreaView style={[styles.container, themeStyles.container]}>
            <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

            <View style={styles.content}>
                <CloudSun size={64} color={themeStyles.text.color} style={styles.icon} />
                <Text style={[styles.title, themeStyles.text]}>Météo</Text>
                <Text style={[styles.subtitle, themeStyles.subText]}>
                    Informations météorologiques à venir
                </Text>
            </View>

            <BottomNavigation
                activeTab={activeTab}
                onTabPress={setActiveTab}
                isHome={false}
                onMenuPress={() => setIsMenuOpen(true)}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
    }
});
