import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        padding: 16,
        alignItems: 'center',
        gap: 12,
        borderBottomWidth: 1,
    },
    headerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 25,
        gap: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    createButton: {
        backgroundColor: '#0057b7',
    },
    dashboardButton: {
        backgroundColor: '#f3f4f6',
    },
    buttonText: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    createText: {
        color: '#fff',
    },
    dashboardText: {
        color: '#1a1a1a',
    },
    filterSection: {
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    filterScroll: {
        paddingHorizontal: 16,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        borderWidth: 1,
    },
    filterChipText: {
        fontSize: 13,
        fontWeight: '500',
    },
    content: {
        flex: 1,
    },
    eventList: {
        padding: 16,
    },
    eventCard: {
        borderRadius: 16,
        marginBottom: 20,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },
    eventThumbnail: {
        width: '100%',
        height: 180,
    },
    eventInfo: {
        padding: 16,
    },
    eventTag: {
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginBottom: 8,
        backgroundColor: 'rgba(0, 87, 183, 0.1)',
    },
    eventTagText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#0057b7',
    },
    eventTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    eventDetailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4,
    },
    eventDetailText: {
        fontSize: 14,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 24,
        maxHeight: '90%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    input: {
        borderRadius: 12,
        padding: 14,
        fontSize: 15,
        borderWidth: 1,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    submitButton: {
        backgroundColor: '#0057b7',
        borderRadius: 15,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 12,
        marginBottom: 40,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 60,
    },
    emptyStateText: {
        marginTop: 12,
        fontSize: 16,
    }
});
