import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, ActivityIndicator, Image } from 'react-native';
import { useLanguageStore } from '@/stores/languageStore';
import { useLearningLanguage } from '@/contexts/LearningLanguageContext';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { components } from '@/types';
import {getApiBaseUrl} from "@/utils/api";

type Language = components['schemas']['Language'];

const SlimLanguageSelector: React.FC = () => {
	const { error } = useLanguageStore();
	const { currentLanguage, setLanguage, loadLanguages, languages, isLoading } = useLearningLanguage();
	const [isModalVisible, setIsModalVisible] = useState(false);

	useEffect(() => {
		loadLanguages();
	}, []);

	const handleLanguageSelect = (language: Language) => {
		setLanguage(language);
		setIsModalVisible(false);
	};

	const handleOpenModal = async () => {
		await loadLanguages();
		setIsModalVisible(true);
	};

	return (
		<View style={styles.container}>
			<TouchableOpacity 
				style={styles.selectorButton}
				onPress={handleOpenModal}
			>
				<View style={styles.buttonContent}>
					<View style={styles.languageInfo}>
						{currentLanguage?.flagImageUrl && (
							<Image 
								source={{ uri: `${getApiBaseUrl()}/static/${currentLanguage.flagImageUrl}` }}
								style={styles.flagImage}
							/>
						)}
						<Text style={styles.buttonText}>
							{currentLanguage?.nativeName || 'Select Language'}
						</Text>
					</View>
					<IconSymbol name="chevron.down" size={20} color="#666" />
				</View>
			</TouchableOpacity>

			<Modal
				visible={isModalVisible}
				transparent={true}
				animationType="slide"
				onRequestClose={() => setIsModalVisible(false)}
			>
				<View style={styles.modalOverlay}>
					<View style={styles.modalContent}>
						<View style={styles.modalHeader}>
							<Text style={styles.modalTitle}>Select Language</Text>
							<TouchableOpacity 
								onPress={() => setIsModalVisible(false)}
								style={styles.closeButton}
							>
								<IconSymbol name="xmark.circle.fill" size={24} color="#666" />
							</TouchableOpacity>
						</View>
						
						{isLoading ? (
							<View style={styles.loadingContainer}>
								<ActivityIndicator size="large" color="#58CC02" />
							</View>
						) : error ? (
							<View style={styles.errorContainer}>
								<Text style={styles.errorText}>{error}</Text>
							</View>
						) : (
							<ScrollView style={styles.languageList}>
								{languages.map((language: Language) => (
									<TouchableOpacity
										key={language.id}
										style={[
											styles.languageItem,
											currentLanguage?.id === language.id && styles.selectedLanguage
										]}
										onPress={() => handleLanguageSelect(language)}
									>
										<View style={styles.languageContent}>
											<View style={styles.languageInfo}>
												{language.flagImageUrl && (
													<Image 
														source={{ uri: `${getApiBaseUrl()}/static/${language.flagImageUrl}` }}
														style={styles.flagImage}
													/>
												)}
												<View>
													<Text style={styles.languageName}>{language.nativeName}</Text>
													<Text style={styles.languageEnglishName}>{language.name}</Text>
												</View>
											</View>
										</View>
										{currentLanguage?.id === language.id && (
											<IconSymbol name="checkmark.circle.fill" size={24} color="#58CC02" />
										)}
									</TouchableOpacity>
								))}
							</ScrollView>
						)}
					</View>
				</View>
			</Modal>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 15,
		backgroundColor: '#fff',
		borderBottomWidth: 1,
		borderBottomColor: '#E5E5E5',
	},
	selectorButton: {
		backgroundColor: '#F8F8F8',
		borderRadius: 12,
		padding: 12,
	},
	buttonContent: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	languageInfo: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		marginLeft: 10,
		gap: 20,
	},
	flagImage: {
		width: 24,
		height: 18,
		borderRadius: 4,
		borderWidth: 1,
		borderColor: '#E0E0E0',
	},
	buttonText: {
		fontSize: 16,
		fontWeight: '600',
		color: '#333',
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		justifyContent: 'flex-end',
	},
	modalContent: {
		backgroundColor: '#fff',
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		maxHeight: '80%',
	},
	modalHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 20,
		borderBottomWidth: 1,
		borderBottomColor: '#E5E5E5',
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: '600',
		color: '#333',
	},
	closeButton: {
		padding: 5,
	},
	loadingContainer: {
		padding: 40,
		alignItems: 'center',
	},
	errorContainer: {
		padding: 20,
		alignItems: 'center',
	},
	errorText: {
		color: '#E53E3E',
		fontSize: 16,
	},
	languageList: {
		padding: 10,
	},
	languageItem: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: 15,
		borderRadius: 12,
		marginBottom: 8,
		backgroundColor: '#F8F8F8',
	},
	selectedLanguage: {
		backgroundColor: '#E8F5E9',
		borderWidth: 1,
		borderColor: '#58CC02',
	},
	languageContent: {
		flex: 1,
	},
	languageName: {
		fontSize: 16,
		fontWeight: '600',
		color: '#333',
		marginBottom: 4,
	},
	languageEnglishName: {
		fontSize: 14,
		color: '#666',
	},
});

export {
	SlimLanguageSelector,
};