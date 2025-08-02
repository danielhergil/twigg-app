// hooks/useUserProfile.ts
import { useEffect, useState } from 'react';
import {
  doc,
  getDoc,
  collection,
  query,
  getDocs,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { auth, db } from '@/config/firebase';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
}

export interface Enrollment {
  courseId: string;
  progress: number;
  startedAt: Date;
  lastAccess: Date;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  totalPoints: number;
  coursesCompleted: number;
  coursesInProgress: number;
  coursesCreated: number;
}

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const uid = user.uid;
    let unsubAchievements: Unsubscribe | null = null;
    let unsubEnrollments: Unsubscribe | null = null;

    const fetch = async () => {
      // Perfil
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setProfile({
          name: data.name || '',
          email: data.email || '',
          avatar: data.avatar || '',
          totalPoints: data.totalPoints ?? 0,
          coursesCompleted: data.coursesCompleted ?? 0,
          coursesInProgress: data.coursesInProgress ?? 0,
          coursesCreated: data.coursesCreated ?? 0,
        });
      }

      // Logros: suscripción en tiempo real
      const achQuery = collection(db, 'users', uid, 'achievements');
      unsubAchievements = onSnapshot(achQuery, (snap) => {
        const arr: Achievement[] = [];
        snap.docs.forEach((d) => {
          const docData = d.data();
          arr.push({
            id: d.id,
            title: docData.title,
            description: docData.description,
            icon: docData.icon,
            unlockedAt: docData.unlockedAt?.toDate ? docData.unlockedAt.toDate() : new Date(),
          });
        });
        setAchievements(arr);
      });

      // Enrollments
      const enrQuery = collection(db, 'users', uid, 'enrollments');
      unsubEnrollments = onSnapshot(enrQuery, (snap) => {
        const arr: Enrollment[] = [];
        snap.docs.forEach((d) => {
          const docData = d.data();
          arr.push({
            courseId: docData.courseId,
            progress: docData.progress ?? 0,
            startedAt: docData.startedAt?.toDate ? docData.startedAt.toDate() : new Date(),
            lastAccess: docData.lastAccess?.toDate ? docData.lastAccess.toDate() : new Date(),
          });
        });
        setEnrollments(arr);
      });

      setLoading(false);
    };

    fetch().catch(console.error);

    return () => {
      if (unsubAchievements) unsubAchievements();
      if (unsubEnrollments) unsubEnrollments();
    };
  }, [user]);

  return { profile, achievements, enrollments, loading };
};
