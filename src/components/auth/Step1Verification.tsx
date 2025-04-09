"use client";

import { OtpSection } from "@/components/auth/OtpSection";
import React from "react";

interface ContactInfoProps {
    mobileNumber: string;
    setMobileNumber: (val: string) => void;
    whatsappNumber: string;
    setWhatsappNumber: (val: string) => void;
    email: string;
    setEmail: (val: string) => void;
    mobileVerified: boolean;
    setMobileVerified: (val: boolean) => void;
    whatsappVerified: boolean;
    setWhatsappVerified: (val: boolean) => void;
    emailVerified: boolean;
    setEmailVerified: (val: boolean) => void;
    showMobileOtp: boolean;
    setShowMobileOtp: (val: boolean) => void;
    showWhatsappOtp: boolean;
    setShowWhatsappOtp: (val: boolean) => void;
    showEmailOtp: boolean;
    setShowEmailOtp: (val: boolean) => void;
    mobileOtp: string[];
    setMobileOtp: (otp: string[]) => void;
    whatsappOtp: string[];
    setWhatsappOtp: (otp: string[]) => void;
    emailOtp: string[];
    setEmailOtp: (otp: string[]) => void;
}

interface Step1VerificationProps {
    contactInfo: ContactInfoProps;
  }

const Step1VerificationComponent = ({ contactInfo }: Step1VerificationProps) => {


    return (
        <div className="space-y-6">


            <OtpSection
                label="Mobile Number"
                type="mobile"
                value={contactInfo.mobileNumber}
                onChange={(val) => {
                    const cleaned = val.replace(/\D/g, "");
                    if (cleaned.length <= 10 && (/^[6-9]/.test(cleaned) || cleaned === "")) {
                        contactInfo.setMobileNumber(cleaned);
                    }
                }}
                verified={contactInfo.mobileVerified}
                setVerified={contactInfo.setMobileVerified}
                showOtpInput={contactInfo.showMobileOtp}
                setShowOtpInput={contactInfo.setShowMobileOtp}
                otp={contactInfo.mobileOtp}
                setOtp={contactInfo.setMobileOtp}
            />


            <OtpSection
                label="WhatsApp Number"
                type="whatsapp"
                value={contactInfo.whatsappNumber}
                onChange={(val) => {
                    const cleaned = val.replace(/\D/g, "");
                    if (cleaned.length <= 10 && (/^[6-9]/.test(cleaned) || cleaned === "")) {
                      contactInfo.setWhatsappNumber(cleaned);
                    }
                  }}
                verified={contactInfo.whatsappVerified}
                setVerified={contactInfo.setWhatsappVerified}
                showOtpInput={contactInfo.showWhatsappOtp}
                setShowOtpInput={contactInfo.setShowWhatsappOtp}
                otp={contactInfo.whatsappOtp}
                setOtp={contactInfo.setWhatsappOtp}

            />


            <OtpSection
                label="Email ID"
                type="email"
                value={contactInfo.email}
                onChange={contactInfo.setEmail}
                verified={contactInfo.emailVerified}
                setVerified={contactInfo.setEmailVerified}
                showOtpInput={contactInfo.showEmailOtp}
                setShowOtpInput={contactInfo.setShowEmailOtp}
                otp={contactInfo.emailOtp}
                setOtp={contactInfo.setEmailOtp}
            />
        </div>
    );
};
const Step1Verification = React.memo(Step1VerificationComponent);

export default Step1Verification;
