import createClient, { Middleware } from 'openapi-fetch'; 
import type { paths } from '@/types';
import { Platform } from 'react-native';

// --- Base API URL Configuration ---
let resolvedApiBaseUrl = process.env.API_URL;
// resolvedApiBaseUrl = 'https://ead.meshtail.com'

// -- no config, set default based on platform DEVELOPMENT ONLY
if (!resolvedApiBaseUrl) {
	// -- Use Android emulator loopback address (Different network)
	if (Platform.OS === 'android') 
		resolvedApiBaseUrl = 'http://10.0.2.2:5165';
	
	// -- Use localhost for web/iOS simulator (Same network)
	else resolvedApiBaseUrl = 'http://localhost:5165';
}

console.log(`API Base URL: ${resolvedApiBaseUrl}`); 

const apiClient = createClient<paths>({ baseUrl: resolvedApiBaseUrl });
const getApiBaseUrl = () => resolvedApiBaseUrl; 

export {
	apiClient,
	getApiBaseUrl,
};