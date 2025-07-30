// app/index.tsx
import { useEffect } from 'react';
import { SplashScreen, router } from 'expo-router'; // Importa SplashScreen si decides manejarlo aquí
import { auth } from '@/config/firebase'; // Importa tu instancia de auth
import { onAuthStateChanged } from 'firebase/auth';
import { View, ActivityIndicator } from 'react-native'; // Para un cargador mientras se verifica

// Opcional: Prevenir auto-ocultar si manejas el splash aquí
// SplashScreen.preventAutoHideAsync(); 

export default function AppEntry() {
  useEffect(() => {
    // Escuchar cambios en el estado de autenticación
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Opcional: Ocultar splash screen aquí si lo manejaste en _layout o aquí
      // SplashScreen.hideAsync(); 

      if (user) {
        // Usuario autenticado: navegar a las tabs
        router.replace('/(tabs)');
      } else {
        // Usuario no autenticado: navegar al login
        router.replace('/(auth)/login');
      }
    });

    // Limpiar el listener al desmontar
    return unsubscribe;
  }, []);

  // Mientras se verifica el estado, puedes mostrar un indicador de carga
  // o simplemente devolver null para mantener la pantalla en blanco/previa
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
       <ActivityIndicator size="large" color="#8b5cf6" />
    </View>
  );
  // O return null; si prefieres no mostrar nada
}
