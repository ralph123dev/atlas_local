
import { Bookmark, Calendar, CloudSun, MapPin, Moon, Sun, X } from 'lucide-react-native';
import React, { useContext, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated';
import { NavigationContext } from '../app/NavigationContext';
import { ThemeContext } from '../app/ThemeContext';
import { MENU_WIDTH, styles } from '../constants/styles/SideMenu.styles';

interface SideMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SideMenu = ({ isOpen, onClose }: SideMenuProps) => {
    const { theme, setTheme } = useContext(ThemeContext);
    const router = useContext(NavigationContext);
    const translateX = useSharedValue(MENU_WIDTH);
    const opacity = useSharedValue(0);

    const isDark = theme === 'dark';

    const themeStyles = {
        container: { backgroundColor: isDark ? '#1a1a1a' : '#fff' },
        text: { color: isDark ? '#f3f4f6' : '#1a1a1a' },
        border: { borderBottomColor: isDark ? '#374151' : '#f3f4f6' },
        icon: isDark ? '#f3f4f6' : '#1a1a1a',
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
        },
        {
            icon: Bookmark,
            label: 'Enregistré',
            onPress: () => {
                onClose();
                router.push('/saved');
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

                {/* Theme Section */}
                <View style={[styles.themeSection, themeStyles.border]}>
                    <Text style={[styles.sectionTitle, themeStyles.text]}>Apparence</Text>
                    <View style={styles.themeOptions}>
                        <TouchableOpacity
                            onPress={() => setTheme('light')}
                            style={[styles.themeBtn, theme === 'light' && styles.themeBtnActive]}
                        >
                            <Sun size={20} color={theme === 'light' ? '#0057b7' : themeStyles.icon} />
                            <Text style={[styles.themeBtnText, themeStyles.text, theme === 'light' && { color: '#0057b7' }]}>Clair</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setTheme('dark')}
                            style={[styles.themeBtn, theme === 'dark' && styles.themeBtnActive]}
                        >
                            <Moon size={20} color={theme === 'dark' ? '#60a5fa' : themeStyles.icon} />
                            <Text style={[styles.themeBtnText, themeStyles.text, theme === 'dark' && { color: '#60a5fa' }]}>Sombre</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Animated.View>
        </>
    );
};



