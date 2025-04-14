// src/app/store.ts
import { configureStore } from "@reduxjs/toolkit";
import loginTabReducer from "@/features/auth/loginTabSlice";
import authReducer from "@/features/auth/authSlice";
import registerFormReducer from "@/features/registerForm/registerFormSlice";
import otpReducer from "@/features/auth/otpSlice";

export const store = configureStore({
  reducer: {
    loginTab: loginTabReducer,
    auth: authReducer,
    registerForm: registerFormReducer,
    otp: otpReducer,
  },
});

//Types for useDispatch and useSelector
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
