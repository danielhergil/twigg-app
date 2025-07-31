// app/(tabs)/create.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Dimensions,
  Image,
} from 'react-native';
import {
  Sparkles,
  ArrowRight,
  Home,
  Compass,
  BookOpen,
  Plus,
  Award,
  User,
  Settings,
  LogOut,
} from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { getFontSize, getSpacing, isWeb, isDesktop } from '@/utils/responsive';
import { dummyUser } from '@/data/dummyData';
import TwiggLogo from '@/assets/images/twigg_logo.png';
import { router } from 'expo-router';
import { signOut } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const { width } = Dimensions.get('window');

// --- Colores Vibrantes Personalizados (iguales a explore) ---
const VibrantColors = {
  primary: '#7e22ce', // Morado más intenso
  secondary: '#f59e0b', // Ámbar
  accent: '#ec4899', // Rosa
  success: '#10b981', // Verde esmeralda
  danger: '#ef4444', // Rojo
  backgroundSecondary: '#f8fafc', // Fondo muy claro
  surface: '#ffffff', // Blanco puro para tarjetas
  text: '#1e293b', // Gris oscuro
  textSecondary: '#64748b', // Gris medio
  borderLight: '#cbd5e1', // Gris claro para bordes
  shadow: '#000000', // Sombra más oscura
  sidebarBackground: 'rgba(126, 34, 206, 0.1)', // Fondo del sidebar más intenso
  headerBackground: 'rgba(126, 34, 206, 0.2)', // Fondo del header más intenso
};

const levels = ['Básico', 'Intermedio', 'Avanzado'];

const handleLogout = async () => {
  try {
    await signOut(auth);
    if (!isWeb) {
      await GoogleSignin.signOut();
    }
    router.replace('/login');
  } catch (e: any) {
    console.error('Error al cerrar sesión:', e);
    alert('No se pudo cerrar sesión. Intenta de nuevo.');
  }
};

type LevelButtonProps = {
  levelOption: string;
  current: string;
  onPress: () => void;
  compact?: boolean;
};

const LevelButton = ({ levelOption, current, onPress, compact = false }: LevelButtonProps) => (
  <TouchableOpacity
    style={[
      styles.levelButton,
      current === levelOption && styles.levelButtonActive,
      compact && styles.levelButtonCompact,
    ]}
    onPress={onPress}
  >
    <Text
      style={[
        styles.levelButtonText,
        current === levelOption && styles.levelButtonTextActive,
      ]}
    >
      {levelOption}
    </Text>
  </TouchableOpacity>
);

const NavigationItem = ({ icon: Icon, label, isActive = false, onPress }: any) => (
  <TouchableOpacity
    style={[styles.navItem, isActive && styles.navItemActive]}
    onPress={onPress}
  >
    <Icon size={20} color={isActive ? VibrantColors.surface : VibrantColors.textSecondary} />
    <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>{label}</Text>
  </TouchableOpacity>
);

export default function CreateScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [level, setLevel] = useState('Básico');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateCourse = async () => {
    if (!title.trim() || !description.trim() || !duration.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos requeridos');
      return;
    }
    setIsGenerating(true);
    // Simulamos la generación del curso
    setTimeout(() => {
      setIsGenerating(false);
      Alert.alert(
        'Curso Generado',
        '¡Tu curso ha sido generado exitosamente con IA!',
        [{ text: 'Ver Curso', onPress: () => console.log('Ver curso generado') }]
      );
    }, 3000);
  };

  const renderWebLayout = () => (
    <View style={styles.webContainer}>
      {/* Sidebar - Copiada exactamente de explore.tsx */}
      <View style={styles.webSidebar}>
        <ScrollView
          contentContainerStyle={styles.webSidebarContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.webSidebarHeader}>
            <View style={styles.sidebarLogoContainer}>
              <Image source={TwiggLogo} style={styles.sidebarLogo} resizeMode="contain" />
              <Text style={styles.sidebarTitle}>Twigg</Text>
            </View>
          </View>
          <View style={styles.navigationMenu}>
            <NavigationItem icon={Home} label="Inicio" onPress={() => router.push('/')} />
            <NavigationItem icon={Compass} label="Explorar" onPress={() => router.push('/explore')} />
            <NavigationItem icon={BookOpen} label="Mis Cursos" onPress={() => router.push('/my-courses')} />
            <NavigationItem icon={Plus} label="Crear Curso" isActive />
            <NavigationItem icon={Award} label="Logros" onPress={() => router.push('/achievements')} />
            <NavigationItem icon={User} label="Perfil" onPress={() => router.push('/profile')} />
            <NavigationItem icon={Settings} label="Configuración" onPress={() => router.push('/settings')} />
          </View>
        </ScrollView>
        <View style={styles.sidebarFooter}>
          <View style={styles.userInfo}>
            <View style={styles.userAvatar}>
              <TouchableOpacity style={styles.profileButton}>
                <Image source={{ uri: dummyUser.avatar }} style={styles.webAvatarEmail} />
              </TouchableOpacity>
            </View>
            <View style={styles.userText}>
              <Text style={styles.userName}>{dummyUser.name}</Text>
              <Text style={styles.userEmail}>{dummyUser.email}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color={VibrantColors.danger} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content - Compactado en web */}
      <ScrollView style={styles.webMainContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.webHeaderContainer, styles.webHeaderContainerCompact]}>
          <View style={styles.webHeader}>
            <View>
              <Text style={styles.webGreeting}>Crear Curso con IA</Text>
              <Text style={styles.webSubtitle}>Describe tu curso y la IA generará el contenido completo</Text>
            </View>
            <View style={styles.webHeaderActions}>
              <TouchableOpacity style={styles.notificationButton}>
                <Image source={{ uri: dummyUser.avatar }} style={styles.webAvatarWeb} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={[styles.webContentCard, styles.webContentCardCompact]}>
          <View style={[styles.infoBox, styles.infoBoxCompact]}>
            <Text style={styles.infoTitle}>¿Cómo funciona?</Text>
            <Text style={styles.infoText}>
              <Text>1. Completa la información básica del curso</Text>
              <Text>{"\n"}</Text>
              <Text>2. Nuestra IA generará módulos, lecciones y evaluaciones</Text>
              <Text>{"\n"}</Text>
              <Text>3. Podrás editar y personalizar el contenido generado</Text>
              <Text>{"\n"}</Text>
              <Text>4. Publica tu curso para que otros puedan acceder</Text>
            </Text>
          </View>

          <View style={styles.webForm}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Título del Curso *</Text>
              <TextInput
                style={[styles.webInput, styles.webInputCompact]}
                placeholder="Ej: Introducción a React Native"
                placeholderTextColor={VibrantColors.textSecondary}
                value={title}
                onChangeText={setTitle}
                multiline
                numberOfLines={2}
              />
            </View>

            <View style={styles.webInputRow}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: getSpacing('md') }]}>
                <Text style={styles.label}>Duración (semanas) *</Text>
                <TextInput
                  style={[styles.webInput, styles.webInputCompact]}
                  placeholder="Ej: 8"
                  placeholderTextColor={VibrantColors.textSecondary}
                  value={duration}
                  onChangeText={setDuration}
                  keyboardType="numeric"
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Nivel de Dificultad</Text>
                <View style={styles.webLevelContainer}>
                  {levels.map((levelOption) => (
                    <LevelButton
                      key={levelOption}
                      levelOption={levelOption}
                      current={level}
                      onPress={() => setLevel(levelOption)}
                      compact
                    />
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Descripción y Enfoque del Curso *</Text>
              <Text style={styles.labelSubtext}>
                Describe qué quieres enseñar, objetivos, público objetivo, etc.
              </Text>
              <TextInput
                style={[styles.webInput, styles.webTextArea, styles.webInputCompact]}
                placeholder="Describe el enfoque, objetivos y contenido que quieres que tenga tu curso..."
                placeholderTextColor={VibrantColors.textSecondary}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={8}
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity
              style={[
                styles.generateButton,
                isGenerating && styles.generateButtonDisabled,
                styles.generateButtonCompact,
              ]}
              onPress={handleGenerateCourse}
              disabled={isGenerating}
            >
              <View style={styles.generateButtonContent}>
                <Sparkles
                  size={20}
                  color={VibrantColors.surface}
                  style={isGenerating ? styles.spinningIcon : {}}
                />
                <Text style={styles.generateButtonText}>
                  {isGenerating ? 'Generando Curso...' : 'Generar Curso con IA'}
                </Text>
                {!isGenerating && (
                  <ArrowRight size={20} color={VibrantColors.surface} />
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );

  const renderMobileLayout = () => (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Sparkles size={32} color={VibrantColors.primary} />
        <Text style={styles.title}>Crear Curso con IA</Text>
        <Text style={styles.subtitle}>
          Describe tu curso y la IA generará el contenido completo para ti
        </Text>
      </View>
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Título del Curso *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Introducción a React Native"
            placeholderTextColor={VibrantColors.textSecondary}
            value={title}
            onChangeText={setTitle}
            multiline
            numberOfLines={2}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Duración (en semanas) *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: 8"
            placeholderTextColor={VibrantColors.textSecondary}
            value={duration}
            onChangeText={setDuration}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nivel de Dificultad</Text>
          <View style={styles.levelContainer}>
            {levels.map((levelOption) => (
              <LevelButton
                key={levelOption}
                levelOption={levelOption}
                current={level}
                onPress={() => setLevel(levelOption)}
              />
            ))}
          </View>
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Descripción y Enfoque del Curso *</Text>
          <Text style={styles.labelSubtext}>
            Describe qué quieres enseñar, objetivos, público objetivo, etc.
          </Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe el enfoque, objetivos y contenido que quieres que tenga tu curso..."
            placeholderTextColor={VibrantColors.textSecondary}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>
        <TouchableOpacity
          style={[styles.generateButton, isGenerating && styles.generateButtonDisabled]}
          onPress={handleGenerateCourse}
          disabled={isGenerating}
        >
          <View style={styles.generateButtonContent}>
            <Sparkles
              size={20}
              color={VibrantColors.surface}
              style={isGenerating ? styles.spinningIcon : {}}
            />
            <Text style={styles.generateButtonText}>
              {isGenerating ? 'Generando Curso...' : 'Generar Curso con IA'}
            </Text>
            {!isGenerating && (
              <ArrowRight size={20} color={VibrantColors.surface} />
            )}
          </View>
        </TouchableOpacity>
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>¿Cómo funciona?</Text>
          <Text style={styles.infoText}>
            <Text>1. Completa la información básica del curso</Text>
            <Text>{"\n"}</Text>
            <Text>2. Nuestra IA generará módulos, lecciones y evaluaciones</Text>
            <Text>{"\n"}</Text>
            <Text>3. Podrás editar y personalizar el contenido generado</Text>
            <Text>{"\n"}</Text>
            <Text>4. Publica tu curso para que otros puedan acceder</Text>
          </Text>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      {isWeb && isDesktop ? renderWebLayout() : renderMobileLayout()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: VibrantColors.backgroundSecondary,
  },

  // Web Layout
  webContainer: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    maxWidth: 1600,
    alignSelf: 'center',
    backgroundColor: VibrantColors.backgroundSecondary,
  },

  // Sidebar - Estilos copiados de explore.tsx
  webSidebar: {
    width: 280,
    backgroundColor: VibrantColors.sidebarBackground,
    borderRightWidth: 1,
    borderRightColor: VibrantColors.borderLight,
  },
  webSidebarContent: {
    padding: getSpacing('lg'),
    paddingBottom: getSpacing('lg'),
  },
  webSidebarHeader: {
    marginBottom: getSpacing('xl'),
  },
  sidebarLogoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getSpacing('sm'),
  },
  sidebarLogo: {
    width: 60,
    height: 60,
  },
  sidebarTitle: {
    fontSize: getFontSize('xl'),
    fontWeight: '800',
    color: VibrantColors.primary,
  },
  navigationMenu: {
    gap: getSpacing('xs'),
    marginBottom: getSpacing('xl'),
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: getSpacing('sm'),
    paddingHorizontal: getSpacing('md'),
    borderRadius: 12,
    gap: getSpacing('md'),
  },
  navItemActive: {
    backgroundColor: VibrantColors.primary,
  },
  navLabel: {
    fontSize: getFontSize('sm'),
    color: VibrantColors.textSecondary,
    fontWeight: '500',
  },
  navLabelActive: {
    color: VibrantColors.surface,
    fontWeight: '600',
  },
  sidebarFooter: {
    borderTopWidth: 1,
    borderTopColor: VibrantColors.borderLight,
    padding: getSpacing('md'),
    backgroundColor: VibrantColors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getSpacing('md'),
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userText: {
    flex: 1,
  },
  userName: {
    fontSize: getFontSize('sm'),
    fontWeight: '600',
    color: VibrantColors.text,
  },
  userEmail: {
    fontSize: getFontSize('xs'),
    color: VibrantColors.textSecondary,
  },
  logoutButton: {
    padding: getSpacing('xs'),
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  webAvatarEmail: {
    width: 40,
    height: 40,
    borderRadius: 50,
    marginBottom: getSpacing('md'),
    marginTop: 30,
  },

  // Main Content
  webMainContent: {
    flex: 1,
    padding: getSpacing('xl'),
  },
  webHeaderContainer: {
    backgroundColor: VibrantColors.headerBackground,
    borderRadius: 16,
    marginBottom: getSpacing('xl'),
    padding: getSpacing('lg'),
  },
  webHeaderContainerCompact: {
    backgroundColor: VibrantColors.headerBackground,
    borderRadius: 16,
    marginBottom: getSpacing('lg'),
    padding: getSpacing('md'), // reducido
  },
  webHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  webGreeting: {
    fontSize: getFontSize('xxl'),
    fontWeight: '800',
    color: VibrantColors.text,
    marginBottom: getSpacing('xs'),
  },
  webSubtitle: {
    fontSize: getFontSize('md'),
    color: VibrantColors.textSecondary,
  },
  webHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getSpacing('md'),
  },
  notificationButton: {
    position: 'relative',
    padding: getSpacing('sm'),
  },
  webAvatarWeb: {
    width: 60,
    height: 60,
    borderRadius: 50,
  },

  // Content Card
  webContentCard: {
    backgroundColor: VibrantColors.surface,
    borderRadius: 12,
    padding: getSpacing('lg'),
    shadowColor: VibrantColors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: VibrantColors.borderLight,
  },
  webContentCardCompact: {
    backgroundColor: VibrantColors.surface,
    borderRadius: 12,
    padding: getSpacing('md'), // reducido
    shadowColor: VibrantColors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: VibrantColors.borderLight,
  },

  // Info Box
  infoBox: {
    backgroundColor: VibrantColors.backgroundSecondary,
    borderRadius: 12,
    padding: getSpacing('lg'),
    borderLeftWidth: 4,
    borderLeftColor: VibrantColors.primary,
    marginBottom: getSpacing('xl'),
  },
  infoBoxCompact: {
    backgroundColor: VibrantColors.backgroundSecondary,
    borderRadius: 12,
    padding: getSpacing('md'), // reducido
    borderLeftWidth: 4,
    borderLeftColor: VibrantColors.primary,
    marginBottom: getSpacing('md'),
  },
  infoTitle: {
    fontSize: getFontSize('lg'),
    fontWeight: '600',
    color: VibrantColors.text,
    marginBottom: getSpacing('md'),
  },
  infoText: {
    fontSize: getFontSize('md'),
    color: VibrantColors.textSecondary,
    lineHeight: getFontSize('md') * 1.5,
  },

  // Form
  webForm: {
    gap: getSpacing('xl'),
  },
  webInputRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  webInput: {
    borderWidth: 1,
    borderColor: VibrantColors.borderLight,
    borderRadius: 12,
    padding: getSpacing('lg'),
    fontSize: getFontSize('md'),
    backgroundColor: VibrantColors.surface,
    color: VibrantColors.text,
    minHeight: 50,
  },
  webInputCompact: {
    borderWidth: 1,
    borderColor: VibrantColors.borderLight,
    borderRadius: 12,
    paddingVertical: getSpacing('sm'),
    paddingHorizontal: getSpacing('md'),
    fontSize: getFontSize('md'),
    backgroundColor: VibrantColors.surface,
    color: VibrantColors.text,
    minHeight: 40,
  },
  webTextArea: {
    minHeight: 150,
    maxHeight: 250,
  },
  webLevelContainer: {
    flexDirection: 'row',
    gap: getSpacing('sm'),
    flexWrap: 'wrap',
    marginTop: getSpacing('sm'),
  },

  // Common form elements
  inputGroup: {
    gap: getSpacing('sm'),
  },
  label: {
    fontSize: getFontSize('sm'),
    fontWeight: '600',
    color: VibrantColors.text,
  },
  labelSubtext: {
    fontSize: getFontSize('xs'),
    color: VibrantColors.textSecondary,
    marginTop: -getSpacing('xs'),
  },

  // Buttons
  levelButton: {
    backgroundColor: VibrantColors.surface,
    borderWidth: 1,
    borderColor: VibrantColors.borderLight,
    borderRadius: 20,
    paddingHorizontal: getSpacing('lg'),
    paddingVertical: getSpacing('sm'),
  },
  levelButtonCompact: {
    paddingHorizontal: getSpacing('md'),
    paddingVertical: getSpacing('xs'),
  },
  levelButtonActive: {
    backgroundColor: VibrantColors.primary,
    borderColor: VibrantColors.primary,
  },
  levelButtonText: {
    fontSize: getFontSize('sm'),
    fontWeight: '500',
    color: VibrantColors.textSecondary,
  },
  levelButtonTextActive: {
    color: VibrantColors.surface,
  },

  generateButton: {
    backgroundColor: VibrantColors.primary,
    borderRadius: 16,
    padding: getSpacing('lg'),
    alignItems: 'center',
    marginTop: getSpacing('md'),
    shadowColor: VibrantColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  generateButtonCompact: {
    paddingVertical: getSpacing('sm'), // menos alto
    paddingHorizontal: getSpacing('lg'),
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  generateButtonDisabled: {
    backgroundColor: VibrantColors.textSecondary,
    shadowOpacity: 0,
    elevation: 0,
  },
  generateButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getSpacing('sm'),
  },
  generateButtonText: {
    color: VibrantColors.surface,
    fontSize: getFontSize('md'),
    fontWeight: '600',
  },
  spinningIcon: {
    // En React Native no tenemos CSS animations nativas, pero esto es una referencia visual
  },

  // Mobile styles (mantenidos)
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: VibrantColors.surface,
    padding: getSpacing('lg'),
    alignItems: 'center',
    textAlign: 'center',
  },
  title: {
    fontSize: getFontSize('xl'),
    fontWeight: 'bold',
    color: VibrantColors.text,
    marginTop: getSpacing('md'),
    marginBottom: getSpacing('sm'),
  },
  subtitle: {
    fontSize: getFontSize('md'),
    color: VibrantColors.textSecondary,
    textAlign: 'center',
    lineHeight: getFontSize('md') * 1.4,
  },
  form: {
    padding: getSpacing('lg'),
    gap: getSpacing('lg'),
  },
  input: {
    borderWidth: 1,
    borderColor: VibrantColors.borderLight,
    borderRadius: 12,
    padding: getSpacing('md'),
    fontSize: getFontSize('md'),
    backgroundColor: VibrantColors.surface,
    color: VibrantColors.text,
  },
  textArea: {
    minHeight: 120,
    maxHeight: 120,
  },
  levelContainer: {
    flexDirection: 'row',
    gap: getSpacing('sm'),
    flexWrap: 'wrap',
  },
});
