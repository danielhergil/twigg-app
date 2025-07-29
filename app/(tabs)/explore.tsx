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
} from 'react-native';
import { Search, Filter } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { getFontSize, getSpacing, isWeb, isDesktop } from '@/utils/responsive';
import { dummyCourses } from '@/data/dummyData';
import CourseCard from '@/components/CourseCard';

const { width } = Dimensions.get('window');

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Todos');

  const filters = ['Todos', 'Básico', 'Intermedio', 'Avanzado'];
  const categories = ['Programación', 'Diseño', 'Marketing', 'Data Science', 'Negocios'];

  const filteredCourses = dummyCourses.filter(course => {
    const matchesSearch = course.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
      style={[
        styles.filterButton,
        selectedFilter === filter && styles.filterButtonActive
      ]}
      onPress={() => setSelectedFilter(filter)}
    >
      <Text
        style={[
          styles.filterButtonText,
          selectedFilter === filter && styles.filterButtonTextActive
        ]}
      >
        {filter}
      </Text>
    </TouchableOpacity>
  );

  const renderWebLayout = () => (
    <View style={styles.webContainer}>
      <View style={styles.webSidebar}>
        <Text style={styles.webTitle}>Explorar Cursos</Text>
        
        <View style={styles.webSearchContainer}>
          <Search size={20} color={Colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.webSearchInput}
            placeholder="Buscar cursos..."
            placeholderTextColor={Colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.webSection}>
          <Text style={styles.webSectionTitle}>Categorías</Text>
          <View style={styles.webCategoriesGrid}>
            {categories.map((category) => (
              <CategoryCard key={category} category={category} />
            ))}
          </View>
        </View>

        <View style={styles.webSection}>
          <Text style={styles.webSectionTitle}>Filtrar por nivel</Text>
          <View style={styles.webFiltersGrid}>
            {filters.map((filter) => (
              <FilterButton key={filter} filter={filter} />
            ))}
          </View>
        </View>
      </View>

      <View style={styles.webMainContent}>
        <View style={styles.webResultsHeader}>
          <Text style={styles.webResultsTitle}>
            Resultados ({filteredCourses.length})
          </Text>
          <TouchableOpacity style={styles.webFilterIcon}>
            <Filter size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.webScrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.webCoursesGrid}>
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onPress={() => {}}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );

  const renderMobileLayout = () => (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categorías</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map((category) => (
            <CategoryCard key={category} category={category} />
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
          {filters.map((filter) => (
            <FilterButton key={filter} filter={filter} />
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Resultados ({filteredCourses.length})
        </Text>
        
        <View style={styles.coursesList}>
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onPress={() => {}}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explorar Cursos</Text>
        
        <View style={[styles.searchContainer, isWeb && isDesktop && { display: 'none' }]}>
          <Search size={20} color={Colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar cursos..."
            placeholderTextColor={Colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.filterIcon}>
            <Filter size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

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
  webTitle: {
    fontSize: getFontSize('xxl'),
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: getSpacing('xl'),
  },
  webSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    paddingHorizontal: getSpacing('md'),
    paddingVertical: getSpacing('sm'),
    marginBottom: getSpacing('xl'),
  },
  webSearchInput: {
    flex: 1,
    fontSize: getFontSize('md'),
    color: Colors.text,
    marginLeft: getSpacing('sm'),
  },
  webSection: {
    marginBottom: getSpacing('xl'),
  },
  webSectionTitle: {
    fontSize: getFontSize('lg'),
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: getSpacing('md'),
  },
  webCategoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: getSpacing('sm'),
  },
  webFiltersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: getSpacing('sm'),
  },
  webResultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: getSpacing('lg'),
  },
  webResultsTitle: {
    fontSize: getFontSize('xl'),
    fontWeight: 'bold',
    color: Colors.text,
  },
  webFilterIcon: {
    padding: getSpacing('sm'),
    borderRadius: 8,
    backgroundColor: Colors.backgroundSecondary,
  },
  webScrollView: {
    flex: 1,
  },
  webCoursesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: getSpacing('lg'),
  },
  // Mobile styles
  header: {
    backgroundColor: Colors.surface,
    padding: getSpacing('lg'),
    paddingBottom: getSpacing('md'),
    display: isWeb && isDesktop ? 'none' : 'flex',
  },
  title: {
    fontSize: getFontSize('xl'),
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: getSpacing('lg'),
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    paddingHorizontal: getSpacing('md'),
    paddingVertical: getSpacing('sm'),
  },
  searchIcon: {
    marginRight: getSpacing('sm'),
  },
  searchInput: {
    flex: 1,
    fontSize: getFontSize('md'),
    color: Colors.text,
  },
  filterIcon: {
    marginLeft: getSpacing('sm'),
  },
  scrollView: {
    flex: 1,
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
  categoriesContainer: {
    paddingHorizontal: getSpacing('lg'),
    gap: getSpacing('md'),
  },
  categoryCard: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    paddingHorizontal: getSpacing('lg'),
    paddingVertical: getSpacing('md'),
    minWidth: 120,
    alignItems: 'center',
  },
  categoryText: {
    color: Colors.white,
    fontSize: getFontSize('sm'),
    fontWeight: '600',
  },
  filtersContainer: {
    paddingHorizontal: getSpacing('lg'),
    gap: getSpacing('sm'),
  },
  filterButton: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    paddingHorizontal: getSpacing('lg'),
    paddingVertical: getSpacing('sm'),
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterButtonText: {
    color: Colors.textSecondary,
    fontSize: getFontSize('sm'),
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: Colors.white,
  },
  coursesList: {
    paddingHorizontal: getSpacing('lg'),
    gap: getSpacing('md'),
  },
});