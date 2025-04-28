import React from 'react';
import { Stack } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { apiClient } from '@/utils/api';
import { useSession } from '@/hooks/useSession';
import { components } from '@/types';

type ChallengeDto = components['schemas']['ChallengeDto'];

function ChallengesLayout() {
	const { challengeId, languageId } = useLocalSearchParams();
	const { getToken } = useSession();

	const getChallengeType = async () => {
		if (!challengeId || !languageId) return null;
		try {
			const { data } = await apiClient.GET('/api/languages/{languageId}/Challenge/{challengeId}', {
				params: { path: {	languageId: Number(languageId), challengeId: Number(challengeId) } },
				headers: { 'Authorization': `Bearer ${getToken()}` }
			});
			return (data as ChallengeDto)?.type;
		} 
		catch (err) {
			console.error('Error fetching challenge type:', err);
			return null;
		}
	};

	return (
		<Stack
			screenOptions={{
				headerShown: false,
				contentStyle: { backgroundColor: '#fff' },
				animation: 'slide_from_right',
			}}
		>
			<Stack.Screen
				name="index"
				options={{
					title: 'Challenge',
				}}
				listeners={{
					focus: async () => {
						const type = await getChallengeType();
						console.log('type', type);
						// Route to the appropriate challenge type screen
						switch (type) {
							case 0:
								return 'multiple-choice';
							case 1:
								return 'fill-blanks';
							case 2:
								return 'conversation';
							case 3:
								return 'word-matching';
							case 4:
								return 'audio-challenge';
							default:
								return 'index';
						}
						
					},
				}}
			/>
			<Stack.Screen
				name="multiple-choice"
				options={{
					title: 'Multiple Choice',
				}}
			/>
			<Stack.Screen
				name="fill-blanks"
				options={{
					title: 'Fill in the Blanks',
				}}
			/>
			<Stack.Screen
				name="conversation"
				options={{
					title: 'Conversation',
				}}
			/>
			<Stack.Screen
				name="word-matching"
				options={{
					title: 'Word Matching',
				}}
			/>
			<Stack.Screen
				name="audio-challenge"
				options={{
					title: 'Audio Challenge',
				}}
			/>
		</Stack>
	);
}

export default ChallengesLayout;