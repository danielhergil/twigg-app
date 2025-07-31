// app/(tabs)/profile.tsx
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import {
  Settings,
  BookOpen,
  Star,
  Trophy,
  CreditCard as Edit,
  LogOut,
  ChevronRight,
  Home,
  Compass,
  Plus,
  Award,
  User,
} from 'lucide-react-native';
import { getFontSize, getSpacing, isWeb, isDesktop } from '@/utils/responsive';
import { dummyUser, dummyCourses } from '@/data/dummyData';
import TwiggLogo from '@/assets/images/twigg_logo.png';
import { router } from 'expo-router';
import { signOut } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { ensureGoogleSigninConfigured } from '@/utils/googleSignIn';

const { width } = Dimensions.get('window');

// --- Colores Vibrantes Personalizados (iguales a create.tsx) ---
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

const handleLogout = async () => {
  try {
    await signOut(auth);
    if (!isWeb) {
      ensureGoogleSigninConfigured();
      await GoogleSignin.signOut();
    }
    router.replace('/login');
  } catch (e: any) {
    console.error('Error al cerrar sesión:', e);
    alert('No se pudo cerrar sesión. Intenta de nuevo.');
  }
};

export default function ProfileScreen() {
  const createdCourses = dummyCourses.slice(0, 2); // Simulamos cursos creados por el usuario

  // --- StatItem Component - Styled like create.tsx ---
  const StatItem = ({ icon: Icon, label, value, color }: any) => (
    <View style={styles.statItem}>
      <Icon size={24} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  // --- MenuItem Component - Styled like create.tsx ---
  const MenuItem = ({ icon: Icon, title, subtitle, onPress }: any) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        <View style={styles.menuIconContainer}>
          <Icon size={20} color={VibrantColors.primary} />
        </View>
        <View>
          <Text style={styles.menuItemTitle}>{title}</Text>
          {subtitle && <Text style={styles.menuItemSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <ChevronRight size={20} color={VibrantColors.textSecondary} />
    </TouchableOpacity>
  );

  // --- CourseItem Component - Styled like create.tsx ---
  const CourseItem = ({ course }: any) => (
    <TouchableOpacity style={styles.courseItem}>
      <Image source={{ uri: course.thumbnail }} style={styles.courseThumbnail} resizeMode="cover" />
      <View style={styles.courseInfo}>
        <Text style={styles.courseTitle} numberOfLines={2}>
          {course.courseTitle}
        </Text>
        <View style={styles.courseStats}>
          <View style={styles.courseStat}>
            <Star size={14} color={VibrantColors.accent} fill={VibrantColors.accent} />
            <Text style={styles.courseStatText}>{course.rating}</Text>
          </View>
          <Text style={styles.courseStatText}>
            {course.enrolledCount} estudiantes
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // --- NavigationItem Component - Copied from create.tsx ---
  const NavigationItem = ({ icon: Icon, label, isActive = false, onPress }: any) => (
    <TouchableOpacity
      style={[styles.navItem, isActive && styles.navItemActive]}
      onPress={onPress}
    >
      <Icon size={20} color={isActive ? VibrantColors.surface : VibrantColors.textSecondary} />
      <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>{label}</Text>
    </TouchableOpacity>
  );

  // --- Web Layout - Incorporating Sidebar from create.tsx ---
  const renderWebLayout = () => (
    <View style={styles.webContainer}>
      {/* Sidebar - Copied exactly from create.tsx */}
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
            <NavigationItem icon={BookOpen} label="Mis Cursos" />
            <NavigationItem icon={Plus} label="Crear Curso" onPress={() => router.push('/create')} />
            <NavigationItem icon={Award} label="Logros"/>
            <NavigationItem icon={User} label="Perfil" isActive />
            <NavigationItem icon={Settings} label="Configuración"/>
          </View>
        </ScrollView>
        <View style={styles.sidebarFooter}>
          <View style={styles.sidebarUser}>
            <Image source={{ uri: dummyUser.avatar }} style={styles.sidebarAvatar} />
            <View style={styles.sidebarText}>
              <Text style={styles.sidebarName}>{dummyUser.name}</Text>
              <Text style={styles.sidebarEmail}>{dummyUser.email}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <LogOut size={20} color={VibrantColors.danger} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content - Redesigned for better web UX/UI, matching create.tsx style */}
      <ScrollView style={styles.webMainContent} showsVerticalScrollIndicator={false}>
        {/* Header - Styled like create.tsx */}
        <View style={[styles.webHeaderContainer, styles.webHeaderContainerCompact]}>
          <View style={styles.webHeader}>
            <View>
              <Text style={styles.webGreeting}>Mi Perfil</Text>
              <Text style={styles.webSubtitle}>Administra tu cuenta y tus cursos</Text>
            </View>
            <View style={styles.webHeaderActions}>
              <TouchableOpacity style={styles.notificationButton}>
                <Image source={{ uri: dummyUser.avatar }} style={styles.webAvatarWeb} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Profile Card */}
        <View style={[styles.webContentCard, styles.webContentCardCompact]}>
          <View style={styles.webProfileHeader}>
            <Image source={{ uri: dummyUser.avatar }} style={styles.webAvatarLarge} />
            <View style={styles.webUserInfo}>
              <Text style={styles.webUserName}>{dummyUser.name}</Text>
              <Text style={styles.webUserEmail}>{dummyUser.email}</Text>
              <TouchableOpacity style={styles.webEditButton}>
                <Edit size={16} color={VibrantColors.primary} />
                <Text style={styles.webEditButtonText}>Editar Perfil</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Stats - Styled like create.tsx */}
          <View style={styles.webStatsContainer}>
            <StatItem
              icon={BookOpen}
              label="Completados"
              value={dummyUser.coursesCompleted}
              color={VibrantColors.success}
            />
            <StatItem
              icon={Trophy}
              label="Puntos"
              value={dummyUser.totalPoints}
              color={VibrantColors.secondary}
            />
            <StatItem
              icon={Star}
              label="Creados"
              value={dummyUser.coursesCreated}
              color={VibrantColors.accent}
            />
          </View>
        </View>

        {/* Created Courses Section */}
        <View style={styles.webSection}>
          <Text style={styles.webSectionTitle}>Mis Cursos Creados</Text>
          <View style={styles.webCoursesList}>
            {createdCourses.map((course) => (
              <CourseItem key={course.id} course={course} />
            ))}
          </View>
        </View>

        {/* Achievements Section */}
        <View style={styles.webSection}>
          <Text style={styles.webSectionTitle}>Logros</Text>
          <View style={styles.webAchievementsList}>
            {dummyUser.achievements.map((achievement) => (
              <View key={achievement.id} style={styles.webAchievementItem}>
                <Text style={styles.webAchievementIcon}>{achievement.icon}</Text>
                <View style={styles.webAchievementInfo}>
                  <Text style={styles.webAchievementTitle}>{achievement.title}</Text>
                  <Text style={styles.webAchievementDescription}>
                    {achievement.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Menu Section */}
        <View style={[styles.webContentCard, styles.webContentCardCompact, styles.webMenuCard]}>
          <Text style={styles.webSectionTitle}>Configuración</Text>
          <View style={styles.webMenuList}>
            <MenuItem
              icon={Settings}
              title="Configuración"
              subtitle="Preferencias y notificaciones"
              onPress={() => router.push('/settings')}
            />
            <MenuItem
              icon={BookOpen} // You might want a specific certificate icon
              title="Mis Certificados"
              subtitle="Ver certificados obtenidos"
              onPress={() => {}} // Add navigation if needed
            />
            <MenuItem
              icon={LogOut}
              title="Cerrar Sesión"
              onPress={handleLogout}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );

  // --- Mobile Layout - Kept mostly as is, but updated styles ---
  const renderMobileLayout = () => (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.profileInfo}>
          <Image source={{ uri: dummyUser.avatar }} style={styles.avatar} />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{dummyUser.name}</Text>
            <Text style={styles.userEmail}>{dummyUser.email}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.editButton}>
          <Edit size={20} color={VibrantColors.primary} />
        </TouchableOpacity>
      </View>
      <View style={styles.statsContainer}>
        <StatItem
          icon={BookOpen}
          label="Completados"
          value={dummyUser.coursesCompleted}
          color={VibrantColors.success}
        />
        <StatItem
          icon={Trophy}
          label="Puntos"
          value={dummyUser.totalPoints}
          color={VibrantColors.secondary}
        />
        <StatItem
          icon={Star}
          label="Creados"
          value={dummyUser.coursesCreated}
          color={VibrantColors.accent}
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mis Cursos Creados</Text>
        <View style={styles.coursesList}>
          {createdCourses.map((course) => (
            <CourseItem key={course.id} course={course} />
          ))}
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Logros</Text>
        <View style={styles.achievementsList}>
          {dummyUser.achievements.map((achievement) => (
            <View key={achievement.id} style={styles.achievementItem}>
              <Text style={styles.achievementIcon}>{achievement.icon}</Text>
              <View style={styles.achievementInfo}>
                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                <Text style={styles.achievementDescription}>
                  {achievement.description}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Configuración</Text>
        <View style={styles.menuList}>
          <MenuItem
            icon={Settings}
            title="Configuración"
            subtitle="Preferencias y notificaciones"
            onPress={() => router.push('/settings')}
          />
          <MenuItem
            icon={BookOpen} // Certificate icon
            title="Mis Certificados"
            subtitle="Ver certificados obtenidos"
            onPress={() => {}} // Add navigation if needed
          />
          <MenuItem
            icon={LogOut}
            title="Cerrar Sesión"
            onPress={handleLogout}
          />
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
  // --- Web Layout Styles - Adapted from create.tsx ---
  webContainer: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    maxWidth: 1600,
    alignSelf: 'center',
    backgroundColor: VibrantColors.backgroundSecondary,
  },
  // Sidebar - Copied exactly from create.tsx
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
  sidebarUser: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: getSpacing('md'),
  },
  sidebarAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  sidebarText: {
    flex: 1,
  },
  sidebarName: {
    fontSize: getFontSize('sm'),
    fontWeight: '600',
    color: VibrantColors.text,
    marginBottom: 2,
  },
  sidebarEmail: {
    fontSize: getFontSize('xs'),
    color: VibrantColors.textSecondary,
  },
  // Main Content - Adapted from create.tsx
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
  // Content Card - Adapted from create.tsx
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
    padding: getSpacing('md'), // reducido
    shadowColor: VibrantColors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: VibrantColors.borderLight,
    marginBottom: getSpacing('lg'),
  },
  webMenuCard: {
    marginBottom: 0, // Override default margin for the last card
  },
  // --- Profile Specific Web Styles ---
  webProfileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: getSpacing('lg'),
  },
  webAvatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: getSpacing('lg'),
  },
  webUserInfo: {
    flex: 1,
  },
  webUserName: {
    fontSize: getFontSize('xl'),
    fontWeight: 'bold',
    color: VibrantColors.text,
    marginBottom: getSpacing('xs'),
  },
  webUserEmail: {
    fontSize: getFontSize('md'),
    color: VibrantColors.textSecondary,
    marginBottom: getSpacing('md'),
  },
  webEditButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getSpacing('sm'),
    paddingHorizontal: getSpacing('lg'),
    paddingVertical: getSpacing('sm'),
    borderRadius: 8,
    backgroundColor: VibrantColors.backgroundSecondary,
    alignSelf: 'flex-start', // Align to the left within the flex container
  },
  webEditButtonText: {
    fontSize: getFontSize('sm'),
    color: VibrantColors.primary,
    fontWeight: '500',
  },
  webStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Distribute stats evenly
    paddingVertical: getSpacing('md'),
    borderTopWidth: 1,
    borderTopColor: VibrantColors.borderLight,
  },
  webSection: {
    marginBottom: getSpacing('xl'),
  },
  webSectionTitle: {
    fontSize: getFontSize('lg'),
    fontWeight: 'bold',
    color: VibrantColors.text,
    marginBottom: getSpacing('md'),
  },
  webCoursesList: {
    gap: getSpacing('md'),
  },
  webAchievementsList: {
    gap: getSpacing('md'),
  },
  webAchievementItem: {
    backgroundColor: VibrantColors.surface,
    borderRadius: 12,
    padding: getSpacing('md'),
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: VibrantColors.borderLight,
  },
  webAchievementIcon: {
    fontSize: getFontSize('xl'),
    marginRight: getSpacing('md'),
    color: VibrantColors.primary, // Make icon stand out
  },
  webAchievementInfo: {
    flex: 1,
  },
  webAchievementTitle: {
    fontSize: getFontSize('md'),
    fontWeight: '600',
    color: VibrantColors.text,
    marginBottom: getSpacing('xs'),
  },
  webAchievementDescription: {
    fontSize: getFontSize('sm'),
    color: VibrantColors.textSecondary,
  },
  webMenuList: {
    // Style the menu list container if needed, or inherit from card
    overflow: 'hidden',
    borderRadius: 8, // Match card border radius
  },
  // --- Common Components Styled like create.tsx ---
  statItem: {
    alignItems: 'center',
    flex: 1, // Distribute equally in row
  },
  statValue: {
    fontSize: getFontSize('xl'),
    fontWeight: 'bold',
    color: VibrantColors.text,
    marginTop: getSpacing('sm'),
  },
  statLabel: {
    fontSize: getFontSize('sm'),
    color: VibrantColors.textSecondary,
    marginTop: getSpacing('xs'),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: getSpacing('md'),
    paddingHorizontal: getSpacing('md'),
    borderBottomWidth: 1,
    borderBottomColor: VibrantColors.borderLight,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: VibrantColors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: getSpacing('md'),
  },
  menuItemTitle: {
    fontSize: getFontSize('md'),
    fontWeight: '500',
    color: VibrantColors.text,
  },
  menuItemSubtitle: {
    fontSize: getFontSize('sm'),
    color: VibrantColors.textSecondary,
    marginTop: 2,
  },
  courseItem: {
    backgroundColor: VibrantColors.surface,
    borderRadius: 12,
    padding: getSpacing('md'),
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: VibrantColors.borderLight,
  },
  courseThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: getSpacing('md'),
  },
  courseInfo: {
    flex: 1,
  },
  courseTitle: {
    fontSize: getFontSize('md'),
    fontWeight: '600',
    color: VibrantColors.text,
    marginBottom: getSpacing('sm'),
  },
  courseStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getSpacing('md'),
  },
  courseStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  courseStatText: {
    fontSize: getFontSize('xs'),
    color: VibrantColors.textSecondary,
  },
  // --- Mobile Styles - Updated with VibrantColors ---
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: VibrantColors.surface,
    padding: getSpacing('lg'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: getSpacing('md'),
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: getFontSize('lg'),
    fontWeight: 'bold',
    color: VibrantColors.text,
    marginBottom: getSpacing('xs'),
  },
  userEmail: {
    fontSize: getFontSize('sm'),
    color: VibrantColors.textSecondary,
  },
  editButton: {
    padding: getSpacing('sm'),
    borderRadius: 8,
    backgroundColor: VibrantColors.backgroundSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: VibrantColors.surface,
    marginTop: getSpacing('xs'),
    paddingVertical: getSpacing('lg'),
    justifyContent: 'space-around',
  },
  section: {
    marginTop: getSpacing('lg'),
  },
  sectionTitle: {
    fontSize: getFontSize('lg'),
    fontWeight: 'bold',
    color: VibrantColors.text,
    marginBottom: getSpacing('md'),
    paddingHorizontal: getSpacing('lg'),
  },
  coursesList: {
    paddingHorizontal: getSpacing('lg'),
    gap: getSpacing('md'),
  },
  achievementsList: {
    paddingHorizontal: getSpacing('lg'),
    gap: getSpacing('md'),
  },
  achievementItem: {
    backgroundColor: VibrantColors.surface,
    borderRadius: 12,
    padding: getSpacing('md'),
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: VibrantColors.borderLight,
  },
  achievementIcon: {
    fontSize: getFontSize('xl'),
    marginRight: getSpacing('md'),
    color: VibrantColors.primary,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: getFontSize('md'),
    fontWeight: '600',
    color: VibrantColors.text,
    marginBottom: getSpacing('xs'),
  },
  achievementDescription: {
    fontSize: getFontSize('sm'),
    color: VibrantColors.textSecondary,
  },
  menuList: {
    backgroundColor: VibrantColors.surface,
    borderRadius: 12,
    marginHorizontal: getSpacing('lg'),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: VibrantColors.borderLight,
  },
});