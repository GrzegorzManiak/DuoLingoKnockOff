import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, Slot, SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import 'react-native-reanimated';
import { ActivityIndicator, View } from 'react-native';

import { useColorScheme } from '@/hooks/useColorScheme';
import { SessionProvider } from '@/contexts/SessionContext';
import { useSession } from '@/hooks/useSession';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function AppContent() {
  const colorScheme = useColorScheme();
  const { user, isLoading } = useSession();
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const router = useRouter();

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded && !isLoading) {
      SplashScreen.hideAsync();
    }
  }, [loaded, isLoading]);

  useEffect(() => {
    // Wait until loading fonts/session is complete
    if (isLoading || !loaded) {
      return;
    }

    // If the user is not signed in, redirect them to the login screen.
    if (!user) {
       // Using replace to prevent going back to the loading state/protected routes.
       router.replace('/login'); // Redirect to login screen
    } else {
      // If the user is signed in and perhaps on an auth screen like /login,
      // redirect them to the main app area.
      // You might need more sophisticated logic if you have specific deep links to handle.
      // Check if current route is one of the auth routes if needed.
       router.replace('/(tabs)'); // Redirect to main tabs
    }
  }, [user, isLoading, loaded, router]);

  // Show loading indicator while fonts or session are loading
  if (isLoading || !loaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Render the main navigator. Expo Router will handle rendering
  // the correct screen based on the route (`/login`, `/(tabs)`, etc.)
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* Define screens accessible when logged out */}
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        {/* Define screens accessible when logged in */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <SessionProvider>
      <AppContent />
    </SessionProvider>
  );
}
