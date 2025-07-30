// app/_layout.tsx
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native'; // Para un indicador de carga simple si es necesario

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  // Mostrar un cargador simple mientras se cargan las fuentes
  // o manejar el error de fuente si es crítico
  if (!fontsLoaded && !fontError) {
    // Puedes usar SplashScreen aquí si prefieres, o un componente simple
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#8b5cf6" /> 
        {/* O puedes seguir usando SplashScreen si prefieres */}
        {/* {SplashScreen.preventAutoHideAsync()} */}
        {/* {return null;} */}
      </View>
    );
  }

  return (
    <>
      {/* Stack gestionará la navegación basada en el estado de autenticación desde app/index */}
      <Stack screenOptions={{ headerShown: false }}>
        {/* app/index.tsx será la pantalla inicial y decidirá la navegación */}
        <Stack.Screen name="index" /> 
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}