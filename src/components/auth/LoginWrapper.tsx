"use client"

import { useDispatch, useSelector } from "react-redux"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { RootState } from "@/app/store"
import { switchToEmail, switchToMobile, setOtpSent } from "@/features/auth/loginTabSlice"
import EmailLogin from "./EmailLogin"
import MobileLogin from "./MobileLogin"
import { useCallback, useState } from "react"
import { RegisterDrawer } from "../auth/register-drawer"
import { OtpSection } from "@/components/auth/OtpSection"
import ForgotPasswordForm from "./ForgotPasswordForm"



export default function LoginWrapper() {
  const dispatch = useDispatch()
  const { method, otpSent } = useSelector((state: RootState) => state.loginTab)
  const [mobile, setMobile] = useState("")
  const [registerDrawerOpen, setRegisterDrawerOpen] = useState(false)
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""))
  const [showForgotPassword, setShowForgotPassword] = useState(false);


  const handleSwitch = useCallback(
    (value: "email" | "mobile") => {
      dispatch(value === "email" ? switchToEmail() : switchToMobile())
    },
    [dispatch],
  )

  if (method === "mobile" && otpSent) {
    return (
      <div className="bg-background w-full max-w-md rounded-xl p-6 sm:p-8 mx-auto">
        <OtpSection
          label="Mobile Number"
          type="mobile"
          value={mobile}
          onChange={(val) => {
            setMobile(val)
            dispatch(setOtpSent(false)) // 🔄 Back to mobile input
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
    )
  }

  return (
    <>
      <div className="container mx-auto max-w-md px-4 py-8 bg-muted">
        <div className="space-y-6  w-full max-w-2xl bg-background p-6 md:p-8 shadow-lg rounded-xl">
          <div className="space-y-2">
            <h2 className="text-md text-muted-foreground font-medium">Welcome Back to CHIP Dashboard.</h2>
            <h1 className="text-2xl font-bold text-text-heading">
              {showForgotPassword ? "Forgot Password" : "Login with"}
            </h1>

          </div>

          {/* Tabs only when not in forgot password mode */}
          {!showForgotPassword && (
         <Tabs value={method} className="w-full">
         <TabsList className="flex w-full rounded-xl overflow-hidden border p-0 h-auto bg-muted">
           <TabsTrigger
             value="email"
             onClick={() => handleSwitch("email")}
             className="flex-1 py-3 px-6 text-center font-medium rounded-none data-[state=active]:bg-primary text-foreground-muted data-[state=active]:text-white"
           >
             Email
           </TabsTrigger>
           <TabsTrigger
             value="mobile"
             onClick={() => handleSwitch("mobile")}
             className="flex-1 py-3 px-6 text-center font-medium rounded-none data-[state=active]:bg-primary text-foreground-muted data-[state=active]:text-white"
           >
             Mobile
           </TabsTrigger>
         </TabsList>
       </Tabs>
       
          )}

          {showForgotPassword ? (
            <ForgotPasswordForm onBack={() => setShowForgotPassword(false)} />
          ) : (
            <>
              {method === "email" && <EmailLogin
                onForgotPassword={() => {
                  setShowForgotPassword(true)
                }}
              />}
              {method === "mobile" && !otpSent && (
                <MobileLogin setMobile={setMobile} onOtpSent={() => dispatch(setOtpSent(true))} />
              )}
            </>
          )}

          <div className="text-center text-muted-foreground text-sm mt-6">
            Don't have an account?{" "}
            <button className="text-accent hover:underline" onClick={() => setRegisterDrawerOpen(true)}>
              Register here.
            </button>
          </div>
        </div>
      </div>
      <RegisterDrawer open={registerDrawerOpen} onOpenChange={setRegisterDrawerOpen} />
    </>
  )
}
