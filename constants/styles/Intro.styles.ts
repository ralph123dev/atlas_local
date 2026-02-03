import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        width: '100%',
    },
    header: {
        height: 50,
        alignItems: 'flex-end',
        paddingHorizontal: 20,
        justifyContent: 'center',
    },
    skipButton: {
        padding: 10,
        marginRight: 10,
        marginTop: 10,
    },
    skipText: {
        color: '#6b7280',
        fontSize: 16,
        fontWeight: '500',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingTop: 20,
    },
    imageContainer: {
        marginBottom: 30,
        width: 100,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    mapEmoji: {
        fontSize: 80,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#6b7280',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 22,
    },
    featuresContainer: {
        width: '100%',
    },
    feature: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    featureIcon: {
        width: 40,
        alignItems: 'center',
        marginRight: 15,
    },
    iconText: {
        fontSize: 24,
    },
    featureText: {
        fontSize: 16,
        color: '#374151',
        fontWeight: '500',
    },
    footer: {
        paddingBottom: 40,
        paddingHorizontal: 30,
        alignItems: 'center',
    },
    buttonContainer: {
        width: '100%',
        marginTop: 30,
    },
});
