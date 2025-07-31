// app/(tabs)/explore.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import {
  Search,
  Filter,
  Compass,
  Home,
  BookOpen,
  Plus,
  Award,
  User,
  Settings,
  LogOut,
} from 'lucide-react-native';
import { getFontSize, getSpacing, isWeb, isDesktop } from '@/utils/responsive';
import { dummyCourses, dummyUser } from '@/data/dummyData';
import CourseCard from '@/components/CourseCard';
import { Colors } from '@/constants/Colors';
import TwiggLogo from '@/assets/images/twigg_logo.png';
import { signOut } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { router } from 'expo-router';

const { width: screenWidth } = Dimensions.get('window');

// --- Colores Vibrantes Personalizados (iguales a dashboard) ---
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

const filters = ['Todos', 'Básico', 'Intermedio', 'Avanzado'];
const categories = ['Programación', 'Diseño', 'Marketing', 'Data Science', 'Negocios'];

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

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Todos');
  
  const filteredCourses = dummyCourses.filter((course) => {
    const matchesSearch =
      course.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'Todos' || course.level === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const CategoryCard = ({ category }: { category: string }) => (
    <TouchableOpacity style={styles.categoryCard}>
      <Text style={styles.categoryText}>{category}</Text>
    </TouchableOpacity>
  );

  const FilterButton = ({ filter }: { filter: string }) => (
    <TouchableOpacity
      style={[styles.filterButton, selectedFilter === filter && styles.filterButtonActive]}
      onPress={() => setSelectedFilter(filter)}
    >
      <Text
        style={[
          styles.filterButtonText,
          selectedFilter === filter && styles.filterButtonTextActive,
        ]}
      >
        {filter}
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

  const renderWebLayout = () => (
    <View style={styles.webContainer}>
      {/* Sidebar - Copiada exactamente de index.tsx */}
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
            <NavigationItem icon={Compass} label="Explorar" isActive />
            <NavigationItem icon={BookOpen} label="Mis Cursos" onPress={() => router.push('/my-courses')} />
            <NavigationItem icon={Plus} label="Crear Curso" onPress={() => router.push('/create')} />
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
          <TouchableOpacity style={styles.logoutButton}>
            <LogOut size={20} color={VibrantColors.danger} onPress={handleLogout} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content - Rediseñado con mejor UX/UI */}
      <ScrollView style={styles.webMainContent} showsVerticalScrollIndicator={false}>
        <View style={styles.webHeaderContainer}>
          <View style={styles.webHeader}>
            <View>
              <Text style={styles.webGreeting}>Explorar Cursos</Text>
              <Text style={styles.webSubtitle}>Descubre nuevos conocimientos</Text>
            </View>
            <View style={styles.webHeaderActions}>
              <TouchableOpacity style={styles.notificationButton}>
                <Image source={{ uri: dummyUser.avatar }} style={styles.webAvatarWeb} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Barra de búsqueda y filtros mejorada */}
        <View style={styles.webSearchAndFiltersSection}>
          <View style={styles.searchContainer}>
            <Search size={20} color={VibrantColors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar cursos, temas o instructores..."
              placeholderTextColor={VibrantColors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <View style={styles.filtersContainer}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filtersScrollContent}
            >
              {filters.map((f) => (
                <FilterButton key={f} filter={f} />
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Categorías */}
        <View style={styles.webSection}>
          <Text style={styles.webSectionTitle}>Categorías Populares</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((c) => (
              <CategoryCard key={c} category={c} />
            ))}
          </View>
        </View>

        {/* Resultados */}
        <View style={styles.webSection}>
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsTitle}>Resultados de búsqueda</Text>
            <Text style={styles.resultsCount}>({filteredCourses.length} cursos encontrados)</Text>
          </View>
          
          {filteredCourses.length === 0 ? (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>No se encontraron cursos que coincidan con tu búsqueda</Text>
            </View>
          ) : (
            <View style={styles.cardsGrid}>
              {filteredCourses.map((course) => (
                <View key={course.id} style={styles.courseCardWrapper}>
                  <CourseCard course={course} onPress={() => {}} />
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );

  const renderMobileLayout = () => (
    <ScrollView style={styles.mobileScroll} showsVerticalScrollIndicator={false}>
      <View style={styles.mobileSearchHeader}>
        <Text style={styles.mobileTitle}>Explorar Cursos</Text>
        <View style={styles.searchContainer}>
          <Search size={20} color={VibrantColors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar cursos..."
            placeholderTextColor={VibrantColors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.mobileFilterIcon}>
            <Filter size={20} color={VibrantColors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categorías</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map((c) => (
            <CategoryCard key={c} category={c} />
          ))}
        </ScrollView>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Filtrar por nivel</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
        >
          {filters.map((f) => (
            <FilterButton key={f} filter={f} />
          ))}
        </ScrollView>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resultados ({filteredCourses.length})</Text>
        <View style={styles.mobileCoursesList}>
          {filteredCourses.map((course) => (
            <View
              key={course.id}
              style={{
                width: '100%',
                alignItems: 'center',
                marginBottom: getSpacing('md'),
              }}
            >
              <CourseCard course={course} onPress={() => {}} />
            </View>
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
  // Sidebar - Estilos copiados de index.tsx
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
    marginTop: 30
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
  // Search and Filters Section - Nuevo diseño
  webSearchAndFiltersSection: {
    backgroundColor: VibrantColors.surface,
    borderRadius: 12,
    padding: getSpacing('md'), // antes 'lg'
    marginBottom: getSpacing('lg'),
    shadowColor: VibrantColors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: VibrantColors.borderLight,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: VibrantColors.backgroundSecondary,
    borderRadius: 12,
    paddingHorizontal: getSpacing('sm'), // más estrecho
    paddingVertical: getSpacing('xs'), // menos alto
    marginBottom: getSpacing('sm'),
  },
  searchInput: {
    flex: 1,
    fontSize: getFontSize('md'),
    color: VibrantColors.text,
    marginLeft: getSpacing('xs'), // un poco menos espacio
  },
  filtersContainer: {
    flexDirection: 'row',
  },
  filtersScrollContent: {
    alignItems: 'center',
    gap: getSpacing('xs'), // menos separación
  },
  // Section Styles (copiados de index.tsx)
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
  // Categories
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: getSpacing('sm'),
  },
  categoryCard: {
    backgroundColor: VibrantColors.primary,
    borderRadius: 20,
    paddingHorizontal: getSpacing('lg'),
    paddingVertical: getSpacing('md'),
    minWidth: 120,
    alignItems: 'center',
    marginRight: getSpacing('sm'),
  },
  categoryText: {
    color: VibrantColors.surface,
    fontSize: getFontSize('sm'),
    fontWeight: '600',
  },
  // Results
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: getSpacing('lg'),
    gap: getSpacing('sm'),
  },
  resultsTitle: {
    fontSize: getFontSize('lg'),
    fontWeight: '700',
    color: VibrantColors.text,
  },
  resultsCount: {
    fontSize: getFontSize('sm'),
    color: VibrantColors.textSecondary,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: getSpacing('lg'),
  },
  courseCardWrapper: {
    marginRight: getSpacing('md'),
    marginBottom: getSpacing('lg'),
  },
  noResultsContainer: {
    padding: getSpacing('xl'),
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: getFontSize('md'),
    color: VibrantColors.textSecondary,
    textAlign: 'center',
  },
  // Filter Buttons (copiados de mobile)
  filterButton: {
    backgroundColor: VibrantColors.surface,
    borderRadius: 20,
    paddingHorizontal: getSpacing('sm'), // antes 'lg'
    paddingVertical: 6, // más compacto que antes
    borderWidth: 1,
    borderColor: VibrantColors.borderLight,
    marginRight: getSpacing('sm'),
  },
  filterButtonActive: {
    backgroundColor: VibrantColors.primary,
    borderColor: VibrantColors.primary,
  },
  filterButtonText: {
    color: VibrantColors.textSecondary,
    fontSize: getFontSize('sm'),
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: VibrantColors.surface,
  },
  // Mobile (mantenido igual)
  mobileScroll: {
    flex: 1,
  },
  mobileSearchHeader: {
    padding: getSpacing('lg'),
    backgroundColor: VibrantColors.surface,
    marginBottom: getSpacing('md'),
    borderBottomWidth: 1,
    borderBottomColor: VibrantColors.borderLight,
  },
  mobileTitle: {
    fontSize: getFontSize('xl'),
    fontWeight: '700',
    color: VibrantColors.text,
    marginBottom: getSpacing('md'),
  },
  mobileFilterIcon: {
    marginLeft: getSpacing('sm'),
  },
  section: {
    marginBottom: getSpacing('xl'),
  },
  sectionTitle: {
    fontSize: getFontSize('lg'),
    fontWeight: '700',
    color: VibrantColors.text,
    marginBottom: getSpacing('md'),
    paddingHorizontal: getSpacing('lg'),
  },
  categoriesContainer: {
    paddingHorizontal: getSpacing('lg'),
    flexDirection: 'row',
    gap: getSpacing('md'),
  },
  filtersContainer: {
    paddingHorizontal: getSpacing('lg'),
    flexDirection: 'row',
    gap: getSpacing('sm'),
  },
  mobileCoursesList: {
    paddingHorizontal: getSpacing('lg'),
    alignItems: 'center',
  },
});