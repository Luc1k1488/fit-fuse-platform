
import { Route } from "react-router-dom";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";
import PhoneLoginPage from "@/pages/auth/PhoneLoginPage";
import MobileLoginPage from "@/pages/auth/MobileLoginPage";
import AdminLoginPage from "@/pages/auth/AdminLoginPage";

export const AuthRoutes = () => (
  <>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
    <Route path="/reset-password" element={<ResetPasswordPage />} />
    <Route path="/phone-login" element={<PhoneLoginPage />} />
    <Route path="/mobile-login" element={<MobileLoginPage />} />
    <Route path="/admin-login" element={<AdminLoginPage />} />
  </>
);
