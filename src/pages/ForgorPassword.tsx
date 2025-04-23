import ForgotPasswordComponent from "@/components/auth/ForgotPasswordForm"

export default function ForgotPassword() {
  return <ForgotPasswordComponent onBack={() => { /* maybe route to login */ }} />
}
