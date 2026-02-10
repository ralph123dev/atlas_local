import { Dimensions, StyleSheet } from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    // Floating Header & Search
    floatingHeader: {
        position: 'absolute',
        top: 30,
        left: 0,
        right: 0,
        zIndex: 100,
    },
    floatingSearchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginHorizontal: 15,
        borderRadius: 24,
        paddingHorizontal: 12,
        height: 48,
    },
    searchBranding: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
    },
    searchLogo: {
        width: 24,
        height: 24,
        borderRadius: 12,
    },
    searchDivider: {
        width: 1,
        height: 24,
        backgroundColor: '#e5e7eb',
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#1a1a1a',
    },
    searchIconBtn: {
        padding: 8,
    },
    quickActionsScroll: {
        marginTop: 12,
    },
    quickActionsContent: {
        paddingHorizontal: 15,
    },
    quickActionBtn: {
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    quickActionText: {
        fontSize: 14,
        fontWeight: '500',
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },

    // Bottom Sheet
    bottomSheet: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: '100%',
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 20,
        zIndex: 1000,
    },
    sheetHandleContainer: {
        alignItems: 'center',
        paddingVertical: 12,
    },
    sheetHandle: {
        width: 40,
        height: 5,
        backgroundColor: '#e5e7eb',
        borderRadius: 2.5,
    },
    sheetHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    sheetTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    sheetCityName: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    weatherInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    temperatureText: {
        fontSize: 22,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    sheetContent: {
        flex: 1,
        paddingBottom: 20,
    },

    // Event Cards in Sheet
    carouselContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
    },
    cardsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 5,
        marginBottom: 10,
    },
    twinCard: {
        width: '48%',
        backgroundColor: 'transparent',
    },
    twinBlackFrame: {
        width: '100%',
        aspectRatio: 1,
        backgroundColor: '#000',
        borderRadius: 15,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#374151',
    },
    fullImage: {
        width: '100%',
        height: '100%',
    },
    twinCardInfo: {
        marginTop: 10,
        paddingHorizontal: 4,
    },
    twinCardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    twinCardSub: {
        fontSize: 12,
        marginBottom: 2,
    },
    twinCardDistance: {
        fontSize: 11,
        opacity: 0.7,
    },
    cardActions: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
        gap: 12,
    },
    cardActionBtn: {
        padding: 4,
    },
    seeAllTrendingBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f3f4f6',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        marginTop: 15,
        width: '100%',
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    seeAllTrendingText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6b7280',
        marginRight: 6,
    },

    // Navigation Header (Top)
    navHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingTop: 10,
        height: 60,
        backgroundColor: '#fff',
        zIndex: 200,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    navIconBtn: {
        padding: 8,
        borderRadius: 20,
    },
    navTabBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 18,
        gap: 6,
        backgroundColor: '#f3f4f6',
    },
    navTabText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#1a1a1a',
    },
    createEventBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0057b7',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 6,
    },
    createEventText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 13,
    },

    // Existing styles to keep for modal
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

    // List view (if map is not used as background)
    content: {
        flex: 1,
    },
    eventList: {
        padding: 16,
        paddingTop: 160, // Space for floating header
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
        backgroundColor: '#fff',
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
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 60,
    },
    emptyStateText: {
        marginTop: 12,
        fontSize: 16,
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
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
    // Bottom Nav
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 10,
        paddingBottom: 25,
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 3000,
    },
    navTab: {
        alignItems: 'center',
        padding: 5,
        flex: 1,
    },
    navTabTextBtn: {
        fontSize: 10,
        color: '#6b7280',
        marginTop: 4,
        fontWeight: '500',
    },
    activeNavText: {
        color: '#0057b7',
        fontWeight: '600',
    },
});
