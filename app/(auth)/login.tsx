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
  ViewStyle,
  TextStyle,
  ImageStyle,
} from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { getFontSize, getSpacing, isWeb, isDesktop } from '@/utils/responsive';
import IcShowPass from '@/assets/images/ic_show_pass.png';
import IcHidePass from '@/assets/images/ic_hide_pass.png';
// Importar el nuevo logo y el icono de Google
import TwiggLogo from '@/assets/images/twigg_logo.png';
import IcGoogle from '@/assets/images/ic_google.png';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleAuth = () => {
    router.replace('/(tabs)');
  };

  const isValidEmail = email.includes('@') && email.includes('.');
  const isFormValid = email && password && password.length >= 6;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {isWeb && isDesktop && (
            <View style={styles.leftPanel}>
              <Image
                source={{ uri: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1200' }}
                style={styles.heroImage}
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
          )}
          <View style={[styles.formPanel, isWeb && isDesktop && styles.webFormPanel]}>
            <View style={[styles.header, isWeb && isDesktop && styles.webHeader]}>
              {/* Reemplazar el logoContainer por una Image */}
              <Image source={TwiggLogo} style={styles.logoImage} resizeMode="contain" />
              <Text style={styles.title}>Twigg</Text>
              <Text style={styles.subtitle}>
                {isSignUp ? 'Crea tu cuenta gratuita' : 'Bienvenido de nuevo'}
              </Text>
            </View>
            <View style={[styles.form, isWeb && isDesktop && styles.webForm]}>
              {isSignUp && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Nombre completo</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Tu nombre"
                    placeholderTextColor="#94a3b8"
                    onChangeText={(text) => console.log(text)}
                  />
                </View>
              )}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={[
                    styles.input,
                    !isValidEmail && email.length > 0 && styles.inputError,
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
                  ]}
                >
                  <TextInput
                    style={styles.inputPassword}
                    placeholder="Mínimo 6 caracteres"
                    placeholderTextColor="#94a3b8"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
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
                    <Text style={[styles.errorText, styles.errorTextHidden]}>Mínimo 6 caracteres</Text>
                  )}
                </View>
              </View>
              {!isSignUp && (
                <TouchableOpacity style={styles.forgotPasswordButton}>
                  <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.primaryButton, !isFormValid && styles.primaryButtonDisabled]}
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
              {/* Reemplazar los botones sociales por un único botón de Google */}
              <TouchableOpacity style={styles.googleButton}>
                <Image source={IcGoogle} style={styles.googleIcon} />
                <Text style={styles.googleButtonText}>Continuar con Google</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleContainer, isWeb && isDesktop && styles.webToggleContainer]}
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
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

interface Styles {
  container: ViewStyle;
  scrollContent: ViewStyle;
  content: ViewStyle;
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
  webFormPanel: ViewStyle; // Nuevo estilo para web
  header: ViewStyle;
  webHeader: ViewStyle; // Nuevo estilo para web
  // logoContainer: ViewStyle; // Eliminado
  // logoEmoji: TextStyle; // Eliminado
  logoImage: ImageStyle; // Nuevo
  title: TextStyle;
  subtitle: TextStyle;
  form: ViewStyle;
  webForm: ViewStyle; // Nuevo estilo para web
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
  // socialButtonsContainer: ViewStyle; // Eliminado
  // socialButton: ViewStyle; // Eliminado
  // socialIcon: TextStyle; // Eliminado
  // Nuevos estilos para el botón de Google
  googleButton: ViewStyle;
  googleIcon: ImageStyle;
  googleButtonText: TextStyle;
  toggleContainer: ViewStyle;
  webToggleContainer: ViewStyle; // Nuevo estilo para web
  toggleText: TextStyle;
  toggleTextBold: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    flexDirection: isWeb && isDesktop ? 'row' : 'column',
    maxWidth: isWeb && isDesktop ? 1200 : '100%',
    alignSelf: 'center',
    width: '100%',
  },
  leftPanel: {
    flex: 1,
    position: 'relative',
    minHeight: isWeb && isDesktop ? 'auto' : 300, // O '100%'
    display: isWeb && isDesktop ? 'flex' : 'none',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: getSpacing('lg'),
  },
  heroContent: {
    alignItems: 'center',
    maxWidth: 500,
  },
  badgeContainer: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
  // Cambio: Ajustes en formPanel para web
  formPanel: {
    flex: 1,
    // Eliminado: justifyContent: 'center',
    padding: getSpacing('lg'), // Mantener padding horizontal
    maxWidth: isWeb && isDesktop ? 400 : '100%',
    alignSelf: 'center',
    minHeight: isWeb && isDesktop ? 'auto' : 'auto', // O '100%'
    backgroundColor: Colors.white,
    width: '100%',
  },
  // Nuevo estilo específico para web en formPanel
  webFormPanel: {
    // Reducir padding vertical en web
    paddingTop: getSpacing('md'), // Menos que el padding original de 'lg'
    paddingBottom: getSpacing('md'), // Menos que el padding original de 'lg'
  },
  header: {
    alignItems: 'center',
    marginBottom: getSpacing('xl'), // Mantener espacio por defecto
    marginTop: isWeb ? 0 : getSpacing('lg'),
  },
  // Nuevo estilo específico para web en header
  webHeader: {
    // Reducir el margen inferior en web
    marginBottom: getSpacing('md'), // Menos que el margen original de 'xl'
  },
  // logoContainer: { ... }, // Eliminado
  // logoEmoji: { ... }, // Eliminado
  // Nuevo estilo para la imagen del logo
  logoImage: {
    width: 80, // Ajusta el tamaño según tus necesidades
    height: 80, // Ajusta el tamaño según tus necesidades
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
    gap: getSpacing('md'), // Mantener gap por defecto
  },
  // Nuevo estilo específico para web en form
  webForm: {
    // Reducir el gap entre elementos en web
    gap: getSpacing('sm'), // Menos que el gap original de 'md'
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
    borderWidth: 2,
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
  // Nuevo: Contenedor de errores con espacio reservado
  errorContainer: {
    minHeight: 20, // Ajusta este valor según la altura típica de tu mensaje de error
    // paddingTop: 2,
    // paddingBottom: 2,
  },
  errorText: {
    color: '#f87171',
    fontSize: getFontSize('xs'),
    marginLeft: getSpacing('sm'),
    // marginTop: 2, // Ya no es necesario si usamos minHeight en el contenedor
  },
  // Nuevo: Estilo para ocultar el texto de error pero mantener el espacio
  errorTextHidden: {
    opacity: 0,
    // O alternativamente: color: 'transparent'
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
  // socialButtonsContainer: { ... }, // Eliminado
  // socialButton: { ... }, // Eliminado
  // socialIcon: { ... }, // Eliminado
  // Nuevos estilos para el botón de Google
  googleButton: {
    flexDirection: 'row', // Colocar icono y texto en fila
    alignItems: 'center', // Centrar verticalmente
    justifyContent: 'center', // Centrar horizontalmente el contenido combinado
    backgroundColor: '#fff', // Fondo blanco típico para Google
    borderWidth: 1,
    borderColor: '#e2e8f0', // Borde sutil
    borderRadius: 12,
    paddingVertical: getSpacing('md'), // Mismo padding vertical que primaryButton
    paddingHorizontal: getSpacing('md'), // Mismo padding horizontal
    minHeight: 52, // Mismo minHeight que primaryButton
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  googleIcon: {
    width: 20, // Ajustar tamaño del icono si es necesario
    height: 20, // Ajustar tamaño del icono si es necesario
    marginRight: getSpacing('sm'), // Espacio entre el icono y el texto
  },
  googleButtonText: {
    fontSize: getFontSize('md'),
    fontWeight: '600',
    color: '#374151', // Color de texto oscuro, típico para botones de Google
  },
  toggleContainer: {
    alignItems: 'center',
    padding: getSpacing('md'),
    marginTop: getSpacing('sm'), // Mantener margen por defecto
  },
  // Nuevo estilo específico para web en toggleContainer
  webToggleContainer: {
    // Reducir el margen superior en web
    marginTop: getSpacing('xs'), // Menos que el margen original de 'sm'
    // Opcional: paddingVertical reducido
    // paddingVertical: getSpacing('sm'),
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
});
