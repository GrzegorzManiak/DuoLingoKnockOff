import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { apiClient } from '@/utils/api';
import { useSession } from '@/hooks/useSession';
import { components } from '@/types';

type ChallengeDto = components['schemas']['ChallengeDto'];

export default function ChallengeScreen() {
	const { challengeId, languageId } = useLocalSearchParams();
	const { getToken } = useSession();
	const router = useRouter();
	const [challenge, setChallenge] = useState<ChallengeDto | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchChallenge = async () => {
			if (!challengeId || !languageId) return;
			setIsLoading(true);
			setError(null);

			try {
				const { data } = await apiClient.GET('/api/languages/{languageId}/Challenge/{challengeId}', {
					params: { path: { languageId: Number(languageId), challengeId: Number(challengeId) }},
					headers: { 'Authorization': `Bearer ${getToken()}` }
				});
				if (data) setChallenge(data);
			} 
			catch (err) {
				setError('Failed to load challenge');
				console.error('Error loading challenge:', err);
			} 
			finally {
				setIsLoading(false);
			}
		};

		fetchChallenge();
	}, [challengeId, languageId, getToken]);

	if (isLoading) {
		return (
			<SafeAreaView style={styles.container}>
				<ActivityIndicator size="large" color="#58CC02" />
			</SafeAreaView>
		);
	}

	if (error) {
		return (
			<SafeAreaView style={styles.container}>
				<Text style={styles.errorText}>{error}</Text>
				<TouchableOpacity 
					style={styles.backButton}
					onPress={() => router.back()}
				>
					<Text style={styles.backButtonText}>Go Back</Text>
				</TouchableOpacity>
			</SafeAreaView>
		);
	}

	if (!challenge) {
		return (
			<SafeAreaView style={styles.container}>
				<Text style={styles.errorText}>Challenge not found</Text>
				<TouchableOpacity 
					style={styles.backButton}
					onPress={() => router.back()}
				>
					<Text style={styles.backButtonText}>Go Back</Text>
				</TouchableOpacity>
			</SafeAreaView>
		);
	}

	const challengeContent = JSON.parse(challenge.content || '{}');

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.content}>
				<Text style={styles.title}>{challengeContent.question}</Text>
				<Text style={styles.difficulty}>
					Difficulty: {challenge.difficulty === 0 ? 'Easy' : challenge.difficulty === 1 ? 'Moderate' : 'Hard'}
				</Text>
				<Text style={styles.type}>
					Type: {challenge.type === 0 ? 'Multiple Choice' : 
						   challenge.type === 1 ? 'Translation' : 
						   challenge.type === 2 ? 'Listening' : 
						   challenge.type === 3 ? 'Speaking' : 'Writing'}
				</Text>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	header: {
		padding: 20,
		borderBottomWidth: 1,
		borderBottomColor: '#E5E5E5',
	},
	backButton: {
		padding: 10,
	},
	backButtonText: {
		fontSize: 16,
		color: '#58CC02',
	},
	content: {
		flex: 1,
		padding: 20,
	},
	title: {
		fontSize: 24,
		fontWeight: '600',
		color: '#333',
		marginBottom: 20,
	},
	difficulty: {
		fontSize: 18,
		color: '#666',
		marginBottom: 10,
	},
	type: {
		fontSize: 18,
		color: '#666',
	},
	errorText: {
		color: '#E53E3E',
		fontSize: 16,
		textAlign: 'center',
		padding: 20,
	},
}); 