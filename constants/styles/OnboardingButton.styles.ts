import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    button: {
        backgroundColor: '#0057b7',
        borderRadius: 100,
        paddingVertical: 18,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    inner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    text: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    icon: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
});
