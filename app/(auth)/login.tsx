import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  useWindowDimensions,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { getFontSize, getSpacing, isWeb, isDesktop } from '@/utils/responsive';
import IcShowPass from '@/assets/images/ic_show_pass.png';
import IcHidePass from '@/assets/images/ic_hide_pass.png';
import TwiggLogo from '@/assets/images/twigg_logo.png';
import IcGoogle from '@/assets/images/ic_google.png';

// --- HeroPanel: Totalmente aislado y memoizado ---
const HeroPanel = React.memo(() => (
  <View style={styles.heroContainer}>
    <Image
      source={{ uri: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1200' }}
      style={styles.heroImage}
      resizeMode="cover"
    />
    <View style={styles.heroOverlay}>
      <View style={styles.heroContent}>
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>APRENDIZAJE INTELIGENTE</Text>
        </View>
        <Text style={styles.heroTitle}>Transforma tu futuro</Text>
        <Text style={styles.heroSubtitle}>
          Cursos creados por expertos y potenciados por inteligencia artificial
        </Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>10K+</Text>
            <Text style={styles.statLabel}>Estudiantes</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>500+</Text>
            <Text style={styles.statLabel}>Cursos</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>98%</Text>
            <Text style={styles.statLabel}>Satisfacción</Text>
          </View>
        </View>
      </View>
    </View>
  </View>
));
HeroPanel.displayName = 'HeroPanel';

export default function LoginScreen() {
  const { height: windowHeight } = useWindowDimensions();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleAuth = () => {
    router.replace('/(tabs)');
  };

  const isValidEmail = email.includes('@') && email.includes('.');
  const isFormValid = email.length > 0 && password.length >= 6;

  // JSX del formulario
  const Form = () => (
    <View style={styles.form}>
      {isSignUp && (
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre completo</Text>
          <TextInput
            style={[
              styles.input,
              isWeb && isDesktop && styles.webInput,
            ]}
            placeholder="Tu nombre"
            placeholderTextColor="#94a3b8"
            onChangeText={() => {}}
          />
        </View>
      )}

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[
            styles.input,
            !isValidEmail && email.length > 0 && styles.inputError,
            isWeb && isDesktop && styles.webInput,
          ]}
          placeholder="tu@email.com"
          placeholderTextColor="#94a3b8"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Contraseña</Text>
        <View
          style={[
            styles.passwordContainer,
            password.length > 0 && password.length < 6 && styles.inputError,
            isWeb && isDesktop && styles.webPasswordContainer,
          ]}
        >
          <TextInput
            style={[
              styles.inputPassword,
              isWeb && isDesktop && styles.webInput,
            ]}
            placeholder="Mínimo 6 caracteres"
            placeholderTextColor="#94a3b8"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            style={[
              styles.eyeButton,
              isWeb && isDesktop && styles.webEyeButton,
            ]}
            onPress={() => setShowPassword(!showPassword)}
            focusable={false}
            accessible={false}
          >
            <Image
              source={showPassword ? IcHidePass : IcShowPass}
              style={styles.eyeIconImage}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          {password.length > 0 && password.length < 6 ? (
            <Text style={styles.errorText}>Mínimo 6 caracteres</Text>
          ) : (
            <Text style={[styles.errorText, styles.errorTextHidden]}>
              Mínimo 6 caracteres
            </Text>
          )}
        </View>
      </View>

      {!isSignUp && (
        <TouchableOpacity style={styles.forgotPasswordButton}>
          <Text style={styles.forgotPasswordText}>
            ¿Olvidaste tu contraseña?
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[
          styles.primaryButton,
          !isFormValid && styles.primaryButtonDisabled,
          isWeb && isDesktop && styles.webPrimaryButton,
        ]}
        onPress={handleAuth}
        disabled={!isFormValid}
      >
        <Text style={styles.primaryButtonText}>
          {isSignUp ? 'Crear cuenta' : 'Iniciar sesión'}
        </Text>
      </TouchableOpacity>

      <View style={styles.dividerContainer}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>o</Text>
        <View style={styles.dividerLine} />
      </View>

      <TouchableOpacity
        style={[
          styles.googleButton,
          isWeb && isDesktop && styles.webGoogleButton,
        ]}
      >
        <Image source={IcGoogle} style={styles.googleIcon} />
        <Text style={styles.googleButtonText}>
          Continuar con Google
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.toggleContainer,
          isWeb && isDesktop && styles.webToggleContainer,
        ]}
        onPress={() => {
          setIsSignUp(!isSignUp);
          setEmail('');
          setPassword('');
        }}
      >
        <Text style={styles.toggleText}>
          {isSignUp ? '¿Ya tienes cuenta? ' : '¿No tienes cuenta? '}
          <Text style={styles.toggleTextBold}>
            {isSignUp ? 'Inicia sesión' : 'Regístrate'}
          </Text>
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {isWeb && isDesktop ? (
        <View style={styles.containerWeb}>
          <View style={[styles.leftPanel, { height: windowHeight }]}>
            <HeroPanel />
          </View>
          <ScrollView
            style={[styles.formPanel, { height: windowHeight }]}
            contentContainerStyle={styles.formScrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={[styles.header, styles.webHeader]}>
              <Image
                source={TwiggLogo}
                style={styles.logoImage}
                resizeMode="contain"
              />
              <Text style={styles.title}>Twigg</Text>
              <Text style={styles.subtitle}>
                {isSignUp
                  ? 'Crea tu cuenta gratuita'
                  : 'Bienvenido de nuevo'}
              </Text>
            </View>
            <Form />
          </ScrollView>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.formPanel}>
              <View style={styles.header}>
                <Image
                  source={TwiggLogo}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
                <Text style={styles.title}>Twigg</Text>
                <Text style={styles.subtitle}>
                  {isSignUp
                    ? 'Crea tu cuenta gratuita'
                    : 'Bienvenido de nuevo'}
                </Text>
              </View>
              <Form />
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

interface Styles {
  container: ViewStyle;
  containerWeb: ViewStyle;
  scrollContent: ViewStyle;
  content: ViewStyle;
  heroContainer: ViewStyle;
  leftPanel: ViewStyle;
  heroImage: ImageStyle;
  heroOverlay: ViewStyle;
  heroContent: ViewStyle;
  badgeContainer: ViewStyle;
  badgeText: TextStyle;
  heroTitle: TextStyle;
  heroSubtitle: TextStyle;
  statsContainer: ViewStyle;
  statItem: ViewStyle;
  statNumber: TextStyle;
  statLabel: TextStyle;
  formPanel: ViewStyle;
  formScrollContent: ViewStyle;
  webHeader: ViewStyle;
  header: ViewStyle;
  logoImage: ImageStyle;
  title: TextStyle;
  subtitle: TextStyle;
  form: ViewStyle;
  inputGroup: ViewStyle;
  label: TextStyle;
  input: TextStyle;
  inputError: ViewStyle;
  passwordContainer: ViewStyle;
  inputPassword: TextStyle;
  eyeButton: ViewStyle;
  eyeIconImage: ImageStyle;
  errorContainer: ViewStyle;
  errorText: TextStyle;
  errorTextHidden: TextStyle;
  forgotPasswordButton: ViewStyle;
  forgotPasswordText: TextStyle;
  primaryButton: ViewStyle;
  primaryButtonDisabled: ViewStyle;
  primaryButtonText: TextStyle;
  dividerContainer: ViewStyle;
  dividerLine: ViewStyle;
  dividerText: TextStyle;
  googleButton: ViewStyle;
  googleIcon: ImageStyle;
  googleButtonText: TextStyle;
  toggleContainer: ViewStyle;
  webToggleContainer: ViewStyle;
  toggleText: TextStyle;
  toggleTextBold: TextStyle;

  // Overrides para web/desktop: aún más compactos
  webInput: ViewStyle;
  webPasswordContainer: ViewStyle;
  webPrimaryButton: ViewStyle;
  webGoogleButton: ViewStyle;
  webEyeButton: ViewStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containerWeb: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: 1200,
    alignSelf: 'center',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  leftPanel: {
    width: '50%',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    transform: [{ translateZ: 0 }],
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: getSpacing('lg'),
  },
  heroContent: {
    alignItems: 'center',
    maxWidth: 500,
  },
  badgeContainer: {
    backgroundColor: 'rgba(139,92,246,0.2)',
    borderColor: '#8b5cf6',
    borderWidth: 1,
    paddingHorizontal: getSpacing('md'),
    paddingVertical: getSpacing('xs'),
    borderRadius: 20,
    marginBottom: getSpacing('lg'),
  },
  badgeText: {
    color: '#8b5cf6',
    fontSize: getFontSize('xs'),
    fontWeight: '600',
    letterSpacing: 1,
  },
  heroTitle: {
    fontSize: getFontSize('xxl'),
    fontWeight: '800',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: getSpacing('sm'),
    lineHeight: 40,
  },
  heroSubtitle: {
    fontSize: getFontSize('md'),
    color: '#e2e8f0',
    textAlign: 'center',
    marginBottom: getSpacing('xl'),
    lineHeight: 24,
    maxWidth: 400,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: getSpacing('lg'),
    backdropFilter: 'blur(10px)',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: getFontSize('lg'),
    fontWeight: '700',
    color: '#8b5cf6',
    marginBottom: getSpacing('xs'),
  },
  statLabel: {
    fontSize: getFontSize('xs'),
    color: '#cbd5e1',
    fontWeight: '500',
  },
  formPanel: {
    flex: 1,
    padding: getSpacing('lg'),
    maxWidth: 400,
    backgroundColor: Colors.white,
    width: '100%',
  },
  formScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: getSpacing('xl'),
    marginTop: 0,
  },
  webHeader: {
    marginBottom: getSpacing('md'),
  },
  logoImage: {
    width: 80,
    height: 80,
    marginBottom: getSpacing('sm'),
  },
  title: {
    fontSize: getFontSize('xxl'),
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: getSpacing('xs'),
  },
  subtitle: {
    fontSize: getFontSize('md'),
    color: '#64748b',
    textAlign: 'center',
    fontWeight: '500',
  },
  form: {
    gap: getSpacing('md'),
  },
  inputGroup: {
    gap: getSpacing('xs'),
  },
  label: {
    fontSize: getFontSize('sm'),
    fontWeight: '600',
    color: '#374151',
    marginLeft: getSpacing('sm'),
  },
  input: {
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: getSpacing('md'),
    fontSize: getFontSize('md'),
    backgroundColor: '#f8fafc',
    minHeight: 52,
    color: '#1e293b',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputError: {
    borderColor: '#f87171',
    backgroundColor: '#fff1f1',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    minHeight: 52,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputPassword: {
    flex: 1,
    padding: getSpacing('md'),
    fontSize: getFontSize('md'),
    color: '#1e293b',
    minHeight: 52,
  },
  eyeButton: {
    padding: getSpacing('md'),
  },
  eyeIconImage: {
    width: 24,
    height: 24,
    tintColor: '#64748b',
  },
  errorContainer: {
    minHeight: 20,
  },
  errorText: {
    color: '#f87171',
    fontSize: getFontSize('xs'),
    marginLeft: getSpacing('sm'),
  },
  errorTextHidden: {
    opacity: 0,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    padding: getSpacing('xs'),
  },
  forgotPasswordText: {
    color: '#8b5cf6',
    fontSize: getFontSize('sm'),
    fontWeight: '500',
  },
  primaryButton: {
    backgroundColor: '#8b5cf6',
    borderRadius: 12,
    padding: getSpacing('md'),
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
    marginTop: getSpacing('sm'),
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonDisabled: {
    backgroundColor: '#c4b5fd',
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryButtonText: {
    color: Colors.white,
    fontSize: getFontSize('md'),
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getSpacing('sm'),
    marginVertical: getSpacing('sm'),
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  dividerText: {
    color: '#64748b',
    fontSize: getFontSize('sm'),
    fontWeight: '500',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingVertical: getSpacing('md'),
    paddingHorizontal: getSpacing('md'),
    minHeight: 52,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: getSpacing('sm'),
  },
  googleButtonText: {
    fontSize: getFontSize('md'),
    fontWeight: '600',
    color: '#374151',
  },
  toggleContainer: {
    alignItems: 'center',
    padding: getSpacing('md'),
    marginTop: getSpacing('sm'),
  },
  webToggleContainer: {
    marginTop: getSpacing('xs'),
  },
  toggleText: {
    color: '#64748b',
    fontSize: getFontSize('sm'),
    textAlign: 'center',
    lineHeight: 20,
  },
  toggleTextBold: {
    color: '#8b5cf6',
    fontWeight: '600',
  },

  // Overrides para web/desktop: aún más compactos
  webInput: {
    padding: getSpacing('xs'),
    minHeight: 36,
  },
  webPasswordContainer: {
    minHeight: 36,
  },
  webPrimaryButton: {
    padding: getSpacing('xs'),
    minHeight: 36,
  },
  webGoogleButton: {
    paddingVertical: getSpacing('xs'),
    minHeight: 36,
  },
  webEyeButton: {
    padding: getSpacing('xs'),
  },
});
