import { Button } from "@/components/ui/button"
import { useState } from "react"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { mobileLoginSchema, type MobileLoginData, formatPhoneNumber } from "@/lib/validations"
import { useSendOtpMutation, createOtpRequest } from "@/features/auth/authApiSlice"
import PhoneInputField from "@/components/shared/PhoneInputField"

interface MobileLoginProps {
  onOtpSent: () => void
  setMobile: (number: string) => void
}

export default function MobileLogin({ onOtpSent, setMobile }: MobileLoginProps) {
  const [loading, setLoading] = useState(false)
  
  // RTK Query hook - ready for API integration
  const [sendOtp, { isLoading: isOtpLoading }] = useSendOtpMutation()

  // ✅ React Hook Form with Zod validation
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    trigger,
    getValues
  } = useForm<MobileLoginData>({
    resolver: zodResolver(mobileLoginSchema),
    mode: "onChange", // Validate on change for real-time feedback
    defaultValues: {
      mobile: ""
    }
  })

  // Watch mobile value for custom input component
  const mobileValue = watch("mobile")

  // ✅ Handle form submission with proper validation
  const onSubmit = async (data: MobileLoginData) => {
    setLoading(true)
    
    try {
      console.log("✅ Validated mobile data:", data)
      
      // TODO: Uncomment when API is ready - Using RTK Query with LOGIN context
      // try {
      //   const otpRequest = createOtpRequest('mobile', data.mobile, 'login')
      //   const response = await sendOtp(otpRequest).unwrap()
      //   
      //   console.log('✅ Login OTP sent successfully:', response)
      //   
      //   // Store otpId for verification step
      //   localStorage.setItem('otpId', response.otpId)
      //   
      //   setMobile(data.mobile)
      //   toast.success(response.message || "Login OTP sent successfully!")
      //   onOtpSent()
      //   return
      // } catch (error: any) {
      //   console.error('Send Login OTP error:', error)
      //   
      //   // Handle login-specific error responses
      //   if (error.status === 400) {
      //     if (error.data?.code === 'MOBILE_NOT_REGISTERED') {
      //       toast.error('Mobile number not registered. Please sign up first.')
      //     } else {
      //       toast.error(error.data?.message || 'Invalid mobile number for login.')
      //     }
      //   } else if (error.status === 429) {
      //     const retryAfter = error.data?.retryAfter || 300
      //     toast.error(`Too many login OTP requests. Please try again in ${Math.ceil(retryAfter / 60)} minutes.`)
      //   } else if (error.status === 500) {
      //     toast.error('Server error. Please try again later.')
      //   } else if (error.status === 'FETCH_ERROR') {
      //     toast.error('Network error. Please check your internet connection.')
      //   } else {
      //     toast.error(error.data?.message || 'Failed to send login OTP. Please try again.')
      //   }
      //   return
      // }

      // MOCK IMPLEMENTATION - Remove when API is ready
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Mock OTP response for LOGIN context
      const mockOtpResponse = {
        success: true,
        message: "Login OTP sent successfully",
        otpId: `mock_login_otp_${Date.now()}_${data.mobile}`
      }
      
      console.log('📱 Mock LOGIN OTP Response:', mockOtpResponse)

      // Store mock otpId for verification step (same as real API would do)
      localStorage.setItem('otpId', mockOtpResponse.otpId)

      setMobile(data.mobile)
      toast.success(mockOtpResponse.message)
      onOtpSent()

    } catch (error: any) {
      console.error("Send Login OTP error:", error)
      
      // Mock error handling for LOGIN context (simulate different error scenarios)
      const mockErrorType = Math.random()
      
      if (mockErrorType < 0.15) {
        // Simulate mobile not registered error (login-specific)
        toast.error('Mobile number not registered. Please sign up first.')
      } else if (mockErrorType < 0.25) {
        // Simulate rate limiting error for login
        toast.error('Too many login OTP requests. Please try again in 5 minutes.')
      } else if (mockErrorType < 0.35) {
        // Simulate server error
        toast.error('Server error. Please try again later.')
      } else {
        // Default error for login
        toast.error("Failed to send login OTP. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  // ✅ Handle button click - validate and provide feedback
  const handleGetOtpClick = async () => {
    const currentValues = getValues()
    
    // Check if mobile is empty
    if (!currentValues.mobile) {
      (toast as any).error("Please enter your mobile number")
      // Focus on mobile field if possible
      (document.querySelector('input[type="tel"]') as HTMLInputElement | null)?.focus()
      return
    }
    
    // Trigger validation
    const isValid = await trigger()
    
    if (!isValid) {
      // Get specific error message
      const mobileError = errors.mobile?.message
      
      if (mobileError) {
        toast.error(`Mobile: ${mobileError}`)
        return
      }
      
      toast.error("Please enter a valid mobile number")
      return
    }
    
    // If validation passes, submit the form
    handleSubmit(onSubmit)()
  }

  // ✅ Handle real-time validation for custom component
  const handleMobileChange = async (value: string) => {
    const formattedValue = formatPhoneNumber(value)
    setValue("mobile", formattedValue, { shouldValidate: true })
    setMobile(formattedValue)
    await trigger("mobile")
  }

  // ✅ Get mobile number display format (with formatting)

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="mobile" className="block text-md text-muted-foreground mb-2">
          Mobile Number <span className="text-destructive">*</span>
        </label>
        
        {/* ✅ Custom PhoneInputField with validation */}
        <PhoneInputField
          value={mobileValue}
          onChange={handleMobileChange}
          className={errors.mobile ? "border-destructive focus:ring-destructive" : ""}
          placeholder="Enter your 10-digit mobile number"
          aria-invalid={!!errors.mobile}
          aria-describedby={errors.mobile ? "mobile-error" : undefined}
        />
        
        {/* ✅ Mobile validation error */}
        {errors.mobile && (
          <p id="mobile-error" className="text-xs text-destructive mt-1 ml-1" role="alert">
            {errors.mobile.message}
          </p>
        )}
      </div>

      {/* ✅ Submit button - ALWAYS ENABLED but validates on click */}
      <Button
        className="w-full py-5 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-medium rounded-xl"
        type="button"
        onClick={handleGetOtpClick}
        disabled={loading || isSubmitting || isOtpLoading} // Include RTK Query loading state
        aria-describedby="get-otp-button-description"
      >
        {(loading || isSubmitting || isOtpLoading) ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            Sending OTP...
          </span>
        ) : (
          "Get OTP"
        )}
      </Button>
      
      <div id="get-otp-button-description" className="sr-only">
        Click to get OTP. Form will validate and show specific error messages if needed.
      </div>

      
    </div>
  )
}
