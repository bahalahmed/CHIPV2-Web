import axiosInstance from './axiosInstance';

// In-memory CSRF token cache
let csrfTokenCache: string | null = null;

// Interface for CSRF token response
interface CsrfTokenResponse {
  csrf_token: string;
}

/**
 * Fetches CSRF token from the server and caches it in memory
 * @returns Promise<string> - The CSRF token
 */
export const getCsrfToken = async (): Promise<string> => {
  // Return cached token if available
  if (csrfTokenCache) {
    console.log('🔐 Using cached CSRF token');
    return csrfTokenCache;
  }

  try {
    console.log('🔐 Fetching new CSRF token from server...');
    const response = await axiosInstance.get<CsrfTokenResponse>(import.meta.env.VITE_AUTH_CSRF_ENDPOINT || '/auth/csrf_token');
    
    if (response.data && response.data.csrf_token) {
      csrfTokenCache = response.data.csrf_token;
      console.log('✅ CSRF token fetched and cached successfully');
      return csrfTokenCache;
    } else {
      throw new Error('Invalid CSRF token response format');
    }
  } catch (error) {
    console.error('❌ Failed to fetch CSRF token:', error);
    throw new Error('Failed to fetch CSRF token');
  }
};

/**
 * Clears the cached CSRF token (use on logout or when token becomes invalid)
 */
export const clearCsrfToken = (): void => {
  csrfTokenCache = null;
  console.log('🔐 CSRF token cache cleared');
};

/**
 * Checks if CSRF token is cached
 * @returns boolean - Whether token is cached
 */
export const isCsrfTokenCached = (): boolean => {
  return csrfTokenCache !== null;
};

/**
 * Gets the cached CSRF token without making a network request
 * @returns string | null - The cached token or null if not cached
 */
export const getCachedCsrfToken = (): string | null => {
  return csrfTokenCache;
};