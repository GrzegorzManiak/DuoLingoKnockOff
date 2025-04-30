import React, { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { useChallengeData } from '@/hooks/useChallengeData';
import {useLocalization} from "@/hooks/useLocalization";

function ChallengesLayout() {
	const params = useLocalSearchParams();
	const { challengeId, languageId } = params;
	const router = useRouter();
	const { t } = useLocalization();

	// @ts-ignore
	const { challenge, isLoading, error } = useChallengeData(challengeId, languageId);

	useEffect(() => {
		console.log(`Challenge ID: ${challengeId}, Language ID: ${languageId}`);
		if (challenge && !isLoading && !error) {
			const type = challenge.type;

			let route;
			switch (type) {
				case 0:
					route = 'multiple-choice';
					break;
				case 1:
					route = 'fill-blanks';
					break;
				case 2:
					route = 'conversation';
					break;
				case 3:
					route = 'word-matching';
					break;
				case 4:
					route = 'audio-challenge';
					break;
				default:
					route = 'index';
			}

			if (route !== 'index') router.replace({
				// @ts-ignore
				pathname: `/(challenges)/${route}` as const,
				params: { challengeId, languageId }
			});
		}
	}, [challenge, isLoading, error, challengeId, languageId, router]);

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
					title: t('')
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