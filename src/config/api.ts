// API Configuration for different environments

interface ApiConfig {
  baseUrl: string;
  useMockData: boolean;
  timeout: number;
  retryAttempts: number;
}

// Environment detection
const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

// API Configuration for Backend Connection
export const apiConfig: ApiConfig = {
  // Backend URLs for different environments
  baseUrl: (() => {
    switch (import.meta.env.MODE) {
      case 'development':
        return import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'; // Your backend
      case 'staging':
        return import.meta.env.VITE_STAGING_API_URL || 'https://staging-api.chipv2.com/api/v1';
      case 'production':
        return import.meta.env.VITE_PROD_API_URL || 'https://api.chipv2.com/api/v1';
      default:
        return 'http://localhost:8000/api/v1';
    }
  })(),
  
  // Enable mock data when specified or when backend is unavailable
  useMockData: import.meta.env.VITE_USE_MOCK_DATA === 'true' || isDevelopment,
  
  // Connection settings
  timeout: 15000, // 15 seconds for backend calls
  
  // Retry attempts for failed requests
  retryAttempts: 3,
};

// Mock data for development
export const mockResponses = {
  login: {
    user: {
      id: '12345',
      email: 'user@example.com',
      mobile: '9876543210',
      name: 'John Doe',
      role: 'Admin',
    },
    token: 'mock-jwt-token-' + Date.now(),
    refreshToken: 'mock-refresh-token-' + Date.now(),
  },
  
  sendOtp: {
    success: true,
    message: 'OTP sent successfully',
    otpId: 'mock-otp-id-' + Date.now(),
  },
  
  verifyOtp: {
    success: true,
    verified: true,
    message: 'OTP verified successfully',
  },
  
  forgotPassword: {
    success: true,
    message: 'Password reset link sent to your email',
  },
};

// Error messages for different scenarios
export const errorMessages = {
  network: 'Network connection failed. Please check your internet connection.',
  cors: 'CORS policy error. This is a development issue and will be resolved in production.',
  timeout: 'Request timed out. Please try again.',
  server: 'Server error. Please try again later.',
  validation: 'Please check your input and try again.',
  unauthorized: 'Invalid credentials. Please check your email and password.',
  forbidden: 'Access denied. Please contact support.',
  notFound: 'Resource not found.',
  unknown: 'An unexpected error occurred. Please try again.',
};

// Helper function to get error message based on error type
export const getErrorMessage = (error: any): string => {
  if (error?.status === 'FETCH_ERROR') {
    return errorMessages.cors;
  }
  
  switch (error?.status) {
    case 400:
      return errorMessages.validation;
    case 401:
      return errorMessages.unauthorized;
    case 403:
      return errorMessages.forbidden;
    case 404:
      return errorMessages.notFound;
    case 408:
      return errorMessages.timeout;
    case 500:
    case 502:
    case 503:
    case 504:
      return errorMessages.server;
    default:
      return error?.message || errorMessages.unknown;
  }
};

// Development helper
export const logApiCall = (endpoint: string, method: string, data?: any) => {
  if (isDevelopment) {
    console.log(`🔗 API Call: ${method} ${endpoint}`, data ? { data } : '');
  }
};

export { isDevelopment, isProduction };