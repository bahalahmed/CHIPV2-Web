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
import { useRegisterForm } from "@/hooks/useRegisterForm";
import { StepProgress } from "@/components/auth/StepProgress";


import { ApprovalDialog } from "./ApprovalDialog";


interface RegisterDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onVerified?: () => void;
}

export function RegisterDrawer({ open, onOpenChange }: RegisterDrawerProps) {
    const form = useRegisterForm();
    const handleNext = () => {
        if (form.step < 4) form.setStep(form.step + 1);
    };

    const handleBack = () => {
        if (form.step > 1) form.setStep(form.step - 1);
    };
    const handleApprovalSubmit = () => {
        form.resetForm();
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
                <StepProgress currentStep={form.step} />
                <Suspense fallback={<div className="text-center p-4">Loading step...</div>}>
                {form.step === 1 && (
                    <Step1Verification
                        contactInfo={{
                            mobileNumber: form.mobileNumber,
                            setMobileNumber: form.setMobileNumber,
                            whatsappNumber: form.whatsappNumber,
                            setWhatsappNumber: form.setWhatsappNumber,
                            email: form.email,
                            setEmail: form.setEmail,
                            mobileVerified: form.mobileVerified,
                            setMobileVerified: form.setMobileVerified,
                            whatsappVerified: form.whatsappVerified,
                            setWhatsappVerified: form.setWhatsappVerified,
                            emailVerified: form.emailVerified,
                            setEmailVerified: form.setEmailVerified,
                            showMobileOtp: form.showMobileOtp,
                            setShowMobileOtp: form.setShowMobileOtp,
                            showWhatsappOtp: form.showWhatsappOtp,
                            setShowWhatsappOtp: form.setShowWhatsappOtp,
                            showEmailOtp: form.showEmailOtp,
                            setShowEmailOtp: form.setShowEmailOtp,
                            mobileOtp: form.mobileOtp,
                            setMobileOtp: form.setMobileOtp,
                            whatsappOtp: form.whatsappOtp,
                            setWhatsappOtp: form.setWhatsappOtp,
                            emailOtp: form.emailOtp,
                            setEmailOtp: form.setEmailOtp,
                        }}
                    />
                )}

                {form.step === 2 && (
                    <Step2UserDetails
                        levelInfo={{
                            selectedLevel: form.selectedLevel,
                            setSelectedLevel: form.setSelectedLevel,
                            state: form.state,
                            setState: form.setState,
                            division: form.division,
                            setDivision: form.setDivision,
                            district: form.district,
                            setDistrict: form.setDistrict,
                            block: form.block,
                            setBlock: form.setBlock,
                            sector: form.sector,
                            setSector: form.setSector,
                            organizationType: form.organizationType,
                            setOrganizationType: form.setOrganizationType,
                            designation: form.designation,
                            setDesignation: form.setDesignation,
                        }}
                    />
                )}

                {form.step === 3 && (
                    <Step3PersonalInfo
                        personalInfo={{
                            fullName: form.fullName,
                            setFullName: form.setFullName,
                            gender: form.gender,
                            setGender: form.setGender,
                            password: form.password,
                            setPassword: form.setPassword,
                            confirmPassword: form.confirmPassword,
                            setConfirmPassword: form.setConfirmPassword,
                        }}
                    />

                )}
                {form.step === 4 && (
                    <Step4Approval
                        reviewInfo={{
                            mobileNumber: form.mobileNumber,
                            whatsappNumber: form.whatsappNumber,
                            email: form.email,
                            selectedLevel: form.selectedLevel,
                            state: form.state,
                            division: form.division,
                            district: form.district,
                            block: form.block,
                            sector: form.sector,
                            organizationType: form.organizationType,
                            designation: form.designation,
                            fullName: form.fullName,
                            gender: form.gender,
                            password: form.password,
                        }}
                    />
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-end gap-4 mt-8">
                    <Button variant="outline" onClick={handleBack} disabled={form.step === 1}>
                        Back
                    </Button>
                    {form.step < 4 ? (
                        <Button
                            className="bg-[#183966] hover:bg-[#122c4f]"
                            onClick={handleNext}
                            disabled={
                                form.step === 1 &&
                                (!form.mobileVerified || !form.whatsappVerified || !form.emailVerified)
                            }
                        >
                            Next
                        </Button>
                    ) : (
                        <ApprovalDialog onSubmit={handleApprovalSubmit} />
                    )}


                </div>
                </Suspense>

            </SheetContent>
        </Sheet>
    );
}
