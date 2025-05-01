import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useSession } from '@/hooks/useSession';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/IconSymbol';
import {apiClient, getApiBaseUrl} from '@/utils/api';
import { components } from '@/types';
import { useLearningLanguage } from '@/contexts/LearningLanguageContext';
import {codeToNativeName, idToCountry} from "@/utils/langUtil";
import {useLocalization} from "@/hooks/useLocalization";
import LanguageSelector from "@/components/ui/LanguageSelector";

type UserProgressDto = components['schemas']['UserProgressDto'];
type Language = components['schemas']['Language'];

function ProfileScreen() {
	const { currentLanguage, setLanguage, languages, loadLanguages } = useLearningLanguage();
	const { user, signOut } = useSession();
	const [progress, setProgress] = useState<UserProgressDto | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const { getToken } = useSession();
	const { t } = useLocalization();

	const getAvatarUrl = (username: string) => {
		return `https://api.dicebear.com/7.x/avataaars/png?seed=${encodeURIComponent(username)}`;
	};

	const calculateLevel = (xp: number) => {
		return Math.floor(xp / 1000) + 1;
	};

	const calculateLevelProgress = (xp: number) => {
		const currentLevel = calculateLevel(xp);
		const xpForCurrentLevel = (currentLevel - 1) * 1000;
		const xpInCurrentLevel = xp - xpForCurrentLevel;
		return (xpInCurrentLevel / 1000) * 100;
	};

	useEffect(() => {
		const fetchProgress = async () => {
			if (!user?.id) return;
			
			setIsLoading(true);
			setError(null);
			await loadLanguages();
			
			try {
				// @ts-ignore
				const { data, error: apiError } = await apiClient.GET('/api/Users/progress', {
					cache: 'no-store',
					parseAs: 'json',
					headers: { 'Authorization': `Bearer ${getToken()}` }
				});
				
				console.log('Progress data:', data);
				if (data) setProgress(data as UserProgressDto);
				else if (apiError) {
					setError('Failed to load progress');
					console.error('Progress error:', apiError);
				}
			} 
			catch (err) {
				setError('Network error occurred');
				console.error('Network error:', err);
			} 
			finally {
				setIsLoading(false);
			}
		};

		fetchProgress();
	}, [user?.id]);


	const totalXP = progress?.languageProgress?.reduce((sum, lang) => sum + (lang.totalScore || 0), 0) || 0;
	const totalLessons = progress?.languageProgress?.reduce((sum, lang) => sum + (lang.completedChallenges || 0), 0) || 0;
	const overallLevel = calculateLevel(totalXP);
	const levelProgress = calculateLevelProgress(totalXP);

	return (
		<SafeAreaView style={styles.safeArea}>
			<ScrollView style={styles.container}>
				{/* Profile Header */}
				<View style={styles.header}>
					<View style={styles.profileInfo}>
						<View style={styles.avatarContainer}>
							<View style={styles.avatar}>
								{user?.username ? (
									<Image
										source={{ uri: getAvatarUrl(user.username) }}
										style={styles.avatarImage}
									/>
								) : (
									<IconSymbol name="person.fill" size={40} color="#666" />
								)}
							</View>
							<View style={styles.levelBadge}>
								<Text style={styles.levelText}>{overallLevel}</Text>
							</View>
						</View>
						<View style={styles.userInfo}>
							<Text style={styles.username}>{user?.usernameCased || user?.username || 'User'}</Text>
							<Text style={styles.email}>{user?.email || 'Email'}</Text>
							<View style={styles.streakContainer}>
								<IconSymbol name="flame.fill" size={16} color="#FF9500" />
								<Text style={styles.streakText}>{
									t('profile.streak', {
										day: String(progress?.streak?.currentStreak || 0)
									})}
								</Text>
							</View>
						</View>
					</View>

					<TouchableOpacity style={styles.settingsButton}>
						<LanguageSelector />
					</TouchableOpacity>
				</View>

				{/* Stats Overview */}
				<View style={styles.statsContainer}>
					<View style={styles.statCard}>
						<View style={styles.statIconContainer}>
							<IconSymbol name="star.fill" size={24} color="#58CC02" />
						</View>
						<Text style={styles.statValue}>{totalXP}</Text>
						<Text style={styles.statLabel}>
							{t('profile.totalXP')}
						</Text>
					</View>
					<View style={styles.statCard}>
						<View style={styles.statIconContainer}>
							<IconSymbol name="checkmark.circle.fill" size={24} color="#58CC02" />
						</View>
						<Text style={styles.statValue}>{totalLessons}</Text>
						<Text style={styles.statLabel}>
							{t('profile.totalLessons')}
						</Text>
					</View>
				</View>

				{/* Overall Progress */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>
						{t('profile.overallProgress')}
					</Text>
					<View style={styles.progressCard}>
						<View style={styles.progressHeader}>
							<Text style={styles.progressTitle}>{
								t('profile.level', {
									level: String(overallLevel),
								})
							}</Text>
							<Text style={styles.progressValue}>{
								t('profile.xp', {
									xp: String(totalXP),
								})
							}</Text>
						</View>
						<View style={styles.progressBar}>
							<View style={[styles.progressFill, { width: `${levelProgress}%` }]}>
								<View style={styles.progressGlow} />
							</View>
						</View>
						<Text style={styles.progressSubtitle}>
							{t('profile.levelProgress', {
								levelProgress: String(100 - (levelProgress ?? 0)),
								level: String(overallLevel),
							})}
						</Text>
					</View>
				</View>

				{/* Language Progress */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>{
						t('profile.languageProgress')
					}</Text>
					{isLoading ? (
						<ActivityIndicator size="large" color="#58CC02" />
					) : error ? (
						<Text style={styles.errorText}>{error}</Text>
					) : !progress?.languageProgress?.length ? (
						<View style={styles.emptyState}>
							<IconSymbol name="book.closed.fill" size={40} color="#666" />
							<Text style={styles.emptyStateText}>{
								t('profile.notStarted')
							}</Text>
						</View>
					) : progress.languageProgress.map((lang) => {
						const langXP = lang.totalScore || 0;
						const langChallenges = lang.completedChallenges || 0;
						const countryCode = idToCountry(lang.languageId);
						console.log("Language: ", lang,  `${getApiBaseUrl()}/static/images/flags/${countryCode}.png`)
						return (
							<View key={lang.languageId} style={styles.languageCard}>
								<View style={styles.languageHeader}>
									<View style={styles.languageInfo}>
										<Image
											source={{ uri: `${getApiBaseUrl()}/static/images/flags/${countryCode}.png` }}
											style={styles.languageFlag}
										/>
										<View>
											<Text style={styles.languageName}>{codeToNativeName(countryCode)}</Text>
											<Text style={styles.languageLevel}>{
												t('profile.level', {
													level: String(calculateLevel(langXP)),
												})
											}</Text>
										</View>
									</View>
									<View style={styles.languageStats}>
										<Text style={styles.languageXP}>{
											t('profile.xp', {
												xp: String(langXP),
											})
										}</Text>
										<Text style={styles.languageChallenges}>{
											t('profile.challangesCompleted', {
												completedChallenges: String(langChallenges),
											})
										}</Text>
									</View>
								</View>
								<View style={styles.progressBar}>
									<View style={[styles.progressFill, { width: `${calculateLevelProgress(langXP)}%` }]}>
										<View style={styles.progressGlow} />
									</View>
								</View>
							</View>
						);
					})}
				</View>

				{/* Logout Button */}
				<TouchableOpacity style={styles.logoutButton} onPress={signOut}>
					<IconSymbol name="rectangle.portrait.and.arrow.right" size={20} color="#FF6B6B" />
					<Text style={styles.logoutText}>{
						t('profile.logout')
					}</Text>
				</TouchableOpacity>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: '#fff',
	},
	container: {
		flex: 1,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 20,
		backgroundColor: '#fff',
		borderBottomWidth: 1,
		borderBottomColor: '#F0F0F0',
	},
	profileInfo: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1,
		gap: 15,
	},
	avatarContainer: {
		position: 'relative',
	},
	avatar: {
		width: 80,
		height: 80,
		borderRadius: 40,
		backgroundColor: '#F8F8F8',
		justifyContent: 'center',
		alignItems: 'center',
		overflow: 'hidden',
		borderWidth: 3,
		borderColor: '#fff',
	},
	avatarImage: {
		width: '100%',
		height: '100%',
	},
	levelBadge: {
		position: 'absolute',
		bottom: -5,
		right: -5,
		backgroundColor: '#58CC02',
		width: 30,
		height: 30,
		borderRadius: 15,
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: 3,
		borderColor: '#fff',
	},
	levelText: {
		color: '#fff',
		fontWeight: 'bold',
		fontSize: 14,
	},
	userInfo: {
		flex: 1,
		gap: 4,
	},
	username: {
		fontSize: 24,
		fontWeight: '700',
		color: '#333',
	},
	email: {
		fontSize: 14,
		color: '#666',
	},
	streakContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
		marginTop: 4,
	},
	streakText: {
		fontSize: 14,
		color: '#FF9500',
		fontWeight: '600',
	},
	settingsButton: {
		padding: 10,
		marginLeft: 10,
	},
	statsContainer: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		padding: 20,
		gap: 15,
	},
	statCard: {
		flex: 1,
		backgroundColor: '#F8F8F8',
		padding: 15,
		borderRadius: 12,
		alignItems: 'center',
	},
	statIconContainer: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: '#fff',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 8,
	},
	statValue: {
		fontSize: 24,
		fontWeight: '700',
		color: '#333',
		marginBottom: 4,
	},
	statLabel: {
		fontSize: 14,
		color: '#666',
	},
	section: {
		padding: 20,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: '700',
		color: '#333',
		marginBottom: 5,
	},
	progressCard: {
		backgroundColor: '#F8F8F8',
		padding: 20,
		borderRadius: 12,
	},
	progressHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 15,
	},
	progressTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: '#333',
	},
	progressValue: {
		fontSize: 16,
		color: '#666',
	},
	progressBar: {
		height: 8,
		backgroundColor: '#E5E5E5',
		borderRadius: 4,
		overflow: 'hidden',
		marginBottom: 10,
	},
	progressFill: {
		height: '100%',
		backgroundColor: '#58CC02',
		position: 'relative',
	},
	progressGlow: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: '#fff',
		opacity: 0.2,
	},
	progressSubtitle: {
		fontSize: 14,
		color: '#666',
	},
	languageCard: {
		backgroundColor: '#F8F8F8',
		padding: 15,
		borderRadius: 12,
		marginBottom: 10,
	},
	languageHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 15,
	},
	languageInfo: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
	},
	languageFlag: {
		width: 24,
		height: 18,
		borderRadius: 4,
		borderWidth: 1,
		borderColor: '#E0E0E0',
	},
	languageName: {
		fontSize: 16,
		fontWeight: '600',
		color: '#333',
	},
	languageLevel: {
		fontSize: 14,
		color: '#666',
	},
	languageStats: {
		alignItems: 'flex-end',
	},
	languageXP: {
		fontSize: 16,
		fontWeight: '600',
		color: '#333',
	},
	languageChallenges: {
		fontSize: 12,
		color: '#666',
	},
	emptyState: {
		alignItems: 'center',
		padding: 40,
		gap: 10,
	},
	emptyStateText: {
		fontSize: 16,
		color: '#666',
		textAlign: 'center',
	},
	logoutButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 8,
		margin: 20,
		padding: 15,
		backgroundColor: '#FFE5E5',
		borderRadius: 12,
	},
	logoutText: {
		fontSize: 16,
		fontWeight: '600',
		color: '#FF6B6B',
	},
	errorText: {
		color: '#E53E3E',
		fontSize: 16,
		textAlign: 'center',
		padding: 20,
	},
});

export default ProfileScreen;