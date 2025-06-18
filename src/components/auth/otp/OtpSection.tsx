"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp"
import { useAppDispatch } from "@/hooks/reduxHooks"
import { setOtpSent } from "@/features/auth/loginTabSlice"

import { CheckCircle } from "lucide-react"
import { useVerifyOtpMutation } from "@/features/auth/authApiSlice"
import EmailInputField from "@/components/shared/EmailInputField"
import PhoneInputField from "@/components/shared/PhoneInputField"

interface OtpSectionProps {
  label: string
  type: "mobile" | "whatsapp" | "email"
  value: string
  verified: boolean
  setVerified: (v: boolean) => void
  showOtpInput: boolean
  setShowOtpInput: (v: boolean) => void
  otp: string[]
  setOtp: (val: string[]) => void
  onVerified?: () => void
  redirectAfterVerify?: string
  mode?: "login" | "default"
  onChange?: (value: string) => void
  sameAsCheckbox?: {
    checked: boolean
    onChange: (checked: boolean) => void
    label: string
  }
}

export function OtpSection({
  label,
  type,
  value,
  verified,
  setVerified,
  showOtpInput,
  setShowOtpInput,
  otp,
  setOtp,
  onVerified,
  redirectAfterVerify,
  mode = "default",
  onChange,
  sameAsCheckbox,
}: OtpSectionProps) {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [timer, setTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [resendTrigger, setResendTrigger] = useState(0)
  const [isVerifying, setIsVerifying] = useState(false)
  const [attemptCount, setAttemptCount] = useState(0)
  const [isBlocked, setIsBlocked] = useState(false)
  const [blockTimer, setBlockTimer] = useState(0)

  // RTK Query hook - ready for API integration  
  const [, { isLoading: isOtpVerifying }] = useVerifyOtpMutation()

  const handleSubmitOtp = async () => {
    const fullOtp = otp.join("")
    
    // ✅ Check if user is blocked due to failed attempts
    if (isBlocked) {
      toast.error(`Too many failed attempts. Please try again in ${Math.ceil(blockTimer / 60)} minutes.`)
      return
    }
    
    // ✅ Only validate when we have exactly 6 digits
    if (fullOtp.length === 6 && /^\d{6}$/.test(fullOtp)) {
      setIsVerifying(true)
      
      try {
        // TODO: Uncomment when API is ready - Using RTK Query
        // const otpId = localStorage.getItem('otpId') || 'stored_otp_id'
        // const verifyRequest = createVerifyOtpRequest(otpId, fullOtp, type)
        // const response = await verifyOtp(verifyRequest).unwrap()
        // 
        // console.log('✅ OTP verified successfully:', response)
        // // RTK Query automatically handles Redux state via authSlice matchers
        // toast.success(`${label} verified successfully!`)
        // setVerified(true)

        // MOCK IMPLEMENTATION - Remove when API is ready
        await new Promise(resolve => setTimeout(resolve, 500))

        // Mock Step 2: Verify OTP response
        const mockVerifyOtpResponse = {
          success: true,
          verified: true,
          user: {
            id: "mob-67890",
            mobile: value,
            name: "John Doe",
            role: "User"
          },
          token: `mock_jwt_token_${Date.now()}`,
          refreshToken: `mock_refresh_token_${Date.now()}`
        }
        
        console.log('📱 Mock Step 2 - Verify OTP Response:', mockVerifyOtpResponse)

        // RTK Query would automatically handle Redux state via authSlice matchers
        // For mock, we'll simulate this by dispatching to trigger the matcher
        console.log('Mock: RTK Query would handle auth state automatically')

        toast.success(`${label} verified successfully!`)
        setVerified(true)
        
        // ✅ Reset OTP state after successful verification
        if (mode === "login") {
          dispatch(setOtpSent(false))
        }
        
        onVerified?.()
        
        if (redirectAfterVerify) {
          // ✅ Use normal navigation (not replace) so back button works properly
          navigate(redirectAfterVerify)
        }
        
      } catch (error: any) {
        console.error('OTP verification error:', error)
        
        // TODO: Uncomment when API is ready - Comprehensive error handling
        // // Handle specific error responses
        // if (error.status === 400) {
        //   if (error.data?.code === 'INVALID_OTP') {
        //     toast.error('Invalid OTP code. Please check and try again.')
        //   } else if (error.data?.code === 'OTP_EXPIRED') {
        //     toast.error('OTP has expired. Please request a new one.')
        //     setShowOtpInput(false)
        //   } else if (error.data?.code === 'OTP_ALREADY_USED') {
        //     toast.error('OTP already used. Please request a new one.')
        //     setShowOtpInput(false)
        //   } else {
        //     toast.error(error.data?.message || 'Invalid OTP format.')
        //   }
        // } else if (error.status === 404) {
        //   toast.error('OTP session not found. Please request a new OTP.')
        //   setShowOtpInput(false)
        // } else if (error.status === 429) {
        //   const retryAfter = error.data?.retryAfter || 300
        //   toast.error(`Too many verification attempts. Please try again in ${Math.ceil(retryAfter / 60)} minutes.`)
        // } else if (error.status === 500) {
        //   toast.error('Server error. Please try again later.')
        // } else if (error.status === 'FETCH_ERROR') {
        //   toast.error('Network error. Please check your internet connection.')
        // } else {
        //   toast.error(error.data?.message || 'OTP verification failed. Please try again.')
        // }
        
        // Mock error handling with 3-attempt rate limiting
        const mockErrorType = Math.random()
        
        if (mockErrorType < 0.6) {
          // Simulate invalid OTP error (60% chance to test rate limiting)
          const newAttemptCount = attemptCount + 1
          setAttemptCount(newAttemptCount)
          
          if (newAttemptCount >= 3) {
            // Block user after 3 failed attempts
            setIsBlocked(true)
            setBlockTimer(300) // 5 minutes block
            toast.error('Too many failed attempts. You are blocked for 5 minutes.')
            setOtp(Array(6).fill(""))
            
            // Start countdown timer
            const blockInterval = setInterval(() => {
              setBlockTimer(prev => {
                if (prev <= 1) {
                  clearInterval(blockInterval)
                  setIsBlocked(false)
                  setAttemptCount(0)
                  return 0
                }
                return prev - 1
              })
            }, 1000)
          } else {
            toast.error(`Invalid OTP code. ${3 - newAttemptCount} attempts remaining.`)
            setOtp(Array(6).fill("")) // Clear OTP on invalid
          }
        } else if (mockErrorType < 0.7) {
          // Simulate expired OTP error
          toast.error('OTP has expired. Please request a new one.')
          setShowOtpInput(false)
          setOtp(Array(6).fill(""))
          setAttemptCount(0) // Reset attempts on session reset
        } else if (mockErrorType < 0.8) {
          // Simulate session not found error
          toast.error('OTP session not found. Please request a new OTP.')
          setShowOtpInput(false)
          setOtp(Array(6).fill(""))
          setAttemptCount(0) // Reset attempts on session reset
        } else {
          // Default error
          toast.error('OTP verification failed. Please try again.')
        }
      } finally {
        setIsVerifying(false)
      }
    }
    // ✅ Don't show error for incomplete OTP (less than 6 digits)
  }

  // ✅ Only trigger validation when OTP is complete (6 digits)
  useEffect(() => {
    if (otp.every((digit) => digit !== "") && otp.length === 6) {
      handleSubmitOtp()
    }
  }, [otp])

  useEffect(() => {
    setTimer(60)
    setCanResend(false)
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(countdown)
          setCanResend(true)
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(countdown)
  }, [resendTrigger])

  const handleSendOTP = () => {
    if (type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) return toast.error("Please enter a valid email.")
    } else {
      const digits = value.replace(/\D/g, "")
      if (digits.length !== 10 || !/^[6-9]/.test(digits)) {
        return toast.error(`Enter a valid 10-digit ${label.toLowerCase()}`)
      }
    }
    setShowOtpInput(true)
    setOtp(Array(6).fill(""))
    setResendTrigger((prev) => prev + 1)
    toast.success("OTP sent successfully!")
  }

  const handleChangeClick = () => {
    setShowOtpInput(false)
    setVerified(false)
    setOtp(Array(6).fill(""))
    setTimer(60)
    setCanResend(false)
    setIsVerifying(false)
    setAttemptCount(0) // Reset attempt count when changing number
    setIsBlocked(false) // Remove block when changing number
    setBlockTimer(0)

    if (mode === "login") {
      dispatch(setOtpSent(false))
    }
  }

  const getInputLabel = () => {
    if (type === "mobile") return "Mobile Number"
    if (type === "whatsapp") return "WhatsApp Number"
    return "Email ID"
  }

  const getVerificationTitle = () => {
    if (type === "mobile") return "Mobile Verification"
    if (type === "whatsapp") return "WhatsApp Verification"
    return "Email ID Verification"
  }

  const renderInputField = () => {
    if (type === "email") {
      return (
        <EmailInputField
          value={value}
          onChange={(val) => onChange?.(val)}
          placeholder="Enter your email"
        />
      )

    } else {
      return (
        <PhoneInputField
          value={value}
          onChange={(val) => onChange?.(val)}
          placeholder="Enter your number"
        />
      )
    }
  }

  // ✅ OTP Input UI with better handling
  const renderOtpInput = () => (
    <div className="flex justify-center">
      <InputOTP
        maxLength={6}
        value={otp.join("")}
        onChange={(val) => {
          const sanitized = val.replace(/\D/g, "").slice(0, 6)
          const otpArray = sanitized.split("")
          // ✅ Pad with empty strings to maintain 6-length array
          while (otpArray.length < 6) {
            otpArray.push("")
          }
          setOtp(otpArray)
        }}
        disabled={isVerifying || isOtpVerifying || isBlocked}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
    </div>
  )

  if (mode === "login" && showOtpInput) {
    return (
      <div className="space-y-6 text-center">
        <h2 className="text-2xl font-semibold text-text-heading">
          Login <span className="text-muted-foreground font-normal">with</span>
        </h2>
        <p className="text-sm text-muted-foreground flex justify-center items-center gap-2 flex-wrap">
          We have sent a 6 digit OTP code to <span className="text-primary font-semibold">{value}</span>
          <button
            className="ml-1 text-sm text-accent flex items-center gap-1 hover:underline"
            onClick={handleChangeClick}
            disabled={isVerifying || isOtpVerifying}
          >
            🔄 Change
          </button>
        </p>
        
        {renderOtpInput()}
        
        {/* ✅ Show verification status */}
        {isBlocked && (
          <div className="flex items-center justify-center gap-2 text-sm text-destructive">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m0 0v2m0-2h2m-2 0H10m2-5V7m0 0V5m0 2h2m-2 0H10" />
            </svg>
            Blocked for {Math.ceil(blockTimer / 60)} minutes due to failed attempts
          </div>
        )}
        
        {(isVerifying || isOtpVerifying) && !isBlocked && (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            Verifying OTP...
          </div>
        )}
        
        <div className="text-sm font-medium">
          {canResend ? (
            <button 
              onClick={handleSendOTP} 
              className="hover:underline text-accent"
              disabled={isVerifying || isOtpVerifying}
            >
              Resend OTP
            </button>
          ) : (
            <span className="text-text-heading">Resend OTP in 00:{timer.toString().padStart(2, "0")}</span>
          )}
        </div>

      </div>
    )
  }

  return (
    <div className="bg-muted p-8 rounded-xl">
      <h3 className="text-xl font-medium text-gray mb-2">{getVerificationTitle()}</h3>
      <hr className="mb-4 border-border" />

      {verified ? (
        <div className="relative">
          <Input value={value} disabled className="bg-background pr-10 py-6 font-semibold" />
          <CheckCircle className="text-success h-5 w-5 absolute top-1/2 right-3 -translate-y-1/2" />
        </div>
      ) : showOtpInput ? (
        <div className="text-center space-y-4">
          <p className="text-sm text-gray flex justify-center items-center gap-2 flex-wrap">
            We have sent a 6-digit OTP code to <span className="text-primary font-semibold">{value}</span>
            <button
              className="ml-1 text-sm text-primary flex items-center gap-1 hover:underline"
              onClick={handleChangeClick}
            >
              🔄 Change
            </button>
          </p>
          {renderOtpInput()}
          <div className="text-sm font-medium">
            {canResend ? (
              <button onClick={handleSendOTP} className="hover:underline text-accent">
                Resend OTP
              </button>
            ) : (
              <span className="text-text-heading">Resend OTP in 00:{timer.toString().padStart(2, "0")}</span>
            )}
          </div>
        </div>
      ) : (
        <>
          <div>
            <label className="block text-muted-foreground ml-1 mb-4">{getInputLabel()}</label>
            <div className="flex items-center gap-4">
              <div className="flex-1">{renderInputField()}</div>
              <button
                onClick={handleSendOTP}
                className="bg-primary hover:bg-primary/90 text-background font-medium rounded-lg h-10 px-6 min-w-[120px] whitespace-nowrap"
              >
                Send OTP
              </button>
            </div>
          </div>

          {/* ✅ Same as above checkbox (only for WhatsApp) */}
          {type === "whatsapp" && sameAsCheckbox && (
            <div className="flex items-center mt-4">
              <label className="inline-flex items-center gap-2 text-heading">
                <input
                  type="checkbox"
                  checked={sameAsCheckbox.checked}
                  onChange={(e) => sameAsCheckbox.onChange(e.target.checked)}
                  className="w-4 h-4 text-accent rounded border-border"
                />
                <span>Same as above</span>
              </label>
            </div>
          )}
        </>
      )}
    </div>
  )
}
