import { ArrowLeft, Map, MessageSquare, MessageSquarePlus } from 'lucide-react-native';
import React, { useContext, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContext } from './NavigationContext';

export default function AskScreen() {
    const router = useContext(NavigationContext);
    const [activeTab, setActiveTab] = useState('new_chat');

    const handleBack = () => {
        // Retour vers Home (Explorer par défaut ou simplement Home)
        router.push('/home');
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'conversations':
                return <Text style={styles.contentText}>Historique des conversations</Text>;
            case 'new_chat':
                return <Text style={styles.contentText}>Démarrer un nouveau chat avec Nexora AI</Text>;
            case 'plan':
                return <Text style={styles.contentText}>Votre Plan</Text>;
            default:
                return null;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header spécifique Ask */}
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../assets/images/logo.png')}
                        style={styles.logo}
                    />
                    <Text style={styles.headerTitle}>Nexora AI</Text>
                </View>
            </View>

            <View style={styles.content}>
                {renderContent()}
            </View>

            {/* Barre de navigation spécifique Ask */}
            <View style={styles.bottomNav}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'conversations' && styles.activeTab]}
                    onPress={() => setActiveTab('conversations')}
                >
                    <MessageSquare size={24} color={activeTab === 'conversations' ? '#0057b7' : '#6b7280'} />
                    <Text style={[styles.tabText, activeTab === 'conversations' && styles.activeTabText]}>Conversations</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tab, activeTab === 'new_chat' && styles.activeTab]}
                    onPress={() => setActiveTab('new_chat')}
                >
                    <MessageSquarePlus size={24} color={activeTab === 'new_chat' ? '#0057b7' : '#6b7280'} />
                    <Text style={[styles.tabText, activeTab === 'new_chat' && styles.activeTabText]}>Nouveau chat</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tab, activeTab === 'plan' && styles.activeTab]}
                    onPress={() => setActiveTab('plan')}
                >
                    <Map size={24} color={activeTab === 'plan' ? '#0057b7' : '#6b7280'} />
                    <Text style={[styles.tabText, activeTab === 'plan' && styles.activeTabText]}>Plan</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.tab}
                    onPress={handleBack}
                >
                    <ArrowLeft size={24} color="#6b7280" />
                    <Text style={styles.tabText}>Retour</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
        marginTop: 30, // Marge safe area pour cohérence avec Home modifiée par user
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
        borderRadius: 8, // Petit style optionnel
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    contentText: {
        fontSize: 18,
        color: '#1a1a1a',
    },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        backgroundColor: '#fff',
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
    activeTabText: {
        color: '#0057b7',
        fontWeight: '600',
    },
});
