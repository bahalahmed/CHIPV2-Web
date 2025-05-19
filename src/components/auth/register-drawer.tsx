"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import React, { Suspense, useMemo } from "react"
import { useEffect } from "react"
import { populateFromLocalStorage } from "@/features/registerForm/registerFormSlice"



// Lazy-loaded step components
const Step1Verification = React.lazy(() => import("./Step1Verification"))
const Step2UserDetails = React.lazy(() => import("./Step2UserDetails"))
const Step3PersonalInfo = React.lazy(() => import("./Step3PersonalInfo"))
const Step4Approval = React.lazy(() => import("./Step4Approval"))


import { StepProgress } from "@/components/auth/StepProgress"

import { ApprovalDialog } from "./ApprovalDialog"

import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/app/store"
import { setStep, resetForm } from "@/features/registerForm/registerFormSlice"

interface RegisterDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onVerified?: () => void
}

export function RegisterDrawer({ open, onOpenChange }: RegisterDrawerProps) {
  const dispatch = useDispatch()
  const { step, contactInfo, levelInfo, personalInfo } = useSelector((state: RootState) => state.registerForm)

  const handleNext = () => {
    if (step < 4) {
     
      const reviewInfo = {
        ...contactInfo,
        ...levelInfo,
        ...personalInfo,
        organizationType: levelInfo.organizationTypeId || "",
        organization: levelInfo.organizationId || "",
        designation: levelInfo.designationId || "",

        organizationTypeLabel: levelInfo.organizationTypeLabel || "",
        organizationLabel: levelInfo.organizationLabel || "",
        designationLabel: levelInfo.designationLabel || "",
      };
  
      localStorage.setItem("userRegistrationData", JSON.stringify(reviewInfo));
  
      dispatch(setStep(step + 1));
    }
  };
  

  const handleBack = () => {
    if (step > 1) dispatch(setStep(step - 1))
  }
  const handleApprovalSubmit = () => {
    console.log("✅ Submitting registration:", reviewInfo);


    localStorage.setItem("userRegistrationData", JSON.stringify(reviewInfo));


    setTimeout(() => {
      dispatch(resetForm());
      localStorage.removeItem("userRegistrationData");
      console.log("🧼 Form reset completed. LocalStorage cleared.");
      onOpenChange(false); // Close drawer
    }, 300);
  };



  useEffect(() => {
    const savedData = localStorage.getItem("userRegistrationData");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      dispatch(populateFromLocalStorage(parsed));
    }
  }, [dispatch]);




  const reviewInfo = useMemo(() => ({
    ...contactInfo,
    ...levelInfo,
    ...personalInfo,
    organizationType: levelInfo.organizationTypeId || "",
    organization: levelInfo.organizationId || "",
    designation: levelInfo.designationId || "",
  }), [contactInfo, levelInfo, personalInfo])




  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className="w-full sm:max-w-md md:max-w-lg lg:max-w-2xl overflow-y-auto px-3 sm:px-4 md:px-6 pt-3 sm:pt-4 pb-6 sm:pb-8"
        side="right"
      >
        <SheetHeader className="">
          <div className="flex justify-between items-center">
            <div>
              <SheetTitle className="text-xl text-primary sm:text-2xl font-bold">User Registration</SheetTitle>
            </div>
            <SheetClose className="rounded-full  hover:bg-secondary"></SheetClose>
          </div>
        </SheetHeader>

        <div className="">
          <StepProgress currentStep={step} />
        </div>

        <div className="">
          <Suspense
            fallback={
              <div className="flex justify-center items-center min-h-[200px] text-center p-4">
                <div className="animate-pulse">Loading step...</div>
              </div>
            }
          >
            {step === 1 && <Step1Verification />}
            {step === 2 && <Step2UserDetails />}
            {step === 3 && <Step3PersonalInfo />}
            {step === 4 && (
              <Step4Approval reviewInfo={reviewInfo} />
            )}
          </Suspense>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-4 mt-6 sm:mt-8">
          <Button
            className="bg-background hover:bg-secondary text-foreground border border-border w-full sm:w-auto order-2 sm:order-1"
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
          >
            Back
          </Button>
          {step < 4 ? (
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto order-1 sm:order-2"
              onClick={handleNext}
              disabled={
                step === 1 &&
                (!contactInfo.mobileVerified || !contactInfo.whatsappVerified || !contactInfo.emailVerified)
              }
            >
              Next
            </Button>
          ) : (
            <div className="w-full sm:w-auto order-1 sm:order-2">
              <ApprovalDialog
                reviewInfo={Object.fromEntries(
                  Object.entries(reviewInfo).map(([k, v]) => [k, String(v)])
                )}
                onSubmit={handleApprovalSubmit}
              />
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
