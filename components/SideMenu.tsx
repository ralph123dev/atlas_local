
import { Calendar, CloudSun, MapPin, X } from 'lucide-react-native';
import React, { useContext, useEffect } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated';
import { NavigationContext } from '../app/NavigationContext';
import { ThemeContext } from '../app/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MENU_WIDTH = SCREEN_WIDTH * 0.7;

interface SideMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SideMenu = ({ isOpen, onClose }: SideMenuProps) => {
    const { theme } = useContext(ThemeContext);
    const router = useContext(NavigationContext);
    const translateX = useSharedValue(MENU_WIDTH);
    const opacity = useSharedValue(0);

    const isDark = theme === 'dark';
    const isBlue = theme === 'blue';

    const themeStyles = {
        container: { backgroundColor: isDark ? '#1a1a1a' : isBlue ? '#15202b' : '#fff' },
        text: { color: isDark || isBlue ? '#f3f4f6' : '#1a1a1a' },
        border: { borderBottomColor: isDark ? '#374151' : '#f3f4f6' },
        icon: isDark || isBlue ? '#f3f4f6' : '#1a1a1a',
        overlay: { backgroundColor: 'rgba(0,0,0,0.5)' }
    };

    useEffect(() => {
        if (isOpen) {
            translateX.value = withSpring(0, { damping: 20 });
            opacity.value = withTiming(1);
        } else {
            translateX.value = withTiming(MENU_WIDTH);
            opacity.value = withTiming(0);
        }
    }, [isOpen]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    const overlayStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        pointerEvents: isOpen ? 'auto' : 'none',
    }));

    const menuItems = [
        {
            icon: CloudSun,
            label: 'Météo',
            onPress: () => {
                onClose();
                router.push('/weather');
            }
        },
        {
            icon: Calendar,
            label: 'Événements',
            onPress: () => {
                onClose();
                router.push('/events');
            }
        },
        {
            icon: MapPin,
            label: 'Tendances à proximité',
            onPress: () => {
                onClose();
                router.push('/trending');
            }
        }
    ];

    return (
        <>
            <Animated.View style={[styles.overlay, themeStyles.overlay, overlayStyle]}>
                <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} activeOpacity={1} />
            </Animated.View>
            <Animated.View style={[styles.menuContainer, themeStyles.container, animatedStyle]}>
                <View style={[styles.header, themeStyles.border]}>
                    <Text style={[styles.title, themeStyles.text]}>Menu</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <X size={24} color={themeStyles.icon} />
                    </TouchableOpacity>
                </View>

                <View style={styles.itemsContainer}>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[styles.menuItem, themeStyles.border]}
                            onPress={item.onPress}
                        >
                            <item.icon size={24} color={themeStyles.icon} style={styles.icon} />
                            <Text style={[styles.menuText, themeStyles.text]}>{item.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </Animated.View>
        </>
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1000,
    },
    menuContainer: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        width: MENU_WIDTH,
        zIndex: 1001,
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: -2,
            height: 0,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        paddingTop: 50, // SafeArea
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        marginBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 5,
    },
    itemsContainer: {
        paddingHorizontal: 10,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'transparent',
    },
    icon: {
        marginRight: 15,
    },
    menuText: {
        fontSize: 16,
        fontWeight: '500',
    }
});
