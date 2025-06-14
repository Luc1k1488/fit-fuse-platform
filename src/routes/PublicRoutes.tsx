
import { Route } from "react-router-dom";
import Index from "@/pages/Index";
import LandingPage from "@/pages/public/LandingPage";
import PricingPage from "@/pages/public/PricingPage";
import ContactPage from "@/pages/public/ContactPage";
import FaqPage from "@/pages/public/FaqPage";
import GymsPage from "@/pages/public/GymsPage";

export const publicRoutes = [
  <Route key="index" path="/" element={<Index />} />,
  <Route key="landing" path="/landing" element={<LandingPage />} />,
  <Route key="pricing" path="/pricing" element={<PricingPage />} />,
  <Route key="contact" path="/contact" element={<ContactPage />} />,
  <Route key="faq" path="/faq" element={<FaqPage />} />,
  <Route key="gyms" path="/gyms" element={<GymsPage />} />
];
