"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"

import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/app/store"
import { updatePersonalInfo } from "@/features/registerForm/registerFormSlice"
import PasswordInputField from "../shared/PasswordInputField"
import { validateField, passwordSchema, nameSchema } from "@/lib/validations"

const Step3PersonalInfoComponent = () => {
  const dispatch = useDispatch()
  const { firstName, lastName, password, confirmPassword } = useSelector(
    (state: RootState) => state.registerForm.personalInfo,
  )

  // ✅ State for inline validation errors
  const [fieldErrors, setFieldErrors] = useState<{
    firstName?: string
    lastName?: string
    password?: string
    confirmPassword?: string
  }>({})

  // ✅ Update field errors
  const updateFieldError = (fieldName: keyof typeof fieldErrors, error?: string) => {
    setFieldErrors(prev => ({
      ...prev,
      [fieldName]: error
    }))
  }

  // ✅ Validate first name
  const validateFirstName = (value: string) => {
    if (!value.trim()) {
      updateFieldError('firstName', 'First name is required')
      return
    }
    
    const validation = validateField(nameSchema, value)
    if (!validation.success) {
      updateFieldError('firstName', validation.error)
    } else {
      updateFieldError('firstName', undefined)
    }
  }

  // ✅ Validate last name (optional)
  const validateLastName = (value: string) => {
    if (value.trim()) {
      const validation = validateField(nameSchema, value)
      if (!validation.success) {
        updateFieldError('lastName', validation.error)
      } else {
        updateFieldError('lastName', undefined)
      }
    } else {
      updateFieldError('lastName', undefined)
    }
  }

  // ✅ Validate password
  const validatePassword = (value: string) => {
    if (!value) {
      updateFieldError('password', 'Password is required')
      return
    }
    
    const validation = validateField(passwordSchema, value)
    if (!validation.success) {
      updateFieldError('password', validation.error)
    } else {
      updateFieldError('password', undefined)
    }
  }

  // ✅ Validate confirm password
  const validateConfirmPassword = (value: string, originalPassword: string) => {
    if (!value) {
      updateFieldError('confirmPassword', 'Please confirm your password')
      return
    }
    
    if (value !== originalPassword) {
      updateFieldError('confirmPassword', 'Passwords do not match')
    } else {
      updateFieldError('confirmPassword', undefined)
    }
  }

  // ✅ Handle field changes with validation
  const handleFirstNameChange = (value: string) => {
    dispatch(updatePersonalInfo({ firstName: value }))
    validateFirstName(value)
  }

  const handleLastNameChange = (value: string) => {
    dispatch(updatePersonalInfo({ lastName: value }))
    validateLastName(value)
  }

  const handlePasswordChange = (value: string) => {
    dispatch(updatePersonalInfo({ password: value }))
    validatePassword(value)
    
    // Re-validate confirm password if it exists
    if (confirmPassword) {
      validateConfirmPassword(confirmPassword, value)
    }
  }

  const handleConfirmPasswordChange = (value: string) => {
    dispatch(updatePersonalInfo({ confirmPassword: value }))
    validateConfirmPassword(value, password)
  }

  // ✅ Validate on initial load if fields have values
  useEffect(() => {
    if (firstName) validateFirstName(firstName)
    if (lastName) validateLastName(lastName)
    if (password) validatePassword(password)
    if (confirmPassword) validateConfirmPassword(confirmPassword, password)
  }, [])

  return (
    <div className="space-y-6">
      <Card className="p-6 rounded-md bg-muted">
        <h3 className="text-lg font-medium">Personal Information</h3>
        <hr className="border-border" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="block mb-2 text-sm text-muted-foreground">First Name</Label>
            <Input
              value={firstName}
              onChange={(e) => handleFirstNameChange(e.target.value)}
              className={`h-10 px-4 text-sm border rounded-md bg-input ${
                fieldErrors.firstName ? "border-destructive" : "border-border"
              }`}
              placeholder="Enter your first name"
              required
            />
            {fieldErrors.firstName && (
              <p className="text-xs text-destructive mt-1 ml-1">
                {fieldErrors.firstName}
              </p>
            )}

          </div>

          <div>
            <Label className="block mb-2 text-sm text-muted-foreground">Last Name <span className="text-xs text-muted-foreground">(Optional)</span></Label>
            <Input
              value={lastName || ''}
              onChange={(e) => handleLastNameChange(e.target.value)}
              className={`h-10 px-4 text-sm border rounded-md bg-input ${
                fieldErrors.lastName ? "border-destructive" : "border-border"
              }`}
              placeholder="Enter your last name"
            />
            {fieldErrors.lastName && (
              <p className="text-xs text-destructive mt-1 ml-1">
                {fieldErrors.lastName}
              </p>
            )}

          </div>
        </div>
      </Card>

      <Card className="bg-muted p-6 rounded-md">
        <h3 className="text-lg font-semibold">Password</h3>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          Use at least one uppercase letter & mix letters with numbers
        </div>

        <hr className="border-border" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Label className="block text-sm text-muted-foreground mb-2">Enter Password</Label>
            <PasswordInputField
              value={password}
              onChange={handlePasswordChange}
              className={fieldErrors.password ? "border-destructive" : ""}
            />
            {fieldErrors.password && (
              <p className="text-xs text-destructive mt-1 ml-1">
                {fieldErrors.password}
              </p>
            )}
            {password && !fieldErrors.password && (
              <p className="text-xs text-muted-foreground mt-1 ml-1">
                Strong password
              </p>
            )}
          </div>

          <div className="relative">
            <Label className="block text-sm text-muted-foreground mb-2">Re-enter Password</Label>
            <PasswordInputField
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder="Confirm your password"
              className={fieldErrors.confirmPassword ? "border-destructive" : ""}
            />
            {fieldErrors.confirmPassword && (
              <p className="text-xs text-destructive mt-1 ml-1">
                {fieldErrors.confirmPassword}
              </p>
            )}
            {confirmPassword && !fieldErrors.confirmPassword && password === confirmPassword && (
              <p className="text-xs text-muted-foreground mt-1 ml-1">
                Passwords match
              </p>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}

const MemoizedStep3PersonalInfo = React.memo(Step3PersonalInfoComponent)
export default MemoizedStep3PersonalInfo
