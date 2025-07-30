import { Tabs } from 'expo-router';
import { Chrome as Home, Search, Plus, User } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { getFontSize, isWeb, isDesktop } from '@/utils/responsive';
import { ViewStyle, TextStyle } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textLight,
        tabBarStyle: isWeb && isDesktop
          ? {
              display: 'none', // en web/desktop ocultamos el bottom‑tabs; asumimos que habrá sidebar/nav propio
            }
          : {
              backgroundColor: Colors.surface,
              borderTopWidth: 1,
              borderTopColor: Colors.borderLight,
              paddingBottom: 8,
              paddingTop: 8,
              height: 65,
            },
        tabBarLabelStyle: {
          fontSize: getFontSize('xs'),
          fontWeight: '500',
        } as TextStyle,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ size, color }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explorar',
          tabBarIcon: ({ size, color }) => <Search size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Crear',
          tabBarIcon: ({ size, color }) => <Plus size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ size, color }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
