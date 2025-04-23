"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp"
import { useAppDispatch } from "@/hooks/reduxHooks"
import { setOtpSent } from "@/features/auth/loginTabSlice"
import PhoneInputField from "../shared/PhoneInputField"
import EmailInputField from "../shared/EmailInputField"
import { CheckCircle } from "lucide-react"



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
  const [timer, setTimer] = useState(30)
  const [canResend, setCanResend] = useState(false)
  const [resendTrigger, setResendTrigger] = useState(0)

  const handleSubmitOtp = () => {
    const fullOtp = otp.join("")
    if (fullOtp.length === 6 && /^\d{6}$/.test(fullOtp)) {
      toast.success(`${label} verified successfully!`)
      setVerified(true)
      onVerified?.()
      if (redirectAfterVerify) navigate(redirectAfterVerify)
    }
  }

  useEffect(() => {
    if (otp.every((digit) => digit !== "")) handleSubmitOtp()
  }, [otp])

  useEffect(() => {
    setTimer(30)
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

  const dispatch = useAppDispatch()
  const handleChangeClick = () => {
    setShowOtpInput(false)
    setVerified(false)
    setOtp(Array(6).fill(""))
    setTimer(30)
    setCanResend(false)

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

  // ✅ OTP Input UI
  const renderOtpInput = () => (
    <div className="flex justify-center">
      <InputOTP
        maxLength={6}
        value={otp.join("")}
        onChange={(val) => {
          const sanitized = val.replace(/\D/g, "").slice(0, 6)
          setOtp(sanitized.split(""))
        }}
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
      <div className=" space-y-6 text-center">
        <h2 className="text-2xl font-semibold text-text-heading">
          Login <span className="text-muted-foreground font-normal">with</span>
        </h2>
        <p className="text-sm text-muted-foreground flex justify-center items-center gap-2 flex-wrap">
          We have sent a 6 digit OTP code to <span className="text-accent font-semibold">{value}</span>
          <button
            className="ml-1 text-sm text-accent flex items-center gap-1 hover:underline"
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
