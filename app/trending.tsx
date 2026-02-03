
import { MapPin, Star } from 'lucide-react-native';
import React, { useContext, useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomNavigation } from '../components/BottomNavigation';
import { SideMenu } from '../components/SideMenu';
import { ThemeContext } from './ThemeContext';

const { width } = Dimensions.get('window');

export default function TrendingScreen() {
    const { theme } = useContext(ThemeContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('menu'); 

    const isDark = theme === 'dark';
    const isBlue = theme === 'blue';

    const themeStyles = {
        container: { backgroundColor: isDark ? '#1a1a1a' : isBlue ? '#15202b' : '#fff' },
        text: { color: isDark || isBlue ? '#f3f4f6' : '#1a1a1a' },
        subText: { color: isDark ? '#9ca3af' : isBlue ? '#8899a6' : '#6b7280' },
        cardBg: {
            backgroundColor: isDark ? '#262626' : isBlue ? '#192734' : '#fff',
            borderColor: isDark ? '#404040' : isBlue ? '#38444d' : '#f3f4f6'
        },
    };

    const MOCK_DATA = [
        { id: 1, name: 'Le Café Parisien', category: 'Café & Détente', rating: 4.8, distance: '1.2km', imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=300&auto=format&fit=crop' },
        { id: 2, name: 'Cinéma Star', category: 'Divertissement', rating: 4.5, distance: '0.8km', imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=300&auto=format&fit=crop' },
        { id: 3, name: 'Parc Central', category: 'Plein air', rating: 4.9, distance: '2.5km', imageUrl: 'https://images.unsplash.com/photo-1496347646636-ea47f7d6b37b?q=80&w=300&auto=format&fit=crop' },
    ];

    const TrendingCard = ({ name, category, rating, distance, imageUrl }: any) => (
        <View style={[styles.card, themeStyles.cardBg]}>
            <Image source={{ uri: imageUrl }} style={styles.cardImage} />
            <View style={styles.cardContent}>
                <Text style={[styles.cardName, themeStyles.text]} numberOfLines={1}>{name}</Text>
                <Text style={[styles.cardCategory, themeStyles.subText]}>{category}</Text>
                <View style={styles.cardFooter}>
                    <View style={styles.ratingContainer}>
                        <Star size={12} color="#FFD700" fill="#FFD700" />
                        <Text style={styles.ratingText}>{rating}</Text>
                    </View>
                    <View style={styles.distanceContainer}>
                        <MapPin size={12} color="#6b7280" />
                        <Text style={styles.distanceText}>{distance}</Text>
                    </View>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, themeStyles.container]}>
            <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={[styles.title, themeStyles.text]}>Tendances à proximité</Text>

                <View style={styles.grid}>
                    {MOCK_DATA.map((item) => (
                        <TrendingCard key={item.id} {...item} />
                    ))}
                    {MOCK_DATA.map((item) => (
                        <TrendingCard key={'copy-' + item.id} {...item} />
                    ))}
                </View>
            </ScrollView>

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
    scrollContent: {
        padding: 20,
        paddingBottom: 100, // Space
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: (width - 50) / 2,
        borderRadius: 16,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        overflow: 'hidden',
        backgroundColor: '#fff',
    },
    cardImage: {
        width: '100%',
        height: 120,
        backgroundColor: '#f3f4f6',
    },
    cardContent: {
        padding: 12,
    },
    cardName: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    cardCategory: {
        fontSize: 12,
        marginBottom: 8,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fffbea',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    ratingText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#b45309',
        marginLeft: 4,
    },
    distanceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    distanceText: {
        fontSize: 12,
        color: '#6b7280',
        marginLeft: 2,
    },
});




