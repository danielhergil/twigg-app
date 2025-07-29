import {Course, User, Achievement} from '@/types/course';

export const dummyUser: User = {
  id: '1',
  name: 'María González',
  email: 'maria@example.com',
  avatar: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=400',
  coursesCompleted: 12,
  coursesInProgress: 3,
  coursesCreated: 5,
  totalPoints: 2450,
  achievements: [
    {
      id: '1',
      title: 'Primer Curso Completado',
      description: 'Has completado tu primer curso',
      icon: '🎯',
      unlockedAt: new Date('2024-01-15')
    },
    {
      id: '2',
      title: 'Creador de Contenido',
      description: 'Has creado tu primer curso',
      icon: '✨',
      unlockedAt: new Date('2024-02-10')
    },
    {
      id: '3',
      title: 'Estudiante Dedicado',
      description: 'Has completado 10 cursos',
      icon: '📚',
      unlockedAt: new Date('2024-03-05')
    }
  ]
};

export const dummyCourses: Course[] = [
  {
    id: '1',
    courseTitle: 'Curso Básico de React Native (8 Semanas)',
    level: 'Básico',
    durationWeeks: 8,
    description: 'Este curso de 8 semanas está diseñado para principiantes sin experiencia previa en React Native.',
    author: 'Carlos Mendoza',
    rating: 4.8,
    reviewCount: 124,
    enrolledCount: 1250,
    progress: 65,
    thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800',
    modules: [
      {
        moduleNumber: 1,
        moduleTitle: 'Introducción a React Native',
        weeks: [1],
        topics: [
          {
            topicTitle: '¿Qué es React Native?',
            lessons: [
              {
                lessonTitle: 'Conceptos Básicos',
                theory: 'React Native es un framework...',
                tests: [
                  {
                    question: '¿Qué es React Native?',
                    options: ['Un framework web', 'Un framework móvil', 'Una librería'],
                    answer: 'Un framework móvil',
                    solution: 'React Native es un framework para desarrollo móvil'
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: '2',
    courseTitle: 'JavaScript Avanzado para Desarrolladores',
    level: 'Avanzado',
    durationWeeks: 12,
    description: 'Domina los conceptos avanzados de JavaScript incluyendo closures, prototypes y programación asíncrona.',
    author: 'Ana Rodríguez',
    rating: 4.9,
    reviewCount: 89,
    enrolledCount: 670,
    progress: 30,
    thumbnail: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=800',
    modules: []
  },
  {
    id: '3',
    courseTitle: 'Diseño UX/UI Desde Cero',
    level: 'Intermedio',
    durationWeeks: 6,
    description: 'Aprende los fundamentos del diseño de experiencia de usuario y interfaces modernas.',
    author: 'Luis Torres',
    rating: 4.7,
    reviewCount: 156,
    enrolledCount: 890,
    thumbnail: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
    modules: []
  },
  {
    id: '4',
    courseTitle: 'Python para Data Science',
    level: 'Intermedio',
    durationWeeks: 10,
    description: 'Conviértete en un científico de datos usando Python, pandas, numpy y matplotlib.',
    author: 'Dr. Elena Vargas',
    rating: 4.6,
    reviewCount: 201,
    enrolledCount: 1100,
    thumbnail: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800',
    modules: []
  }
];

export const featuredCourses = dummyCourses.slice(0, 3);
export const myCourses = dummyCourses.filter(course => course.progress !== undefined);