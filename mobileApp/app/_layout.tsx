import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, Slot, SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import 'react-native-reanimated';
import { ActivityIndicator, View } from 'react-native';

import { useColorScheme } from '@/hooks/useColorScheme';
import { SessionProvider } from '@/contexts/SessionContext';
import { LocalizationProvider } from '@/contexts/LocalizationContext';
import { useSession } from '@/hooks/useSession';
import { LearningLanguageProvider } from '@/contexts/LearningLanguageContext';

SplashScreen.preventAutoHideAsync();

function AppContent() {
	const router = useRouter();
	const colorScheme = useColorScheme();
	const { user, isLoading } = useSession();
	const [loaded, error] = useFonts({
		SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
	});

	// -- Error & splash screen handling 
	useEffect(() => { if (error) throw error }, [error]);
	useEffect(() => { if (loaded && !isLoading) SplashScreen.hideAsync() }, [loaded, isLoading]);

	// -- Logged in / logged out pages
	useEffect(() => {
		if (isLoading || !loaded) return;
		if (!user) router.replace('/(auth)');
		else router.replace('/(tabs)');
	}, [user, isLoading, loaded, router]);

	// -- Show loading indicator while everythin is loading
	if (isLoading || !loaded) return (
		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
			<ActivityIndicator size="large" />
		</View>
	);

	return (
	<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
		<Stack>
			<Stack.Screen name="(auth)" options={{ headerShown: false }} />
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
			<LocalizationProvider>
				<LearningLanguageProvider>
					<AppContent />
				</LearningLanguageProvider>
			</LocalizationProvider>
		</SessionProvider>
	);
}
