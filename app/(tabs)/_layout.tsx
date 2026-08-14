import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Tabs } from 'expo-router';

import { useTheme } from '@/theme/theme-provider';

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.brand,
        tabBarInactiveTintColor: colors.textFaint,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        sceneStyle: { backgroundColor: colors.bg },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'ホーム',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="auto-awesome" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="samples"
        options={{
          title: 'サンプル',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="play-circle-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="references"
        options={{
          title: 'リファレンス',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="menu-book" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: '設定',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="tune" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
