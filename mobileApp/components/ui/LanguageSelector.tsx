import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Modal, Text } from 'react-native';
import { useLocalization } from '@/hooks/useLocalization';
import { FALLBACK_LANGUAGE } from '@/contexts/LocalizationContext';

const LANGUAGES = [
	{ code: 'en', name: 'English', flag: '🇮🇪' },
	{ code: 'de', name: 'Deutsch', flag: '🇩🇪' },
	{ code: 'es', name: 'Español', flag: '🇪🇸' },
	{ code: 'fr', name: 'Français', flag: '🇫🇷' },
];

function LanguageSelector() {
	const [isOpen, setIsOpen] = useState(false);
	const { currentLanguage, setLanguage } = useLocalization();

	const currentLanguageData = 
		LANGUAGES.find(lang => lang.code === currentLanguage) || 
		LANGUAGES.find(lang => lang.code === FALLBACK_LANGUAGE);

	return (
		<View style={styles.container}>
			<TouchableOpacity 
				style={styles.flagButton}
				onPress={() => setIsOpen(true)}
			>
				<Text style={styles.flagText}>{currentLanguageData?.flag}</Text>
			</TouchableOpacity>

			<Modal
				visible={isOpen}
				transparent
				animationType="fade"
				onRequestClose={() => setIsOpen(false)}
			>
				<TouchableOpacity 
					style={styles.modalOverlay}
					activeOpacity={1}
					onPress={() => setIsOpen(false)}
				>
					<View style={styles.dropdown}>
						{LANGUAGES.map((lang) => (
							<TouchableOpacity
								key={lang.code}
								style={[
									styles.languageOption,
									currentLanguage === lang.code && styles.selectedLanguage
								]}
								onPress={() => {
									setLanguage(lang.code);
									setIsOpen(false);
								}}
							>
								<Text style={styles.flagText}>{lang.flag}</Text>
								<Text style={styles.languageName}>{lang.name}</Text>
							</TouchableOpacity>
						))}
					</View>
				</TouchableOpacity>
			</Modal>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		position: 'relative',
	},
	flagButton: {
		padding: 6,
		paddingLeft: 12,
		paddingRight: 12,
		borderRadius: 8,
		backgroundColor: '#f0f0f0',
	},
	flagText: {
		fontSize: 24,
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	dropdown: {
		backgroundColor: 'white',
		borderRadius: 12,
		padding: 16,
		width: '80%',
		maxWidth: 300,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	languageOption: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 12,
		borderRadius: 8,
		marginBottom: 8,
	},
	selectedLanguage: {
		backgroundColor: '#f0f0f0',
	},
	languageName: {
		marginLeft: 12,
		fontSize: 16,
	},
});

export default LanguageSelector;