// src/components/shared/EmailInputField.tsx
"use client"

import { Mail } from "lucide-react"
import { Input } from "@/components/ui/input"

interface EmailInputFieldProps {
  value: string
  onChange: (val: string) => void
  placeholder?: string
  disabled?: boolean
}

export default function EmailInputField({
  value,
  onChange,
  placeholder = "Enter your email",
  disabled = false,
}: EmailInputFieldProps) {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 flex items-center pl-4">
        <Mail className="h-5 w-5 text-muted-foreground" />
      </div>
      <Input
        type="email"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full h-10 pl-12 pr-4 bg-input text-sm border border-border rounded-md"
      />
    </div>
  )
}
