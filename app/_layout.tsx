import { ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { ThemeProvider, useTheme } from '@/theme/theme-provider';
import { toNavigationTheme } from '@/theme/navigation-theme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <ThemeProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <RootNavigator />
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}

function RootNavigator() {
  const { scheme, colors } = useTheme();

  return (
    <NavigationThemeProvider value={toNavigationTheme(scheme, colors)}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.bg },
          headerTitleStyle: { color: colors.text, fontSize: 16 },
          headerTintColor: colors.brand,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.bg },
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="sample/[id]" options={{ title: 'サンプル' }} />
        <Stack.Screen name="reference/[slug]" options={{ title: 'リファレンス' }} />
      </Stack>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
    </NavigationThemeProvider>
  );
}
