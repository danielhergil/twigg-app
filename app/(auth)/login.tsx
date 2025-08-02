// login.tsx

import React, { useState, useEffect, useCallback } from 'react';
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
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { signInWithPopup } from 'firebase/auth';
import Constants from 'expo-constants';

// --- Firebase imports ---
import { auth, db } from '@/config/firebase';
import {
  GoogleAuthProvider,
  signInWithCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

import { ensureGoogleSigninConfigured } from '@/utils/googleSignIn';

// Extraer webClientId desde extras de expoConfig
const { webClientId } = (Constants.expoConfig?.extra ?? {}) as Record<string, string>;

// --- HeroPanel: Totalmente aislado y memoizado ---
const HeroPanel = React.memo(() => (
  <View style={styles.heroContainer}>
    <Image
      source={{
        uri: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1200',
      }}
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

interface FormProps {
  fullName: string;
  setFullName: (v: string) => void;
  email: string;
  password: string;
  isSignUp: boolean;
  showPassword: boolean;
  setEmail: (v: string) => void;
  setPassword: (v: string) => void;
  setIsSignUp: (v: boolean) => void;
  setShowPassword: (v: boolean) => void;
  handleGoogleSignIn: () => Promise<void>;
  handleAuth: () => void;
  loading: boolean;
  googleLoading: boolean;
}

const Form: React.FC<FormProps> = ({
  fullName,
  setFullName,
  email,
  password,
  isSignUp,
  showPassword,
  setEmail,
  setPassword,
  setIsSignUp,
  setShowPassword,
  handleGoogleSignIn,
  handleAuth,
  loading,
  googleLoading,
}) => {
  const isValidEmail = email.includes('@') && email.includes('.');
  const hasValidName = !isSignUp || fullName.trim().length > 0;
  const isFormValid =
    email.trim().length > 0 && password.length >= 6 && isValidEmail && hasValidName;

  return (
    <View style={styles.form}>
      {isSignUp && (
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre completo</Text>
          <TextInput
            style={[
              styles.input,
              fullName.trim().length === 0 && isSignUp && styles.inputError,
              isWeb && isDesktop && styles.webInput,
            ]}
            placeholder="Tu nombre"
            placeholderTextColor="#94a3b8"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
          />
          {isSignUp && fullName.trim().length === 0 && (
            <Text style={styles.errorText}>El nombre es obligatorio</Text>
          )}
        </View>
      )}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[
            styles.input,
            (!isValidEmail || email.trim().length === 0) && email.length > 0 && styles.inputError,
            isWeb && isDesktop && styles.webInput,
          ]}
          placeholder="tu@email.com"
          placeholderTextColor="#94a3b8"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {email.length > 0 && !isValidEmail && (
          <Text style={styles.errorText}>Email no válido</Text>
        )}
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
            style={[styles.inputPassword, isWeb && isDesktop && styles.webInput]}
            placeholder="Mínimo 6 caracteres"
            placeholderTextColor="#94a3b8"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity
            style={[styles.eyeButton, isWeb && isDesktop && styles.webEyeButton]}
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
          <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={[
          styles.primaryButton,
          (!isFormValid || loading) && styles.primaryButtonDisabled,
          isWeb && isDesktop && styles.webPrimaryButton,
        ]}
        onPress={handleAuth}
        disabled={!isFormValid || loading}
      >
        <Text style={styles.primaryButtonText}>
          {loading ? (isSignUp ? 'Creando...' : 'Entrando...') : isSignUp ? 'Crear cuenta' : 'Iniciar sesión'}
        </Text>
      </TouchableOpacity>
      <View style={styles.dividerContainer}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>o</Text>
        <View style={styles.dividerLine} />
      </View>
      <TouchableOpacity
        style={[styles.googleButton, isWeb && isDesktop && styles.webGoogleButton]}
        onPress={handleGoogleSignIn}
        disabled={googleLoading}
      >
        <Image source={IcGoogle} style={styles.googleIcon} />
        <Text style={styles.googleButtonText}>
          {googleLoading ? 'Procesando...' : 'Continuar con Google'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.toggleContainer, isWeb && isDesktop && styles.webToggleContainer]}
        onPress={() => {
          setIsSignUp(!isSignUp);
          setEmail('');
          setPassword('');
          setFullName('');
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
};

export default function LoginScreen() {
  const { height: windowHeight } = useWindowDimensions();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    ensureGoogleSigninConfigured();
  }, []);

  const handleAuth = useCallback(async () => {
    const emailTrimmed = email.trim();
    const isValidEmail = emailTrimmed.includes('@') && emailTrimmed.includes('.');
    if (!isValidEmail || password.length < 6 || (isSignUp && fullName.trim().length === 0)) return;

    setLoading(true);
    try {
      if (isSignUp) {
        // Registro
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          emailTrimmed,
          password
        );
        const user = userCredential.user;

        // Crear documento en Firestore
        await setDoc(doc(db, 'users', user.uid), {
          name: fullName.trim(),
          email: user.email,
          avatar: '', // no hay foto en registro por email/password
          totalPoints: 0,
          coursesCompleted: 0,
          coursesInProgress: 0,
          coursesCreated: 0,
          createdAt: new Date(),
        });
      } else {
        // Login
        await signInWithEmailAndPassword(auth, emailTrimmed, password);
      }

      router.replace('/(tabs)');
    } catch (e: any) {
      console.error('Error auth email/pass:', e);
      let mensaje = 'Ocurrió un error. Intenta de nuevo.';

      if (e.code) {
        switch (e.code) {
          case 'auth/email-already-in-use':
            mensaje = 'El correo ya está en uso.';
            break;
          case 'auth/invalid-email':
            mensaje = 'El correo no es válido.';
            break;
          case 'auth/weak-password':
            mensaje = 'La contraseña es demasiado débil.';
            break;
          case 'auth/user-not-found':
            mensaje = 'Usuario no encontrado.';
            break;
          case 'auth/wrong-password':
            mensaje = 'Contraseña incorrecta.';
            break;
          case 'auth/user-disabled':
            mensaje = 'La cuenta está deshabilitada.';
            break;
        }
      } else if (e.message) {
        mensaje = e.message;
      }

      alert(mensaje);
    } finally {
      setLoading(false);
    }
  }, [email, password, isSignUp, fullName, router]);

  const handleGoogleSignIn = useCallback(async () => {
    setGoogleLoading(true);
    try {
      ensureGoogleSigninConfigured();

      if (!isWeb) {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        const idToken = userInfo.data?.idToken;

        if (!idToken) {
          throw new Error('No se obtuvo el ID token de Google');
        }

        const credential = GoogleAuthProvider.credential(idToken);
        await signInWithCredential(auth, credential);
      } else {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
      }

      // Crear o mergear documento de usuario en Firestore
      const user = auth.currentUser;
      if (user) {
        await setDoc(
          doc(db, 'users', user.uid),
          {
            name: user.displayName ?? '',
            email: user.email,
            avatar: user.photoURL || '',
            totalPoints: 0,
            coursesCompleted: 0,
            coursesInProgress: 0,
            coursesCreated: 0,
            createdAt: new Date(), // si ya existe, este campo no se sobreescribe porque usamos merge
          },
          { merge: true } // conserva lo que ya haya (progreso, logros, etc.)
        );
      }

      router.replace('/(tabs)');
    } catch (error: any) {
      console.error('Error en login con Google:', error);

      if (error.code === 'auth/popup-closed-by-user') {
        console.log('Popup cerrado por el usuario');
      } else if (error.code === 'auth/web-storage-unsupported') {
        alert('Habilita las cookies. No funciona en modo incógnito.');
      } else {
        alert('Error al iniciar sesión con Google. Intenta de nuevo.');
      }
    } finally {
      setGoogleLoading(false);
    }
  }, [router]);

  return (
    <SafeAreaView style={styles.container}>
      {isWeb && isDesktop ? (
        <View style={[styles.containerWeb]}>
          <View style={[styles.leftPanel, { height: windowHeight }]}>
            <HeroPanel />
          </View>
          <ScrollView
            style={[styles.formPanel, { height: windowHeight }]}
            contentContainerStyle={styles.formScrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={[styles.header, styles.webHeader]}>
              <Image source={TwiggLogo} style={styles.logoImage} resizeMode="contain" />
              <Text style={styles.title}>Twigg</Text>
              <Text style={styles.subtitle}>
                {isSignUp ? 'Crea tu cuenta gratuita' : 'Bienvenido de nuevo'}
              </Text>
            </View>
            <Form
              fullName={fullName}
              setFullName={setFullName}
              email={email}
              password={password}
              isSignUp={isSignUp}
              showPassword={showPassword}
              setEmail={setEmail}
              setPassword={setPassword}
              setIsSignUp={setIsSignUp}
              setShowPassword={setShowPassword}
              handleGoogleSignIn={handleGoogleSignIn}
              handleAuth={handleAuth}
              loading={loading}
              googleLoading={googleLoading}
            />
          </ScrollView>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.formPanel}>
              <View style={styles.header}>
                <Image source={TwiggLogo} style={styles.logoImage} resizeMode="contain" />
                <Text style={styles.title}>Twigg</Text>
                <Text style={styles.subtitle}>
                  {isSignUp ? 'Crea tu cuenta gratuita' : 'Bienvenido de nuevo'}
                </Text>
              </View>
              <Form
                fullName={fullName}
                setFullName={setFullName}
                email={email}
                password={password}
                isSignUp={isSignUp}
                showPassword={showPassword}
                setEmail={setEmail}
                setPassword={setPassword}
                setIsSignUp={setIsSignUp}
                setShowPassword={setShowPassword}
                handleGoogleSignIn={handleGoogleSignIn}
                handleAuth={handleAuth}
                loading={loading}
                googleLoading={googleLoading}
              />
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

// (El objeto styles permanece igual al que tenías previamente)
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
  webInput: ViewStyle;
  webPasswordContainer: ViewStyle;
  webPrimaryButton: ViewStyle;
  webGoogleButton: ViewStyle;
  webEyeButton: ViewStyle;
}

// (Aquí reutilizas el mismo `styles` que ya tenías, sin cambios en esta sección)
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
