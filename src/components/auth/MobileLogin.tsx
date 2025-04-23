"use client"

import type React from "react"

// src/components/auth/MobileLogin.tsx

import { Button } from "@/components/ui/button"
import { useState } from "react"
import { toast } from "sonner"

import PhoneInputField from "../shared/PhoneInputField"
//import { useAppDispatch } from '@/hooks/reduxHooks'


interface MobileLoginProps {
  onOtpSent: () => void
  setMobile: (number: string) => void
}

export default function MobileLogin({ onOtpSent, setMobile }: MobileLoginProps) {
  const [mobileInput, setMobileInput] = useState("")
  const [loading, setLoading] = useState(false)

  //const dispatch = useAppDispatch()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!mobileInput || mobileInput.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number")
      return
    }

    setLoading(true)

    try {
      // ✅ FUTURE: Replace with actual API call
      // const res = await axios.post("/api/send-otp", { mobile: mobileInput });
      // const { user, token } = res.data;

      const mockUser = {
        id: "mob-67890",
        name: "Mobile User",
        email: "mobileuser@example.com",
        mobile: mobileInput,
        role: "User",
      }

      const mockToken = "mock-mobile-jwt-token"

      //dispatch(setUser({ user: mockUser, token: mockToken }))

      localStorage.setItem("auth", JSON.stringify({ user: mockUser, token: mockToken }))

      setMobile(mobileInput)
      toast.success("OTP sent successfully!")
      onOtpSent()

      // ✅ OPTIONAL: navigate to dashboard or OTP screen
      // navigate("/otp-verification");
    } catch {
      toast.error("Failed to send OTP. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {" "}
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label htmlFor="mobile" className="block text-md text-muted-foreground mb-2">
            Mobile Number
          </label>
          <PhoneInputField
            value={mobileInput}
            onChange={(val) => {
              setMobileInput(val)
              setMobile(val)
            }}
          />

        </div>

        <Button
          className="w-full py-6  bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-medium rounded-xl"
          variant="default"
          type="submit"
          disabled={loading}
        >
          {loading ? "Sending OTP..." : "Get OTP"}
        </Button>
      </form>
    </>
  )
}
