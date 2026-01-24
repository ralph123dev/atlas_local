import { ArrowLeft, Check, Droplet, Map, MessageSquare, MessageSquarePlus, Mic, Moon, Palette, Send, Sun } from 'lucide-react-native';
import React, { useContext, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContext } from './NavigationContext';
import { ThemeContext } from './ThemeContext';

export default function AskScreen() {
    const router = useContext(NavigationContext);
    const { theme, setTheme } = useContext(ThemeContext);
    const [activeTab, setActiveTab] = useState('conversations');
    const [isThemeMenuVisible, setIsThemeMenuVisible] = useState(false);
    const [messageText, setMessageText] = useState('');

    const isDark = theme === 'dark';
    const isBlue = theme === 'blue';

    // Dynamic styles based on theme
    const themeStyles = {
        container: { backgroundColor: isDark ? '#1a1a1a' : isBlue ? '#15202b' : '#fff' },
        text: { color: isDark || isBlue ? '#f3f4f6' : '#1a1a1a' },
        subText: { color: isDark || isBlue ? '#8899a6' : '#6b7280' },
        border: { borderBottomColor: isDark ? '#374151' : isBlue ? '#38444d' : '#f3f4f6', borderTopColor: isDark ? '#374151' : isBlue ? '#38444d' : '#e5e7eb' },
        navBg: { backgroundColor: isDark ? '#1a1a1a' : isBlue ? '#15202b' : '#fff' },
        tabActiveBg: { backgroundColor: isDark ? '#374151' : isBlue ? '#22303c' : '#f0f9ff' },
        tabActiveText: { color: isDark ? '#60a5fa' : isBlue ? '#1d9bf0' : '#0057b7' },
        iconActive: isDark ? '#60a5fa' : isBlue ? '#1d9bf0' : '#0057b7',
        iconInactive: isDark ? '#9ca3af' : isBlue ? '#8899a6' : '#6b7280',
        inputBg: isDark ? '#374151' : isBlue ? '#273340' : '#f3f4f6',
        inputText: isDark || isBlue ? '#f3f4f6' : '#1a1a1a',
        divider: { backgroundColor: isDark ? '#374151' : isBlue ? '#38444d' : '#f3f4f6' },
    };

    const handleBack = () => {
        if (activeTab === 'new_chat') {
            setActiveTab('conversations');
        } else {
            router.push('/home');
        }
    };

    const toggleThemeMenu = () => {
        setIsThemeMenuVisible(!isThemeMenuVisible);
    };

    const selectTheme = (newTheme: 'light' | 'dark' | 'blue') => {
        setTheme(newTheme);
        setIsThemeMenuVisible(false);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'conversations':
                return <Text style={[styles.contentText, themeStyles.text]}>Historique des conversations</Text>;
            // 'new_chat' logic is handled in main return to hide nav
            case 'plan':
                return <Text style={[styles.contentText, themeStyles.text]}>Votre Plan</Text>;
            default:
                return null;
        }
    };

    if (activeTab === 'new_chat') {
        return (
            <SafeAreaView style={[styles.container, themeStyles.container]}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
                >
                    {/* Header New Chat */}
                    <View style={[styles.chatHeader, themeStyles.border]}>
                        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                            <ArrowLeft size={24} color={themeStyles.text.color} />
                        </TouchableOpacity>
                        <Text style={[styles.headerTitle, themeStyles.text]}>Nouveau Chat</Text>
                        <View style={{ width: 24 }} />
                    </View>

                    <View style={styles.chatContent}>
                        <Text style={[styles.contentText, themeStyles.subText]}>Commencez une nouvelle conversation...</Text>
                    </View>

                    {/* Input Area */}
                    <View style={[styles.chatInputContainer, themeStyles.navBg, themeStyles.border]}>
                        <View style={[styles.inputWrapper, { backgroundColor: themeStyles.inputBg }]}>
                            <TextInput
                                style={[styles.input, { color: themeStyles.inputText }]}
                                placeholder="Message..."
                                placeholderTextColor={isDark || isBlue ? '#8899a6' : '#6b7280'}
                                value={messageText}
                                onChangeText={setMessageText}
                                multiline
                            />
                        </View>
                        <View style={styles.actionButtons}>
                            <TouchableOpacity style={styles.iconButton}>
                                <Mic size={24} color={themeStyles.iconInactive} />
                            </TouchableOpacity>
                            {messageText.length > 0 && (
                                <TouchableOpacity style={[styles.iconButton, styles.sendButton]}>
                                    <Send size={20} color="#fff" />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, themeStyles.container]}>
            {/* Header spécifique Ask */}
            <View style={[styles.header, themeStyles.navBg, themeStyles.border]}>
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../assets/images/logo.jpg')}
                        style={styles.logo}
                    />
                    <Text style={[styles.headerTitle, themeStyles.text]}>Nexora AI</Text>
                </View>
            </View>

            <View style={styles.content}>
                {renderContent()}
            </View>

            {/* Theme Selection Menu (Bottom Sheet Simulation) */}
            {isThemeMenuVisible && (
                <Pressable style={styles.modalOverlay} onPress={() => setIsThemeMenuVisible(false)}>
                    <View style={[styles.themeMenu, themeStyles.navBg, { borderColor: isDark || isBlue ? '#38444d' : '#e5e7eb' }]}>
                        <Text style={[styles.themeMenuTitle, themeStyles.text]}>Apparence</Text>

                        <TouchableOpacity style={styles.themeOption} onPress={() => selectTheme('light')}>
                            <View style={styles.themeOptionLeft}>
                                <Sun size={20} color={isDark || isBlue ? '#8899a6' : '#6b7280'} />
                                <Text style={[styles.themeOptionText, themeStyles.text]}>Clair</Text>
                            </View>
                            {theme === 'light' && <Check size={20} color="#0057b7" />}
                        </TouchableOpacity>

                        <View style={[styles.divider, themeStyles.divider]} />

                        <TouchableOpacity style={styles.themeOption} onPress={() => selectTheme('dark')}>
                            <View style={styles.themeOptionLeft}>
                                <Moon size={20} color={isDark || isBlue ? '#8899a6' : '#6b7280'} />
                                <Text style={[styles.themeOptionText, themeStyles.text]}>Sombre</Text>
                            </View>
                            {theme === 'dark' && <Check size={20} color="#60a5fa" />}
                        </TouchableOpacity>

                        <View style={[styles.divider, themeStyles.divider]} />

                        <TouchableOpacity style={styles.themeOption} onPress={() => selectTheme('blue')}>
                            <View style={styles.themeOptionLeft}>
                                <Droplet size={20} color={isDark || isBlue ? '#8899a6' : '#6b7280'} />
                                <Text style={[styles.themeOptionText, themeStyles.text]}>Bleu</Text>
                            </View>
                            {theme === 'blue' && <Check size={20} color="#1d9bf0" />}
                        </TouchableOpacity>
                    </View>
                </Pressable>
            )}

            {/* Barre de navigation spécifique Ask */}
            <View style={[styles.bottomNav, themeStyles.navBg, themeStyles.border]}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'conversations' && [styles.activeTab, themeStyles.tabActiveBg]]}
                    onPress={() => setActiveTab('conversations')}
                >
                    <MessageSquare size={24} color={activeTab === 'conversations' ? themeStyles.iconActive : themeStyles.iconInactive} />
                    <Text style={[styles.tabText, themeStyles.subText, activeTab === 'conversations' && [styles.activeTabText, themeStyles.tabActiveText]]}>Conversations</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tab, activeTab === 'new_chat' && [styles.activeTab, themeStyles.tabActiveBg]]}
                    onPress={() => setActiveTab('new_chat')}
                >
                    <MessageSquarePlus size={24} color={activeTab === 'new_chat' ? themeStyles.iconActive : themeStyles.iconInactive} />
                    <Text style={[styles.tabText, themeStyles.subText, activeTab === 'new_chat' && [styles.activeTabText, themeStyles.tabActiveText]]}>Nouveau</Text>
                </TouchableOpacity>

                {/* Bg / Theme Tab */}
                <TouchableOpacity
                    style={[styles.tab, isThemeMenuVisible && [styles.activeTab, themeStyles.tabActiveBg]]}
                    onPress={toggleThemeMenu}
                >
                    <Palette size={24} color={isThemeMenuVisible ? themeStyles.iconActive : themeStyles.iconInactive} />
                    <Text style={[styles.tabText, themeStyles.subText, isThemeMenuVisible && [styles.activeTabText, themeStyles.tabActiveText]]}>Thème</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tab, activeTab === 'plan' && [styles.activeTab, themeStyles.tabActiveBg]]}
                    onPress={() => setActiveTab('plan')}
                >
                    <Map size={24} color={activeTab === 'plan' ? themeStyles.iconActive : themeStyles.iconInactive} />
                    <Text style={[styles.tabText, themeStyles.subText, activeTab === 'plan' && [styles.activeTabText, themeStyles.tabActiveText]]}>Plan</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.tab}
                    onPress={handleBack}
                >
                    <ArrowLeft size={24} color={themeStyles.iconInactive} />
                    <Text style={[styles.tabText, themeStyles.subText]}>Retour</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        marginTop: 30,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logo: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
        marginRight: 10,
        borderRadius: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    contentText: {
        fontSize: 18,
    },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 10,
        borderTopWidth: 1,
    },
    tab: {
        alignItems: 'center',
        padding: 5,
        flex: 1,
    },
    activeTab: {
        borderRadius: 10,
    },
    tabText: {
        fontSize: 10,
        marginTop: 4,
    },
    activeTabText: {
        fontWeight: '600',
    },
    // Styles for Theme Menu
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 80, // Height of bottomNav roughly
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'flex-end',
    },
    themeMenu: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        paddingBottom: 20,
        borderWidth: 1,
        borderBottomWidth: 0,
        marginHorizontal: 10,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    themeMenuTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    themeOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },
    themeOptionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    themeOptionText: {
        fontSize: 16,
        marginLeft: 10,
    },
    divider: {
        height: 1,
        width: '100%',
    },
    // Chat Interface Styles
    chatHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderBottomWidth: 1,
    },
    backButton: {
        padding: 5,
    },
    chatContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    chatInputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderTopWidth: 1,
    },
    inputWrapper: {
        flex: 1,
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginRight: 10,
        minHeight: 40,
        maxHeight: 100,
    },
    input: {
        fontSize: 16,
        padding: 0,
    },
    actionButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 4,
    },
    iconButton: {
        padding: 8,
    },
    sendButton: {
        backgroundColor: '#0057b7',
        borderRadius: 20,
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 5,
    },
});


/**
 * @Project: Atlas Local
 * @Author: Ralph <ralphurgue@gmail.com>
 * @Date: 2026-01-12
 * @Last Modified: 2026-01-24
 * @Description: Application mobile d'exploration.
 */