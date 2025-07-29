export interface Course {
  id: string;
  courseTitle: string;
  level: 'Básico' | 'Intermedio' | 'Avanzado';
  durationWeeks: number;
  description: string;
  author: string;
  rating: number;
  reviewCount: number;
  enrolledCount: number;
  progress?: number;
  thumbnail: string;
  modules: Module[];
}

export interface Module {
  moduleNumber: number;
  moduleTitle: string;
  weeks: number[];
  topics: Topic[];
  completed?: boolean;
}

export interface Topic {
  topicTitle: string;
  lessons: Lesson[];
  completed?: boolean;
}

export interface Lesson {
  lessonTitle: string;
  theory: string;
  tests: Test[];
  completed?: boolean;
}

export interface Test {
  question: string;
  options: string[];
  answer: string;
  solution: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  coursesCompleted: number;
  coursesInProgress: number;
  coursesCreated: number;
  totalPoints: number;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
}