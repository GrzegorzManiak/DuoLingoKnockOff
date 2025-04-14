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

SplashScreen.preventAutoHideAsync();

function AppContent() {
  const colorScheme = useColorScheme();
  const { user, isLoading } = useSession();
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const router = useRouter();

  // -- Error & splash screen handling 
  useEffect(() => { if (error) throw error }, [error]);
  useEffect(() => { if (loaded && !isLoading) SplashScreen.hideAsync() }, [loaded, isLoading]);

  // -- Logged in / logged out pages
  useEffect(() => {
    if (isLoading || !loaded) return;
    if (!user) router.replace('/(auth)');
    else router.replace('/(tabs)');
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
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />

        {/* Define screens accessible when logged in */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

// -- Wrap our whole app in the session provider
export default function RootLayout() {
  return (<SessionProvider><AppContent/></SessionProvider>);
}
