import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { apiConfig, mockResponses, getErrorMessage, logApiCall } from '@/config/api';

// Types for API responses
interface LoginRequest {
  email?: string;
  mobile?: string;
  password: string;
}

interface LoginResponse {
  user: {
    id: string;
    email: string;
    mobile: string;
    name: string;
    role: string;
  };
  token: string;
  refreshToken: string;
}

interface OtpRequest {
  mobile?: string;
  email?: string;
  whatsapp?: string;
  type: 'mobile' | 'email' | 'whatsapp';
}

interface OtpResponse {
  success: boolean;
  message: string;
  otpId: string;
}

interface VerifyOtpRequest {
  otpId: string;
  otp: string;
  type: 'mobile' | 'email' | 'whatsapp';
}

interface VerifyOtpResponse {
  success: boolean;
  verified: boolean;
  message: string;
}

interface ForgotPasswordRequest {
  email: string;
}

interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

// Enhanced base query with secure JWT handling
const baseQueryWithRetry: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: apiConfig.baseUrl,
    timeout: apiConfig.timeout,
    prepareHeaders: (headers, { getState }) => {
      headers.set('Content-Type', 'application/json');
      headers.set('Accept', 'application/json');
      
      // Secure token handling
      const token = (getState() as any).auth?.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      
      // Security headers
      headers.set('X-Requested-With', 'XMLHttpRequest');
      headers.set('Cache-Control', 'no-cache');
      
      return headers;
    },
    credentials: 'omit', // Don't send cookies for security
  });

  let result = await baseQuery(args, api, extraOptions);

  // Enhanced error handling with mock data fallback
  if (result.error && apiConfig.useMockData && typeof args === 'object') {
    const errorStatus = result.error.status;
    const requestUrl = args.url;
    
    console.warn(`API Error ${errorStatus}, using mock data fallback`);
    logApiCall(requestUrl || 'unknown', args.method || 'GET', args.body);
    
    // Login endpoints (handle all login URLs)
    if (requestUrl?.includes('login')) {
      const loginData = { ...mockResponses.login };
      loginData.user.email = (args.body as any)?.email || loginData.user.email;
      console.log('🎭 Using mock login data:', loginData);
      return { data: loginData };
    }
    
    // OTP endpoints
    if (requestUrl?.includes('/auth/send-otp')) {
      console.log('🎭 Using mock OTP send data');
      return { data: mockResponses.sendOtp };
    }
    
    if (requestUrl?.includes('/auth/verify-otp')) {
      console.log('🎭 Using mock OTP verify data');
      return { data: mockResponses.verifyOtp };
    }
    
    if (requestUrl?.includes('/auth/forgot-password')) {
      console.log('🎭 Using mock forgot password data');
      return { data: mockResponses.forgotPassword };
    }
  }
  
  // Handle network errors with retry
  if (result.error && result.error.status === 'FETCH_ERROR') {
    console.warn('Network error detected:', getErrorMessage(result.error));
    console.log('Retrying request...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    result = await baseQuery(args, api, extraOptions);
  }

  // Handle token refresh on 401 (but not for login endpoints)
  if (result.error && result.error.status === 401) {
    const requestUrl = typeof args === 'object' ? args.url : args;
    const isLoginRequest = requestUrl?.includes('/login') || requestUrl?.includes('/auth/login');
    
    // Don't try to refresh tokens for login requests
    if (isLoginRequest) {
      console.warn('Login failed with 401 - invalid credentials');
      return result;
    }
    
    console.warn('Token expired, attempting secure refresh...');
    
    // Get refresh token securely
    const refreshToken = (api.getState() as any).auth?.refreshToken;
    
    if (!refreshToken) {
      // No refresh token, force logout
      console.warn('No refresh token available, logging out');
      api.dispatch({ type: 'auth/logout' });
      return result;
    }
    
    try {
      // Attempt secure token refresh
      const refreshResult = await baseQuery(
        {
          url: '/auth/refresh',
          method: 'POST',
          body: { refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        // Update tokens in state
        const newTokens = refreshResult.data as { token: string; refreshToken: string };
        api.dispatch({ 
          type: 'auth/updateTokens', 
          payload: newTokens 
        });
        
        // Retry original request with new token
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Refresh failed, secure logout
        console.warn('Token refresh failed, logging out');
        api.dispatch({ type: 'auth/logout' });
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
      }
    } catch (refreshError) {
      console.error('Token refresh error:', refreshError);
      api.dispatch({ type: 'auth/logout' });
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
    }
  }

  return result;
};

// RTK Query API slice for authentication
export const authApiSlice = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithRetry,
  tagTypes: ['User', 'Session'],
  keepUnusedDataFor: 60, // Keep cache for 1 minute
  refetchOnMountOrArgChange: 30, // Refetch if data is older than 30 seconds
  endpoints: (builder) => ({
    // Email/Password Login
    loginWithEmail: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/login',  // ReqRes API endpoint
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User', 'Session'],
      transformErrorResponse: (response: FetchBaseQueryError) => {
        return {
          status: response.status,
          message: (response.data as any)?.message || 'Login failed',
        };
      },
    }),

    // Mobile Login
    loginWithMobile: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/mobile-login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User', 'Session'],
    }),

    // Send OTP
    sendOtp: builder.mutation<OtpResponse, OtpRequest>({
      query: ({ type, ...data }) => ({
        url: `/auth/send-otp/${type}`,
        method: 'POST',
        body: data,
      }),
      // Optimistic updates for better UX
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          console.log(`OTP sent successfully to ${arg.type}:`, data.message);
        } catch (error) {
          console.error(`Failed to send OTP to ${arg.type}:`, error);
        }
      },
    }),

    // Verify OTP
    verifyOtp: builder.mutation<VerifyOtpResponse, VerifyOtpRequest>({
      query: (data) => ({
        url: `/auth/verify-otp`,
        method: 'POST',
        body: data,
      }),
      // Transform response for consistent handling
      transformResponse: (response: any) => ({
        success: response.success || false,
        verified: response.verified || false,
        message: response.message || 'Verification completed',
      }),
    }),

    // Forgot Password
    forgotPassword: builder.mutation<ForgotPasswordResponse, ForgotPasswordRequest>({
      query: (data) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: data,
      }),
    }),

    // Logout
    logout: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['User', 'Session'],
      // Always succeed locally even if server fails
      transformResponse: () => ({ success: true }),
      transformErrorResponse: () => ({ success: true }),
    }),

    // Get Current User (for session validation)
    getCurrentUser: builder.query<LoginResponse['user'], void>({
      query: () => '/auth/me',
      providesTags: ['User'],
      // Stale time for user data
      keepUnusedDataFor: 300, // 5 minutes
    }),

    // Refresh Token
    refreshToken: builder.mutation<{ token: string; refreshToken: string }, { refreshToken: string }>({
      query: (data) => ({
        url: '/auth/refresh',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

// Export hooks for use in components
export const {
  useLoginWithEmailMutation,
  useLoginWithMobileMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
  useForgotPasswordMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useRefreshTokenMutation,
} = authApiSlice;

// Export API slice reducer
export default authApiSlice.reducer;

// Selectors for optimized data access
export const selectAuthApiState = (state: any) => state.authApi;
export const selectIsLoading = (state: any) => {
  const apiState = selectAuthApiState(state);
  return Object.values(apiState.mutations || {}).some((mutation: any) => mutation?.status === 'pending');
};

// Utility functions for common operations
export const createOtpRequest = (
  type: 'mobile' | 'email' | 'whatsapp',
  value: string
): OtpRequest => ({
  type,
  [type]: value,
});

export const createVerifyOtpRequest = (
  otpId: string,
  otp: string,
  type: 'mobile' | 'email' | 'whatsapp'
): VerifyOtpRequest => ({
  otpId,
  otp,
  type,
});