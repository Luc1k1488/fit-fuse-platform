
import { Route } from "react-router-dom";
import Index from "@/pages/Index";
import LandingPage from "@/pages/public/LandingPage";
import PricingPage from "@/pages/public/PricingPage";
import ContactPage from "@/pages/public/ContactPage";
import FaqPage from "@/pages/public/FaqPage";
import GymsPage from "@/pages/public/GymsPage";

export const PublicRoutes = () => (
  <>
    <Route path="/" element={<Index />} />
    <Route path="/landing" element={<LandingPage />} />
    <Route path="/pricing" element={<PricingPage />} />
    <Route path="/contact" element={<ContactPage />} />
    <Route path="/faq" element={<FaqPage />} />
    <Route path="/gyms" element={<GymsPage />} />
  </>
);
