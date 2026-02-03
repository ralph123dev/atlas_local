import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
