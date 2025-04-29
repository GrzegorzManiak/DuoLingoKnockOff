import { Stack } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import LanguageSelector from '@/components/ui/LanguageSelector';

function TabLayout() {
	return (
		<Stack screenOptions={{
			headerShown: true,
			headerTintColor: 'transparent',
			headerShadowVisible: false,
			headerTitle: '',
			headerTransparent: true,
			headerRight: () => (
				<View>
					<LanguageSelector />
				</View>
			),
		}}>
			<Stack.Screen name="index" />
			<Stack.Screen name="login" />
			<Stack.Screen name="register" />
		</Stack>
	);
}

export default TabLayout;
