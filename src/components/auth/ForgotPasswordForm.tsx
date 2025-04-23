"use client"

import type React from "react"

import { useState } from "react"
import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"


interface ForgotPasswordFormProps {
  onBack: () => void;
}

export default function ForgotPassword({ onBack }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSubmitted(true)
    toast.success("Password reset link sent to your email.")

    setIsLoading(false)
  }

  const handleBackToLogin = () => {
    onBack()
  }

  return (
    <div className="container mx-auto max-w-md px-4 py-8">
      <div className="space-y-6">
       
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-md text-muted-foreground mb-3">
              {isSubmitted ? "Email Address" : "Email Address"}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                <Mail className="h-5 w-5 text-black" />
              </div>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="username@gmail.com"
                className="w-full h-10 pl-12 pr-4 bg-input text-sm border border-border rounded-md"
                disabled={isSubmitted}
                required
              />
            </div>
          </div>

          {isSubmitted && (
            <div className="text-green-600">
              We have sent the password reset link to your registered email address please check your inbox.
            </div>
          )}

          {!isSubmitted ? (
            <Button
              type="submit"
              disabled={isLoading}
             className="w-full py-6 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-medium rounded-xl"
            >
              {isLoading ? "Sending..." : "Reset Password"}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleBackToLogin}
              className="w-full py-6 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-medium rounded-xl"
            >
              Back to Login
            </Button>
          )}
        </form>

      
      </div>
    </div>
  )
}


