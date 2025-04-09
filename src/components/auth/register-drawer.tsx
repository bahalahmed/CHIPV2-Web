import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import React, { Suspense } from "react";

// Lazy-loaded step components
const Step1Verification = React.lazy(() => import("./Step1Verification"));
const Step2UserDetails = React.lazy(() => import("./Step2UserDetails"));
const Step3PersonalInfo = React.lazy(() => import("./Step3PersonalInfo"));
const Step4Approval = React.lazy(() => import("./Step4Approval"));

import { StepProgress } from "@/components/auth/StepProgress";

import { ApprovalDialog } from "./ApprovalDialog";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { setStep, resetForm } from "@/features/registerForm/registerFormSlice";

interface RegisterDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerified?: () => void;
}

export function RegisterDrawer({ open, onOpenChange }: RegisterDrawerProps) {
  const dispatch = useDispatch();
  const { step, contactInfo, levelInfo, personalInfo } = useSelector(
    (state: RootState) => state.registerForm
  );

  const handleNext = () => {
    if (step < 4) dispatch(setStep(step + 1));
  };

  const handleBack = () => {
    if (step > 1) dispatch(setStep(step - 1));
  };

  const handleApprovalSubmit = () => {
    dispatch(resetForm());
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className="sm:max-w-md md:max-w-lg lg:max-w-2xl overflow-y-auto px-6 pt-4 pb-8"
        side="right"
      >
        <SheetHeader className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <SheetTitle className="text-2xl font-bold">
                User Registration
              </SheetTitle>
            </div>
            <SheetClose className="rounded-full p-1 hover:bg-gray-100"></SheetClose>
          </div>
        </SheetHeader>
        <StepProgress currentStep={step} />
        <Suspense
          fallback={<div className="text-center p-4">Loading step...</div>}
        >
          {step === 1 && <Step1Verification />}
          {step === 2 && <Step2UserDetails  />}
          {step === 3 && <Step3PersonalInfo  />}
          {step === 4 && (
            <Step4Approval
              reviewInfo={{ ...contactInfo, ...levelInfo, ...personalInfo }}
            />
          )}
        </Suspense>

        {/* Navigation Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
          >
            Back
          </Button>
          {step < 4 ? (
            <Button
              className="bg-[#183966] hover:bg-[#122c4f]"
              onClick={handleNext}
              disabled={
                step === 1 &&
                (!contactInfo.mobileVerified ||
                  !contactInfo.whatsappVerified ||
                  !contactInfo.emailVerified)
              }
            >
              Next
            </Button>
          ) : (
            <ApprovalDialog onSubmit={handleApprovalSubmit} />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
