import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { Star, Clock, Users } from 'lucide-react-native';
import { Course } from '@/types/course';
import { Colors } from '@/constants/Colors';
import { getFontSize, getSpacing, isWeb, isDesktop } from '@/utils/responsive';

interface CourseCardProps {
  course: Course;
  onPress: () => void;
  showProgress?: boolean;
}

export default function CourseCard({ course, onPress, showProgress = false }: CourseCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: course.thumbnail }} style={styles.thumbnail} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.level}>{course.level}</Text>
          <View style={styles.rating}>
            <Star size={12} color={Colors.accent} fill={Colors.accent} />
            <Text style={styles.ratingText}>{course.rating}</Text>
          </View>
        </View>
        
        <Text style={styles.title} numberOfLines={2}>
          {course.courseTitle}
        </Text>
        
        <Text style={styles.author}>Por {course.author}</Text>
        
        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <Clock size={14} color={Colors.textSecondary} />
            <Text style={styles.metaText}>{course.durationWeeks} sem</Text>
          </View>
          <View style={styles.metaItem}>
            <Users size={14} color={Colors.textSecondary} />
            <Text style={styles.metaText}>{course.enrolledCount}</Text>
          </View>
        </View>
        
        {showProgress && course.progress !== undefined && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[styles.progressFill, { width: `${course.progress}%` }]} 
              />
            </View>
            <Text style={styles.progressText}>{course.progress}%</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    width: isWeb && isDesktop ? 320 : '100%',
    marginBottom: getSpacing('md'),
  },
  thumbnail: {
    width: '100%',
    height: isWeb && isDesktop ? 180 : 160,
    resizeMode: 'cover',
  },
  content: {
    padding: getSpacing('md'),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: getSpacing('sm'),
  },
  level: {
    fontSize: getFontSize('xs'),
    fontWeight: '600',
    color: Colors.primary,
    backgroundColor: Colors.primaryLight + '20',
    paddingHorizontal: getSpacing('sm'),
    paddingVertical: getSpacing('xs'),
    borderRadius: 6,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: getFontSize('xs'),
    fontWeight: '600',
    color: Colors.text,
  },
  title: {
    fontSize: getFontSize('md'),
    fontWeight: '700',
    color: Colors.text,
    marginBottom: getSpacing('xs'),
    lineHeight: getFontSize('md') * 1.3,
  },
  author: {
    fontSize: getFontSize('sm'),
    color: Colors.textSecondary,
    marginBottom: getSpacing('md'),
  },
  meta: {
    flexDirection: 'row',
    gap: getSpacing('md'),
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: getFontSize('xs'),
    color: Colors.textSecondary,
  },
  progressContainer: {
    marginTop: getSpacing('md'),
    flexDirection: 'row',
    alignItems: 'center',
    gap: getSpacing('sm'),
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.borderLight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.secondary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: getFontSize('xs'),
    fontWeight: '600',
    color: Colors.secondary,
  },
});