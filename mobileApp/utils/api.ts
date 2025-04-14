import createClient from 'openapi-fetch';
import type { paths } from '@/types'; // Import the generated paths
import { Platform } from 'react-native'; // Import Platform

// --- Base URL Configuration ---
// Use environment variable if provided
let resolvedApiBaseUrl = process.env.EXPO_PUBLIC_API_URL;

// If no env var, set default based on platform
if (!resolvedApiBaseUrl) {
  if (Platform.OS === 'android') {
    // Use Android emulator loopback address
    resolvedApiBaseUrl = 'http://10.0.2.2:5165';
  } else {
    // Use localhost for web/iOS simulator
    resolvedApiBaseUrl = 'http://localhost:5165';
  }
}

console.log(`API Base URL: ${resolvedApiBaseUrl}`); // Log the resolved URL for debugging

// Create the basic openapi-fetch client
export const apiClient = createClient<paths>({
  baseUrl: resolvedApiBaseUrl, // Use the resolved URL
});

// Function to get the base URL, useful for things like WebView
export const getApiBaseUrl = () => resolvedApiBaseUrl; 