import React, { useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { apiClient } from '@/utils/api';
import { useSession } from '@/hooks/useSession';
import { components } from '@/types';

type ChallengeDto = components['schemas']['ChallengeDto'];

function ChallengeIndexScreen() {
  const { challengeId, languageId } = useLocalSearchParams();
  const { getToken } = useSession();
  const router = useRouter();

  useEffect(() => {
    const getChallengeType = async () => {
      if (!challengeId || !languageId) return;
      try {
        const { data } = await apiClient.GET('/api/languages/{languageId}/Challenge/{challengeId}' as any, {
          params: { path: { languageId: Number(languageId), challengeId: Number(challengeId) } },
          headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        
        const type = (data as ChallengeDto)?.type;
        if (type !== undefined) {
          // Route to the appropriate challenge type screen
          switch (type) {
            case 0:
              router.replace('/multiple-choice' as any);
              break;
            case 1:
              router.replace('/fill-blanks' as any);
              break;
            case 2:
              router.replace('/conversation' as any);
              break;
            case 3:
              router.replace('/word-matching' as any);
              break;
            case 4:
              router.replace('/audio-challenge' as any);
              break;
            default:
              router.replace('/index' as any);
          }
        }
      } catch (err) {
        console.error('Error fetching challenge type:', err);
      }
    };

    getChallengeType();
  }, [challengeId, languageId, getToken, router]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <ActivityIndicator size="large" color="#58CC02" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChallengeIndexScreen;