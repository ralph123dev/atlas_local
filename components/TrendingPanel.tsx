
import { ChevronRight, MapPin, Star } from 'lucide-react-native';
import React, { useContext, useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Gesture } from 'react-native-gesture-handler';
import Animated, {
    Extrapolation,
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';
import { ThemeContext } from '../app/ThemeContext';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const OPEN_HEIGHT = SCREEN_HEIGHT * 0.85;

// We simply translate Y from 0 (Open) to OPEN_HEIGHT (Closed).
const MAX_TRANSLATE = OPEN_HEIGHT;

export const TrendingPanel = () => {
    const { theme } = useContext(ThemeContext);
    const isDark = theme === 'dark';
    const isBlue = theme === 'blue';

    const themeStyles = {
        panelBg: { backgroundColor: isDark ? '#1a1a1a' : isBlue ? '#15202b' : '#fff' },
        text: { color: isDark || isBlue ? '#f3f4f6' : '#1a1a1a' },
        subText: { color: isDark ? '#9ca3af' : isBlue ? '#8899a6' : '#6b7280' },
        cardBg: {
            backgroundColor: isDark ? '#262626' : isBlue ? '#192734' : '#fff',
            borderColor: isDark ? '#404040' : isBlue ? '#38444d' : '#f3f4f6'
        },
        buttonBg: {
            backgroundColor: isDark ? '#374151' : isBlue ? '#22303c' : '#f0f9ff',
            borderColor: isDark ? '#4b5563' : isBlue ? '#22303c' : '#e0f2fe'
        },
        buttonText: { color: isDark || isBlue ? '#60a5fa' : '#0057b7' },
        glow: {
            backgroundColor: isDark || isBlue ? '#3b82f6' : '#0057b7',
            shadowColor: isDark || isBlue ? '#3b82f6' : '#0057b7'
        },
        weatherBg: { backgroundColor: isDark || isBlue ? '#3b82f6' : '#0057b7' }
    };

    // Initial state: Closed (translated down by OPEN_HEIGHT)
    const translateY = useSharedValue(MAX_TRANSLATE);
    const context = useSharedValue({ y: 0 });
    const [isOpen, setIsOpen] = useState(false);



    const togglePanel = () => {
        'worklet';
        if (translateY.value > MAX_TRANSLATE / 2) {
            // Open it
            translateY.value = withSpring(0, { damping: 15 });
            runOnJS(setIsOpen)(true);
        } else {
            // Close it
            translateY.value = withSpring(MAX_TRANSLATE, { damping: 15 });
            runOnJS(setIsOpen)(false);
        }
    };

    const panGesture = Gesture.Pan()
        .onStart(() => {
            context.value = { y: translateY.value };
        })
        .onUpdate((event) => {
            const newY = context.value.y + event.translationY;
            // Limit range: 0 (Open) to MAX_TRANSLATE (Closed)
            translateY.value = Math.max(-50, Math.min(MAX_TRANSLATE, newY));
        })
        .onEnd((event) => {
            if (event.velocityY < -500 || translateY.value < MAX_TRANSLATE * 0.7) {
                // Open
                translateY.value = withSpring(0, { damping: 15 });
                runOnJS(setIsOpen)(true);
            } else {
                // Close
                translateY.value = withSpring(MAX_TRANSLATE, { damping: 15 });
                runOnJS(setIsOpen)(false);
            }
        });

    const tapGesture = Gesture.Tap().onEnd(() => {
        togglePanel();
    });

    const composedGesture = Gesture.Race(tapGesture, panGesture);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY.value }],
        };
    });



    const headerStyle = useAnimatedStyle(() => {
        // When Panel is Closed (MAX_TRANSLATE), header is typically positioned above via CSS top value (-140).
        // However, this `floatingHeader` is INSIDE the panel container which moves.
        // If panel moves UP (0), the header (top: -140) moves UP with it, potentially going off screen if top is -140.
        // Wait, the panel container is at bottom: 0, height: OPEN_HEIGHT.
        // Closed: TranslateY = OPEN_HEIGHT. Panel Top is at Screen Bottom. Header (top -140) is at Screen Bottom - 140. Visible.
        // Open: TranslateY = 0. Panel Top is at Screen Bottom - OPEN_HEIGHT. Header is at Screen Bottom - OPEN_HEIGHT - 140. WAY off screen top.
        // Fix: When Open, we want header to stay visible or disappear? "Quand on glisse... fais que on puisse bien voir l'icone de chevront vers le bas".
        // So we want it visible at top of panel content.
        // We need to counteract the panel movement for the header, OR just position it differently when open.
        // Let's translate it down as panel opens.
        // Opened (0): Shift down by 140 roughly? Or just enough to be inside?
        const headerTranslate = interpolate(
            translateY.value,
            [0, MAX_TRANSLATE],
            [140, 0], // Move down 140px when open
            Extrapolation.CLAMP
        );
        return {
            transform: [{ translateY: headerTranslate }]
        };
    });

    const dimmerStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            translateY.value,
            [0, MAX_TRANSLATE],
            [0.6, 0], // 0.6 opacity when open (0), 0 when closed
            Extrapolation.CLAMP
        );
        return {
            opacity,
        };
    });

    const renderTrendingItems = () => {
        const items: React.ReactNode[] = [];
        MOCK_DATA.forEach((item, index) => {
            items.push(<TrendingCard key={`item-${item.id}`} {...item} themeStyles={themeStyles} />);
            if ((index + 1) % 3 === 0) {
                items.push(
                    <TouchableOpacity key={`see-all-${index}`} style={[styles.viewAllCard, themeStyles.cardBg]}>
                        <View style={[styles.viewAllCircle, themeStyles.buttonBg]}>
                            <ChevronRight size={24} color={themeStyles.buttonText.color} />
                        </View>
                        <Text style={[styles.viewAllCardText, themeStyles.text]}>Voir tout</Text>
                    </TouchableOpacity>
                );
            }
        });
        return items;
    };

    return (
        <View style={[StyleSheet.absoluteFill, styles.mainContainer]} pointerEvents="box-none">
            {/* Dimmer Background */}
            <Animated.View style={[styles.dimmer, dimmerStyle]} pointerEvents={isOpen ? 'auto' : 'none'}>
                <TouchableOpacity style={StyleSheet.absoluteFill} onPress={() => togglePanel()} activeOpacity={1} />
            </Animated.View>

            {/* Sliding Panel */}
            <Animated.View style={[
                styles.panelContainer,
                themeStyles.panelBg,
                animatedStyle
            ]}>

                {/* Floating Handle Section REMOVED */}

                {/* Panel Content (Visible only when sliding up) */}
                <View style={[styles.panelContent, themeStyles.panelBg]}>
                    <Text style={[styles.sectionTitle, themeStyles.text]}>Tendances à proximité</Text>

                    {/* Section 1 */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                        {renderTrendingItems()}
                    </ScrollView>

                    {/* Section 3 */}
                    <Text style={[styles.sectionTitle, themeStyles.text]}>Recommandés pour vous</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                        {MOCK_DATA.slice().reverse().map((item) => (
                            <TrendingCard key={`rec-${item.id}`} {...item} themeStyles={themeStyles} />
                        ))}
                    </ScrollView>
                </View>
            </Animated.View>
        </View>
    );
};

// Styles
const styles = StyleSheet.create({
    mainContainer: {
        zIndex: 1000,
        elevation: 1000,
    },
    dimmer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#000',
        zIndex: 100, // Behind the panel
    },
    panelContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: OPEN_HEIGHT,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        zIndex: 200,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 20,
        justifyContent: 'flex-start',
    },
    floatingHeader: {
        position: 'absolute',
        top: -140, // Move significantly higher to clear nav bar
        left: 0,
        right: 0,
        height: 140,
    },
    absoluteItem: {
        position: 'absolute',
        bottom: 50, // Lift up from the panel edge
        width: 60,
        height: 60,
        zIndex: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    chevronHitBox: {
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -99,
    },
    chevronWrapper: {
        // Just the animation wrapper
    },
    glowContainer: {
        borderRadius: 30,
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 15,
        elevation: 10,
    },
    weatherIconContainer: {
        position: 'absolute',
        bottom: 154, // Aligned with manually shifted chevron (50 + 104)
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        zIndex: 20,
    },
    panelContent: {
        flex: 1,
        paddingTop: 40, // Padding top so content doesn't overlap if header comes down a bit
        paddingHorizontal: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        marginLeft: 5,
    },
    scrollContent: {
        paddingRight: 20,
        paddingBottom: 20,
    },
    card: {
        width: 200,
        borderRadius: 16,
        marginRight: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        overflow: 'hidden',
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
    viewAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f0f9ff',
        padding: 15,
        borderRadius: 12,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#e0f2fe',
    },
    viewAllText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0057b7',
    },
    viewAllCard: {
        width: 140,
        borderRadius: 16,
        marginRight: 15,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
    },
    viewAllCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    viewAllCardText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
});

interface TrendingCardProps {
    name: string;
    category: string;
    rating: number;
    distance: string;
    imageUrl: string;
    themeStyles: any;
}

const TrendingCard = ({ name, category, rating, distance, imageUrl, themeStyles }: TrendingCardProps) => (
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

const MOCK_DATA = [
    { id: 1, name: 'Le Café Parisien', category: 'Café & Détente', rating: 4.8, distance: '1.2km', imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=300&auto=format&fit=crop' },
    { id: 2, name: 'Cinéma Star', category: 'Divertissement', rating: 4.5, distance: '0.8km', imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=300&auto=format&fit=crop' },
    { id: 3, name: 'Parc Central', category: 'Plein air', rating: 4.9, distance: '2.5km', imageUrl: 'https://images.unsplash.com/photo-1496347646636-ea47f7d6b37b?q=80&w=300&auto=format&fit=crop' },
    { id: 4, name: 'Musée d\'Art Moderne', category: 'Culture', rating: 4.7, distance: '3.1km', imageUrl: 'https://images.unsplash.com/photo-1518998053901-5348d3969105?q=80&w=300&auto=format&fit=crop' },
    { id: 5, name: 'Burger & Co', category: 'Restauration', rating: 4.6, distance: '0.5km', imageUrl: 'https://images.unsplash.com/photo-1586190848861-99c8a3da7af8?q=80&w=300&auto=format&fit=crop' },
    { id: 6, name: 'Salle de Sport Fit', category: 'Sport', rating: 4.4, distance: '1.0km', imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=300&auto=format&fit=crop' },
    { id: 7, name: 'Librairie du Coin', category: 'Shopping', rating: 4.8, distance: '1.5km', imageUrl: 'https://images.unsplash.com/photo-1507842217121-9d5974d091b0?q=80&w=300&auto=format&fit=crop' },
    { id: 8, name: 'Lac Bleu', category: 'Nature', rating: 4.9, distance: '5.0km', imageUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=300&auto=format&fit=crop' },
    { id: 9, name: 'Théâtre National', category: 'Spectacle', rating: 4.7, distance: '2.2km', imageUrl: 'https://images.unsplash.com/photo-1503095392269-41f86433ae39?q=80&w=300&auto=format&fit=crop' },
];
