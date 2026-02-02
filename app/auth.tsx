import { ArrowLeft, Eye, EyeOff, Lock, Mail, Phone, User as UserIcon } from 'lucide-react-native';
import React, { useContext, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContext } from './NavigationContext';
import { ThemeContext } from './ThemeContext';

export default function AuthScreen() {
    const router = useContext(NavigationContext);
    const { theme } = useContext(ThemeContext);
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    // Form fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phoneCountryCode, setPhoneCountryCode] = useState('+237');
    const [phoneNumber, setPhoneNumber] = useState('');

    const isDark = theme === 'dark';
    const isBlue = theme === 'blue';

    const themeStyles = {
        container: { backgroundColor: isDark ? '#1a1a1a' : isBlue ? '#15202b' : '#fff' },
        text: { color: isDark || isBlue ? '#f3f4f6' : '#1a1a1a' },
        subText: { color: isDark ? '#9ca3af' : isBlue ? '#8899a6' : '#6b7280' },
        input: {
            backgroundColor: isDark ? '#374151' : isBlue ? '#192734' : '#f3f4f6',
            color: isDark || isBlue ? '#f3f4f6' : '#1a1a1a',
            borderColor: isDark ? '#4b5563' : isBlue ? '#38444d' : '#e5e7eb',
        },
        button: {
            backgroundColor: isDark ? '#60a5fa' : isBlue ? '#1d9bf0' : '#0057b7',
        },
        header: { backgroundColor: isDark ? '#1a1a1a' : isBlue ? '#15202b' : '#fff' },
    };

    const handleAuth = () => {
        if (isLogin) {
            // Simulation de connexion
            if (!email || !password) {
                Alert.alert('Erreur', 'Veuillez remplir tous les champs');
                return;
            }

            // Simuler une connexion réussie
            setTimeout(() => {
                Alert.alert('Succès', 'Connexion réussie !', [
                    { text: 'OK', onPress: () => router.push('/home') }
                ]);
            }, 500);
        } else {
            // Simulation d'inscription
            if (!email || !password || !name || !phoneNumber) {
                Alert.alert('Erreur', 'Veuillez remplir tous les champs');
                return;
            }

            // Validation basique de l'email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                Alert.alert('Erreur', 'Adresse email invalide');
                return;
            }

            // Validation du mot de passe (minimum 6 caractères)
            if (password.length < 6) {
                Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
                return;
            }

            // Simuler une inscription réussie
            setTimeout(() => {
                Alert.alert('Succès', `Bienvenue ${name} ! Votre compte a été créé avec succès.`, [
                    { text: 'OK', onPress: () => router.push('/home') }
                ]);
            }, 500);
        }
    };

    return (
        <SafeAreaView style={[styles.container, themeStyles.container]}>
            {/* Header */}
            <View style={[styles.header, themeStyles.header]}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.push('/home')}
                >
                    <ArrowLeft size={24} color={themeStyles.text.color} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, themeStyles.text]}>
                    {isLogin ? 'Connexion' : 'Inscription'}
                </Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    {/* Title Section */}
                    <View style={styles.titleSection}>
                        <Text style={[styles.title, themeStyles.text]}>
                            {isLogin ? 'Bon retour !' : 'Créer un compte'}
                        </Text>
                        <Text style={[styles.subtitle, themeStyles.subText]}>
                            {isLogin
                                ? 'Connectez-vous pour continuer'
                                : 'Inscrivez-vous pour commencer'}
                        </Text>
                    </View>

                    {/* Form */}
                    <View style={styles.form}>
                        {!isLogin && (
                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, themeStyles.text]}>Nom complet</Text>
                                <View style={[styles.inputContainer, themeStyles.input]}>
                                    <UserIcon size={20} color={themeStyles.subText.color} style={styles.inputIcon} />
                                    <TextInput
                                        style={[styles.input, { color: themeStyles.input.color }]}
                                        placeholder="Entrez votre nom"
                                        placeholderTextColor={themeStyles.subText.color}
                                        value={name}
                                        onChangeText={setName}
                                    />
                                </View>
                            </View>
                        )}

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, themeStyles.text]}>Email</Text>
                            <View style={[styles.inputContainer, themeStyles.input]}>
                                <Mail size={20} color={themeStyles.subText.color} style={styles.inputIcon} />
                                <TextInput
                                    style={[styles.input, { color: themeStyles.input.color }]}
                                    placeholder="exemple@email.com"
                                    placeholderTextColor={themeStyles.subText.color}
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>

                        {!isLogin && (
                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, themeStyles.text]}>Numéro de téléphone</Text>
                                <View style={styles.phoneContainer}>
                                    <View style={[styles.countryCodeContainer, themeStyles.input]}>
                                        <Phone size={20} color={themeStyles.subText.color} style={styles.inputIcon} />
                                        <TextInput
                                            style={[styles.countryCodeInput, { color: themeStyles.input.color }]}
                                            placeholder="+237"
                                            placeholderTextColor={themeStyles.subText.color}
                                            value={phoneCountryCode}
                                            onChangeText={setPhoneCountryCode}
                                            keyboardType="phone-pad"
                                        />
                                    </View>
                                    <View style={[styles.phoneNumberContainer, themeStyles.input]}>
                                        <TextInput
                                            style={[styles.input, { color: themeStyles.input.color }]}
                                            placeholder="6 XX XX XX XX"
                                            placeholderTextColor={themeStyles.subText.color}
                                            value={phoneNumber}
                                            onChangeText={setPhoneNumber}
                                            keyboardType="phone-pad"
                                        />
                                    </View>
                                </View>
                            </View>
                        )}

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, themeStyles.text]}>Mot de passe</Text>
                            <View style={[styles.inputContainer, themeStyles.input]}>
                                <Lock size={20} color={themeStyles.subText.color} style={styles.inputIcon} />
                                <TextInput
                                    style={[styles.input, { color: themeStyles.input.color }]}
                                    placeholder={isLogin ? "Entrez votre mot de passe" : "Créez un mot de passe (min. 6 caractères)"}
                                    placeholderTextColor={themeStyles.subText.color}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    {showPassword ? (
                                        <EyeOff size={20} color={themeStyles.subText.color} />
                                    ) : (
                                        <Eye size={20} color={themeStyles.subText.color} />
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Submit Button */}
                        <TouchableOpacity
                            style={[styles.submitButton, themeStyles.button]}
                            onPress={handleAuth}
                        >
                            <Text style={styles.submitButtonText}>
                                {isLogin ? 'Se connecter' : "S'inscrire"}
                            </Text>
                        </TouchableOpacity>

                        {/* Toggle Login/Signup */}
                        <View style={styles.toggleContainer}>
                            <Text style={[styles.toggleText, themeStyles.subText]}>
                                {isLogin ? "Vous n'avez pas de compte ?" : 'Vous avez déjà un compte ?'}
                            </Text>
                            <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
                                <Text style={[styles.toggleLink, { color: themeStyles.button.backgroundColor }]}>
                                    {isLogin ? "S'inscrire" : 'Se connecter'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
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
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    scrollView: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 30,
        paddingBottom: 40,
    },
    titleSection: {
        marginBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
    },
    form: {
        gap: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        paddingHorizontal: 15,
        height: 52,
        borderWidth: 1,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
    },
    phoneContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    countryCodeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        paddingHorizontal: 15,
        height: 52,
        borderWidth: 1,
        width: 110,
    },
    countryCodeInput: {
        fontSize: 16,
        width: 50,
    },
    phoneNumberContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        paddingHorizontal: 15,
        height: 52,
        borderWidth: 1,
    },
    submitButton: {
        height: 52,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    toggleContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        gap: 5,
    },
    toggleText: {
        fontSize: 14,
    },
    toggleLink: {
        fontSize: 14,
        fontWeight: '600',
    },
});



