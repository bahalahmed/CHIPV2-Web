import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define types
interface ContactInfo {
  mobileNumber: string;
  whatsappNumber: string;
  email: string;
  mobileVerified: boolean;
  whatsappVerified: boolean;
  emailVerified: boolean;
  showMobileOtp: boolean;
  showWhatsappOtp: boolean;
  showEmailOtp: boolean;
  mobileOtp: string[];
  whatsappOtp: string[];
  emailOtp: string[];
}

interface LevelInfo {
  selectedLevel: string;
  state: string;
  division: string;
  district: string;
  block: string;
  sector: string;
  organizationType: string;
  designation: string;
}

interface PersonalInfo {
  fullName: string;
  gender: string;
  password: string;
  confirmPassword: string;
}

interface RegisterFormState {
  step: number;
  contactInfo: ContactInfo;
  levelInfo: LevelInfo;
  personalInfo: PersonalInfo;
}

// Initial State
const initialState: RegisterFormState = {
  step: 1,
  contactInfo: {
    mobileNumber: "",
    whatsappNumber: "",
    email: "",
    mobileVerified: false,
    whatsappVerified: false,
    emailVerified: false,
    showMobileOtp: false,
    showWhatsappOtp: false,
    showEmailOtp: false,
    mobileOtp: Array(6).fill(""),
    whatsappOtp: Array(6).fill(""),
    emailOtp: Array(6).fill(""),
  },
  levelInfo: {
    selectedLevel: "State",
    state: "",
    division: "",
    district: "",
    block: "",
    sector: "",
    organizationType: "",
    designation: "",
  },
  personalInfo: {
    fullName: "",
    gender: "",
    password: "",
    confirmPassword: "",
  },
};

// Slice
const registerFormSlice = createSlice({
  name: "registerForm",
  initialState,
  reducers: {
    setStep(state, action: PayloadAction<number>) {
      state.step = action.payload;
    },

    resetForm() {
      return initialState;
    },

    // 🟦 Contact Info
    updateContactInfo(state, action: PayloadAction<Partial<ContactInfo>>) {
      state.contactInfo = { ...state.contactInfo, ...action.payload };
    },
    setMobileVerified(state, action: PayloadAction<boolean>) {
      state.contactInfo.mobileVerified = action.payload;
    },
    setWhatsappVerified(state, action: PayloadAction<boolean>) {
      state.contactInfo.whatsappVerified = action.payload;
    },
    setEmailVerified(state, action: PayloadAction<boolean>) {
      state.contactInfo.emailVerified = action.payload;
    },
    setShowMobileOtp(state, action: PayloadAction<boolean>) {
      state.contactInfo.showMobileOtp = action.payload;
    },
    setShowWhatsappOtp(state, action: PayloadAction<boolean>) {
      state.contactInfo.showWhatsappOtp = action.payload;
    },
    setShowEmailOtp(state, action: PayloadAction<boolean>) {
      state.contactInfo.showEmailOtp = action.payload;
    },
    setMobileOtp(state, action: PayloadAction<string[]>) {
      state.contactInfo.mobileOtp = action.payload;
    },
    setWhatsappOtp(state, action: PayloadAction<string[]>) {
      state.contactInfo.whatsappOtp = action.payload;
    },
    setEmailOtp(state, action: PayloadAction<string[]>) {
      state.contactInfo.emailOtp = action.payload;
    },

    // 🟨 Level Info
    updateLevelInfo(state, action: PayloadAction<Partial<LevelInfo>>) {
      state.levelInfo = { ...state.levelInfo, ...action.payload };
    },

    // 🟩 Personal Info
    updatePersonalInfo(state, action: PayloadAction<Partial<PersonalInfo>>) {
      state.personalInfo = { ...state.personalInfo, ...action.payload };
    },
  },
});

export const {
  setStep,
  resetForm,

  updateContactInfo,
  setMobileVerified,
  setWhatsappVerified,
  setEmailVerified,
  setShowMobileOtp,
  setShowWhatsappOtp,
  setShowEmailOtp,
  setMobileOtp,
  setWhatsappOtp,
  setEmailOtp,

  updateLevelInfo,
  updatePersonalInfo,
} = registerFormSlice.actions;

export default registerFormSlice.reducer;
