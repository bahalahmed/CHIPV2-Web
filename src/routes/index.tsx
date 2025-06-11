import HomePage from "@/pages/HomePage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardPage from "@/pages/DashboardPage";
import { UserDetailsPage } from "@/pages/UserDetailsPage";
import UserEditPage from "@/components/userregistration/user-edit";



const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage/>} />
        <Route path="/user-details/:id" element={<UserDetailsPage />} />
        <Route path="/user-edit" element={<UserEditPage />} /> 
 
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
