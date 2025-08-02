// app/(tabs)/index.tsx
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {
  Trophy,
  BookOpen,
  Clock,
  Target,
  Award,
  Home,
  Compass,
  Plus,
  User,
  Settings,
  LogOut,
} from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { getFontSize, getSpacing, isWeb, isDesktop } from '@/utils/responsive';
import CourseCard from '@/components/CourseCard';
import TwiggLogo from '@/assets/images/twigg_logo.png';
import { signOut } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { router } from 'expo-router';
import { useUserProfile } from '../../utils/useUserProfile';
import { useCourses } from '@/hooks/useCourses';

const { width } = Dimensions.get('window');

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

export default function DashboardScreen() {
  const { profile, achievements, enrollments, loading: userLoading } = useUserProfile();
  const { courses, loading: coursesLoading } = useCourses();

  // Derivar cursos en progreso a partir de enrollments y cursos cargados
  const myCoursesInProgress = enrollments
    .map((e) => {
      const course = courses.find((c) => c.id === e.courseId);
      if (!course) return null;
      return {
        ...course,
        progress: e.progress,
      };
    })
    .filter(Boolean) as any[];

  const featuredCourses = courses.slice(0, 3);

  const StatCard = ({ icon: Icon, title, value, color, description }: any) => (
    <View style={[styles.statCard, isWeb && isDesktop && styles.statCardWeb]}>
      <View style={[styles.statIconContainer, { backgroundColor: `${color}30` }]}>
        <Icon size={24} color={color} />
      </View>
      <View style={styles.statTextContainer}>
        <Text style={[styles.statValue, { color }]}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
        {description && <Text style={styles.statDescription}>{description}</Text>}
      </View>
    </View>
  );

  const Achievement = ({ achievement }: any) => (
    <View style={styles.achievementItem}>
      <View style={[styles.achievementIconContainer, { backgroundColor: `${achievement.color}30` }]}>
        <Text style={[styles.achievementIcon, { color: achievement.color }]}>
          {achievement.icon}
        </Text>
      </View>
      <View style={styles.achievementText}>
        <Text style={styles.achievementTitle}>{achievement.title}</Text>
        <Text style={styles.achievementDescription}>{achievement.description}</Text>
      </View>
      <View style={styles.achievementPoints}>
        <Trophy size={16} color={VibrantColors.secondary} />
        <Text style={styles.achievementPointsText}>
          {achievement.points ?? 0} pts
        </Text>
      </View>
    </View>
  );

  const renderStatsSection = () => (
    <View style={[styles.webSection, styles.statsSectionWeb]}>
      <Text style={styles.webSectionTitle}>Estadísticas</Text>
      <View style={styles.statsGrid}>
        <StatCard
          icon={BookOpen}
          title="Completados"
          value={userLoading ? <ActivityIndicator /> : profile?.coursesCompleted ?? 0}
          color={VibrantColors.success}
          description="Cursos finalizados"
        />
        <StatCard
          icon={Clock}
          title="En progreso"
          value={userLoading ? <ActivityIndicator /> : profile?.coursesInProgress ?? 0}
          color={VibrantColors.primary}
          description="Cursos activos"
        />
        <StatCard
          icon={Target}
          title="Creados"
          value={userLoading ? <ActivityIndicator /> : profile?.coursesCreated ?? 0}
          color={VibrantColors.accent}
          description="Tus contribuciones"
        />
        <StatCard
          icon={Trophy}
          title="Puntos"
          value={userLoading ? <ActivityIndicator /> : profile?.totalPoints ?? 0}
          color={VibrantColors.secondary}
          description="Logros obtenidos"
        />
      </View>
    </View>
  );

  const renderCoursesSection = (title: string, coursesToShow: any[], showProgress = false) => (
    <View style={styles.webSection}>
      <Text style={styles.webSectionTitle}>{title}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.coursesList}
        style={isWeb && isDesktop ? styles.coursesListWeb : undefined}
      >
        {coursesLoading ? (
          <View style={{ padding: 20 }}>
            <ActivityIndicator />
          </View>
        ) : coursesToShow.length === 0 ? (
          <View style={{ padding: 20 }}>
            <Text style={{ color: VibrantColors.textSecondary }}>No hay cursos para mostrar.</Text>
          </View>
        ) : (
          coursesToShow.map((course) => (
            <View key={course.id} style={styles.courseCardWrapper}>
              <CourseCard course={course} onPress={() => {}} showProgress={showProgress} />
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );

  const renderAchievementsSection = () => (
    <View style={styles.webSection}>
      <Text style={styles.webSectionTitle}>Tus Logros</Text>
      <View style={styles.achievementsList}>
        {userLoading ? (
          <ActivityIndicator />
        ) : achievements.length === 0 ? (
          <Text style={{ color: VibrantColors.textSecondary }}>
            Aún no tienes logros desbloqueados.
          </Text>
        ) : (
          achievements.slice(0, 3).map((a: any) => (
            <Achievement
              key={a.id}
              achievement={{
                ...a,
                color: VibrantColors.secondary,
                points: 0,
              }}
            />
          ))
        )}
      </View>
    </View>
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

  const renderWeb = () => (
    <View style={styles.webContainer}>
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
            <NavigationItem icon={Home} label="Inicio" isActive onPress={() => router.replace('/')} />
            <NavigationItem icon={Compass} label="Explorar" onPress={() => router.push('/explore')} />
            <NavigationItem icon={BookOpen} label="Mis Cursos" />
            <NavigationItem icon={Plus} label="Crear Curso" onPress={() => router.push('/create')} />
            <NavigationItem icon={Award} label="Logros" />
            <NavigationItem icon={User} label="Perfil" onPress={() => router.push('/profile')} />
            <NavigationItem icon={Settings} label="Configuración" />
          </View>
        </ScrollView>
        <View style={styles.sidebarFooter}>
          <View style={styles.userInfo}>
            <View style={styles.userAvatar}>
              <TouchableOpacity style={styles.profileButton}>
                <Image
                  source={{ uri: profile?.avatar || undefined }}
                  style={styles.webAvatarEmail}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.userText}>
              <Text style={styles.userName}>
                {userLoading ? 'Cargando...' : profile?.name ?? 'Usuario'}
              </Text>
              <Text style={styles.userEmail}>{profile?.email ?? ''}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color={VibrantColors.danger} />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.webMainContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.webHeaderContainer, styles.webHeaderContainerWeb]}>
          <View style={styles.webHeader}>
            <View>
              <Text style={styles.webGreeting}>
                {userLoading
                  ? 'Cargando...'
                  : profile
                  ? `¡Buenos días, ${profile.name}!`
                  : '¡Hola!'}
              </Text>
              <Text style={styles.webSubtitle}>
                Aquí tienes tu resumen de aprendizaje
              </Text>
            </View>
            <View style={styles.webHeaderActions}>
              <TouchableOpacity style={styles.notificationButton}>
                <Image
                  source={{ uri: profile?.avatar || undefined }}
                  style={styles.webAvatarWeb}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {renderStatsSection()}
        {renderCoursesSection('Mis Cursos en Progreso', myCoursesInProgress, true)}
        {renderCoursesSection('Cursos Recomendados', featuredCourses)}
        {renderAchievementsSection()}
      </ScrollView>
    </View>
  );

  const renderMobile = () => (
    <SafeAreaView style={styles.mobileContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.mobileHeader}>
          <View style={styles.mobileHeaderTop}>
            <TouchableOpacity style={styles.profileButton}>
              <Image
                source={{ uri: profile?.avatar || undefined }}
                style={styles.webAvatar}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.mobileGreeting}>
            {userLoading
              ? 'Cargando...'
              : profile
              ? `¡Hola, ${profile.name}!`
              : '¡Hola!'}
          </Text>
          <Text style={styles.mobileSubtitle}>Continúa tu aprendizaje</Text>
        </View>
        <View style={styles.statsSection}>
          <View style={styles.sectionHeader} />
          <View style={styles.statsGrid}>
            <StatCard
              icon={BookOpen}
              title="Completados"
              value={userLoading ? <ActivityIndicator /> : profile?.coursesCompleted ?? 0}
              color={VibrantColors.success}
              description="Cursos finalizados"
            />
            <StatCard
              icon={Clock}
              title="En progreso"
              value={userLoading ? <ActivityIndicator /> : profile?.coursesInProgress ?? 0}
              color={VibrantColors.primary}
              description="Cursos activos"
            />
            <StatCard
              icon={Target}
              title="Creados"
              value={userLoading ? <ActivityIndicator /> : profile?.coursesCreated ?? 0}
              color={VibrantColors.accent}
              description="Tus contribuciones"
            />
            <StatCard
              icon={Trophy}
              title="Puntos"
              value={userLoading ? <ActivityIndicator /> : profile?.totalPoints ?? 0}
              color={VibrantColors.secondary}
              description="Logros obtenidos"
            />
          </View>
        </View>
        {renderCoursesSection('Mis Cursos en Progreso', myCoursesInProgress, true)}
        {renderAchievementsSection()}
        {renderCoursesSection('Cursos Destacados', featuredCourses)}
      </ScrollView>
    </SafeAreaView>
  );

  return isWeb && isDesktop ? renderWeb() : renderMobile();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: VibrantColors.backgroundSecondary,
  },
  webContainer: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    maxWidth: 1600,
    alignSelf: 'center',
    backgroundColor: VibrantColors.backgroundSecondary,
  },
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
  webHeaderContainerWeb: {
    paddingVertical: getSpacing('md'),
    marginBottom: getSpacing('lg'),
  },
  statsSectionWeb: {
    paddingVertical: getSpacing('md'),
    marginBottom: getSpacing('lg'),
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
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  webSection: {
    backgroundColor: VibrantColors.surface,
    borderRadius: 12,
    padding: getSpacing('lg'),
    marginBottom: getSpacing('xl'),
    shadowColor: VibrantColors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: VibrantColors.borderLight,
  },
  webSectionTitle: {
    fontSize: getFontSize('lg'),
    fontWeight: '700',
    color: VibrantColors.primary,
    borderBottomColor: VibrantColors.primary,
    borderBottomWidth: 2,
    paddingBottom: getSpacing('xs'),
    marginBottom: getSpacing('md'),
    alignSelf: 'flex-start',
  },
  mobileContainer: {
    flex: 1,
    backgroundColor: VibrantColors.backgroundSecondary,
  },
  mobileHeader: {
    backgroundColor: VibrantColors.primary,
    padding: getSpacing('lg'),
    paddingTop: getSpacing('md'),
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  mobileHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginBottom: getSpacing('xs'),
  },
  mobileGreeting: {
    fontSize: getFontSize('xl'),
    fontWeight: '700',
    color: VibrantColors.surface,
    marginBottom: getSpacing('xs'),
  },
  mobileSubtitle: {
    fontSize: getFontSize('md'),
    color: VibrantColors.surface,
  },
  webAvatar: {
    width: 60,
    height: 60,
    borderRadius: 50,
    marginBottom: getSpacing('md'),
    marginTop: 100,
    marginRight: 40,
  },
  statsSection: {
    marginBottom: getSpacing('xl'),
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: getSpacing('md'),
    paddingHorizontal: getSpacing('sm'),
  },
  statCard: {
    backgroundColor: VibrantColors.surface,
    borderRadius: 16,
    padding: getSpacing('md'),
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 150,
    shadowColor: VibrantColors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: VibrantColors.borderLight,
  },
  statCardWeb: {
    flex: 1,
    minWidth: 160,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: getSpacing('md'),
  },
  statTextContainer: {
    flex: 1,
  },
  statValue: {
    fontSize: getFontSize('lg'),
    fontWeight: '700',
    color: VibrantColors.text,
    marginBottom: 2,
  },
  statTitle: {
    fontSize: getFontSize('sm'),
    fontWeight: '600',
    color: VibrantColors.text,
  },
  statDescription: {
    fontSize: getFontSize('xs'),
    color: VibrantColors.textSecondary,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: getSpacing('md'),
    paddingHorizontal: getSpacing('sm'),
  },
  coursesList: {
    paddingHorizontal: getSpacing('sm'),
    paddingVertical: getSpacing('xs'),
    alignItems: 'flex-start',
  },
  coursesListWeb: {
    paddingVertical: 0,
  },
  courseCardWrapper: {
    marginRight: getSpacing('md'),
  },
  achievementsList: {
    gap: getSpacing('md'),
    paddingHorizontal: getSpacing('sm'),
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: VibrantColors.surface,
    borderRadius: 16,
    padding: getSpacing('md'),
    shadowColor: VibrantColors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: VibrantColors.borderLight,
  },
  achievementIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: getSpacing('md'),
  },
  achievementIcon: {
    fontSize: getFontSize('md'),
    fontWeight: '600',
  },
  achievementText: {
    flex: 1,
    marginRight: getSpacing('sm'),
  },
  achievementTitle: {
    fontSize: getFontSize('sm'),
    fontWeight: '600',
    color: VibrantColors.text,
    marginBottom: 2,
  },
  achievementDescription: {
    fontSize: getFontSize('xs'),
    color: VibrantColors.textSecondary,
  },
  achievementPoints: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  achievementPointsText: {
    fontSize: getFontSize('xs'),
    color: VibrantColors.textSecondary,
    fontWeight: '500',
  },
  webAvatarWeb: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: getSpacing('md'),
    marginTop: 50,
    marginRight: 40,
  },
  webAvatarEmail: {
    width: 40,
    height: 40,
    borderRadius: 50,
    marginBottom: getSpacing('md'),
    marginTop: 30,
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
});
