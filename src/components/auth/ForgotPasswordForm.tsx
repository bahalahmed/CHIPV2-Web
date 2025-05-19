"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import EmailInputField from "../shared/EmailInputField"

interface ForgotPasswordFormProps {
  onBack: () => void;
}

export default function ForgotPassword({ onBack }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
          toast.error("Please enter a valid email address")
          return
        }
    setIsLoading(true)

    

    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSubmitted(true)
    toast.success("Password reset link sent to your email.")
    setIsLoading(false)
  }

  const handleBackToLogin = () => onBack()

  return (
    <div className="container mx-auto max-w-md px-4 py-8">
      <div className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-md text-muted-foreground mb-3">
              Email Address
            </label>
            <EmailInputField
              value={email}
              onChange={(val) => setEmail(val)}
              disabled={isSubmitted}
            />
          </div>

          {isSubmitted && (
            <div className="text-green-600">
              We have sent the password reset link to your registered email address. Please check your inbox.
            </div>
          )}

          {!isSubmitted ? (
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-5 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-medium rounded-xl"
            >
              {isLoading ? "Sending..." : "Reset Password"}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleBackToLogin}
              className="w-full py-5 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-medium rounded-xl"
            >
              Back to Login
            </Button>
          )}
        </form>

        {!isSubmitted && (
          <div className="text-center text-muted-foreground text-sm mt-6">
            Already have an account?{" "}
            <button
              type="button"
              onClick={handleBackToLogin}
              className="text-accent hover:underline"
            >
              Login here
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
