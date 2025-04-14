import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSession } from '@/hooks/useSession';
import { apiClient } from '@/utils/api';
import { components } from '@/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalization } from '@/hooks/useLocalization';

type LoginDto = components['schemas']['LoginDto'];

function LoginScreen() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [outlined, setOutlined] = useState<{username: boolean, password: boolean}>({username: false, password: false});
	const router = useRouter();
	const { signIn } = useSession();
	const { t } = useLocalization();

	async function handleLogin() {
		if (!username || !password) {
			let [outlinedUsername, outlinedPassword, error] = [false, false, 'Sorry, but'];
			if (username.length < 3) {
				outlinedUsername = true;
				error = 'application.auth.UsernameError';
			}

			if (password.length < 6) {
				outlinedPassword = true;
				if (outlinedUsername) error = 'application.auth.UsernameAndPasswordError';
				else error = 'application.auth.PasswordError';
			}
		
			setOutlined({username: outlinedUsername, password: outlinedPassword});
			setError(error);
			return;
		}

		setLoading(true);
		setError(null);
		const loginData: LoginDto = { username, password };

		try {
			console.log('Attempting login with:', loginData);
			const { data, error: apiError, response } = await apiClient.POST('/api/Auth/login', { body: loginData });

			if (data) {
				if (data.token) return await signIn(data, data.token);
				setError('application.auth.login.loginError');
				console.log('Login succeeded but no token received:', data);
			} 
			
			else if (apiError) {
				console.log('Login failed with API error:', apiError);
				setOutlined({username: true, password: true});
				setError('application.auth.login.invalidCredentials');
			} 
			
			else {
				setError('application.auth.login.loginError');
				console.log('Unexpected login response state');
			}
		} 
		
		catch (err: any) {
			console.log('Network or unexpected login error:', err);
			setError(err.message || 'A network error occurred. Please try again.');
		} 
		
		finally {
			setLoading(false);
		}
	};

  return (
	<SafeAreaView style={styles.safeArea}>
		<View style={styles.container}>
			<Text style={styles.title}>{t('application.auth.login.title')}</Text>

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
				style={[styles.input, outlined.password && styles.outlinedInput]}
				placeholder={t('application.auth.password')}
				value={password}
				onChangeText={setPassword}
				secureTextEntry
				placeholderTextColor={outlined.username ? '#ff7a70' : '#b0b0b0'}
			/>

			<TouchableOpacity
				style={[styles.button, loading && styles.buttonDisabled]}
				onPress={handleLogin}
				disabled={loading}
			>
				{loading ? (
					<ActivityIndicator color="#ffffff" />
				) : (
					<Text style={styles.buttonText}>
						{t('application.auth.login.submit')}
					</Text>
				)}
			</TouchableOpacity>

			<TouchableOpacity onPress={() => router.push('/register')} style={styles.linkButton}>
				<Text style={styles.linkText}>{t('application.auth.login.register')}</Text>
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
  	outlinedInput: {
		borderColor: 'red',
		borderWidth: 1,
		backgroundColor: '#ffe0de',
		color: '#ff7a70',
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

export default LoginScreen;