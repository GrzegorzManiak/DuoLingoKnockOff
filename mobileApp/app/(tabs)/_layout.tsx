import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import {useLocalization} from "@/hooks/useLocalization";

function TabLayout() {
	const { t } = useLocalization();
	return (
	<Tabs
		screenOptions={{
			tabBarActiveTintColor: Colors['light'].tint,
			headerShown: false,
			tabBarButton: HapticTab,
			tabBarBackground: TabBarBackground,
			tabBarStyle: Platform.select({
				ios: {
					position: 'absolute',
				},
				default: {},
			}),
		}}>
			
		<Tabs.Screen
			name="index"
			options={{
				title: t('common.home'),
				tabBarIcon: ({ color }) => <IconSymbol size={28} name="book" color={color} />,
			}}
		/>

		<Tabs.Screen
			name="leaderboard"
			options={{
				title: t('common.leaderboard'),
				tabBarIcon: ({ color }) => <IconSymbol size={28} name="trophy.fill" color={color} />,
			}}
		/>

		<Tabs.Screen
			name="profile"
			options={{
				title: t('common.profile'),
				tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
			}}
		/>
	</Tabs>
  );
}

export default TabLayout;