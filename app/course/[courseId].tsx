import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  Image, 
  TextInput, 
  ActivityIndicator, 
  Dimensions 
} from 'react-native';
import { 
  Star, 
  ChevronLeft, 
  BookOpen, 
  Play, 
  MessageSquare, 
  Send 
} from 'lucide-react-native';
import { getFontSize, getSpacing, isWeb, isDesktop } from '@/utils/responsive';
import { router, useLocalSearchParams } from 'expo-router';
import { useUserProfile } from '@/utils/useUserProfile';
import { useCourses } from '@/hooks/useCourses';
import { Colors } from '@/constants/Colors';
import TwiggLogo from '@/assets/images/twigg_logo.png';
import { doc, getDoc, collection, addDoc, updateDoc, increment, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';

import { onAuthStateChanged } from 'firebase/auth';

const VibrantColors = Colors;

// Componente de estrella para rating
const RatingStar = ({ filled, onPress, size = 24 }: { filled: boolean; onPress?: () => void; size?: number }) => (
  <TouchableOpacity onPress={onPress} disabled={!onPress}>
    <Star 
      size={size} 
      color={filled ? VibrantColors.secondary : VibrantColors.textSecondary} 
      fill={filled ? VibrantColors.secondary : 'none'} 
    />
  </TouchableOpacity>
);

// Componente ReviewCard
const ReviewCard = ({ review }: { review: any }) => (
  <View style={styles.reviewCard}>
    <View style={styles.reviewHeader}>
      <Image source={{ uri: review.authorAvatar }} style={styles.reviewAvatar} />
      <View style={styles.reviewUserInfo}>
        <Text style={styles.reviewAuthor}>{review.authorName}</Text>
        <View style={styles.reviewStars}>
          {[...Array(10)].map((_, i) => (
            <RatingStar key={i} filled={i < review.rating} size={16} />
          ))}
        </View>
      </View>
    </View>
    <Text style={styles.reviewText}>{review.comment}</Text>
    <Text style={styles.reviewDate}>{review.date}</Text>
  </View>
);

// Componente principal
export default function CourseDetailScreen() {
  const rawCourseId = useLocalSearchParams().courseId;
  const courseId = Array.isArray(rawCourseId) 
    ? rawCourseId[0] 
    : rawCourseId ?? '';
  const { profile, enrollments, loading: userLoading } = useUserProfile();
  const { courses, loading: coursesLoading } = useCourses();
  const [reviews, setReviews] = useState<any[]>([]);
  const [userReview, setUserReview] = useState({ rating: 0, comment: '' });
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Buscar curso en la lista de cursos
  const course = courses.find(c => c.id === courseId);
  
  // Verificar si el usuario está inscrito
  const hasEnrolled = enrollments.some(e => e.courseId === courseId);

  // Obtener reviews del curso
  useEffect(() => {
    const fetchReviews = async () => {
      if (!courseId) return;
      
      try {
        const reviewsRef = collection(db, 'courses', courseId as string, 'reviews');
        const reviewsSnap = await getDocs(reviewsRef);
        const reviewsData = reviewsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setReviews(reviewsData);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchReviews();
  }, [courseId]);

  // Enviar review
  const submitReview = async () => {

    if (!courseId) return;
    
    if (!userReview.rating) {
        alert('Por favor, selecciona una puntuación');
        return;
    }
    if (!profile) {
        alert('Debes iniciar sesión para dejar una review');
        return;
    }
    if (!courseId) return;

    setIsSubmitting(true);
    try {
        // 1) Construyo el objeto review
        const newReview = {
        authorId: profile.id ?? profile.id,
        authorName: profile.name ?? '',
        authorAvatar: profile.avatar ?? '',
        rating: userReview.rating,
        comment: userReview.comment,
        date: new Date().toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        };

        // 2) Lo subo al sub‐collection
        await addDoc(collection(db, 'courses', courseId, 'reviews'), newReview);

        // 3) Recalculo sobre el array “final”:
        const updated = [...reviews, newReview];
        const total = updated.reduce((s, r) => s + r.rating, 0);
        const newAverage = parseFloat((total / updated.length).toFixed(2));
        // 4) Actualizo directamente el documento padre
        const courseRef = doc(db, 'courses', courseId);
        await updateDoc(courseRef, {
        rating: newAverage,
        // reviewCount: newCount,          // opción “manual”
        reviewCount: increment(1)         // opción con FieldValue.increment
        });

        // 5) Actualizo UI
        setReviews(updated);
        setUserReview({ rating: 0, comment: '' });
        alert('¡Gracias por tu reseña!');
    } catch (error) {
        console.error('Error al enviar/actualizar review:', error);
        alert('Error al enviar la reseña');
    } finally {
        setIsSubmitting(false);
    }
    };

  // Calcular nuevo rating
  const calculateNewRating = (existingReviews: any[], newRating: number) => {
    const allRatings = [...existingReviews.map(r => r.rating), newRating];
    const total = allRatings.reduce((sum, rating) => sum + rating, 0);
    return parseFloat((total / allRatings.length).toFixed(2));
  };

  // Actualizar rating del curso en Firestore
  const updateCourseRating = async (newRating: number) => {
    if (!courseId) return;
    
    try {
      const courseRef = doc(db, 'courses', courseId as string);
      await updateDoc(courseRef, {
        rating: newRating,
        reviewCount: reviews.length + 1
      });
    } catch (error) {
      console.error('Error updating course rating:', error);
    }
  };

  // Inscribirse al curso
  const enrollInCourse = async () => {
    if (!profile || !courseId) {
      router.push('/login');
      return;
    }
    
    try {
      await addDoc(collection(db, 'users', profile.id, 'enrollments'), {
        courseId,
        progress: 0,
        startedAt: new Date(),
        lastAccess: new Date()
      });
      alert('¡Inscrito correctamente!');
      // La inscripción se actualizará automáticamente a través del hook useUserProfile
    } catch (error) {
      console.error('Error enrolling in course:', error);
      alert('Error al inscribirse');
    }
  };

  const loading = coursesLoading || userLoading || loadingReviews;

  // Renderizado web
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
            <TouchableOpacity 
              style={styles.navItem}
              onPress={() => router.back()}
            >
              <ChevronLeft size={20} color={VibrantColors.textSecondary} />
              <Text style={styles.navLabel}>Volver</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <View style={styles.sidebarFooter}>
          <View style={styles.sidebarUser}>
            <Image
              source={{ uri: profile?.avatar || undefined }}
              style={styles.sidebarAvatar}
            />
            <View style={styles.sidebarText}>
              <Text style={styles.sidebarName}>
                {userLoading ? 'Cargando...' : profile?.name ?? 'Usuario'}
              </Text>
              <Text style={styles.sidebarEmail}>{profile?.email ?? ''}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.webMainContent} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" />
          </View>
        ) : course ? (
          <>
            {/* Banner del curso */}
            <View style={styles.courseHeader}>
              <Image 
                source={{ uri: course.thumbnail }} 
                style={styles.courseThumbnail} 
                resizeMode="cover" 
              />
              <View style={styles.courseHeaderContent}>
                <Text style={styles.courseTitle}>{course.courseTitle}</Text>
                <View style={styles.courseMeta}>
                  <View style={styles.courseRating}>
                    <Text style={styles.ratingText}>{course.rating?.toFixed(2) || 'Nuevo'}</Text>
                    <View style={styles.ratingStars}>
                      {[...Array(10)].map((_, i) => (
                        <RatingStar key={i} filled={i < Math.floor(course.rating || 0)} />
                      ))}
                    </View>
                    <Text style={styles.ratingCount}>({course.reviewCount || 0} reseñas)</Text>
                  </View>
                  <Text style={styles.courseLevel}>Nivel: {course.level || 'Básico'}</Text>
                  <Text style={styles.courseDuration}>Duración: {course.durationWeeks || 4} semanas</Text>
                </View>
                
                <TouchableOpacity 
                  style={[styles.enrollButton, hasEnrolled && styles.continueButton]}
                  onPress={hasEnrolled ? () => router.push(`/course/${courseId}/content`) : enrollInCourse}
                >
                  <Text style={styles.enrollButtonText}>
                    {hasEnrolled ? 'Continuar Curso' : 'Comenzar Curso'}
                  </Text>
                  <Play size={20} color={VibrantColors.surface} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Descripción del curso */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Descripción</Text>
              <Text style={styles.courseDescription}>{course.description}</Text>
            </View>

            {/* Reviews */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Reseñas</Text>
              
              {/* Formulario de review */}
              {profile && (
                <View style={styles.reviewForm}>
                  <Text style={styles.reviewFormTitle}>Deja tu reseña</Text>
                  <View style={styles.ratingInput}>
                    <Text style={styles.ratingLabel}>Puntuación:</Text>
                    <View style={styles.starsContainer}>
                      {[...Array(10)].map((_, i) => (
                        <RatingStar 
                          key={i} 
                          filled={i < userReview.rating} 
                          onPress={() => setUserReview({...userReview, rating: i + 1})} 
                        />
                      ))}
                    </View>
                    <Text style={styles.ratingValue}>{userReview.rating}/10</Text>
                  </View>
                  <TextInput
                    style={styles.commentInput}
                    placeholder="Escribe tu reseña aquí..."
                    placeholderTextColor={VibrantColors.textSecondary}
                    value={userReview.comment}
                    onChangeText={text => setUserReview({...userReview, comment: text})}
                    multiline
                    numberOfLines={4}
                  />
                  <TouchableOpacity 
                    style={styles.submitButton}
                    onPress={submitReview}
                    disabled={isSubmitting}
                  >
                    <Text style={styles.submitButtonText}>
                      {isSubmitting ? 'Enviando...' : 'Enviar Reseña'}
                    </Text>
                    <Send size={20} color={VibrantColors.surface} />
                  </TouchableOpacity>
                </View>
              )}
              
              {/* Lista de reviews */}
              <View style={styles.reviewsList}>
                {reviews.length > 0 ? (
                  reviews.map(review => (
                    <ReviewCard key={review.id} review={review} />
                  ))
                ) : (
                  <Text style={styles.noReviewsText}>Aún no hay reseñas para este curso</Text>
                )}
              </View>
            </View>
          </>
        ) : (
          <View style={styles.notFoundContainer}>
            <Text style={styles.notFoundText}>Curso no encontrado</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );

  // Renderizado móvil
  const renderMobileLayout = () => (
    <ScrollView style={styles.mobileScroll} showsVerticalScrollIndicator={false}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <ChevronLeft size={24} color={VibrantColors.text} />
      </TouchableOpacity>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      ) : course ? (
        <>
          {/* Banner del curso */}
          <View style={styles.courseHeaderMobile}>
            <Image 
              source={{ uri: course.thumbnail }} 
              style={styles.courseThumbnailMobile} 
              resizeMode="cover" 
            />
            <View style={styles.courseHeaderContentMobile}>
              <Text style={styles.courseTitleMobile}>{course.courseTitle}</Text>
              
              <View style={styles.courseMetaMobile}>
                <View style={styles.courseRatingMobile}>
                  <Text style={styles.ratingTextMobile}>{course.rating?.toFixed(2) || 'Nuevo'}</Text>
                  <View style={styles.ratingStarsMobile}>
                    {[...Array(10)].map((_, i) => (
                      <RatingStar key={i} filled={i < Math.floor(course.rating || 0)} size={18} />
                    ))}
                  </View>
                  <Text style={styles.ratingCountMobile}>({course.reviewCount || 0})</Text>
                </View>
                
                <Text style={styles.courseLevelMobile}>Nivel: {course.level || 'Básico'}</Text>
                <Text style={styles.courseDurationMobile}>Duración: {course.durationWeeks || 4} semanas</Text>
              </View>
              
              <TouchableOpacity 
                style={[styles.enrollButtonMobile, hasEnrolled && styles.continueButtonMobile]}
                onPress={hasEnrolled ? () => router.push(`/course/${courseId}/content`) : enrollInCourse}
              >
                <Text style={styles.enrollButtonTextMobile}>
                  {hasEnrolled ? 'Continuar' : 'Comenzar'}
                </Text>
                <Play size={18} color={VibrantColors.surface} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Descripción del curso */}
          <View style={styles.sectionMobile}>
            <Text style={styles.sectionTitleMobile}>Descripción</Text>
            <Text style={styles.courseDescriptionMobile}>{course.description}</Text>
          </View>

          {/* Reviews */}
          <View style={styles.sectionMobile}>
            <Text style={styles.sectionTitleMobile}>Reseñas</Text>
            
            {/* Formulario de review */}
            {profile && (
              <View style={styles.reviewFormMobile}>
                <Text style={styles.reviewFormTitleMobile}>Deja tu reseña</Text>
                <View style={styles.ratingInputMobile}>
                  <Text style={styles.ratingLabelMobile}>Puntuación:</Text>
                  <View style={styles.starsContainerMobile}>
                    {[...Array(10)].map((_, i) => (
                      <RatingStar 
                        key={i} 
                        filled={i < userReview.rating} 
                        onPress={() => setUserReview({...userReview, rating: i + 1})} 
                        size={20}
                      />
                    ))}
                  </View>
                  <Text style={styles.ratingValueMobile}>{userReview.rating}/10</Text>
                </View>
                <TextInput
                  style={styles.commentInputMobile}
                  placeholder="Escribe tu reseña aquí..."
                  placeholderTextColor={VibrantColors.textSecondary}
                  value={userReview.comment}
                  onChangeText={text => setUserReview({...userReview, comment: text})}
                  multiline
                  numberOfLines={3}
                />
                <TouchableOpacity 
                  style={styles.submitButtonMobile}
                  onPress={submitReview}
                  disabled={isSubmitting}
                >
                  <Text style={styles.submitButtonTextMobile}>
                    {isSubmitting ? 'Enviando...' : 'Enviar Reseña'}
                  </Text>
                  <Send size={18} color={VibrantColors.surface} />
                </TouchableOpacity>
              </View>
            )}
            
            {/* Lista de reviews */}
            <View style={styles.reviewsListMobile}>
              {reviews.length > 0 ? (
                reviews.map(review => (
                  <ReviewCard key={review.id} review={review} />
                ))
              ) : (
                <Text style={styles.noReviewsTextMobile}>Aún no hay reseñas</Text>
              )}
            </View>
          </View>
        </>
      ) : (
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>Curso no encontrado</Text>
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
    backgroundColor: VibrantColors.backgroundSecondary,
  },
  webSidebar: {
    width: 280,
    backgroundColor: VibrantColors.sidebarBackground,
    borderRightWidth: 1,
    borderRightColor: VibrantColors.borderLight,
  },
  webSidebarContent: {
    padding: 20,
  },
  webSidebarHeader: {
    marginBottom: 20,
  },
  sidebarLogoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sidebarLogo: {
    width: 60,
    height: 60,
  },
  sidebarTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: VibrantColors.primary,
  },
  navigationMenu: {
    gap: 8,
    marginBottom: 20,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 12,
  },
  navLabel: {
    fontSize: 16,
    color: VibrantColors.textSecondary,
    fontWeight: '500',
  },
  sidebarFooter: {
    borderTopWidth: 1,
    borderTopColor: VibrantColors.borderLight,
    padding: 16,
    backgroundColor: VibrantColors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sidebarUser: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
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
    fontSize: 14,
    fontWeight: '600',
    color: VibrantColors.text,
    marginBottom: 2,
  },
  sidebarEmail: {
    fontSize: 12,
    color: VibrantColors.textSecondary,
  },
  webMainContent: {
    flex: 1,
    padding: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
  },
  notFoundText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: VibrantColors.textSecondary,
  },
  courseHeader: {
    flexDirection: 'row',
    marginBottom: 32,
    backgroundColor: VibrantColors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: VibrantColors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  courseThumbnail: {
    width: '40%',
    height: 300,
  },
  courseHeaderContent: {
    flex: 1,
    padding: 24,
  },
  courseTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: VibrantColors.text,
    marginBottom: 16,
  },
  courseMeta: {
    marginBottom: 24,
  },
  courseRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingText: {
    fontSize: 24,
    fontWeight: '700',
    color: VibrantColors.secondary,
    marginRight: 12,
  },
  ratingStars: {
    flexDirection: 'row',
    marginRight: 12,
  },
  ratingCount: {
    fontSize: 16,
    color: VibrantColors.textSecondary,
  },
  courseLevel: {
    fontSize: 16,
    color: VibrantColors.text,
    marginBottom: 8,
  },
  courseDuration: {
    fontSize: 16,
    color: VibrantColors.text,
  },
  enrollButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: VibrantColors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginTop: 16,
  },
  continueButton: {
    backgroundColor: VibrantColors.success,
  },
  enrollButtonText: {
    color: VibrantColors.surface,
    fontSize: 18,
    fontWeight: '600',
    marginRight: 12,
  },
  section: {
    backgroundColor: VibrantColors.surface,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: VibrantColors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: VibrantColors.text,
    marginBottom: 16,
    borderBottomColor: VibrantColors.primary,
    borderBottomWidth: 2,
    paddingBottom: 8,
  },
  courseDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: VibrantColors.text,
  },
  reviewForm: {
    backgroundColor: VibrantColors.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  reviewFormTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: VibrantColors.text,
    marginBottom: 16,
  },
  ratingInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: VibrantColors.text,
    marginRight: 12,
    width: 100,
  },
  starsContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  ratingValue: {
    fontSize: 16,
    fontWeight: '600',
    color: VibrantColors.secondary,
    marginLeft: 12,
    width: 50,
  },
  commentInput: {
    backgroundColor: VibrantColors.surface,
    borderRadius: 12,
    padding: 16,
    minHeight: 120,
    fontSize: 16,
    color: VibrantColors.text,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: VibrantColors.borderLight,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: VibrantColors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignSelf: 'flex-end',
  },
  submitButtonText: {
    color: VibrantColors.surface,
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  reviewsList: {
    gap: 16,
  },
  reviewCard: {
    backgroundColor: VibrantColors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: VibrantColors.borderLight,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewUserInfo: {
    flex: 1,
  },
  reviewAuthor: {
    fontSize: 16,
    fontWeight: '600',
    color: VibrantColors.text,
    marginBottom: 4,
  },
  reviewStars: {
    flexDirection: 'row',
  },
  reviewText: {
    fontSize: 16,
    lineHeight: 24,
    color: VibrantColors.text,
    marginBottom: 8,
  },
  reviewDate: {
    fontSize: 14,
    color: VibrantColors.textSecondary,
    textAlign: 'right',
  },
  noReviewsText: {
    fontSize: 16,
    color: VibrantColors.textSecondary,
    textAlign: 'center',
    padding: 24,
  },
  
  // Mobile Layout
  mobileScroll: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 20,
    padding: 8,
  },
  courseHeaderMobile: {
    marginBottom: 24,
  },
  courseThumbnailMobile: {
    width: '100%',
    height: 200,
  },
  courseHeaderContentMobile: {
    padding: 16,
  },
  courseTitleMobile: {
    fontSize: 24,
    fontWeight: '800',
    color: VibrantColors.text,
    marginBottom: 12,
  },
  courseMetaMobile: {
    marginBottom: 16,
  },
  courseRatingMobile: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingTextMobile: {
    fontSize: 20,
    fontWeight: '700',
    color: VibrantColors.secondary,
    marginRight: 8,
  },
  ratingStarsMobile: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingCountMobile: {
    fontSize: 14,
    color: VibrantColors.textSecondary,
  },
  courseLevelMobile: {
    fontSize: 14,
    color: VibrantColors.text,
    marginBottom: 4,
  },
  courseDurationMobile: {
    fontSize: 14,
    color: VibrantColors.text,
  },
  enrollButtonMobile: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: VibrantColors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 12,
  },
  continueButtonMobile: {
    backgroundColor: VibrantColors.success,
  },
  enrollButtonTextMobile: {
    color: VibrantColors.surface,
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  sectionMobile: {
    backgroundColor: VibrantColors.surface,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitleMobile: {
    fontSize: 20,
    fontWeight: '700',
    color: VibrantColors.text,
    marginBottom: 12,
    borderBottomColor: VibrantColors.primary,
    borderBottomWidth: 2,
    paddingBottom: 6,
  },
  courseDescriptionMobile: {
    fontSize: 14,
    lineHeight: 22,
    color: VibrantColors.text,
  },
  reviewFormMobile: {
    backgroundColor: VibrantColors.backgroundSecondary,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  reviewFormTitleMobile: {
    fontSize: 16,
    fontWeight: '600',
    color: VibrantColors.text,
    marginBottom: 12,
  },
  ratingInputMobile: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingLabelMobile: {
    fontSize: 14,
    fontWeight: '500',
    color: VibrantColors.text,
    marginRight: 8,
    width: 80,
  },
  starsContainerMobile: {
    flexDirection: 'row',
    flex: 1,
    flexWrap: 'wrap',
  },
  ratingValueMobile: {
    fontSize: 14,
    fontWeight: '600',
    color: VibrantColors.secondary,
    marginLeft: 8,
  },
  commentInputMobile: {
    backgroundColor: VibrantColors.surface,
    borderRadius: 12,
    padding: 12,
    minHeight: 100,
    fontSize: 14,
    color: VibrantColors.text,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: VibrantColors.borderLight,
  },
  submitButtonMobile: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: VibrantColors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignSelf: 'flex-end',
  },
  submitButtonTextMobile: {
    color: VibrantColors.surface,
    fontSize: 14,
    fontWeight: '600',
    marginRight: 6,
  },
  reviewsListMobile: {
    gap: 12,
  },
  noReviewsTextMobile: {
    fontSize: 14,
    color: VibrantColors.textSecondary,
    textAlign: 'center',
    padding: 16,
  },
});