import { useDispatch, useSelector } from "react-redux";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RootState } from "@/app/store";
import { switchToEmail, switchToMobile, setOtpSent } from "@/features/auth/loginTabSlice";
import EmailLogin from "./EmailLogin";
import MobileLogin from "./MobileLogin";
import { useCallback, useState } from "react";
import { RegisterDrawer } from "../auth/register-drawer";
import { OtpSection } from "@/components/auth/OtpSection";

export default function LoginWrapper() {
  const dispatch = useDispatch();
  const { method, otpSent } = useSelector((state: RootState) => state.loginTab);
  const [mobile, setMobile] = useState("");
  const [registerDrawerOpen, setRegisterDrawerOpen] = useState(false);
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));



  const handleSwitch = useCallback(
    (value: "email" | "mobile") => {
      dispatch(value === "email" ? switchToEmail() : switchToMobile());
    },
    [dispatch]
  );

  if (method === "mobile" && otpSent) {
    return (

      <div className="w-full max-w-md rounded-xl shadow-lg bg-white p-6 sm:p-8">
        <OtpSection
          label="Mobile Number"
          type="mobile"
          value={mobile}
          onChange={(val) => {
            setMobile(val);
            dispatch(setOtpSent(false)); // 🔄 Back to mobile input
          }}
          verified={false}
          setVerified={() => { }} // Not needed in login
          showOtpInput={true}
          setShowOtpInput={() => { }} // Always true in login
          otp={otp}
          setOtp={setOtp}
          mode="login"
          redirectAfterVerify="/dashboard"
        />
      </div>

    );
  }


  return (
    <><div className="flex items-center justify-center  w-full px-6 md:px-6 py-8 bg-[#f5f6fb]">
      <div className="w-full max-w-2xl bg-white p-6 md:p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-[#183966]">
          Login <span className="text-gray-500 font-normal">with</span>
        </h2>

        <Tabs value={method}>
          <TabsList className="flex mb-6 bg-[#f3f3f3] rounded-md p-1">
            <TabsTrigger
              value="email"
              onClick={() => handleSwitch("email")}
              className={`flex-1 py-2 px-4 rounded-md text-center font-medium ${method === "email" ? "bg-white text-black" : "text-[#8b8b8b]"}`}
            >
              Email
            </TabsTrigger>
            <TabsTrigger
              value="mobile"
              onClick={() => handleSwitch("mobile")}
              className={`flex-1 py-2 px-4 rounded-md text-center font-medium ${method === "mobile" ? "bg-white text-black" : "text-[#8b8b8b]"}`}
            >
              Mobile
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {method === "email" && <EmailLogin />}

        {method === "mobile" && !otpSent && (
          <MobileLogin
            setMobile={setMobile}
            onOtpSent={() => dispatch(setOtpSent(true))} />
        )}


        <div className="text-center text-[#606060] text-sm mt-6">
          Don’t have an account?{" "}
          <button className="text-[#156f85] hover:underline" onClick={() => setRegisterDrawerOpen(true)}>
            Register
          </button>
        </div>

      </div>
    </div><RegisterDrawer open={registerDrawerOpen} onOpenChange={setRegisterDrawerOpen} /></>

  );
}
