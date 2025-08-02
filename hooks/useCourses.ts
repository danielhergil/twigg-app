// hooks/useCourses.ts
import { useEffect, useState } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '@/config/firebase';

export interface Course {
  id: string;
  courseTitle: string;
  level: string;
  durationWeeks: number;
  description: string;
  author: string;
  rating: number;
  reviewCount: number;
  enrolledCount: number;
  thumbnail: string;
  // puedes tipar más profundamente modules si los necesitas
}

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const q = query(collection(db, 'courses'));
      const snap = await getDocs(q);
      const arr: Course[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      }));
      setCourses(arr);
      setLoading(false);
    };
    fetch().catch(console.error);
  }, []);

  return { courses, loading };
};
