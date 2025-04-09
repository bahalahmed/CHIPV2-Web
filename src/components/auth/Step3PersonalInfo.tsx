"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { updatePersonalInfo } from "@/features/registerForm/registerFormSlice";

const Step3PersonalInfoComponent = () => {
  const dispatch = useDispatch();
  const { fullName, gender, password, confirmPassword } = useSelector(
    (state: RootState) => state.registerForm.personalInfo
  );

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const passwordsMatch = password === confirmPassword;

  return (
    <div className="space-y-6">
      <Card className="p-6 rounded-md bg-[#f8f9fc]">
        <h3 className="text-lg font-medium">Personal Information</h3>
        <hr className="border-gray-300" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="block mb-2 text-sm text-gray-600">Full Name</Label>
            <Input
              value={fullName}
              onChange={(e) =>
                dispatch(updatePersonalInfo({ fullName: e.target.value }))
              }
              className="h-10 px-4 text-sm border border-gray-300 rounded-md bg-white"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <Label className="block mb-2 text-sm text-gray-600">
              Select Your Gender
            </Label>
            <div className="flex gap-2">
              {["Male", "Female", "Other"].map((option) => (
                <Button
                  key={option}
                  variant={gender === option ? "default" : "outline"}
                  onClick={() =>
                    dispatch(updatePersonalInfo({ gender: option }))
                  }
                  className={`h-10 px-6 rounded-md text-sm font-medium ${
                    gender === option
                      ? "bg-primary text-white"
                      : "bg-white text-gray-800 border-gray-300"
                  }`}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card className="bg-[#f8f9fc] p-6 rounded-md">
        <h3 className="text-lg font-semibold">Password</h3>

        <div className="flex items-center gap-2 text-sm text-gray-600">
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

        <hr className="border-gray-300" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Label className="block text-sm text-gray-600 mb-2">
              Enter Password
            </Label>
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) =>
                dispatch(updatePersonalInfo({ password: e.target.value }))
              }
              className="h-10 px-4 text-sm border border-gray-300 rounded-md bg-white pr-10"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>

          <div className="relative">
            <Label className="block text-sm text-gray-600 mb-2">
              Re-enter Password
            </Label>
            <Input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) =>
                dispatch(
                  updatePersonalInfo({ confirmPassword: e.target.value })
                )
              }
              className={`h-10 px-4 text-sm border ${
                passwordsMatch ? "border-gray-300" : "border-red-500"
              } rounded-md bg-white pr-10`}
              placeholder="Confirm your password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
            {!passwordsMatch && confirmPassword.length > 0 && (
              <p className="text-xs text-red-600 mt-1 ml-1">
                Passwords do not match
              </p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

const MemoizedStep3PersonalInfo = React.memo(Step3PersonalInfoComponent);
export default MemoizedStep3PersonalInfo;
