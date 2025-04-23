import HomePage from "@/pages/HomePage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardPage from "@/pages/DashboardPage";
import ForgotPassword from "@/components/auth/ForgotPasswordForm.tsx";



const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/forgot-password" element={<ForgotPassword onBack={function (): void {
        throw new Error("Function not implemented.");
      } }/>} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
