import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { Trophy, BookOpen, Clock, Target } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { getFontSize, getSpacing, isWeb, isDesktop } from '@/utils/responsive';
import { dummyUser, myCourses, featuredCourses } from '@/data/dummyData';
import CourseCard from '@/components/CourseCard';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const StatCard = ({ icon: Icon, title, value, color }: any) => (
    <View style={[styles.statCard, isWeb && isDesktop && styles.statCardWeb]}>
      <Icon size={24} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

  const Achievement = ({ achievement }: any) => (
    <View style={styles.achievementItem}>
      <Text style={styles.achievementIcon}>{achievement.icon}</Text>
      <View style={styles.achievementText}>
        <Text style={styles.achievementTitle}>{achievement.title}</Text>
        <Text style={styles.achievementDescription}>{achievement.description}</Text>
      </View>
    </View>
  );

  const renderWebLayout = () => (
    <View style={styles.webContainer}>
      <View style={styles.webSidebar}>
        <View style={styles.webHeader}>
          <Text style={styles.webGreeting}>¡Hola, {dummyUser.name}! 👋</Text>
          <Text style={styles.webSubtitle}>Continúa tu aprendizaje</Text>
        </View>

        <View style={styles.webStatsGrid}>
          <StatCard
            icon={BookOpen}
            title="Completados"
            value={dummyUser.coursesCompleted}
            color={Colors.success}
          />
          <StatCard
            icon={Clock}
            title="En progreso"
            value={dummyUser.coursesInProgress}
            color={Colors.primary}
          />
          <StatCard
            icon={Target}
            title="Creados"
            value={dummyUser.coursesCreated}
            color={Colors.accent}
          />
          <StatCard
            icon={Trophy}
            title="Puntos"
            value={dummyUser.totalPoints}
            color={Colors.secondary}
          />
        </View>

        <View style={styles.webSection}>
          <Text style={styles.webSectionTitle}>Logros Recientes</Text>
          <View style={styles.webAchievementsList}>
            {dummyUser.achievements.slice(0, 3).map((achievement) => (
              <Achievement key={achievement.id} achievement={achievement} />
            ))}
          </View>
        </View>
      </View>

      <View style={styles.webMainContent}>
        <View style={styles.webSection}>
          <Text style={styles.webSectionTitle}>Mis Cursos en Progreso</Text>
          <View style={styles.webCoursesGrid}>
            {myCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onPress={() => {}}
                showProgress
              />
            ))}
          </View>
        </View>

        <View style={styles.webSection}>
          <Text style={styles.webSectionTitle}>Cursos Destacados</Text>
          <View style={styles.webCoursesGrid}>
            {featuredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onPress={() => {}}
              />
            ))}
          </View>
        </View>
      </View>
    </View>
  );

  const renderMobileLayout = () => (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.greeting}>¡Hola, {dummyUser.name}! 👋</Text>
        <Text style={styles.subtitle}>Continúa tu aprendizaje</Text>
      </View>

      <View style={styles.statsContainer}>
        <StatCard
          icon={BookOpen}
          title="Completados"
          value={dummyUser.coursesCompleted}
          color={Colors.success}
        />
        <StatCard
          icon={Clock}
          title="En progreso"
          value={dummyUser.coursesInProgress}
          color={Colors.primary}
        />
        <StatCard
          icon={Target}
          title="Crear"
          value={dummyUser.coursesCreated}
          color={Colors.accent}
        />
        <StatCard
          icon={Trophy}
          title="Puntos"
          value={dummyUser.totalPoints}
          color={Colors.secondary}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mis Cursos en Progreso</Text>
        <View style={styles.coursesGrid}>
          {myCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onPress={() => {}}
              showProgress
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cursos Destacados</Text>
        <View style={styles.coursesGrid}>
          {featuredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onPress={() => {}}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Logros Recientes</Text>
        <View style={styles.achievementsList}>
          {dummyUser.achievements.slice(0, 3).map((achievement) => (
            <Achievement key={achievement.id} achievement={achievement} />
          ))}
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
  webHeader: {
    marginBottom: getSpacing('xl'),
  },
  webGreeting: {
    fontSize: getFontSize('xxl'),
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: getSpacing('sm'),
  },
  webSubtitle: {
    fontSize: getFontSize('lg'),
    color: Colors.textSecondary,
  },
  webStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: getSpacing('md'),
    marginBottom: getSpacing('xl'),
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
  webAchievementsList: {
    gap: getSpacing('md'),
  },
  // Mobile styles
  scrollView: {
    flex: 1,
  },
  header: {
    padding: getSpacing('lg'),
    backgroundColor: Colors.surface,
  },
  greeting: {
    fontSize: getFontSize('xl'),
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: getSpacing('xs'),
  },
  subtitle: {
    fontSize: getFontSize('md'),
    color: Colors.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: getSpacing('lg'),
    gap: getSpacing('md'),
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: getSpacing('md'),
    alignItems: 'center',
    flex: 1,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statCardWeb: {
    width: 150,
    flex: 0,
  },
  statValue: {
    fontSize: getFontSize('xl'),
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: getSpacing('sm'),
  },
  statTitle: {
    fontSize: getFontSize('sm'),
    color: Colors.textSecondary,
    marginTop: getSpacing('xs'),
    textAlign: 'center',
  },
  section: {
    marginBottom: getSpacing('lg'),
  },
  sectionTitle: {
    fontSize: getFontSize('lg'),
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: getSpacing('md'),
    paddingHorizontal: getSpacing('lg'),
  },
  coursesGrid: {
    paddingHorizontal: getSpacing('lg'),
    gap: getSpacing('md'),
  },
  achievementsList: {
    paddingHorizontal: getSpacing('lg'),
    gap: getSpacing('md'),
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: getSpacing('md'),
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  achievementIcon: {
    fontSize: getFontSize('xl'),
    marginRight: getSpacing('md'),
  },
  achievementText: {
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
});