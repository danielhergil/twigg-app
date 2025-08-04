// app/(tabs)/create.tsx
import React, { useState, useEffect, useCallback } from 'react';
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
  ActivityIndicator,
  LayoutAnimation,
  Platform,
  UIManager,
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
import { getFontSize, getSpacing, isWeb, isDesktop } from '@/utils/responsive';
import { dummyUser } from '@/data/dummyData';
import TwiggLogo from '@/assets/images/twigg_logo.png';
import { router } from 'expo-router';
import { signOut } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
const { width } = Dimensions.get('window');
// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
// --- Colores Vibrantes Personalizados ---
const VibrantColors = {
  primary: '#7e22ce',
  secondary: '#f59e0b',
  accent: '#ec4899',
  success: '#10b981',
  danger: '#ef4444',
  backgroundSecondary: '#f8fafc',
  surface: '#ffffff',
  text: '#1e293b',
  textSecondary: '#64748b',
  borderLight: '#cbd5e1',
  shadow: '#000000',
  sidebarBackground: 'rgba(126, 34, 206, 0.1)',
  headerBackground: 'rgba(126, 34, 206, 0.2)',
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
// Tipado mínimo según respuesta de draft
interface Lesson {
  lessonTitle: string;
  theory?: string;
  tests?: any[];
}
interface Topic {
  topicTitle: string;
  lessons: Lesson[];
}
interface Module {
  moduleNumber: number;
  moduleTitle: string;
  weeks: number[];
  topics: Topic[];
}
interface Outline {
  modules: Module[];
  [key: string]: any;
}
const NavigationItem = ({ icon: Icon, label, isActive = false, onPress }: any) => (
  <TouchableOpacity
    style={[styles.navItem, isActive && styles.navItemActive]}
    onPress={onPress}
  >
    <Icon size={20} color={isActive ? VibrantColors.surface : VibrantColors.textSecondary} />
    <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>{label}</Text>
  </TouchableOpacity>
);
// Tarjeta de módulo (solo títulos y topicTitle)
const ModuleCard = ({ module, index }: { module: Module; index: number }) => {
  const [open, setOpen] = useState(false);
  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen(o => !o);
  };
  return (
    <View style={styles.moduleCard}>
      <TouchableOpacity onPress={toggle} style={styles.moduleHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.moduleTitle}>
            {module.moduleNumber}. {module.moduleTitle}
          </Text>
          <Text style={styles.moduleWeeks}>Semanas: {module.weeks.join(', ')}</Text>
        </View>
        <Text style={styles.toggleArrow}>{open ? '▲' : '▼'}</Text>
      </TouchableOpacity>
      {open && (
        <View style={styles.moduleBody}>
          {module.topics.map((topic, ti) => (
            <View key={ti} style={styles.topicBlock}>
              <Text style={styles.topicTitle}>• {topic.topicTitle}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};
// ---------- BACKEND URL HELPERS ----------
/**
 * Sustituye '192.168.x.y' por la IP local de tu máquina en la red cuando pruebes desde dispositivo físico.
 */
const LOCAL_BACKEND_IP = '192.168.1.144'; // <-- reemplaza con tu IP local real
const getBackendBaseUrl = () => {
  if (Platform.OS === 'android' && !isWeb) {
    // Si estás usando emulador Android estándar, 10.0.2.2 mapea al localhost de la máquina
    return `http://${LOCAL_BACKEND_IP}:8000`;
  }
  // Para iOS simulator o dispositivo físico, usar IP local de la máquina
  return `http://${LOCAL_BACKEND_IP}:8000`;
};
// -----------------------------------------
export default function CreateScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('12');
  const [level, setLevel] = useState('Básico');
  const [isGenerating, setIsGenerating] = useState(false);
  const [outline, setOutline] = useState<Outline | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [draftFinal, setDraftFinal] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false); // Nuevo estado para el botón de publicar
  const anyModuleReceived = modules.length > 0;
  const resetAll = () => {
    setTitle('');
    setDescription('');
    setDuration('12');
    setLevel('Básico');
    setOutline(null);
    setModules([]);
    setDraftFinal(null);
    setError(null);
    setIsGenerating(false);
    setIsPublishing(false);
  };
  const handleGenerateCourse = useCallback(async () => {
    if (!title.trim() || !description.trim() || !duration.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos requeridos');
      return;
    }
    setIsGenerating(true);
    setOutline(null);
    setModules([]);
    setDraftFinal(null);
    setError(null);
    let idToken = '';
    try {
      const user = auth.currentUser;
      if (user) {
        idToken = await user.getIdToken();
      }
    } catch (e: any) {
      console.warn('No se pudo obtener token:', e);
    }
    const payload = {
      courseTitle: title,
      level,
      durationWeeks: parseInt(duration, 10),
      description,
    };
    // Diferenciar: en web usamos streaming SSE, en mobile fallback a polling
    if (isWeb) {
      // SSE como antes
      const streamUrl = `${getBackendBaseUrl()}/generate-draft-stream`;
      const controller = new AbortController();
      const signal = controller.signal;
      let lastActivity = Date.now();
      const activityInterval = setInterval(() => {
        if (Date.now() - lastActivity > 30000) {
          controller.abort();
        }
      }, 5000);
      try {
        const resp = await fetch(streamUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: idToken ? `Bearer ${idToken}` : '',
          },
          body: JSON.stringify(payload),
          signal,
        });
        if (!resp.body) {
          throw new Error('Stream no disponible');
        }
        const reader = resp.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';
        const newModules: Module[] = [];
        let partialOutline: Outline | null = null;
        let finalDraft: any = null;
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          lastActivity = Date.now();
          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split('\n');
          buffer = parts.pop() || '';
          for (const part of parts) {
            if (!part.trim()) continue;
            const lines = part.split('\n');
            let eventType = '';
            let dataLine = '';
            for (const line of lines) {
              if (line.startsWith('event:')) {
                eventType = line.replace('event:', '').trim();
              } else if (line.startsWith('data:')) {
                dataLine += line.replace('data:', '').trim();
              }
            }
            if (!dataLine) continue;
            try {
              const parsed = JSON.parse(dataLine);
              if (eventType === 'outline' && parsed.outline) {
                partialOutline = parsed.outline;
                setOutline(parsed.outline);
              } else if (eventType === 'module' && parsed.module) {
                newModules.push(parsed.module);
                setModules([...newModules]);
              } else if (eventType === 'done' && parsed.draft) {
                finalDraft = parsed.draft;
                setDraftFinal(parsed.draft);
                if ((!newModules.length || !partialOutline) && parsed.draft.modules) {
                  setModules(parsed.draft.modules);
                }
              } else if (eventType === 'error') {
                setError(parsed.error || 'Error desconocido');
              }
            } catch (e) {
              console.warn('Error parseando chunk SSE:', e, dataLine);
            }
          }
        }
      } catch (e: any) {
        if (e.name === 'AbortError') {
          setError('La conexión se tardó demasiado y se abortó. Intenta de nuevo.');
        } else {
          console.error('Error generando curso:', e);
          setError(e.message || 'Error generando curso');
        }
      } finally {
        clearInterval(activityInterval);
        setIsGenerating(false);
      }
    } else {
      // Mobile: polling con /generate-draft y luego /drafts/{id}/progress
      try {
        // 1. Crear draft
        const createResp = await fetch(`${getBackendBaseUrl()}/generate-draft`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: idToken ? `Bearer ${idToken}` : '',
          },
          body: JSON.stringify(payload),
        });
        if (!createResp.ok) {
          throw new Error(`Falló creación del draft: ${createResp.statusText}`);
        }
        const { draftId } = await createResp.json();
        setModules([]);
        setOutline(null);
        setDraftFinal(null);
        // 2. Polling
        const polling = setInterval(async () => {
          try {
            const progResp = await fetch(`${getBackendBaseUrl()}/drafts/${draftId}/progress`, {
              headers: {
                Authorization: idToken ? `Bearer ${idToken}` : '',
              },
            });
            if (!progResp.ok) return;
            const { draft } = await progResp.json();
            if (draft.modules) {
              setOutline({ modules: draft.modules });
              setModules(draft.modules);
            }
            if (draft.status && draft.status !== 'generating') {
              setDraftFinal(draft);
              setIsGenerating(false);
              clearInterval(polling);
            }
          } catch (e) {
            console.warn('Polling error', e);
          }
        }, 1500);
      } catch (e: any) {
        console.error('Error generando curso (mobile):', e);
        setError(e.message || 'Error generando curso');
        setIsGenerating(false);
      }
    }
  }, [title, description, duration, level, isWeb]);
  
  // Nueva función para publicar el curso
  const handlePublishCourse = useCallback(async () => {
    if (!draftFinal || !outline) {
      Alert.alert('Error', 'No hay curso para publicar');
      return;
    }
    
    setIsPublishing(true);
    setError(null);
    
    let idToken = '';
    try {
      const user = auth.currentUser;
      if (user) {
        idToken = await user.getIdToken();
      }
    } catch (e: any) {
      console.warn('No se pudo obtener token:', e);
    }
    
    try {
      // Llamada al backend para publicar el draft
      const publishResp = await fetch(`${getBackendBaseUrl()}/publish-draft/${draftFinal.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: idToken ? `Bearer ${idToken}` : '',
        },
        body: JSON.stringify({
          thumbnail: "", // Puedes agregar un campo para thumbnail si lo deseas
        }),
      });
      
      if (!publishResp.ok) {
        const errorData = await publishResp.json();
        throw new Error(errorData.detail || 'Error al publicar el curso');
      }
      
      const result = await publishResp.json();
      Alert.alert('Éxito', 'Curso publicado correctamente', [
        { 
          text: 'OK', 
          onPress: () => {
            router.push(`/course/${result.course.id}`);
          }
        }
      ]);
      
      // Resetear todo después de publicar
      resetAll();
    } catch (e: any) {
      console.error('Error publicando curso:', e);
      setError(e.message || 'Error al publicar el curso');
      Alert.alert('Error', e.message || 'Error al publicar el curso');
    } finally {
      setIsPublishing(false);
    }
  }, [draftFinal, outline, isWeb]);
  
  // Renderers y UI se mantienen igual que tenías, con formulario inicial ocultándose cuando hay módulos/draftFinal.
  const renderWebLayout = () => (
    <View style={styles.webContainer}>
      {/* Sidebar */}
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
      {/* Main Content */}
      <ScrollView style={styles.webMainContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.webHeaderContainer, styles.webHeaderContainerCompact]}>
          <View style={styles.webHeader}>
            <View>
              <Text style={styles.webGreeting}>Crear Curso con IA</Text>
              <Text style={styles.webSubtitle}>
                Describe tu curso y la IA generará la estructura progresivamente
              </Text>
            </View>
            <View style={styles.webHeaderActions}>
              <TouchableOpacity style={styles.notificationButton}>
                <Image source={{ uri: dummyUser.avatar }} style={styles.webAvatarWeb} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {!anyModuleReceived && !draftFinal && (
          <View style={[styles.webContentCard, styles.webContentCardCompact]}>
            <View style={[styles.infoBox, styles.infoBoxCompact]}>
              <Text style={styles.infoTitle}>¿Cómo funciona?</Text>
              <Text style={styles.infoText}>
                <Text>1. Completa la información básica del curso</Text>
                {'\n'}
                <Text>2. Nuestra IA generará módulos, lecciones y evaluaciones</Text>
                {'\n'}
                <Text>3. Podrás editar y personalizar el contenido generado</Text>
                {'\n'}
                <Text>4. Publica tu curso para que otros puedan acceder</Text>
              </Text>
            </View>
            <View style={styles.webForm}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Título del Curso *</Text>
                <TextInput
                  style={[styles.webInput, styles.webInputCompact]}
                  placeholder="Ej: Acupuntura para principiantes"
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
                    placeholder="Ej: 12"
                    placeholderTextColor={VibrantColors.textSecondary}
                    value={duration}
                    onChangeText={setDuration}
                    keyboardType="numeric"
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Nivel de Dificultad</Text>
                  <View style={styles.webLevelContainer}>
                    {levels.map(lv => (
                      <LevelButton
                        key={lv}
                        levelOption={lv}
                        current={level}
                        onPress={() => setLevel(lv)}
                        compact
                      />
                    ))}
                  </View>
                </View>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Descripción y Enfoque *</Text>
                <Text style={styles.labelSubtext}>
                  Describe qué quieres enseñar, objetivos, público objetivo, etc.
                </Text>
                <TextInput
                  style={[styles.webInput, styles.webTextArea, styles.webInputCompact]}
                  placeholder="Aprende acupuntura desde cero..."
                  placeholderTextColor={VibrantColors.textSecondary}
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={6}
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
                  {!isGenerating && <ArrowRight size={20} color={VibrantColors.surface} />}
                </View>
              </TouchableOpacity>
              {error && (
                <Text style={{ color: VibrantColors.danger, marginTop: getSpacing('sm') }}>
                  {error}
                </Text>
              )}
            </View>
          </View>
        )}
        {(anyModuleReceived || draftFinal) && (
          <View style={[styles.webContentCard, styles.webContentCardCompact]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View>
                <Text style={{ fontSize: 20, fontWeight: '700' }}>Estructura del curso</Text>
                {draftFinal && (
                  <Text style={{ color: VibrantColors.textSecondary, marginTop: 4 }}>
                    {draftFinal.courseTitle || title}
                  </Text>
                )}
              </View>
              <TouchableOpacity onPress={resetAll} style={{ padding: 8, backgroundColor: '#eee', borderRadius: 8 }}>
                <Text style={{ fontWeight: '600' }}>Reiniciar</Text>
              </TouchableOpacity>
            </View>
            {outline && (
              <View style={{ marginTop: getSpacing('sm') }}>
                <Text style={{ fontWeight: '600' }}>{`Módulos esperados: ${outline.modules?.length || 0}`}</Text>
              </View>
            )}
            {modules.map((mod, idx) => (
              <ModuleCard key={idx} module={mod} index={idx} />
            ))}
            
            {/* Botón de publicar curso */}
            <TouchableOpacity
              style={[
                styles.publishButton,
                isPublishing && styles.publishButtonDisabled,
                styles.publishButtonCompact,
              ]}
              onPress={handlePublishCourse}
              disabled={isPublishing}
            >
              <View style={styles.publishButtonContent}>
                <Text style={styles.publishButtonText}>
                  {isPublishing ? 'Publicando curso...' : 'Crear este curso'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
      {/* Overlay spinner semi-transparente */}
      {isGenerating && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 8, color: '#fff' }}>Generando curso... </Text>
          {modules.length > 0 && (
            <Text style={{ marginTop: 4, color: '#fff' }}>
              Módulos recibidos: {modules.length}
            </Text>
          )}
        </View>
      )}
    </View>
  );

  const renderMobileLayout = () => (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Sparkles size={32} color={VibrantColors.primary} />
        <Text style={styles.title}>Crear Curso con IA</Text>
        <Text style={styles.subtitle}>
          Describe tu curso y la IA generará la estructura progresivamente
        </Text>
      </View>
      {!anyModuleReceived && !draftFinal && (
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Título del Curso *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Acupuntura para principiantes"
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
              placeholder="Ej: 12"
              placeholderTextColor={VibrantColors.textSecondary}
              value={duration}
              onChangeText={setDuration}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nivel de Dificultad</Text>
            <View style={styles.levelContainer}>
              {levels.map(lv => (
                <LevelButton
                  key={lv}
                  levelOption={lv}
                  current={level}
                  onPress={() => setLevel(lv)}
                />
              ))}
            </View>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descripción y Enfoque *</Text>
            <Text style={styles.labelSubtext}>
              Describe qué quieres enseñar, objetivos, público objetivo, etc.
            </Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Aprende acupuntura desde cero..."
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
              {!isGenerating && <ArrowRight size={20} color={VibrantColors.surface} />}
            </View>
          </TouchableOpacity>
          {error && (
            <Text style={{ color: VibrantColors.danger, marginTop: getSpacing('sm') }}>
              {error}
            </Text>
          )}
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>¿Cómo funciona?</Text>
            <Text style={styles.infoText}>
              <Text>1. Completa la información básica del curso</Text>
              {'\n'}
              <Text>2. Nuestra IA generará módulos, lecciones y evaluaciones</Text>
              {'\n'}
              <Text>3. Podrás editar y personalizar el contenido generado</Text>
              {'\n'}
              <Text>4. Publica tu curso para que otros puedan acceder</Text>
            </Text>
          </View>
        </View>
      )}
      {(anyModuleReceived || draftFinal) && (
        <View style={[styles.resultContainer, { marginHorizontal: getSpacing('lg') }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ fontSize: 20, fontWeight: '700' }}>Estructura del curso</Text>
              {draftFinal && (
                <Text style={{ color: VibrantColors.textSecondary, marginTop: 4 }}>
                  {draftFinal.courseTitle || title}
                </Text>
              )}
            </View>
            <TouchableOpacity onPress={resetAll} style={{ padding: 8, backgroundColor: '#eee', borderRadius: 8 }}>
              <Text style={{ fontWeight: '600' }}>Reiniciar</Text>
            </TouchableOpacity>
          </View>
          {outline && (
            <View style={{ marginTop: getSpacing('sm') }}>
              <Text style={{ fontWeight: '600' }}>{`Módulos esperados: ${outline.modules?.length || 0}`}</Text>
            </View>
          )}
          {modules.map((mod, idx) => (
            <ModuleCard key={idx} module={mod} index={idx} />
          ))}
          
          {/* Botón de publicar curso */}
          <TouchableOpacity
            style={[
              styles.publishButton,
              isPublishing && styles.publishButtonDisabled,
            ]}
            onPress={handlePublishCourse}
            disabled={isPublishing}
          >
            <View style={styles.publishButtonContent}>
              <Text style={styles.publishButtonText}>
                {isPublishing ? 'Publicando curso...' : 'Crear este curso'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
      {isGenerating && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 8, color: '#fff' }}>Generando curso... </Text>
          {modules.length > 0 && (
            <Text style={{ marginTop: 4, color: '#fff' }}>
              Módulos recibidos: {modules.length}
            </Text>
          )}
        </View>
      )}
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
  // Sidebar
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
    padding: getSpacing('md'),
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
  // Cards / form web
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
    marginBottom: getSpacing('xl'),
  },
  webContentCardCompact: {
    backgroundColor: VibrantColors.surface,
    borderRadius: 12,
    padding: getSpacing('md'),
    shadowColor: VibrantColors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: VibrantColors.borderLight,
    marginBottom: getSpacing('lg'),
  },
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
    padding: getSpacing('md'),
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
  // Common
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
    paddingVertical: getSpacing('sm'),
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
  spinningIcon: {},
  // Mobile (simple como antes)
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
  resultContainer: {
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
    marginTop: getSpacing('xl'),
  },
  // Módulos
  moduleCard: {
    backgroundColor: '#f9f9fc',
    borderRadius: 12,
    padding: getSpacing('md'),
    marginTop: getSpacing('md'),
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  moduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getSpacing('sm'),
  },
  moduleTitle: {
    fontSize: getFontSize('md'),
    fontWeight: '700',
    color: VibrantColors.primary,
  },
  moduleWeeks: {
    fontSize: getFontSize('xs'),
    color: VibrantColors.textSecondary,
    marginTop: 2,
  },
  toggleArrow: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: getSpacing('sm'),
  },
  moduleBody: {
    marginTop: getSpacing('sm'),
    paddingLeft: getSpacing('sm'),
  },
  topicBlock: {
    marginBottom: getSpacing('xs'),
  },
  topicTitle: {
    fontSize: getFontSize('sm'),
    fontWeight: '500',
    color: VibrantColors.text,
  },
  // Overlay
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(30,41,59,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50,
    gap: 8,
  },
  
  // Estilos para el botón de publicar
  publishButton: {
    backgroundColor: VibrantColors.success,
    borderRadius: 16,
    padding: getSpacing('lg'),
    alignItems: 'center',
    marginTop: getSpacing('lg'),
    shadowColor: VibrantColors.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  publishButtonCompact: {
    paddingVertical: getSpacing('sm'),
    paddingHorizontal: getSpacing('lg'),
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  publishButtonDisabled: {
    backgroundColor: VibrantColors.textSecondary,
    shadowOpacity: 0,
    elevation: 0,
  },
  publishButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getSpacing('sm'),
  },
  publishButtonText: {
    color: VibrantColors.surface,
    fontSize: getFontSize('md'),
    fontWeight: '600',
  },
});