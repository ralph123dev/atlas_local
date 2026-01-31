
import * as Location from 'expo-location';
import { Cloud, CloudDrizzle, CloudLightning, CloudRain, CloudSnow, Droplets, MapPin, Sun, Sunrise, Sunset, Thermometer, Wind } from 'lucide-react-native';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomNavigation } from '../components/BottomNavigation';
import { SideMenu } from '../components/SideMenu';
import { ThemeContext } from './ThemeContext';

// Interfaces for Open-Meteo API
interface CurrentWeather {
    temperature: number;
    windspeed: number;
    weathercode: number;
    time: string;
    is_day: number;
}

interface HourlyUnits {
    temperature_2m: string;
    time: string;
}

interface Hourly {
    time: string[];
    temperature_2m: number[];
    weathercode: number[];
    relativehumidity_2m: number[];
    apparent_temperature: number[];
    precipitation_probability: number[];
}

interface Daily {
    time: string[];
    weathercode: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    sunrise: string[];
    sunset: string[];
    uv_index_max: number[];
}

interface WeatherData {
    latitude: number;
    longitude: number;
    current_weather: CurrentWeather;
    hourly: Hourly;
    daily: Daily;
    hourly_units: HourlyUnits;
}

export default function WeatherScreen() {
    const { theme } = useContext(ThemeContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('menu');
    const [loading, setLoading] = useState(true);
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [locationName, setLocationName] = useState('Chargement...');
    const [refreshing, setRefreshing] = useState(false);

    const isDark = theme === 'dark';
    const isBlue = theme === 'blue';

    // Theme Configuration
    const themeStyles = {
        container: { backgroundColor: isDark ? '#1a1a1a' : isBlue ? '#15202b' : '#f0f2f5' },
        card: { backgroundColor: isDark ? '#262626' : isBlue ? '#192734' : '#ffffff' },
        text: { color: isDark || isBlue ? '#f3f4f6' : '#1a1a1a' },
        subText: { color: isDark ? '#9ca3af' : isBlue ? '#8899a6' : '#6b7280' },
        divider: { backgroundColor: isDark ? '#404040' : isBlue ? '#38444d' : '#e5e7eb' },
        accent: { color: isDark || isBlue ? '#60a5fa' : '#0078d4' }, // MSN Blue
    };

    // Helper: Map WMO codes to Icons and Description
    const getWeatherInfo = (code: number, isDay: number = 1) => {
        const color = themeStyles.text.color;
        // Simplified mapping
        if (code === 0) return { icon: <Sun size={32} color={isDay ? "#FFD700" : "#fff"} />, label: 'Ensoleillé', bg: '#0078d4' };
        if (code <= 3) return { icon: <Cloud size={32} color={color} />, label: 'Nuageux', bg: '#607d8b' };
        if (code <= 48) return { icon: <Cloud size={32} color="#90a4ae" />, label: 'Brouillard', bg: '#546e7a' };
        if (code <= 57) return { icon: <CloudDrizzle size={32} color="#4fc3f7" />, label: 'Bruine', bg: '#455a64' };
        if (code <= 67) return { icon: <CloudRain size={32} color="#29b6f6" />, label: 'Pluie', bg: '#37474f' };
        if (code <= 77) return { icon: <CloudSnow size={32} color="#e1f5fe" />, label: 'Neige', bg: '#78909c' };
        if (code <= 82) return { icon: <CloudRain size={32} color="#0288d1" />, label: 'Averses', bg: '#263238' };
        if (code <= 86) return { icon: <CloudSnow size={32} color="#b3e5fc" />, label: 'Averses de neige', bg: '#546e7a' };
        if (code <= 99) return { icon: <CloudLightning size={32} color="#fdd835" />, label: 'Orage', bg: '#212121' };
        return { icon: <Sun size={32} color={color} />, label: 'Inconnu', bg: '#0078d4' };
    };

    const fetchWeather = async () => {
        try {
            // Permission check
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission refusée', 'La localisation est nécessaire pour la météo.');
                setLoading(false);
                return;
            }

            // Get Location
            let location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;

            // Get Address Name
            let reverseGeocode = await Location.reverseGeocodeAsync({ latitude, longitude });
            if (reverseGeocode.length > 0) {
                const place = reverseGeocode[0];
                setLocationName(`${place.city || place.region || place.country}`);
            }

            // Fetch Open-Meteo Data (including daily and hourly)
            const response = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,precipitation_probability,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&current_weather=true&timezone=auto`
            );
            const data = await response.json();
            setWeather(data);

        } catch (error) {
            Alert.alert("Erreur", "Impossible de récupérer les données météo.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchWeather();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchWeather();
    };

    const formatHour = (isoString: string) => {
        const date = new Date(isoString);
        return date.getHours() + 'h';
    };

    const formatDay = (isoString: string) => {
        const date = new Date(isoString);
        const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
        return days[date.getDay()];
    };

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, themeStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={themeStyles.accent.color} />
                <Text style={[{ marginTop: 10 }, themeStyles.text]}>Chargement de la météo...</Text>
            </SafeAreaView>
        );
    }

    if (!weather) return null;

    const currentInfo = getWeatherInfo(weather.current_weather.weathercode, weather.current_weather.is_day);
    // Find index of current hour
    const currentHourIndex = new Date().getHours();

    // Get current detailed stats from hourly array (approximate)
    const humidity = weather.hourly.relativehumidity_2m[currentHourIndex] || 0;
    const feelsLike = weather.hourly.apparent_temperature[currentHourIndex] || weather.current_weather.temperature;
    const precip = weather.hourly.precipitation_probability[currentHourIndex] || 0;
    const uvIndex = weather.daily.uv_index_max[0] || 0;

    return (
        <SafeAreaView style={[styles.container, themeStyles.container]}>
            <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={themeStyles.text.color} />
                }
                showsVerticalScrollIndicator={false}
            >
                {/* Header / Main Card */}
                <View style={[styles.mainCard, { backgroundColor: isDark ? '#262626' : '#fff' }]}>
                    <View style={styles.headerBar}>
                        <View style={styles.locationRow}>
                            <MapPin size={18} color={themeStyles.accent.color} />
                            <Text style={[styles.locationText, themeStyles.text]}>{locationName}</Text>
                        </View>
                        <Text style={[styles.dateText, themeStyles.subText]}>
                            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </Text>
                    </View>

                    <View style={styles.heroSection}>
                        <View style={styles.tempContainer}>
                            {/* Dynamic Icon size 64 */}
                            {React.cloneElement(currentInfo.icon as React.ReactElement, { size: 64 })}
                            <Text style={[styles.tempText, themeStyles.text]}>
                                {Math.round(weather.current_weather.temperature)}°
                            </Text>
                        </View>
                        <Text style={[styles.conditionText, themeStyles.subText]}>{currentInfo.label}</Text>
                        <View style={styles.highLowContainer}>
                            <Text style={[styles.highLowText, themeStyles.subText]}>
                                Max: {Math.round(weather.daily.temperature_2m_max[0])}°  Min: {Math.round(weather.daily.temperature_2m_min[0])}°
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Hourly Forecast Horizontal Scroll */}
                <View style={[styles.sectionContainer, themeStyles.card]}>
                    <Text style={[styles.sectionTitle, themeStyles.text]}>Aujourd'hui</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hourlyList}>
                        {weather.hourly.time.slice(currentHourIndex, currentHourIndex + 24).map((time, index) => {
                            const actualIndex = currentHourIndex + index;
                            const code = weather.hourly.weathercode[actualIndex];
                            const temp = weather.hourly.temperature_2m[actualIndex];
                            return (
                                <View key={index} style={styles.hourlyItem}>
                                    <Text style={[styles.hourlyTime, themeStyles.subText]}>{index === 0 ? 'Maint.' : formatHour(time)}</Text>
                                    {/* Small icon */}
                                    {React.cloneElement(getWeatherInfo(code).icon as React.ReactElement, { size: 24 })}
                                    <Text style={[styles.hourlyTemp, themeStyles.text]}>{Math.round(temp)}°</Text>
                                    <View style={styles.popContainer}>
                                        <Droplets size={10} color="#60a5fa" />
                                        <Text style={styles.popText}>{weather.hourly.precipitation_probability[actualIndex]}%</Text>
                                    </View>
                                </View>
                            );
                        })}
                    </ScrollView>
                </View>

                {/* Grid Details (MSN Style) */}
                <View style={styles.gridContainer}>
                    {/* Feels Like */}
                    <View style={[styles.gridItem, themeStyles.card]}>
                        <View style={styles.gridHeader}>
                            <Thermometer size={18} color={themeStyles.subText.color} />
                            <Text style={[styles.gridLabel, themeStyles.subText]}>Ressenti</Text>
                        </View>
                        <Text style={[styles.gridValue, themeStyles.text]}>{Math.round(feelsLike)}°</Text>
                    </View>

                    {/* Wind */}
                    <View style={[styles.gridItem, themeStyles.card]}>
                        <View style={styles.gridHeader}>
                            <Wind size={18} color={themeStyles.subText.color} />
                            <Text style={[styles.gridLabel, themeStyles.subText]}>Vent</Text>
                        </View>
                        <Text style={[styles.gridValue, themeStyles.text]}>{Math.round(weather.current_weather.windspeed)} <Text style={{ fontSize: 14 }}>km/h</Text></Text>
                    </View>

                    {/* Humidity */}
                    <View style={[styles.gridItem, themeStyles.card]}>
                        <View style={styles.gridHeader}>
                            <Droplets size={18} color={themeStyles.subText.color} />
                            <Text style={[styles.gridLabel, themeStyles.subText]}>Humidité</Text>
                        </View>
                        <Text style={[styles.gridValue, themeStyles.text]}>{humidity}%</Text>
                    </View>

                    {/* UV Index */}
                    <View style={[styles.gridItem, themeStyles.card]}>
                        <View style={styles.gridHeader}>
                            <Sun size={18} color={themeStyles.subText.color} />
                            <Text style={[styles.gridLabel, themeStyles.subText]}>Indice UV</Text>
                        </View>
                        <Text style={[styles.gridValue, themeStyles.text]}>{uvIndex}</Text>
                    </View>

                    {/* Sunrise/Sunset */}
                    <View style={[styles.gridItemWide, themeStyles.card]}>
                        <View style={styles.sunRow}>
                            <View style={styles.sunItem}>
                                <Sunrise size={24} color="#F59E0B" />
                                <View>
                                    <Text style={[styles.gridLabel, themeStyles.subText]}>Lever</Text>
                                    <Text style={[styles.gridValueSmall, themeStyles.text]}>
                                        {new Date(weather.daily.sunrise[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </Text>
                                </View>
                            </View>
                            <View style={[styles.verticalDivider, themeStyles.divider]} />
                            <View style={styles.sunItem}>
                                <Sunset size={24} color="#F59E0B" />
                                <View>
                                    <Text style={[styles.gridLabel, themeStyles.subText]}>Coucher</Text>
                                    <Text style={[styles.gridValueSmall, themeStyles.text]}>
                                        {new Date(weather.daily.sunset[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                {/* 7 Day Forecast */}
                <View style={[styles.sectionContainer, themeStyles.card, { marginBottom: 80 }]}>
                    <Text style={[styles.sectionTitle, themeStyles.text]}>Prévisions 7 Jours</Text>
                    {weather.daily.time.map((day, index) => (
                        <View key={index} style={[styles.dailyRow, { borderBottomColor: themeStyles.divider.backgroundColor, borderBottomWidth: index === 6 ? 0 : 1 }]}>
                            <Text style={[styles.dayName, themeStyles.text]}>{index === 0 ? 'Auj.' : formatDay(day)}</Text>
                            <View style={styles.dayIcon}>
                                {React.cloneElement(getWeatherInfo(weather.daily.weathercode[index]).icon as React.ReactElement, { size: 24 })}
                            </View>
                            <View style={styles.tempRange}>
                                <Text style={[styles.maxTemp, themeStyles.text]}>{Math.round(weather.daily.temperature_2m_max[index])}°</Text>
                                <Text style={[styles.minTemp, themeStyles.subText]}>{Math.round(weather.daily.temperature_2m_min[index])}°</Text>
                            </View>
                        </View>
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
    mainCard: {
        margin: 15,
        borderRadius: 20,
        padding: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    headerBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    locationText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    dateText: {
        fontSize: 12,
        textTransform: 'capitalize',
    },
    heroSection: {
        alignItems: 'center',
    },
    tempContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    tempText: {
        fontSize: 64,
        fontWeight: '200',
    },
    conditionText: {
        fontSize: 20,
        marginTop: 5,
        fontWeight: '500',
    },
    highLowContainer: {
        marginTop: 5,
    },
    highLowText: {
        fontSize: 14,
    },
    sectionContainer: {
        marginHorizontal: 15,
        marginBottom: 15,
        borderRadius: 20,
        padding: 15,
        elevation: 1,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    hourlyList: {
        flexDirection: 'row',
    },
    hourlyItem: {
        alignItems: 'center',
        marginRight: 25,
        gap: 8,
    },
    hourlyTime: {
        fontSize: 12,
    },
    hourlyTemp: {
        fontSize: 16,
        fontWeight: '600',
    },
    popContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    popText: {
        fontSize: 10,
        color: '#60a5fa',
    },
    gridContainer: {
        marginHorizontal: 15,
        marginBottom: 15,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 10,
    },
    gridItem: {
        width: '48%', // Approx half
        padding: 15,
        borderRadius: 20,
        justifyContent: 'space-between',
        minHeight: 100,
        elevation: 1,
    },
    gridItemWide: {
        width: '100%',
        padding: 15,
        borderRadius: 20,
        elevation: 1,
    },
    gridHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    gridLabel: {
        fontSize: 14,
    },
    gridValue: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 10,
    },
    gridValueSmall: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    sunRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    sunItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    verticalDivider: {
        width: 1,
        height: 40,
        backgroundColor: '#e5e7eb',
    },
    dailyRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
    },
    dayName: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
    },
    dayIcon: {
        flex: 1,
        alignItems: 'center',
    },
    tempRange: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
    },
    maxTemp: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    minTemp: {
        fontSize: 16,
    },
});
