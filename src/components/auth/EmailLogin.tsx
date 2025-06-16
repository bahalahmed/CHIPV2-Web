"use client"

import { memo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import PasswordInputField from "../shared/PasswordInputField"
import EmailInputField from "../shared/EmailInputField"
import { useLoginFormValidation } from "@/hooks/useFormValidation"
import { emailLoginSchema, type EmailLoginForm } from "@/lib/validationSchemas"
import { useLoginWithEmailMutation } from "@/features/auth/authApiSlice"
import { handleApiError } from "@/lib/errorHandling"
import { useAppDispatch } from "@/hooks/reduxHooks"
import { login } from "@/features/auth/authSlice"

interface EmailLoginProps {
  onForgotPassword: () => void
}

const EmailLogin = memo(function EmailLogin({ onForgotPassword }: EmailLoginProps) {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  
  // RTK Query mutation for login
  const [loginWithEmail, { isLoading }] = useLoginWithEmailMutation()
  
  // Use optimized form validation hook
  const {
    watch,
    handleFieldChange,
    handleValidatedSubmit,
    getFieldError,
    isFieldValid,
    isSubmitting,
  } = useLoginFormValidation<EmailLoginForm>(emailLoginSchema, {
    email: "",
    password: ""
  })

  // Memoized form values
  const emailValue = watch("email")
  const passwordValue = watch("password")

  // Optimized submission handler
  const onSubmit = useCallback(async (data: EmailLoginForm) => {
    try {
      const response = await loginWithEmail({
        email: data.email,
        password: data.password,
      }).unwrap()

      // Update Redux state with proper structure
      dispatch(login({
        username: data.email,
        password: data.password,
      }))

      // Store user data in localStorage for persistence
      localStorage.setItem("auth", JSON.stringify({
        user: response.user,
        token: response.token,
      }))

      // Navigate to dashboard
      navigate("/dashboard")
      
    } catch (error) {
      handleApiError(error, 'login')
    }
  }, [loginWithEmail, dispatch, navigate])

  // Memoized field change handlers
  const handleEmailChange = useCallback(
    handleFieldChange("email"),
    [handleFieldChange]
  )

  const handlePasswordChange = useCallback(
    handleFieldChange("password"),
    [handleFieldChange]
  )

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="email" className="block text-md text-muted-foreground mb-2">
          Email <span className="text-destructive">*</span>
        </label>
        
        <EmailInputField
          value={emailValue}
          onChange={handleEmailChange}
          className={!isFieldValid("email") ? "border-destructive focus:ring-destructive" : ""}
          placeholder="Enter your email address"
          aria-invalid={!isFieldValid("email")}
          aria-describedby={getFieldError("email") ? "email-error" : undefined}
        />
        
        {getFieldError("email") && (
          <p id="email-error" className="text-xs text-destructive mt-1 ml-1" role="alert">
            {getFieldError("email")}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="block text-md text-muted-foreground">
          Password <span className="text-destructive">*</span>
        </label>
        
        <PasswordInputField
          value={passwordValue}
          onChange={handlePasswordChange}
          className={!isFieldValid("password") ? "border-destructive focus:ring-destructive" : ""}
          placeholder="Enter your password"
          aria-invalid={!isFieldValid("password")}
          aria-describedby={getFieldError("password") ? "password-error" : undefined}
        />
        
        {getFieldError("password") && (
          <p id="password-error" className="text-xs text-destructive mt-1 ml-1" role="alert">
            {getFieldError("password")}
          </p>
        )}
      </div>

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
      
      <Button 
        className="w-full py-5 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-medium rounded-xl" 
        type="button"
        onClick={handleValidatedSubmit(onSubmit)}
        disabled={isSubmitting || isLoading}
        aria-describedby="login-button-description"
      >
        {(isSubmitting || isLoading) ? (
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
})

export default EmailLogin
