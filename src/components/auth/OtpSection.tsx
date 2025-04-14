// src/components/auth/OtpSection.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PhoneInput from "@/components/ui/PhoneInput";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,

} from "@/components/ui/input-otp";
import { useDispatch } from "react-redux";
import { setOtpSent } from "@/features/auth/loginTabSlice";


interface OtpSectionProps {
  label: string;
  type: "mobile" | "whatsapp" | "email";
  value: string;
  verified: boolean;
  setVerified: (v: boolean) => void;
  showOtpInput: boolean;
  setShowOtpInput: (v: boolean) => void;
  otp: string[];
  setOtp: (val: string[]) => void;
  onVerified?: () => void;
  redirectAfterVerify?: string;
  mode?: "login" | "default";
  onChange?: (value: string) => void;
}

export function OtpSection({
  label,
  type,
  value,
  verified,
  setVerified,
  showOtpInput,
  setShowOtpInput,
  otp,
  setOtp,
  onVerified,
  redirectAfterVerify,
  mode = "default",
  onChange,
}: OtpSectionProps) {
  const navigate = useNavigate();
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [resendTrigger, setResendTrigger] = useState(0);


  
  const handleSubmitOtp = () => {
    const fullOtp = otp.join("");
    if (fullOtp.length === 6 && /^\d{6}$/.test(fullOtp)) {
      toast.success(`${label} verified successfully!`);
      setVerified(true);
      onVerified?.();
      if (redirectAfterVerify) navigate(redirectAfterVerify);
    }
  };

  useEffect(() => {
    if (otp.every((digit) => digit !== "")) handleSubmitOtp();
  }, [otp]);


  useEffect(() => {
    setTimer(30);
    setCanResend(false);
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(countdown);
          setCanResend(true);
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(countdown);
  }, [resendTrigger]);

  
  const handleSendOTP = () => {
    if (type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return toast.error("Please enter a valid email.");
    } else {
      const digits = value.replace(/\D/g, "");
      if (digits.length !== 10 || !/^[6-9]/.test(digits)) {
        return toast.error(`Enter a valid 10-digit ${label.toLowerCase()}`);
      }
    }
    setShowOtpInput(true);
    setOtp(Array(6).fill(""));
    setResendTrigger((prev) => prev + 1);
    toast.success("OTP sent successfully!");
  };

  const dispatch = useDispatch();
  const handleChangeClick = () => {
    setShowOtpInput(false);
    setVerified(false);
    setOtp(Array(6).fill(""));
    setTimer(30);
    setCanResend(false);
  
    if (mode === "login") {
      dispatch(setOtpSent(false)); 
    }
  };
  
  
  

  const renderInputField = () =>
    type === "email" ? (
      <Input
        type="email"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder="Enter your email"
        className="bg-[var(--bg-input)] pr-10" />
    
    ) : (
      <PhoneInput
        value={value}
        onChange={(val) => onChange?.(val)}
        placeholder="Enter your mobile number"
      />
    );

  // ✅ OTP Input UI
  const renderOtpInput = () => (
    <div className="flex justify-center">
      <InputOTP
        maxLength={6}
        value={otp.join("")}
        onChange={(val) => {
          const sanitized = val.replace(/\D/g, "").slice(0, 6);
          setOtp(sanitized.split(""));
        }}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
    </div>
  );


  if (mode === "login" && showOtpInput) {
    return (
      <div className="space-y-6 text-center">
        <h2 className="text-2xl font-semibold text-[#1F2937]">
          Login <span className="text-gray-500 font-normal">with</span>
        </h2>
        <p className="text-sm text-[#4B5563] flex justify-center items-center gap-2 flex-wrap">
          We have sent a 6 digit OTP code to{" "}
          <span className="text-accent font-semibold">{value}</span>
          <button
              className="ml-1 text-sm text-accent flex items-center gap-1 hover:underline"
              onClick={handleChangeClick}
            >
              🔄 Change
            </button>
        </p>
        {renderOtpInput()}
        <div className="text-sm text-[var(--primary)] font-medium mt-1">
          {canResend ? (
            <button onClick={handleSendOTP} className="hover:underline text-accent">
              Resend OTP
            </button>
          ) : (
            <span className="text-[#1F2937]">
              Resend OTP in 00:{timer.toString().padStart(2, "0")}
            </span>
          )}
        </div>
      </div>
    );
  }

  
  return (
    <div className="bg-[var(--bg-light)] p-6 rounded-xl">
      <h3 className="text-lg font-medium mb-6">{label} Verification</h3>
      <hr className="mb-5 border-gray-300" />

      {verified ? (
        <div className="relative">
          <Input value={value} disabled className="bg-[var(--white)] pr-10 font-semibold" />
          <CheckCircle className="text-green-600 h-5 w-5 absolute top-1/2 right-3 -translate-y-1/2" />
        </div>
      ) : showOtpInput ? (
        <div className="text-center space-y-4">
          <p className="text-sm text-[#4B5563] flex justify-center items-center gap-2 flex-wrap">
            We have sent a 6-digit OTP code to{" "}
            <span className="text-accent font-semibold">{value}</span>
            <button
              className="ml-1 text-sm text-accent flex items-center gap-1 hover:underline"
              onClick={handleChangeClick}
            >
              🔄 Change
            </button>
          </p>
          {renderOtpInput()}
          <div className="text-sm text-[var(--primary)] font-medium">
            {canResend ? (
              <button onClick={handleSendOTP} className="hover:underline text-accent">
                Resend OTP
              </button>
            ) : (
              <span className="text-[#1F2937]">
                Resend OTP in 00:{timer.toString().padStart(2, "0")}
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm text-gray-600 mb-1">{label}</label>
            {renderInputField()}
          </div>
          <Button
            className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] h-10 w-[140px]"
            onClick={handleSendOTP}
          >
            Send OTP
          </Button>
        </div>
      )}
    </div>
  );
}