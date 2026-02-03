
import { ArrowLeft, Cloud, CloudRain, Droplets, Eye, Map as MapIcon, Search, Sun, Thermometer, Wind } from 'lucide-react-native';
import React, { useContext, useEffect, useState } from 'react';
import { Dimensions, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, {
    Easing,
    FadeIn,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomNavigation } from '../components/BottomNavigation';
import { SideMenu } from '../components/SideMenu';
import { styles } from '../constants/styles/Weather.styles';
import { NavigationContext } from './NavigationContext';
import { ThemeContext } from './ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const MENU_ITEMS = [
    { id: 'temperature', label: 'Température', icon: Thermometer },
    { id: 'precipitations', label: 'Précipitations', icon: CloudRain },
    { id: 'wind', label: 'Vent', icon: Wind },
    { id: 'radar', label: 'Radar', icon: MapIcon },
    { id: 'humidity', label: 'Humidité', icon: Droplets },
    { id: 'visibility', label: 'Visibilité', icon: Eye },
];

export default function WeatherScreen() {
    const router = useContext(NavigationContext);
    const { theme } = useContext(ThemeContext);
    const [activeTab, setActiveTab] = useState('menu');
    const [selectedCategory, setSelectedCategory] = useState('temperature');
    const [searchQuery, setSearchQuery] = useState('Bafoussam, Cameroun');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isDark = theme === 'dark';
    const isBlue = theme === 'blue';

    // Animations Shared Values
    const sunRotation = useSharedValue(0);
    const rainTranslate = useSharedValue(-20);
    const windTranslate = useSharedValue(0);
    const radarScale = useSharedValue(0.5);
    const radarOpacity = useSharedValue(1);

    useEffect(() => {
        // Sun Rotation
        sunRotation.value = withRepeat(
            withTiming(360, { duration: 10000, easing: Easing.linear }),
            -1
        );
        // Rain Drop
        rainTranslate.value = withRepeat(
            withTiming(20, { duration: 1000, easing: Easing.linear }),
            -1,
            false
        );
        // Wind
        windTranslate.value = withRepeat(
            withSequence(
                withTiming(10, { duration: 1000, easing: Easing.inOut(Easing.quad) }),
                withTiming(-10, { duration: 1000, easing: Easing.inOut(Easing.quad) })
            ),
            -1,
            true
        );
        // Radar Pulse
        radarScale.value = withRepeat(
            withTiming(2, { duration: 2000, easing: Easing.out(Easing.quad) }),
            -1,
            false
        );
        radarOpacity.value = withRepeat(
            withTiming(0, { duration: 2000, easing: Easing.out(Easing.quad) }),
            -1,
            false
        );
    }, []);

    const themeStyles = {
        container: { backgroundColor: isDark ? '#1a1a1a' : isBlue ? '#15202b' : '#fff' },
        text: { color: isDark || isBlue ? '#f3f4f6' : '#1a1a1a' },
        subText: { color: isDark ? '#9ca3af' : isBlue ? '#8899a6' : '#6b7280' },
        inputBg: { backgroundColor: isDark ? '#262626' : isBlue ? '#273340' : '#f3f4f6' },
        card: { backgroundColor: isDark ? '#262626' : isBlue ? '#192734' : '#fff' },
        border: { borderColor: isDark ? '#404040' : isBlue ? '#38444d' : '#e5e7eb' },
        activeTab: { backgroundColor: isDark || isBlue ? '#60a5fa' : '#0078d4' },
        activeTabText: { color: '#fff' },
        inactiveTab: { backgroundColor: 'transparent' },
        inactiveTabText: { color: isDark || isBlue ? '#9ca3af' : '#6b7280' },
    };

    // Animated Styles
    const sunStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${sunRotation.value}deg` }]
    }));
    const rainStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: rainTranslate.value }]
    }));
    const windStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: windTranslate.value }]
    }));
    const radarStyle = useAnimatedStyle(() => ({
        transform: [{ scale: radarScale.value }],
        opacity: radarOpacity.value
    }));

    const renderSimulation = () => {
        switch (selectedCategory) {
            case 'temperature':
                return (
                    <Animated.View entering={FadeIn} style={[styles.simulationContainer, { backgroundColor: isDark ? '#331a00' : '#fff7e6' }]}>
                        <Animated.View style={[styles.bigIconContainer, sunStyle]}>
                            <Sun size={120} color="#FFD700" fill="#FFD700" />
                        </Animated.View>
                        <Text style={[styles.simData, themeStyles.text]}>28°C</Text>
                        <Text style={[styles.simLabel, themeStyles.subText]}>Ensoleillé</Text>
                        <Text style={[styles.simCity, themeStyles.text]}>Bafoussam, Cameroun</Text>
                    </Animated.View>
                );
            case 'precipitations':
                return (
                    <Animated.View entering={FadeIn} style={[styles.simulationContainer, { backgroundColor: isDark ? '#001a33' : '#e6f2ff' }]}>
                        <View style={styles.rainCloudContainer}>
                            <Cloud size={100} color="#90a4ae" fill="#90a4ae" />
                            <Animated.View style={[styles.rainDrop, rainStyle, { left: 30 }]} />
                            <Animated.View style={[styles.rainDrop, rainStyle, { left: 50, top: 10 }]} />
                            <Animated.View style={[styles.rainDrop, rainStyle, { left: 70 }]} />
                        </View>
                        <Text style={[styles.simData, themeStyles.text]}>60%</Text>
                        <Text style={[styles.simLabel, themeStyles.subText]}>Risque de pluie</Text>
                        <Text style={[styles.simCity, themeStyles.text]}>Bafoussam, Cameroun</Text>
                    </Animated.View>
                );
            case 'wind':
                return (
                    <Animated.View entering={FadeIn} style={[styles.simulationContainer, { backgroundColor: isDark ? '#1a3333' : '#e6ffff' }]}>
                        <Animated.View style={[styles.windContainer, windStyle]}>
                            <Wind size={100} color="#4fc3f7" />
                        </Animated.View>
                        <Text style={[styles.simData, themeStyles.text]}>15 km/h</Text>
                        <Text style={[styles.simLabel, themeStyles.subText]}>Vent Nord-Est</Text>
                        <Text style={[styles.simCity, themeStyles.text]}>Bafoussam, Cameroun</Text>
                    </Animated.View>
                );
            case 'radar':
                return (
                    <Animated.View entering={FadeIn} style={[styles.simulationContainer, { backgroundColor: '#1a1a1a' }]}>
                        <View style={styles.radarContainer}>
                            <MapIcon size={120} color="#404040" />
                            <Animated.View style={[styles.radarPulse, radarStyle]} />
                            <View style={styles.radarCenter} />
                        </View>
                        <Text style={[styles.simData, { color: '#fff' }]}>Radar Live</Text>
                        <Text style={[styles.simLabel, { color: '#9ca3af' }]}>Scan en cour...</Text>
                        <Text style={[styles.simCity, { color: '#fff' }]}>Bafoussam, Cameroun</Text>
                    </Animated.View>
                );
            default:
                return (
                    <View style={styles.simulationContainer}>
                        <Text style={themeStyles.text}>Simulation non disponible</Text>
                    </View>
                );
        }
    };

    return (
        <SafeAreaView style={[styles.container, themeStyles.container]}>
            <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

            {/* Header with Search */}
            <View style={[styles.header, themeStyles.border]}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.push('/home')}
                >
                    <ArrowLeft size={24} color={themeStyles.text.color} />
                </TouchableOpacity>

                <View style={[styles.searchContainer, themeStyles.inputBg]}>
                    <Search size={20} color={themeStyles.subText.color} style={styles.searchIcon} />
                    <TextInput
                        style={[styles.searchInput, themeStyles.text]}
                        placeholder="Rechercher un lieu..."
                        placeholderTextColor={themeStyles.subText.color}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            {/* Categories Menu */}
            <View style={[styles.categoriesContainer, themeStyles.border]}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoriesContent}
                >
                    {MENU_ITEMS.map((item) => {
                        const isActive = selectedCategory === item.id;
                        const Icon = item.icon;
                        return (
                            <TouchableOpacity
                                key={item.id}
                                style={[
                                    styles.categoryButton,
                                    isActive ? themeStyles.activeTab : themeStyles.inactiveTab
                                ]}
                                onPress={() => setSelectedCategory(item.id)}
                            >
                                <Icon size={16} color={isActive ? '#fff' : themeStyles.text.color} />
                                <Text style={[
                                    styles.categoryText,
                                    isActive ? themeStyles.activeTabText : themeStyles.inactiveTabText
                                ]}>
                                    {item.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            {/* Simulation Area */}
            <View style={styles.mainContent}>
                {renderSimulation()}
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


