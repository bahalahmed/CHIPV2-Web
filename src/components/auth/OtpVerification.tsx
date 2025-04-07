import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";


interface OTPVerificationProps {
  mobile: string;
  onChangeMobile?: () => void;
}

export default function OTPVerification({ mobile, onChangeMobile }: OTPVerificationProps) {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (timer === 0) {
      setCanResend(true);
      return; // no need to set interval
    }
  
    const countdown = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
  
    return () => clearInterval(countdown);
  }, [timer]);
  

  const handleChange = (value: string, index: number) => {
    if (/^[0-9]?$/.test(value)) {
      const updated = [...otp];
      updated[index] = value;
      setOtp(updated);
    }
  };

  const handleResend = () => {
    if (!canResend) return;
    toast.success("OTP resent successfully!");
    setCanResend(false);
    setTimer(30); 
  };

  const handleSubmitOtp = () => {
    const fullOtp = otp.join("");
    if (fullOtp.length === 6) {
      toast.success(`OTP Verified: ${fullOtp}`);
      navigate("/dashboard"); 
      // Api call 
    }
  };

  useEffect(() => {
    if (otp.every((digit) => digit !== "")) {
      handleSubmitOtp();
    }
  }, [otp]);
  
  
  return (
    <div className="space-y-6 text-center">
      <h2 className="text-2xl font-semibold text-[#1F2937]">
        Login <span className="font-normal text-gray-500">with</span>
      </h2>

      <p className="text-sm text-[#4B5563] flex justify-center items-center gap-2 flex-wrap">
        We have sent a 6 digit OTP code to{" "}
        <span className="text-[#156f85] font-semibold">{mobile}</span>
        {onChangeMobile && (
          <Button
            type="button"
            variant="ghost"
            className="px-2 py-1 text-sm text-[#156f85] hover:underline"
            onClick={onChangeMobile}
          >
            🔄 Change
          </Button>
        )}
      </p>

      <div className="flex justify-center gap-2 max-w-xs mx-auto">
        {otp.map((digit, i) => (
          <Input
            key={i}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target.value, i)}
            className="text-center text-xl font-semibold w-12 h-12 rounded-lg bg-[#f3f3f3] focus:ring-2 focus:ring-primary"
          />
        ))}
      </div>

      <div className="text-sm text-[#183966] font-medium mt-1">
        {canResend ? (
          <button onClick={handleResend} className="hover:underline text-[#156f85]">
            Resend OTP
          </button>
        ) : (
          <span className="text-[#1F2937]">Resend OTP in 00:{timer.toString().padStart(2, "0")}</span>
        )}
      </div>
    </div>
  );
}
