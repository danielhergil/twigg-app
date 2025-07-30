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
} from 'react-native';
import {
  Trophy,
  BookOpen,
  Clock,
  Target,
  Award,
  TrendingUp,
  Calendar,
  Home,
  Compass,
  Plus,
  User,
  Settings,
  LogOut,
} from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { getFontSize, getSpacing, isWeb, isDesktop } from '@/utils/responsive';
import { dummyUser, myCourses, featuredCourses } from '@/data/dummyData';
import CourseCard from '@/components/CourseCard';
import TwiggLogo from '@/assets/images/twigg_logo.png';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  // --- Componentes Reutilizables ---
  const StatCard = ({ icon: Icon, title, value, color, description }: any) => (
    <View style={[styles.statCard, isWeb && isDesktop && styles.statCardWeb]}>
      <View style={[styles.statIconContainer, { backgroundColor: `${color}20` }]}>
        <Icon size={24} color={color} />
      </View>
      <View style={styles.statTextContainer}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
        {description && <Text style={styles.statDescription}>{description}</Text>}
      </View>
    </View>
  );

  const Achievement = ({ achievement }: any) => (
    <View style={styles.achievementItem}>
      <View style={[styles.achievementIconContainer, { backgroundColor: `${achievement.color}20` }]}>
        <Text style={[styles.achievementIcon, { color: achievement.color }]}>
          {achievement.icon}
        </Text>
      </View>
      <View style={styles.achievementText}>
        <Text style={styles.achievementTitle}>{achievement.title}</Text>
        <Text style={styles.achievementDescription}>{achievement.description}</Text>
      </View>
      <View style={styles.achievementPoints}>
        <Trophy size={16} color={Colors.secondary} />
        <Text style={styles.achievementPointsText}>{achievement.points} pts</Text>
      </View>
    </View>
  );

  const ProgressRing = ({ progress, size = 60, strokeWidth = 6 }: any) => (
    <View style={[styles.progressRingContainer, { width: size, height: size }]}>
      <svg width={size} height={size} style={styles.progressRingSvg}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - strokeWidth / 2}
          stroke={Colors.borderLight}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - strokeWidth / 2}
          stroke={Colors.primary}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={2 * Math.PI * (size / 2 - strokeWidth / 2)}
          strokeDashoffset={
            2 * Math.PI * (size / 2 - strokeWidth / 2) * (1 - progress / 100)
          }
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <View style={styles.progressRingTextContainer}>
        <Text style={styles.progressRingText}>{progress}%</Text>
      </View>
    </View>
  );

  // --- Secciones Principales ---
  const renderStatsSection = () => (
    <View style={styles.webSection}>
      <Text style={styles.webSectionTitle}>Estadísticas</Text>
      <View style={styles.statsGrid}>
        <StatCard
          icon={BookOpen}
          title="Completados"
          value={dummyUser.coursesCompleted}
          color={Colors.success}
          description="Cursos finalizados"
        />
        <StatCard
          icon={Clock}
          title="En progreso"
          value={dummyUser.coursesInProgress}
          color={Colors.primary}
          description="Cursos activos"
        />
        <StatCard
          icon={Target}
          title="Creados"
          value={dummyUser.coursesCreated}
          color={Colors.accent}
          description="Tus contribuciones"
        />
        <StatCard
          icon={Trophy}
          title="Puntos"
          value={dummyUser.totalPoints}
          color={Colors.secondary}
          description="Logros obtenidos"
        />
      </View>
    </View>
  );

  const renderCoursesSection = (title: string, courses: any[], showProgress = false) => (
    <View style={styles.webSection}>
      <Text style={styles.webSectionTitle}>{title}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.coursesList}
        style={isWeb && isDesktop ? styles.coursesListWeb : undefined}
      >
        {courses.map((course) => (
          <View key={course.id} style={styles.courseCardWrapper}>
            <CourseCard course={course} onPress={() => {}} showProgress={showProgress} />
          </View>
        ))}
      </ScrollView>
    </View>
  );

  const renderAchievementsSection = () => (
    <View style={styles.webSection}>
      <Text style={styles.webSectionTitle}>Tus Logros</Text>
      <View style={styles.achievementsList}>
        {dummyUser.achievements.slice(0, 3).map((a: any) => (
          <Achievement key={a.id} achievement={a} />
        ))}
      </View>
    </View>
  );

  // --- Menú de Navegación ---
  const NavigationItem = ({ icon: Icon, label, isActive = false }: any) => (
    <TouchableOpacity style={[styles.navItem, isActive && styles.navItemActive]}>
      <Icon size={20} color={isActive ? Colors.white : Colors.textSecondary} />
      <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>{label}</Text>
    </TouchableOpacity>
  );

  // --- Layout para Web/Desktop con Sidebar Scrollable ---
  const renderWeb = () => (
    <View style={styles.webContainer}>
      <View style={styles.webSidebar}>
        <ScrollView
          contentContainerStyle={styles.webSidebarContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Logo */}
          <View style={styles.webSidebarHeader}>
            <View style={styles.sidebarLogoContainer}>
              <Image source={TwiggLogo} style={styles.sidebarLogo} resizeMode="contain" />
              <Text style={styles.sidebarTitle}>Twigg</Text>
            </View>
          </View>

          {/* Navegación */}
          <View style={styles.navigationMenu}>
            <NavigationItem icon={Home} label="Inicio" isActive />
            <NavigationItem icon={Compass} label="Explorar" />
            <NavigationItem icon={BookOpen} label="Mis Cursos" />
            <NavigationItem icon={Plus} label="Crear Curso" />
            <NavigationItem icon={Award} label="Logros" />
            <NavigationItem icon={User} label="Perfil" />
            <NavigationItem icon={Settings} label="Configuración" />
          </View>
        </ScrollView>

        {/* Footer perfil/logout fijo */}
        <View style={styles.sidebarFooter}>
          <View style={styles.userInfo}>
            <View style={styles.userAvatar}>
              <Text style={styles.userInitials}>
                {dummyUser.name.split(' ').map((n) => n[0]).join('')}
              </Text>
            </View>
            <View style={styles.userText}>
              <Text style={styles.userName}>{dummyUser.name}</Text>
              <Text style={styles.userEmail}>{dummyUser.email}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.logoutButton}>
            <LogOut size={20} color={Colors.danger} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Contenido Principal */}
      <ScrollView style={styles.webMainContent} showsVerticalScrollIndicator={false}>
        <View style={styles.webHeaderContainer}>
          <View style={styles.webHeader}>
            <View>
              <Text style={styles.webGreeting}>¡Buenos días, {dummyUser.name}!</Text>
              <Text style={styles.webSubtitle}>Aquí tienes tu resumen de aprendizaje</Text>
            </View>
            <View style={styles.webHeaderActions}>
              <TouchableOpacity style={styles.notificationButton}>
                <Image source={{ uri: dummyUser.avatar }} style={styles.webAvatarWeb} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {renderStatsSection()}
        {renderCoursesSection('Mis Cursos en Progreso', myCourses, true)}
        {renderCoursesSection('Cursos Recomendados', featuredCourses)}
        {renderAchievementsSection()}
      </ScrollView>
    </View>
  );

  // --- Layout Mobile (sin cambios) ---
  const renderMobile = () => (
    <SafeAreaView style={styles.mobileContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.mobileHeader}>
          <View style={styles.mobileHeaderTop}>
            <Image source={TwiggLogo} style={styles.mobileLogo} resizeMode="contain" />
            <View style={styles.mobileHeaderActions}>
              <TouchableOpacity style={styles.notificationButton}>
                <View style={styles.notificationBadge} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.profileButton}>
                <Image source={{ uri: dummyUser.avatar }} style={styles.webAvatar} />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.mobileGreeting}>¡Hola, {dummyUser.name}!</Text>
          <Text style={styles.mobileSubtitle}>Continúa tu aprendizaje</Text>
        </View>

        <View style={styles.statsSection}>
          <View style={styles.sectionHeader}></View>
          <View style={styles.statsGrid}>
            <StatCard
              icon={BookOpen}
              title="Completados"
              value={dummyUser.coursesCompleted}
              color={Colors.success}
              description="Cursos finalizados"
            />
            <StatCard
              icon={Clock}
              title="En progreso"
              value={dummyUser.coursesInProgress}
              color={Colors.primary}
              description="Cursos activos"
            />
            <StatCard
              icon={Target}
              title="Creados"
              value={dummyUser.coursesCreated}
              color={Colors.accent}
              description="Tus contribuciones"
            />
            <StatCard
              icon={Trophy}
              title="Puntos"
              value={dummyUser.totalPoints}
              color={Colors.secondary}
              description="Logros obtenidos"
            />
          </View>
        </View>

        {renderCoursesSection('Mis Cursos en Progreso', myCourses, true)}
        {renderAchievementsSection()}
        {renderCoursesSection('Cursos Destacados', featuredCourses)}
      </ScrollView>
    </SafeAreaView>
  );

  return isWeb && isDesktop ? renderWeb() : renderMobile();
}

const styles = StyleSheet.create({
  // --- General ---
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },

  // --- Web / Desktop ---
  webContainer: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    maxWidth: 1600,
    alignSelf: 'center',
    backgroundColor: Colors.backgroundSecondary,
  },
  webSidebar: {
    width: 280,
    backgroundColor: 'rgba(139,92,246,0.05)',
    borderRightWidth: 1,
    borderRightColor: Colors.borderLight,
    // ya no justifyContent: space-between
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
    color: Colors.primary,
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
    backgroundColor: Colors.primary,
  },
  navLabel: {
    fontSize: getFontSize('sm'),
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  navLabelActive: {
    color: Colors.white,
    fontWeight: '600',
  },
  sidebarStats: {
    gap: getSpacing('md'),
    marginBottom: getSpacing('xl'),
  },
  sidebarStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getSpacing('sm'),
  },
  sidebarStatText: {
    fontSize: getFontSize('sm'),
    color: Colors.text,
  },
  sidebarSection: {
    marginBottom: getSpacing('xl'),
  },
  webSidebarSectionTitle: {
    fontSize: getFontSize('md'),
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: getSpacing('sm'),
  },
  weeklyProgressSidebar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getSpacing('md'),
  },
  recentAchievementsScroll: {
    // opcional, ajustar padding si necesario
  },
  recentAchievementWrapper: {
    marginRight: getSpacing('md'),
  },
  sidebarFooter: {
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    padding: getSpacing('md'),
    backgroundColor: Colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  webMainContent: {
    flex: 1,
    padding: getSpacing('xl'),
  },
  webHeaderContainer: {
    backgroundColor: 'rgba(139,92,246,0.1)',
    borderRadius: 16,
    marginBottom: getSpacing('xl'),
    padding: getSpacing('lg'),
  },
  webHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  webGreeting: {
    fontSize: getFontSize('xxl'),
    fontWeight: '800',
    color: Colors.text,
    marginBottom: getSpacing('xs'),
  },
  webSubtitle: {
    fontSize: getFontSize('md'),
    color: Colors.textSecondary,
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
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.danger,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitials: {
    color: Colors.white,
    fontWeight: '600',
  },

  // --- Secciones con cards blancas y sombra ---
  webSection: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: getSpacing('lg'),
    marginBottom: getSpacing('xl'),
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  webSectionTitle: {
    fontSize: getFontSize('lg'),
    fontWeight: '700',
    color: Colors.primary,
    borderBottomColor: Colors.primary,
    borderBottomWidth: 2,
    paddingBottom: getSpacing('xs'),
    marginBottom: getSpacing('md'),
    alignSelf: 'flex-start',
  },

  // --- Mobile (sin cambios) ---
  mobileContainer: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  mobileHeader: {
    backgroundColor: Colors.primary,
    padding: getSpacing('lg'),
    paddingTop: getSpacing('md'),
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  mobileHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: getSpacing('xs'),
  },
  mobileLogo: {
    width: 40,
    height: 40
  },
  mobileHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getSpacing('md'),
  },
  mobileGreeting: {
    fontSize: getFontSize('xl'),
    fontWeight: '700',
    color: Colors.white,
    marginBottom: getSpacing('xs'),
  },
  mobileSubtitle: {
    fontSize: getFontSize('md'),
    color: Colors.white,
  },
  webAvatar: {
    width: 60,
    height: 60,
    borderRadius: 50,
    marginBottom: getSpacing('md'),
    marginTop: 100,
    marginRight: 40
  },

  // --- Stats Section ---
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
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: getSpacing('md'),
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 150,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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
    color: Colors.text,
    marginBottom: 2,
  },
  statTitle: {
    fontSize: getFontSize('sm'),
    fontWeight: '600',
    color: Colors.text,
  },
  statDescription: {
    fontSize: getFontSize('xs'),
    color: Colors.textSecondary,
  },

  // --- Sections ---
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: getSpacing('md'),
    paddingHorizontal: getSpacing('sm'),
  },
  sectionTitle: {
    fontSize: getFontSize('lg'),
    fontWeight: '700',
    color: Colors.text,
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

  // --- Achievements ---
  achievementsList: {
    gap: getSpacing('md'),
    paddingHorizontal: getSpacing('sm'),
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: getSpacing('md'),
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
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
    color: Colors.text,
    marginBottom: 2,
  },
  achievementDescription: {
    fontSize: getFontSize('xs'),
    color: Colors.textSecondary,
  },
  achievementPoints: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  achievementPointsText: {
    fontSize: getFontSize('xs'),
    color: Colors.textSecondary,
    fontWeight: '500',
  },

  // --- Weekly Progress (Sidebar) ---
  weeklyProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getSpacing('md'),
    marginTop: getSpacing('sm'),
  },
  weeklyProgressText: {
    flex: 1,
  },
  weeklyProgressValue: {
    fontSize: getFontSize('lg'),
    fontWeight: '700',
    color: Colors.text,
  },
  weeklyProgressLabel: {
    fontSize: getFontSize('sm'),
    color: Colors.textSecondary,
  },

  // --- Progress Ring ---
  progressRingContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressRingSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  progressRingTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressRingText: {
    fontSize: getFontSize('sm'),
    fontWeight: '700',
    color: Colors.text,
  },

  // --- User Profile Section ---
  userProfileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: getSpacing('md'),
    backgroundColor: Colors.background,
    borderRadius: 16,
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
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInitials: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: getFontSize('sm'),
  },
  userText: {
    flex: 1,
  },
  userName: {
    fontSize: getFontSize('sm'),
    fontWeight: '600',
    color: Colors.text,
  },
  userEmail: {
    fontSize: getFontSize('xs'),
    color: Colors.textSecondary,
  },
  logoutButton: {
    padding: getSpacing('xs'),
  },
  webAvatarWeb: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: getSpacing('md'),
    marginTop: 50,
    marginRight: 40
  },
});
