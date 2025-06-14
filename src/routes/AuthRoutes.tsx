
import { Route } from "react-router-dom";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";
import PhoneLoginPage from "@/pages/auth/PhoneLoginPage";
import MobileLoginPage from "@/pages/auth/MobileLoginPage";
import AdminLoginPage from "@/pages/auth/AdminLoginPage";

export const authRoutes = [
  <Route key="login" path="/login" element={<LoginPage />} />,
  <Route key="register" path="/register" element={<RegisterPage />} />,
  <Route key="forgot-password" path="/forgot-password" element={<ForgotPasswordPage />} />,
  <Route key="reset-password" path="/reset-password" element={<ResetPasswordPage />} />,
  <Route key="phone-login" path="/phone-login" element={<PhoneLoginPage />} />,
  <Route key="mobile-login" path="/mobile-login" element={<MobileLoginPage />} />,
  <Route key="admin-login" path="/admin-login" element={<AdminLoginPage />} />
];
