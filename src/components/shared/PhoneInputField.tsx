// src/components/shared/PhoneInputField.tsx
"use client"

import { Smartphone } from "lucide-react"
import { Input } from "@/components/ui/input"

interface PhoneInputFieldProps {
  value: string
  onChange: (val: string) => void
  placeholder?: string
  disabled?: boolean
}

export default function PhoneInputField({
  value,
  onChange,
  placeholder = "Enter your mobile number",
  disabled = false,
}: PhoneInputFieldProps) {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 flex items-center pl-4">
        <Smartphone className="h-5 w-5 text-muted-foreground" />
      </div>
      <Input
        type="tel"
        inputMode="numeric"
        pattern="[0-9]*"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 10))}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full h-10 pl-12 pr-4 bg-input text-sm border border-border rounded-md"
      />
    </div>
  )
}
