// src/features/auth/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { loginUser } from './authApi';


interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  isAuthenticated: !!localStorage.getItem('user'),
  loading: false,
  error: null,
};

// ✅ Thunk: login
export const login = createAsyncThunk(
  'auth/login',
  async (
    { username, password }: { username: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      console.log("logging in with", username, password);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const res = await loginUser(username, password);
      

      // ✅ You may receive a token or rely on httpOnly cookie
      const user = {
        id: '1',
        name: username,
        email: `${username}@example.com`,
      };

      return { user };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Login failed. Please check credentials.'
      );
    }
  }
);

// ✅ Thunk: logout
export const logout = createAsyncThunk('auth/logout', async () => {
  logoutUser();
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuth(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('user');
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;

        // ✅ Save only user to localStorage (not token)
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        localStorage.removeItem('user');
      });
  },
});

export const { resetAuth, setError } = authSlice.actions;
export default authSlice.reducer;
function logoutUser() {
  throw new Error('Function not implemented.');
}

