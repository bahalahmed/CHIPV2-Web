"use client"

import { Input } from "@/components/ui/input"
import { Eye, EyeOff, Lock } from "lucide-react"
import { useState } from "react"

interface PasswordInputFieldProps {
  value: string
  onChange: (val: string) => void
  placeholder?: string
  id?: string
  compareWith?: string
  showMismatchError?: boolean
}

export default function PasswordInputField({
  value,
  onChange,
  placeholder = "Enter your password",
  id = "password",
  compareWith,
  showMismatchError = false,
}: PasswordInputFieldProps) {
  const [showPassword, setShowPassword] = useState(false)

  const isMismatch = showMismatchError && compareWith !== undefined && value.length > 0 && value !== compareWith

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 flex items-center pl-4">
        <Lock className="h-5 w-5 text-muted-foreground" />
      </div>
      <Input
        id={id}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full h-10 pl-12 pr-4 bg-input text-sm rounded-md border ${
          isMismatch ? "border-destructive" : "border-border"
        }`}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
      >
        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
      </button>
    </div>
  )
}
