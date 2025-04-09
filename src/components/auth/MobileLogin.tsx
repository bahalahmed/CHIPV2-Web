// src/components/auth/MobileLogin.tsx
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
// import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface MobileLoginProps {
    onOtpSent: () => void;
    setMobile: (number: string) => void;
  }
  

export default function MobileLogin({ onOtpSent, setMobile}: MobileLoginProps) {
  const [mobileInput, setMobileInput] = useState("");
  const [loading, setLoading] = useState(false);
  //const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!mobileInput || mobileInput.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);

    try {
      // Simulate sending OTP
      await new Promise((r) => setTimeout(r, 1000));
      setMobile(mobileInput);  
      toast.success("OTP sent successfully!");
      onOtpSent();
    } catch  {
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="mobile" className="block text-[#606060] mb-1">
          Mobile Number
        </label>
        <Input
          id="mobile"
          type="tel"
          placeholder="Enter your mobile number"
          className="bg-[#f3f3f3]"
          value={mobileInput}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");
            if (value === "" || (/^[6-9]/.test(value) && value.length <= 10)) {
              setMobileInput(value);
              setMobile(value);
            }
          }}
          
        />
      </div>

      <Button
        className="w-full bg-[#183966] text-white"
        type="submit"
        disabled={loading}
      >
        {loading ? "Sending OTP..." : "Get OTP"}
      </Button>
    </form>
  );
}
