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
import { Settings, BookOpen, Star, Trophy, CreditCard as Edit, LogOut, ChevronRight } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { getFontSize, getSpacing, isWeb, isDesktop } from '@/utils/responsive';
import { dummyUser, dummyCourses } from '@/data/dummyData';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const createdCourses = dummyCourses.slice(0, 2); // Simulamos cursos creados por el usuario

  const StatItem = ({ icon: Icon, label, value, color }: any) => (
    <View style={styles.statItem}>
      <Icon size={24} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const MenuItem = ({ icon: Icon, title, subtitle, onPress }: any) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        <View style={styles.menuIconContainer}>
          <Icon size={20} color={Colors.primary} />
        </View>
        <View>
          <Text style={styles.menuItemTitle}>{title}</Text>
          {subtitle && <Text style={styles.menuItemSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <ChevronRight size={20} color={Colors.textLight} />
    </TouchableOpacity>
  );

  const CourseItem = ({ course }: any) => (
    <TouchableOpacity style={styles.courseItem}>
      <Image source={{ uri: course.thumbnail }} style={styles.courseThumbnail} />
      <View style={styles.courseInfo}>
        <Text style={styles.courseTitle} numberOfLines={2}>
          {course.courseTitle}
        </Text>
        <View style={styles.courseStats}>
          <View style={styles.courseStat}>
            <Star size={14} color={Colors.accent} fill={Colors.accent} />
            <Text style={styles.courseStatText}>{course.rating}</Text>
          </View>
          <Text style={styles.courseStatText}>
            {course.enrolledCount} estudiantes
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderWebLayout = () => (
    <View style={styles.webContainer}>
      <View style={styles.webSidebar}>
        <View style={styles.webProfileHeader}>
          <Image source={{ uri: dummyUser.avatar }} style={styles.webAvatar} />
          <Text style={styles.webUserName}>{dummyUser.name}</Text>
          <Text style={styles.webUserEmail}>{dummyUser.email}</Text>
          <TouchableOpacity style={styles.webEditButton}>
            <Edit size={16} color={Colors.primary} />
            <Text style={styles.webEditButtonText}>Editar Perfil</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.webStatsContainer}>
          <StatItem
            icon={BookOpen}
            label="Completados"
            value={dummyUser.coursesCompleted}
            color={Colors.success}
          />
          <StatItem
            icon={Trophy}
            label="Puntos"
            value={dummyUser.totalPoints}
            color={Colors.secondary}
          />
          <StatItem
            icon={Star}
            label="Creados"
            value={dummyUser.coursesCreated}
            color={Colors.accent}
          />
        </View>

        <View style={styles.webMenuSection}>
          <Text style={styles.webSectionTitle}>Configuración</Text>
          <View style={styles.webMenuList}>
            <MenuItem
              icon={Settings}
              title="Configuración"
              subtitle="Preferencias y notificaciones"
              onPress={() => {}}
            />
            <MenuItem
              icon={BookOpen}
              title="Mis Certificados"
              subtitle="Ver certificados obtenidos"
              onPress={() => {}}
            />
            <MenuItem
              icon={LogOut}
              title="Cerrar Sesión"
              onPress={() => {}}
            />
          </View>
        </View>
      </View>

      <View style={styles.webMainContent}>
        <ScrollView style={styles.webScrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.webSection}>
            <Text style={styles.webSectionTitle}>Mis Cursos Creados</Text>
            <View style={styles.webCoursesGrid}>
              {createdCourses.map((course) => (
                <View key={course.id} style={styles.webCourseCard}>
                  <Image source={{ uri: course.thumbnail }} style={styles.webCourseThumbnail} />
                  <View style={styles.webCourseInfo}>
                    <Text style={styles.webCourseTitle} numberOfLines={2}>
                      {course.courseTitle}
                    </Text>
                    <View style={styles.webCourseStats}>
                      <View style={styles.courseStat}>
                        <Star size={14} color={Colors.accent} fill={Colors.accent} />
                        <Text style={styles.courseStatText}>{course.rating}</Text>
                      </View>
                      <Text style={styles.courseStatText}>
                        {course.enrolledCount} estudiantes
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.webSection}>
            <Text style={styles.webSectionTitle}>Logros</Text>
            <View style={styles.webAchievementsGrid}>
              {dummyUser.achievements.map((achievement) => (
                <View key={achievement.id} style={styles.webAchievementCard}>
                  <Text style={styles.webAchievementIcon}>{achievement.icon}</Text>
                  <Text style={styles.webAchievementTitle}>{achievement.title}</Text>
                  <Text style={styles.webAchievementDescription}>
                    {achievement.description}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );

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
          <Edit size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <StatItem
          icon={BookOpen}
          label="Completados"
          value={dummyUser.coursesCompleted}
          color={Colors.success}
        />
        <StatItem
          icon={Trophy}
          label="Puntos"
          value={dummyUser.totalPoints}
          color={Colors.secondary}
        />
        <StatItem
          icon={Star}
          label="Creados"
          value={dummyUser.coursesCreated}
          color={Colors.accent}
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
            onPress={() => {}}
          />
          <MenuItem
            icon={BookOpen}
            title="Mis Certificados"
            subtitle="Ver certificados obtenidos"
            onPress={() => {}}
          />
          <MenuItem
            icon={LogOut}
            title="Cerrar Sesión"
            onPress={() => {}}
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
    backgroundColor: Colors.backgroundSecondary,
  },
  // Web-specific styles
  webContainer: {
    flex: 1,
    flexDirection: 'row',
    maxWidth: 1400,
    alignSelf: 'center',
    width: '100%',
  },
  webSidebar: {
    width: 350,
    backgroundColor: Colors.surface,
    padding: getSpacing('xl'),
    borderRightWidth: 1,
    borderRightColor: Colors.borderLight,
  },
  webMainContent: {
    flex: 1,
    padding: getSpacing('xl'),
  },
  webProfileHeader: {
    alignItems: 'center',
    marginBottom: getSpacing('xl'),
  },
  webAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: getSpacing('md'),
  },
  webUserName: {
    fontSize: getFontSize('xl'),
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: getSpacing('xs'),
  },
  webUserEmail: {
    fontSize: getFontSize('md'),
    color: Colors.textSecondary,
    marginBottom: getSpacing('lg'),
  },
  webEditButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getSpacing('sm'),
    paddingHorizontal: getSpacing('lg'),
    paddingVertical: getSpacing('sm'),
    borderRadius: 8,
    backgroundColor: Colors.backgroundSecondary,
  },
  webEditButtonText: {
    fontSize: getFontSize('sm'),
    color: Colors.primary,
    fontWeight: '500',
  },
  webStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: getSpacing('xl'),
    gap: getSpacing('sm'),
  },
  webMenuSection: {
    marginTop: getSpacing('lg'),
  },
  webScrollView: {
    flex: 1,
  },
  webSection: {
    marginBottom: getSpacing('xl'),
  },
  webSectionTitle: {
    fontSize: getFontSize('xl'),
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: getSpacing('lg'),
  },
  webCoursesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: getSpacing('lg'),
  },
  webCourseCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: getSpacing('md'),
    width: 280,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  webCourseThumbnail: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: getSpacing('md'),
  },
  webCourseInfo: {
    flex: 1,
  },
  webCourseTitle: {
    fontSize: getFontSize('md'),
    fontWeight: '600',
    color: Colors.text,
    marginBottom: getSpacing('sm'),
  },
  webCourseStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getSpacing('md'),
  },
  webAchievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: getSpacing('lg'),
  },
  webAchievementCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: getSpacing('lg'),
    width: 200,
    alignItems: 'center',
    textAlign: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  webAchievementIcon: {
    fontSize: getFontSize('xxl'),
    marginBottom: getSpacing('md'),
  },
  webAchievementTitle: {
    fontSize: getFontSize('md'),
    fontWeight: '600',
    color: Colors.text,
    marginBottom: getSpacing('sm'),
    textAlign: 'center',
  },
  webAchievementDescription: {
    fontSize: getFontSize('sm'),
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  webMenuList: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    overflow: 'hidden',
  },
  // Mobile styles
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: Colors.surface,
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
    color: Colors.text,
    marginBottom: getSpacing('xs'),
  },
  userEmail: {
    fontSize: getFontSize('sm'),
    color: Colors.textSecondary,
  },
  editButton: {
    padding: getSpacing('sm'),
    borderRadius: 8,
    backgroundColor: Colors.backgroundSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    marginTop: getSpacing('xs'),
    paddingVertical: getSpacing('lg'),
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: getFontSize('xl'),
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: getSpacing('sm'),
  },
  statLabel: {
    fontSize: getFontSize('sm'),
    color: Colors.textSecondary,
    marginTop: getSpacing('xs'),
  },
  section: {
    marginTop: getSpacing('lg'),
  },
  sectionTitle: {
    fontSize: getFontSize('lg'),
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: getSpacing('md'),
    paddingHorizontal: getSpacing('lg'),
  },
  coursesList: {
    paddingHorizontal: getSpacing('lg'),
    gap: getSpacing('md'),
  },
  courseItem: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: getSpacing('md'),
    flexDirection: 'row',
    alignItems: 'center',
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
    color: Colors.text,
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
    color: Colors.textSecondary,
  },
  achievementsList: {
    paddingHorizontal: getSpacing('lg'),
    gap: getSpacing('md'),
  },
  achievementItem: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: getSpacing('md'),
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementIcon: {
    fontSize: getFontSize('xl'),
    marginRight: getSpacing('md'),
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: getFontSize('md'),
    fontWeight: '600',
    color: Colors.text,
    marginBottom: getSpacing('xs'),
  },
  achievementDescription: {
    fontSize: getFontSize('sm'),
    color: Colors.textSecondary,
  },
  menuList: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    marginHorizontal: getSpacing('lg'),
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: getSpacing('md'),
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
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
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: getSpacing('md'),
  },
  menuItemTitle: {
    fontSize: getFontSize('md'),
    fontWeight: '500',
    color: Colors.text,
  },
  menuItemSubtitle: {
    fontSize: getFontSize('sm'),
    color: Colors.textSecondary,
    marginTop: 2,
  },
});