import HomePage from "@/pages/HomePage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardPage from "@/pages/DashboardPage";



const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
