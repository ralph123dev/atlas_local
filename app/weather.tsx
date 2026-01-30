import * as Location from 'expo-location';
import { Cloud, CloudDrizzle, CloudRain, CloudSnow, MapPin, Sun, Thermometer, Wind } from 'lucide-react-native';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomNavigation } from '../components/BottomNavigation';
import { SideMenu } from '../components/SideMenu';
import { ThemeContext } from './ThemeContext';

interface WeatherData {
    temperature: number;
    windSpeed: number;
    weatherCode: number;
    time: string;
    humidity?: number;
    visibility?: number;
}

interface HourlyData {
    time: string;
    temperature: number;
    weatherCode: number;
}

export default function WeatherScreen() {
    const { theme } = useContext(ThemeContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('menu');
    const [loading, setLoading] = useState(true);
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [hourlyData, setHourlyData] = useState<HourlyData[]>([]);
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [locationName, setLocationName] = useState('');

    const isDark = theme === 'dark';
    const isBlue = theme === 'blue';

    const themeStyles = {
        container: { backgroundColor: isDark ? '#1a1a1a' : isBlue ? '#15202b' : '#fff' },
        text: { color: isDark || isBlue ? '#f3f4f6' : '#1a1a1a' },
        subText: { color: isDark ? '#9ca3af' : isBlue ? '#8899a6' : '#6b7280' },
        card: { backgroundColor: isDark ? '#374151' : isBlue ? '#192734' : '#f3f4f6' },
        border: { borderColor: isDark ? '#4b5563' : isBlue ? '#38444d' : '#e5e7eb' },
    };

    // Get weather icon based on WMO weather code
    const getWeatherIcon = (code: number, size: number = 60) => {
        const color = themeStyles.text.color;

        if (code === 0) return <Sun size={size} color="#FFD700" />; // Clear sky
        if (code <= 3) return <Cloud size={size} color={color} />; // Partly cloudy
        if (code <= 48) return <Cloud size={size} color={color} />; // Fog
        if (code <= 57) return <CloudDrizzle size={size} color="#4A90E2" />; // Drizzle
        if (code <= 67) return <CloudRain size={size} color="#4A90E2" />; // Rain
        if (code <= 77) return <CloudSnow size={size} color="#B0E0E6" />; // Snow
        if (code <= 82) return <CloudRain size={size} color="#4A90E2" />; // Rain showers
        if (code <= 86) return <CloudSnow size={size} color="#B0E0E6" />; // Snow showers
        return <Cloud size={size} color={color} />; // Default
    };

    const getWeatherDescription = (code: number): string => {
        if (code === 0) return 'Ciel dégagé';
        if (code === 1) return 'Principalement dégagé';
        if (code === 2) return 'Partiellement nuageux';
        if (code === 3) return 'Couvert';
        if (code <= 48) return 'Brouillard';
        if (code <= 57) return 'Bruine';
        if (code <= 67) return 'Pluie';
        if (code <= 77) return 'Neige';
        if (code <= 82) return 'Averses';
        if (code <= 86) return 'Averses de neige';
        return 'Conditions variables';
    };

    useEffect(() => {
        getLocationAndWeather();
    }, []);

    const getLocationAndWeather = async () => {
        try {
            setLoading(true);

            // Request location permission
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission refusée', 'Impossible d\'accéder à votre position');
                setLoading(false);
                return;
            }

            // Get current location
            const currentLocation = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = currentLocation.coords;
            setLocation({ latitude, longitude });

            // Get location name
            const reverseGeocode = await Location.reverseGeocodeAsync({ latitude, longitude });
            if (reverseGeocode && reverseGeocode.length > 0) {
                const { city, region, country } = reverseGeocode[0];
                setLocationName(city || region || country || 'Position actuelle');
            }

            // Fetch weather data
            await fetchWeatherData(latitude, longitude);
        } catch (error) {
            console.error('Error getting location:', error);
            Alert.alert('Erreur', 'Impossible de récupérer votre position');
            setLoading(false);
        }
    };

    const fetchWeatherData = async (latitude: number, longitude: number) => {
        try {
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,weathercode&current_weather=true&timezone=auto`;

            const response = await fetch(url);
            const data = await response.json();

            if (data.current_weather) {
                setWeatherData({
                    temperature: data.current_weather.temperature,
                    windSpeed: data.current_weather.windspeed,
                    weatherCode: data.current_weather.weathercode,
                    time: data.current_weather.time,
                });
            }

            // Get next 6 hours forecast
            if (data.hourly) {
                const now = new Date();
                const hourlyForecast: HourlyData[] = [];

                for (let i = 0; i < Math.min(6, data.hourly.time.length); i++) {
                    const forecastTime = new Date(data.hourly.time[i]);
                    if (forecastTime > now) {
                        hourlyForecast.push({
                            time: data.hourly.time[i],
                            temperature: data.hourly.temperature_2m[i],
                            weatherCode: data.hourly.weathercode[i],
                        });

                        if (hourlyForecast.length === 6) break;
                    }
                }

                setHourlyData(hourlyForecast);
            }

            setLoading(false);
        } catch (error) {
            console.error('Error fetching weather:', error);
            Alert.alert('Erreur', 'Impossible de récupérer les données météo');
            setLoading(false);
        }
    };

    const formatTime = (timeString: string): string => {
        const date = new Date(timeString);
        return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    };

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, themeStyles.container]}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={isDark ? '#60a5fa' : '#0057b7'} />
                    <Text style={[styles.loadingText, themeStyles.text]}>Récupération de la météo...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, themeStyles.container]}>
            <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.locationContainer}>
                        <MapPin size={20} color={themeStyles.subText.color} />
                        <Text style={[styles.locationText, themeStyles.text]}>{locationName}</Text>
                    </View>
                    <TouchableOpacity onPress={getLocationAndWeather}>
                        <Text style={[styles.refreshText, { color: isDark ? '#60a5fa' : '#0057b7' }]}>
                            Actualiser
                        </Text>
                    </TouchableOpacity>
                </View>

                {weatherData && (
                    <>
                        {/* Current Weather */}
                        <View style={styles.currentWeather}>
                            {getWeatherIcon(weatherData.weatherCode, 100)}
                            <Text style={[styles.temperature, themeStyles.text]}>
                                {Math.round(weatherData.temperature)}°C
                            </Text>
                            <Text style={[styles.description, themeStyles.subText]}>
                                {getWeatherDescription(weatherData.weatherCode)}
                            </Text>
                        </View>

                        {/* Weather Details */}
                        <View style={styles.detailsContainer}>
                            <View style={[styles.detailCard, themeStyles.card]}>
                                <Wind size={24} color={themeStyles.subText.color} />
                                <Text style={[styles.detailValue, themeStyles.text]}>
                                    {weatherData.windSpeed} km/h
                                </Text>
                                <Text style={[styles.detailLabel, themeStyles.subText]}>Vent</Text>
                            </View>

                            <View style={[styles.detailCard, themeStyles.card]}>
                                <Thermometer size={24} color={themeStyles.subText.color} />
                                <Text style={[styles.detailValue, themeStyles.text]}>
                                    {Math.round(weatherData.temperature)}°
                                </Text>
                                <Text style={[styles.detailLabel, themeStyles.subText]}>Température</Text>
                            </View>
                        </View>

                        {/* Hourly Forecast */}
                        {hourlyData.length > 0 && (
                            <View style={styles.forecastSection}>
                                <Text style={[styles.sectionTitle, themeStyles.text]}>Prévisions horaires</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hourlyScroll}>
                                    {hourlyData.map((hour, index) => (
                                        <View key={index} style={[styles.hourlyCard, themeStyles.card, themeStyles.border]}>
                                            <Text style={[styles.hourlyTime, themeStyles.subText]}>
                                                {formatTime(hour.time)}
                                            </Text>
                                            {getWeatherIcon(hour.weatherCode, 32)}
                                            <Text style={[styles.hourlyTemp, themeStyles.text]}>
                                                {Math.round(hour.temperature)}°
                                            </Text>
                                        </View>
                                    ))}
                                </ScrollView>
                            </View>
                        )}
                    </>
                )}
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 15,
        fontSize: 16,
    },
    scrollView: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    locationText: {
        fontSize: 16,
        fontWeight: '600',
    },
    refreshText: {
        fontSize: 14,
        fontWeight: '600',
    },
    currentWeather: {
        alignItems: 'center',
        paddingVertical: 30,
        paddingHorizontal: 20,
    },
    temperature: {
        fontSize: 72,
        fontWeight: 'bold',
        marginTop: 15,
    },
    description: {
        fontSize: 20,
        marginTop: 8,
    },
    detailsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 20,
        marginTop: 20,
        gap: 15,
    },
    detailCard: {
        flex: 1,
        padding: 20,
        borderRadius: 15,
        alignItems: 'center',
        gap: 8,
    },
    detailValue: {
        fontSize: 20,
        fontWeight: '600',
        marginTop: 5,
    },
    detailLabel: {
        fontSize: 14,
    },
    forecastSection: {
        marginTop: 30,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 15,
    },
    hourlyScroll: {
        flexDirection: 'row',
    },
    hourlyCard: {
        padding: 15,
        borderRadius: 15,
        alignItems: 'center',
        marginRight: 12,
        minWidth: 80,
        borderWidth: 1,
    },
    hourlyTime: {
        fontSize: 12,
        marginBottom: 8,
    },
    hourlyTemp: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 8,
    },
});
