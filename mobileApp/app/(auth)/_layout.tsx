import { Tabs } from 'expo-router';
import { Stack } from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

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
