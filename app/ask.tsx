import { ArrowLeft, Edit2, FileText, Image as ImageIcon, Map, MessageSquare, MessageSquarePlus, Mic, Paperclip, Send, Trash2, Video, X } from 'lucide-react-native';
import React, { useContext, useRef, useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContext } from './NavigationContext';
import { ThemeContext } from './ThemeContext';
/**
 * Interface définissant la structure d'un message dans le chat.
 */
interface Message {
    id: string;
    text: string;
    timestamp: Date;
    isUser: boolean; // True si le message vient de l'utilisateur, False si c'est le bot
    attachments?: {
        type: 'image' | 'video' | 'document' | 'audio';
        name: string;
        uri?: string;
    }[];
}

export default function AskScreen() {
    const router = useContext(NavigationContext);
    const { theme } = useContext(ThemeContext);

    // États du composant
    const [activeTab, setActiveTab] = useState('conversations'); // Gère l'onglet actif (conversations, plan, ou nouveau chat)

    const [messageText, setMessageText] = useState(''); // Texte saisi dans l'input
    const [messages, setMessages] = useState<Message[]>([]); // Liste des messages affichés
    const [isRecording, setIsRecording] = useState(false); // État de l'enregistrement vocal
    const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null); // ID du message sélectionné pour actions (edit/delete)
    const [isAttachmentMenuVisible, setIsAttachmentMenuVisible] = useState(false); // Visibilité du menu des pièces jointes
    const [editingMessageId, setEditingMessageId] = useState<string | null>(null); // ID du message en cours d'édition
    const scrollViewRef = useRef<ScrollView>(null);

    const isDark = theme === 'dark';
    const isBlue = theme === 'blue';

    // Styles dynamiques basés sur le thème actuel
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
        messageBubbleUser: { backgroundColor: isDark ? '#0057b7' : isBlue ? '#1d9bf0' : '#0057b7' },
        messageBubbleBot: { backgroundColor: isDark ? '#374151' : isBlue ? '#273340' : '#f3f4f6' },
        messageTextUser: { color: '#fff' },
        messageTextBot: { color: isDark || isBlue ? '#f3f4f6' : '#1a1a1a' },
    };

    /**
     * Gère le retour en arrière ou le changement d'onglet
     */
    const handleBack = () => {
        if (activeTab === 'new_chat') {
            setActiveTab('conversations');
        } else {
            router.push('/home');
        }
    };

    /**
     * Envoie un message ou enregistre les modifications d'un message existant
     */
    const handleSendMessage = () => {
        if (messageText.trim().length === 0) return;

        if (editingMessageId) {
            // Modifier le message existant
            setMessages(messages.map(msg =>
                msg.id === editingMessageId
                    ? { ...msg, text: messageText.trim() }
                    : msg
            ));
            setEditingMessageId(null);
        } else {
            // Créer un nouveau message utilisateur
            const newMessage: Message = {
                id: Date.now().toString(),
                text: messageText.trim(),
                timestamp: new Date(),
                isUser: true,
            };
            setMessages([...messages, newMessage]);

            // Simulation d'une réponse de l'IA (bot) après un délai de 1 seconde
            setTimeout(() => {
                const botResponse: Message = {
                    id: (Date.now() + 1).toString(),
                    text: "Merci pour votre message ! Je suis là pour vous aider.",
                    timestamp: new Date(),
                    isUser: false,
                };
                setMessages(prev => [...prev, botResponse]);
            }, 1000);
        }

        setMessageText(''); // Réinitialisation de l'input
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    const handleDeleteMessage = (id: string) => {
        Alert.alert(
            'Supprimer le message',
            'Êtes-vous sûr de vouloir supprimer ce message ?',
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: () => {
                        setMessages(messages.filter(msg => msg.id !== id));
                        setSelectedMessageId(null);
                    }
                }
            ]
        );
    };

    const handleEditMessage = (message: Message) => {
        setMessageText(message.text);
        setEditingMessageId(message.id);
        setSelectedMessageId(null);
    };

    const handleAttachment = (type: 'image' | 'video' | 'document') => {
        setIsAttachmentMenuVisible(false);

        const attachmentMessage: Message = {
            id: Date.now().toString(),
            text: `Fichier ${type === 'image' ? 'image' : type === 'video' ? 'vidéo' : 'document'} sélectionné`,
            timestamp: new Date(),
            isUser: true,
            attachments: [{
                type,
                name: `fichier.${type === 'image' ? 'jpg' : type === 'video' ? 'mp4' : 'pdf'}`,
            }]
        };

        setMessages([...messages, attachmentMessage]);
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    const handleVoiceRecording = () => {
        if (isRecording) {
            // Arrêter l'enregistrement
            setIsRecording(false);
            const voiceMessage: Message = {
                id: Date.now().toString(),
                text: 'Message vocal',
                timestamp: new Date(),
                isUser: true,
                attachments: [{
                    type: 'audio',
                    name: 'audio.mp3',
                }]
            };
            setMessages([...messages, voiceMessage]);
            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 100);
        } else {
            // Démarrer l'enregistrement
            setIsRecording(true);
        }
    };

    const formatTime = (date: Date) => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'conversations':
                return <Text style={[styles.contentText, themeStyles.text]}>Historique des conversations</Text>;
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
                        <Text style={[styles.headerTitle, themeStyles.text]}>
                            {editingMessageId ? 'Modifier le message' : 'Nouveau Chat'}
                        </Text>
                        <View style={{ width: 24 }} />
                    </View>

                    {/* Messages Area */}
                    <ScrollView
                        ref={scrollViewRef}
                        style={styles.messagesContainer}
                        contentContainerStyle={styles.messagesContent}
                    >
                        {messages.length === 0 ? (
                            <View style={styles.emptyState}>
                                <Text style={[styles.emptyStateText, themeStyles.subText]}>
                                    Commencez une nouvelle conversation...
                                </Text>
                            </View>
                        ) : (
                            messages.map((message) => (
                                <TouchableOpacity
                                    key={message.id}
                                    activeOpacity={0.7}
                                    onLongPress={() => message.isUser && setSelectedMessageId(message.id)}
                                    style={[
                                        styles.messageContainer,
                                        message.isUser ? styles.messageUser : styles.messageBot
                                    ]}
                                >
                                    <View
                                        style={[
                                            styles.messageBubble,
                                            message.isUser ? themeStyles.messageBubbleUser : themeStyles.messageBubbleBot
                                        ]}
                                    >
                                        <Text style={[
                                            styles.messageText,
                                            message.isUser ? themeStyles.messageTextUser : themeStyles.messageTextBot
                                        ]}>
                                            {message.text}
                                        </Text>

                                        {message.attachments && message.attachments.map((attachment, index) => (
                                            <View key={index} style={styles.attachmentContainer}>
                                                {attachment.type === 'image' && <ImageIcon size={16} color="#fff" />}
                                                {attachment.type === 'video' && <Video size={16} color="#fff" />}
                                                {attachment.type === 'document' && <FileText size={16} color="#fff" />}
                                                {attachment.type === 'audio' && <Mic size={16} color="#fff" />}
                                                <Text style={styles.attachmentText}>{attachment.name}</Text>
                                            </View>
                                        ))}

                                        <Text style={[
                                            styles.messageTime,
                                            { color: message.isUser ? 'rgba(255,255,255,0.7)' : themeStyles.subText.color }
                                        ]}>
                                            {formatTime(message.timestamp)}
                                        </Text>
                                    </View>

                                    {/* Message Actions Menu */}
                                    {selectedMessageId === message.id && (
                                        <View style={[styles.messageActionsMenu, themeStyles.navBg, { borderColor: themeStyles.divider.backgroundColor }]}>
                                            <TouchableOpacity
                                                style={styles.messageAction}
                                                onPress={() => handleEditMessage(message)}
                                            >
                                                <Edit2 size={18} color={themeStyles.iconActive} />
                                                <Text style={[styles.messageActionText, themeStyles.text]}>Modifier</Text>
                                            </TouchableOpacity>
                                            <View style={[styles.divider, themeStyles.divider]} />
                                            <TouchableOpacity
                                                style={styles.messageAction}
                                                onPress={() => handleDeleteMessage(message.id)}
                                            >
                                                <Trash2 size={18} color="#ef4444" />
                                                <Text style={[styles.messageActionText, { color: '#ef4444' }]}>Supprimer</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            ))
                        )}
                    </ScrollView>

                    {/* Attachment Menu Modal */}
                    <Modal
                        visible={isAttachmentMenuVisible}
                        transparent
                        animationType="fade"
                        onRequestClose={() => setIsAttachmentMenuVisible(false)}
                    >
                        <Pressable style={styles.modalOverlay} onPress={() => setIsAttachmentMenuVisible(false)}>
                            <View style={[styles.attachmentMenu, themeStyles.navBg, { borderColor: themeStyles.divider.backgroundColor }]}>
                                <TouchableOpacity
                                    style={styles.attachmentOption}
                                    onPress={() => handleAttachment('image')}
                                >
                                    <ImageIcon size={24} color={themeStyles.iconActive} />
                                    <Text style={[styles.attachmentOptionText, themeStyles.text]}>Image</Text>
                                </TouchableOpacity>

                                <View style={[styles.divider, themeStyles.divider]} />

                                <TouchableOpacity
                                    style={styles.attachmentOption}
                                    onPress={() => handleAttachment('video')}
                                >
                                    <Video size={24} color={themeStyles.iconActive} />
                                    <Text style={[styles.attachmentOptionText, themeStyles.text]}>Vidéo</Text>
                                </TouchableOpacity>

                                <View style={[styles.divider, themeStyles.divider]} />

                                <TouchableOpacity
                                    style={styles.attachmentOption}
                                    onPress={() => handleAttachment('document')}
                                >
                                    <FileText size={24} color={themeStyles.iconActive} />
                                    <Text style={[styles.attachmentOptionText, themeStyles.text]}>Document</Text>
                                </TouchableOpacity>
                            </View>
                        </Pressable>
                    </Modal>

                    {/* Input Area */}
                    <View style={[styles.chatInputContainer, themeStyles.navBg, themeStyles.border]}>
                        {editingMessageId && (
                            <View style={[styles.editingIndicator, themeStyles.tabActiveBg]}>
                                <Text style={[styles.editingText, themeStyles.tabActiveText]}>
                                    Modification en cours...
                                </Text>
                                <TouchableOpacity onPress={() => {
                                    setEditingMessageId(null);
                                    setMessageText('');
                                }}>
                                    <X size={18} color={themeStyles.iconActive} />
                                </TouchableOpacity>
                            </View>
                        )}

                        <View style={styles.inputRow}>
                            <TouchableOpacity
                                style={styles.iconButton}
                                onPress={() => setIsAttachmentMenuVisible(true)}
                            >
                                <Paperclip size={24} color={themeStyles.iconInactive} />
                            </TouchableOpacity>

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
                                <TouchableOpacity
                                    style={[
                                        styles.iconButton,
                                        isRecording && styles.recordingButton
                                    ]}
                                    onPress={handleVoiceRecording}
                                >
                                    <Mic size={24} color={isRecording ? '#fff' : themeStyles.iconInactive} />
                                </TouchableOpacity>

                                {messageText.length > 0 && (
                                    <TouchableOpacity
                                        style={[styles.iconButton, styles.sendButton]}
                                        onPress={handleSendMessage}
                                    >
                                        <Send size={20} color="#fff" />
                                    </TouchableOpacity>
                                )}
                            </View>
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
        bottom: 80,
        backgroundColor: 'rgba(0,0,0,0.5)',
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
    messagesContainer: {
        flex: 1,
    },
    messagesContent: {
        padding: 15,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 100,
    },
    emptyStateText: {
        fontSize: 16,
    },
    messageContainer: {
        marginBottom: 15,
        maxWidth: '80%',
    },
    messageUser: {
        alignSelf: 'flex-end',
    },
    messageBot: {
        alignSelf: 'flex-start',
    },
    messageBubble: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 18,
    },
    messageText: {
        fontSize: 16,
        lineHeight: 22,
    },
    messageTime: {
        fontSize: 11,
        marginTop: 4,
    },
    attachmentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.2)',
    },
    attachmentText: {
        color: '#fff',
        fontSize: 13,
        marginLeft: 6,
    },
    messageActionsMenu: {
        position: 'absolute',
        top: -70,
        right: 0,
        borderRadius: 12,
        padding: 10,
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        minWidth: 150,
    },
    messageAction: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 5,
    },
    messageActionText: {
        fontSize: 15,
        marginLeft: 10,
    },
    chatInputContainer: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderTopWidth: 1,
    },
    editingIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 8,
        marginBottom: 8,
    },
    editingText: {
        fontSize: 13,
        fontWeight: '600',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    inputWrapper: {
        flex: 1,
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginHorizontal: 8,
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
    recordingButton: {
        backgroundColor: '#ef4444',
        borderRadius: 20,
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
    },
    attachmentMenu: {
        borderRadius: 16,
        padding: 15,
        borderWidth: 1,
        marginHorizontal: 20,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    attachmentOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
    },
    attachmentOptionText: {
        fontSize: 16,
        marginLeft: 15,
    },
});
