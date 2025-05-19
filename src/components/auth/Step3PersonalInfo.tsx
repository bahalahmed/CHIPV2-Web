"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"

import React from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/app/store"
import { updatePersonalInfo } from "@/features/registerForm/registerFormSlice"
import PasswordInputField from "../shared/PasswordInputField"

const Step3PersonalInfoComponent = () => {
  const dispatch = useDispatch()
  const { firstName, lastName, password, confirmPassword } = useSelector(
    (state: RootState) => state.registerForm.personalInfo,
  )

  const passwordsMatch = password === confirmPassword

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
              onChange={(e) => dispatch(updatePersonalInfo({ firstName: e.target.value }))}
              className="h-10 px-4 text-sm border border-border rounded-md bg-input"
              placeholder="Enter your first name"
              required
            />
          </div>

          <div>
            <Label className="block mb-2 text-sm text-muted-foreground">Last Name <span className="text-xs text-muted-foreground">(Optional)</span></Label>
            <Input
              value={lastName || ''}
              onChange={(e) => dispatch(updatePersonalInfo({ lastName: e.target.value }))}
              className="h-10 px-4 text-sm border border-border rounded-md bg-input"
              placeholder="Enter your last name"
            />
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
              onChange={(val) => dispatch(updatePersonalInfo({ password: val }))}
            />
          </div>

          <div className="relative">
            <Label className="block text-sm text-muted-foreground mb-2">Re-enter Password</Label>
            <PasswordInputField
              value={confirmPassword}
              onChange={(val) => dispatch(updatePersonalInfo({ confirmPassword: val }))}
              placeholder="Confirm your password"
              compareWith={password}
              showMismatchError
            />
            {!passwordsMatch && confirmPassword.length > 0 && (
              <p className="text-xs text-destructive mt-1 ml-1">Passwords do not match</p>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}

const MemoizedStep3PersonalInfo = React.memo(Step3PersonalInfoComponent)
export default MemoizedStep3PersonalInfo
