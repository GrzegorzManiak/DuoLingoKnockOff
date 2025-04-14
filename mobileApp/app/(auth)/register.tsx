import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSession } from '@/hooks/useSession';
import { apiClient } from '@/utils/api';
import { components } from '@/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalization } from '@/hooks/useLocalization';

type RegisterDto = components['schemas']['RegisterDto'];

function RegisterScreen() {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [outlined, setOutlined] = useState<{username: boolean, email: boolean, password: boolean}>({
		username: false, 
		email: false, 
		password: false
	});
	const router = useRouter();
	const { signIn } = useSession();
	const { t } = useLocalization();

	async function handleRegister() {			
		const validations = {
			Username: username.length < 3,
			Password: password.length < 6,
			Email: !email.includes('@'),
		};

		if (Object.values(validations).some(invalid => invalid)) {
			let error = 'application.auth.register.registerError';
			const errorKeys = Object.entries(validations)
				.filter(([_, invalid]) => invalid)
				.map(([field]) => field);

			if (errorKeys.length > 0)
				error = `application.auth.${errorKeys.join('And')}Error`;
				
			setOutlined({
				username: validations.Username, 
				email: validations.Email, 
				password: validations.Password
			});

			setError(error);
			return;
		}

		setLoading(true);
		setError(null);
		const registerData: RegisterDto = { username, email, password };

		try {
			console.log('Attempting registration with:', registerData);
			const { data, error: apiError } = await apiClient.POST('/api/Auth/register', { body: registerData });

			if (data) {
				if (data.token) return await signIn(data, data.token);
				setError('application.auth.register.registerError');
				console.log('Registration succeeded but no token received:', data);
			} 
			
			else if (apiError) {
				console.log('Registration failed with API error:', apiError);
				setOutlined({username: true, email: true, password: true});
				setError(`Sorry, but the registration failed. Please try again.`);
			} 
			
			else {
				setError('application.auth.register.registerError');
				console.log('Unexpected registration response state');
			}
		} 
		
		catch (err: any) {
			console.log('Network or unexpected registration error:', err);
			setError(err.message || 'A network error occurred. Please try again.');
		} 
		
		finally {
			setLoading(false);
		}
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.container}>
				<Text style={styles.title}>{t('application.auth.register.title')}</Text>

				{error && <Text style={styles.errorText}>{t(error)}</Text>}

				<TextInput
					style={[styles.input, outlined.username && styles.outlinedInput]}
					placeholder={t('application.auth.username')}
					value={username}
					onChangeText={setUsername}
					autoCapitalize="none"
					placeholderTextColor={outlined.username ? '#ff7a70' : '#b0b0b0'}
				/>
				
				<TextInput
					style={[styles.input, outlined.email && styles.outlinedInput]}
					placeholder={t('application.auth.email')}
					value={email}
					onChangeText={setEmail}
					keyboardType="email-address"
					autoCapitalize="none"
					placeholderTextColor={outlined.email ? '#ff7a70' : '#b0b0b0'}
				/>
				
				<TextInput
					style={[styles.input, outlined.password && styles.outlinedInput]}
					placeholder={t('application.auth.password')}
					value={password}
					onChangeText={setPassword}
					secureTextEntry
					placeholderTextColor={outlined.password ? '#ff7a70' : '#b0b0b0'}
				/>

				<TouchableOpacity
					style={[styles.button, loading && styles.buttonDisabled]}
					onPress={handleRegister}
					disabled={loading}
				>
					{loading ? (
						<ActivityIndicator color="#ffffff" />
					) : (
						<Text style={styles.buttonText}>
							{t('application.auth.register.submit')}
						</Text>
					)}
				</TouchableOpacity>

				<TouchableOpacity onPress={() => router.push('/login')} style={styles.linkButton}>
					<Text style={styles.linkText}>
						{t('application.auth.register.login')}
					</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: '#ffffff',
	},
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
	},
	title: {
		fontSize: 28,
		fontWeight: 'bold',
		color: '#4B4B4B',
		marginBottom: 30,
	},
	input: {
		width: '100%',
		height: 50,
		backgroundColor: '#F0F0F0',
		borderRadius: 10,
		paddingHorizontal: 15,
		fontSize: 16,
		marginBottom: 15,
		borderWidth: 1,
		borderColor: '#E0E0E0',
	},
	outlinedInput: {
		borderColor: 'red',
		borderWidth: 1,
		backgroundColor: '#ffe0de',
		color: '#ff7a70',
	},
	button: {
		width: '100%',
		backgroundColor: '#58CC02',
		paddingVertical: 15,
		borderRadius: 10,
		alignItems: 'center',
		marginTop: 10,
	},
	buttonDisabled: {
		backgroundColor: '#B2E0B2',
	},
	buttonText: {
		color: '#ffffff',
		fontSize: 16,
		fontWeight: 'bold',
	},
	errorText: {
		color: 'red',
		marginBottom: 15,
		textAlign: 'center'
	},
	linkButton: {
		marginTop: 20,
	},
	linkText: {
		color: '#58CC02',
		fontSize: 14,
		fontWeight: 'bold'
	},
}); 

export default RegisterScreen;