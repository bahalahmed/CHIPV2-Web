"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import PasswordInputField from "../shared/PasswordInputField"
import EmailInputField from "../shared/EmailInputField"
import { emailLoginSchema, type EmailLoginData, checkPasswordStrength } from "@/lib/validations"
// import { useAppDispatch } from '@/hooks/reduxHooks'
// import { login } from '@/features/auth/authSlice'

interface EmailLoginProps {
  onForgotPassword: () => void
}

export default function EmailLogin({ onForgotPassword }: EmailLoginProps) {
  const navigate = useNavigate()
  // const dispatch = useAppDispatch()

  // ✅ React Hook Form with Zod validation (now includes password strength validation)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    trigger,
    getValues
  } = useForm<EmailLoginData>({
    resolver: zodResolver(emailLoginSchema),
    mode: "onChange", // Validate on change for real-time feedback
    defaultValues: {
      email: "",
      password: ""
    }
  })

  // Watch form values for custom input components
  const emailValue = watch("email")
  const passwordValue = watch("password")

  // ✅ Get password strength for display
  const passwordStrength = passwordValue ? checkPasswordStrength(passwordValue) : null

  // ✅ Handle form submission with proper validation
  const onSubmit = async (data: EmailLoginData) => {
    try {
      console.log("✅ Validated login data:", data)
      
      // ✅ FUTURE: Replace this block with actual API call
      // const res = await axios.post("/api/auth/login", {
      //   email: data.email,
      //   password: data.password
      // })
      // const { user, token } = res.data
      // dispatch(login({ user, token }))

      // Mock API call simulation
      await new Promise(resolve => setTimeout(resolve, 1000))

      const mockUser = {
        id: "12345",
        name: "John Doe",
        email: data.email,
        role: "Admin",
      }

      const mockToken = "fake-jwt-token"

      // ✅ Save to Redux (uncomment when ready)
      // dispatch(setUser({ user: mockUser, token: mockToken }))

      // ✅ Save to LocalStorage
      localStorage.setItem("auth", JSON.stringify({ user: mockUser, token: mockToken }))

      toast.success("Logged in successfully!")
      navigate("/dashboard")
      
    } catch (error) {
      console.error("Login error:", error)
      toast.error("Login failed. Please check your credentials and try again.")
    }
  }

  // ✅ Handle button click - validate and provide feedback
  const handleLoginClick = async () => {
    const currentValues = getValues()
    
    // Check if form is empty
    if (!currentValues.email && !currentValues.password) {
      toast.error("Please enter your email and password")
      return
    }
    
    // Check individual fields and provide specific feedback
    if (!currentValues.email) {
      toast.error("Please enter your email address")
      // Focus on email field if possible
      document.querySelector('input[type="email"]')?.focus()
      return
    }
    
    if (!currentValues.password) {
      toast.error("Please enter your password")
      // Focus on password field if possible
      document.querySelector('input[type="password"]')?.focus()
      return
    }
    
    // Trigger validation for all fields
    const isValid = await trigger()
    
    if (!isValid) {
      // Get specific error messages
      const emailError = errors.email?.message
      const passwordError = errors.password?.message
      
      if (emailError) {
        toast.error(`Email: ${emailError}`)
        return
      }
      
      if (passwordError) {
        toast.error(`Password: ${passwordError}`)
        return
      }
      
      toast.error("Please fix the errors and try again")
      return
    }
    
    // If validation passes, submit the form
    handleSubmit(onSubmit)()
  }

  // ✅ Handle real-time validation for custom components
  const handleEmailChange = async (value: string) => {
    setValue("email", value, { shouldValidate: true })
    await trigger("email")
  }

  const handlePasswordChange = async (value: string) => {
    setValue("password", value, { shouldValidate: true })
    await trigger("password")
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="email" className="block text-md text-muted-foreground mb-2">
          Email <span className="text-destructive">*</span>
        </label>
        
        {/* ✅ Custom EmailInputField with validation */}
        <EmailInputField
          value={emailValue}
          onChange={handleEmailChange}
          className={errors.email ? "border-destructive focus:ring-destructive" : ""}
          placeholder="Enter your email address"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        
        {/* ✅ Email validation error */}
        {errors.email && (
          <p id="email-error" className="text-xs text-destructive mt-1 ml-1" role="alert">
            {errors.email.message}
          </p>
        )}
       
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="block text-md text-muted-foreground">
          Password <span className="text-destructive">*</span>
        </label>
        
        {/* ✅ Custom PasswordInputField with validation */}
        <PasswordInputField
          value={passwordValue}
          onChange={handlePasswordChange}
          className={errors.password ? "border-destructive focus:ring-destructive" : ""}
          placeholder="Enter your password"
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? "password-error" : undefined}
        />
        
        {/* ✅ Password validation error */}
        {errors.password && (
          <p id="password-error" className="text-xs text-destructive mt-1 ml-1" role="alert">
            {errors.password.message}
          </p>
        )}


       
      </div>

      {/* ✅ Forgot password link */}
      <div className="text-right">
        <p className="text-right text-sm mt-2">
          <button
            type="button"
            className="text-accent hover:underline focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded"
            onClick={onForgotPassword}
            tabIndex={0}
          >
            Forgot Password?
          </button>
        </p>
      </div>
      
      {/* ✅ Submit button - ALWAYS ENABLED but validates on click */}
      <Button 
        className="w-full py-5 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-medium rounded-xl" 
        type="button"
        onClick={handleLoginClick}
        disabled={isSubmitting} // Only disable when submitting
        aria-describedby="login-button-description"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            Signing in...
          </span>
        ) : (
          "Login"
        )}
      </Button>
      
      <div id="login-button-description" className="sr-only">
        Click to login. Form will validate and show specific error messages if needed.
      </div>
    </div>
  )
}
