import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import PasswordSecurity from '@/utils/passwordSecurity';

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

// Enhanced base query with error handling and retry logic
const baseQueryWithRetry: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: 'https://api.freeapi.app/api/v1',
    prepareHeaders: (headers, { getState }) => {
      headers.set('Content-Type', 'application/json');
      headers.set('Accept', 'application/json');
      
      // Add auth token if available
      const token = (getState() as any).auth?.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      
      return headers;
    },
    // Remove credentials to fix CORS issue
    // credentials: 'include',
  });

  let result = await baseQuery(args, api, extraOptions);

  // Retry logic for network errors
  if (result.error && result.error.status === 'FETCH_ERROR') {
    console.warn('Network error, retrying...', result.error);
    
    // Wait before retry
    await new Promise(resolve => setTimeout(resolve, 1000));
    result = await baseQuery(args, api, extraOptions);

  }

  // Handle token refresh on 401
  if (result.error && result.error.status === 401) {
    console.warn('Token expired, attempting refresh...');
    
    // Attempt token refresh
    const refreshResult = await baseQuery(
      {
        url: '/auth/refresh',
        method: 'POST',
        body: {
          refreshToken: (api.getState() as any).auth?.refreshToken,
        },
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      // Retry original request with new token
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Refresh failed, logout user
      api.dispatch({ type: 'auth/logout' });
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
    // Email/Password Login (MOCKED for development)
    loginWithEmail: builder.mutation<LoginResponse, LoginRequest>({
      // TODO: Uncomment this when API is ready
      // query: (credentials) => {
      //   // Hash password before sending
      //   const hashedCredentials = {
      //     ...credentials,
      //     password: PasswordSecurity.hashPassword(credentials.password)
      //   };
      //   
      //   console.log('🔒 Password hashed for secure transmission');
      //   
      //   return {
      //     url: '/auth/login',
      //     method: 'POST',
      //     body: hashedCredentials,
      //   };
      // },
      // transformErrorResponse: (response: FetchBaseQueryError) => {
      //   return {
      //     status: response.status,
      //     message: (response.data as any)?.message || 'Login failed',
      //   };
      // },
      
      // MOCK IMPLEMENTATION - Remove when API is ready
      queryFn: async (credentials) => {
        // Hash password like the real API would
        const hashedPassword = PasswordSecurity.hashPassword(credentials.password);
        
        console.log('🔄 Mock Login - Original Password:', credentials.password);
        console.log('🔒 Mock Login - Hashed Password:', hashedPassword);
        console.log('🔄 Mock Login - Email:', credentials.email);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock validation - accept any email with "admin" or valid format
        const isValidEmail = credentials.email?.includes('@') || false;
        const isValidPassword = credentials.password && credentials.password.length > 0;
        
        if (!isValidEmail) {
          return {
            error: {
              status: 422,
              data: {
                success: false,
                message: 'Please enter a valid email address',
                errors: [{ field: 'email', message: 'Invalid email format' }]
              }
            }
          };
        }
        
        if (!isValidPassword) {
          return {
            error: {
              status: 422,
              data: {
                success: false,
                message: 'Password is required',
                errors: [{ field: 'password', message: 'Password cannot be empty' }]
              }
            }
          };
        }
        
        // Mock successful login response
        const mockUser = {
          id: "mock_user_" + Date.now(),
          email: credentials.email || "user@example.com",  
          mobile: "9876543210",
          name: credentials.email?.split('@')[0] || "Mock User",
          role: credentials.email?.includes('admin') ? "Admin" : "User"
        };
        
        const mockResponse: LoginResponse = {
          user: mockUser,
          token: "mock_jwt_token_" + btoa(JSON.stringify(mockUser)),
          refreshToken: "mock_refresh_token_" + Date.now()
        };
        
        console.log('✅ Mock Login Success:', mockResponse);
        return { data: mockResponse };
      },
      invalidatesTags: ['User', 'Session'],
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
