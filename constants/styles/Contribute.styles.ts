import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    section: {
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
    },
    profileSection: {
        marginTop: 8
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        marginRight: 16,
    },
    profileInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    userLevel: {
        fontSize: 13,
        fontWeight: '600',
        marginTop: 2,
    },
    progressContainer: {
        marginTop: 4,
    },
    progressTextRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    progressLabel: {
        fontSize: 12,
    },
    pointsText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    progressBarContainer: {
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    progressSubtitle: {
        fontSize: 11,
        marginTop: 8,
    },
    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        marginTop: 24,
        marginBottom: 8,
    },
    actionsScrollContent: {
        paddingHorizontal: 8,
    },
    actionButton: {
        alignItems: 'center',
        width: 90,
        marginHorizontal: 6,
    },
    actionIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        borderWidth: 1,
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    actionLabel: {
        fontSize: 11,
        textAlign: 'center',
        fontWeight: '500',
    },
    badgeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    badgeTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 12,
        flex: 1,
    },
    divider: {
        height: 1,
        width: '100%',
        marginBottom: 16,
    },
    taskItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    taskLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    taskIconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    taskContent: {
        flex: 1,
        marginRight: 16,
    },
    taskName: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 6,
    },
    taskProgressBg: {
        height: 4,
        width: '100%',
        borderRadius: 2,
    },
    taskProgressFill: {
        height: '100%',
        borderRadius: 2,
    },
    taskStatus: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    moreActionsBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 16,
        marginTop: 8,
        borderTopWidth: 1,
    },
    moreActionsText: {
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    emptyFeedText: {
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 18,
    },
    // Balloon Card Styles
    balloonCard: {
        alignItems: 'center',
        paddingVertical: 24,
    },
    balloonIconBg: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#fff5f5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#fee2e2',
    },
    balloonEmoji: {
        fontSize: 32,
    },
    balloonTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    balloonDescription: {
        fontSize: 14,
        textAlign: 'center',
        paddingHorizontal: 20,
        lineHeight: 20,
        marginBottom: 16,
    },
    contribNowBtn: {
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    contribNowText: {
        color: '#34a853',
        fontWeight: 'bold',
        fontSize: 15,
    },
    // Modal Styles
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    modalContent: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        minHeight: 450,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    galleryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    galleryItem: {
        width: '31%',
        aspectRatio: 1,
        marginBottom: 12,
        borderRadius: 12,
        overflow: 'hidden',
    },
    galleryImage: {
        width: '100%',
        height: '100%',
    },
    galleryItemSelected: {
        borderWidth: 4,
        borderColor: '#0057b7',
    },
    checkOverlay: {
        position: 'absolute',
        top: 6,
        right: 6,
        backgroundColor: '#0057b7',
        borderRadius: 12,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    publishButton: {
        marginTop: 24,
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
    },
    publishButtonDisabled: {
        opacity: 0.5,
    },
    publishButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    popupOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    popupContent: {
        width: '85%',
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        borderWidth: 1,
    },
    popupTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    popupSubtitle: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 20,
    },
    popupInput: {
        width: '100%',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        minHeight: 80,
        textAlignVertical: 'top',
        marginBottom: 24,
    },
    popupActions: {
        flexDirection: 'row',
        width: '100%',
    },
    popupButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 24,
        alignItems: 'center',
    },
    popupButtonText: {
        fontWeight: 'bold',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        marginTop: 15,
    },
    mapPreviewContainer: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
    },
    mapPreview: {
        ...StyleSheet.absoluteFillObject,
    },
    mapMarkerFixed: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: -16,
        marginTop: -32,
    },
    imageUploadBtn: {
        width: '100%',
        height: 100,
        borderRadius: 12,
        borderWidth: 1,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageUploadText: {
        fontSize: 14,
        marginTop: 8,
    },
    inputGroup: {
        width: '100%',
    },
    // Proposed Place Styles
    proposedPlaceCard: {
        alignItems: 'center',
        paddingVertical: 20,
        position: 'relative',
    },
    proposedPlaceHeader: {
        flexDirection: 'row',
        width: '100%',
        paddingHorizontal: 10,
        marginBottom: 15,
    },
    proposedPlaceTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    proposedPlaceDesc: {
        fontSize: 13,
        lineHeight: 18,
    },
    moreOptionsBtnSmall: {
        padding: 4,
    },
    ratingStarsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 15,
    },
    noterLieuText: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 20,
    },
    ignoreLink: {
        padding: 5,
    },
    blueLinkText: {
        color: '#0057b7',
        fontWeight: '600',
        fontSize: 14,
    },
    modalOverlayTransparent: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuPopup: {
        width: '80%',
        borderRadius: 16,
        padding: 8,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 15,
    },
    menuItemText: {
        fontSize: 15,
        fontWeight: '500',
    },
    placeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        gap: 15,
    },
    placeIconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#e6effd',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeItemName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    placeItemDesc: {
        fontSize: 13,
    }
});
