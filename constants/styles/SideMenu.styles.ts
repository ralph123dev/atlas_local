import { Dimensions, StyleSheet } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
export const MENU_WIDTH = SCREEN_WIDTH * 0.7;

export const styles = StyleSheet.create({
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
    },
    newListBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
    },
    newListText: {
        marginLeft: 10,
        fontWeight: 'bold',
        fontSize: 14,
    },
    themeSection: {
        marginTop: 20,
        paddingHorizontal: 20,
        borderTopWidth: 1,
        paddingTop: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    themeOptions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    themeBtn: {
        alignItems: 'center',
        padding: 8,
        borderRadius: 8,
        flex: 1,
    },
    themeBtnActive: {
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
    themeBtnText: {
        marginTop: 5,
        fontSize: 12,
        fontWeight: '500',
    }
});
