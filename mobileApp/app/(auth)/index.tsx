import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import logo from '../../assets/images/logo.png';

function AuthScreen() {
	const router = useRouter();

	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.container}>
				<Image source={logo} style={styles.logo} resizeMode="contain" />
				<Text style={styles.title}>Learn a language for free. Forever.</Text>

				<View style={styles.buttonContainer}>
					<TouchableOpacity 
						style={[styles.button, styles.registerButton]} 
						onPress={() => router.push('/register')}>
						<Text style={[styles.buttonText, styles.registerButtonText]}>
							Get Started
						</Text>
					</TouchableOpacity>

					<TouchableOpacity 
						style={[styles.button, styles.loginButton]} 
						onPress={() => router.push('/login')}>
						<Text style={[styles.buttonText, styles.loginButtonText]}>
							I Already Have an Account
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: '#ffffff', // Duolingo-like light background
	},
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'space-around', // Pushes logo up, buttons down
		paddingHorizontal: 20,
		paddingTop: Constants.statusBarHeight + 20,
		paddingBottom: 40,
	},
	logo: {
		width: '60%',
		height: 100, // Adjust as needed
		marginBottom: 40,
	},
	title: {
		fontSize: 28,
		fontWeight: 'bold',
		color: '#4B4B4B', // Dark grey text
		textAlign: 'center',
		marginBottom: 60, // Pushes buttons down more
		paddingHorizontal: 20,
	},
	buttonContainer: {
		width: '100%',
	},
	button: {
		paddingVertical: 15,
		borderRadius: 12,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 15,
		borderWidth: 2,
		borderColor: '#E5E5E5', // Light grey border
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 2,
	},
	registerButton: {
		backgroundColor: '#58CC02', // Duolingo green
		borderColor: '#58CC02',
	},
	loginButton: {
		backgroundColor: '#ffffff', // White background
	},
	buttonText: {
		fontSize: 16,
		fontWeight: 'bold',
		textTransform: 'uppercase',
	},
	registerButtonText: {
		color: '#ffffff', // White text
	},
	loginButtonText: {
		color: '#58CC02', // Duolingo green text
	},
}); 

export default AuthScreen;