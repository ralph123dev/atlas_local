import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderBottomWidth: 1,
        gap: 10,
    },
    backButton: {
        padding: 5,
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
        paddingHorizontal: 15,
        height: 40,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        padding: 0,
    },
    categoriesContainer: {
        borderBottomWidth: 1,
        paddingVertical: 10,
    },
    categoriesContent: {
        paddingHorizontal: 15,
        gap: 10,
    },
    categoryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'transparent',
        gap: 6,
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '600',
    },
    mainContent: {
        flex: 1,
    },
    simulationContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bigIconContainer: {
        marginBottom: 20,
    },
    simData: {
        fontSize: 48,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    simLabel: {
        fontSize: 20,
        marginBottom: 10,
    },
    simCity: {
        fontSize: 16,
        opacity: 0.8,
        marginTop: 10,
    },
    // Precipitation Styles
    rainCloudContainer: {
        marginBottom: 20,
        position: 'relative',
    },
    rainDrop: {
        width: 4,
        height: 12,
        backgroundColor: '#4fc3f7',
        borderRadius: 2,
        position: 'absolute',
        top: 60,
    },
    // Wind Styles
    windContainer: {
        marginBottom: 20,
    },
    // Radar Styles
    radarContainer: {
        width: 200,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        position: 'relative',
    },
    radarPulse: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(0, 255, 0, 0.3)',
        borderWidth: 2,
        borderColor: 'rgba(0, 255, 0, 0.8)',
    },
    radarCenter: {
        width: 10,
        height: 10,
        backgroundColor: '#0f0',
        borderRadius: 5,
        position: 'absolute',
        zIndex: 10,
    }
});
