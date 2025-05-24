
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

// Public routes
import LandingPage from "./pages/public/LandingPage";
import GymsPage from "./pages/public/GymsPage";
import PricingPage from "./pages/public/PricingPage";
import FaqPage from "./pages/public/FaqPage";
import ContactPage from "./pages/public/ContactPage";
import NotFound from "./pages/NotFound";

// Auth routes
import LoginPage from "./pages/auth/LoginPage";
import AdminLoginPage from "./pages/auth/AdminLoginPage";
import PhoneLoginPage from "./pages/auth/PhoneLoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import MobileLoginPage from "./pages/auth/MobileLoginPage";

// Client app routes
import ClientLayout from "./layouts/ClientLayout";
import ClientHome from "./pages/client/ClientHome";
import ClientSearch from "./pages/client/ClientSearch";
import ClientSchedule from "./pages/client/ClientSchedule";
import ClientGyms from "./pages/client/ClientGyms";
import ClientGymDetail from "./pages/client/ClientGymDetail";
import ClientClasses from "./pages/client/ClientClasses";
import ClientBookings from "./pages/client/ClientBookings";
import ClientProfile from "./pages/client/ClientProfile";
import ClientSubscription from "./pages/client/ClientSubscription";
import ClientSupport from "./pages/client/ClientSupport";
import ClientCalendar from "./pages/client/ClientCalendar";
import ClientProgress from "./pages/client/ClientProgress";

// Admin routes
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminGyms from "./pages/admin/AdminGyms";
import AdminClasses from "./pages/admin/AdminClasses";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminSubscriptions from "./pages/admin/AdminSubscriptions";
import AdminPartners from "./pages/admin/AdminPartners";
import AdminSupport from "./pages/admin/AdminSupport";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminAnalytics from "./pages/admin/AdminAnalytics";

// Partner routes (inside admin layout with restricted access)
import PartnerDashboard from "./pages/partner/PartnerDashboard";
import PartnerGyms from "./pages/partner/PartnerGyms";
import PartnerClasses from "./pages/partner/PartnerClasses";
import PartnerBookings from "./pages/partner/PartnerBookings";
import PartnerReviews from "./pages/partner/PartnerReviews";
import PartnerAnalytics from "./pages/partner/PartnerAnalytics";

// Support routes (inside admin layout with restricted access)
import SupportDashboard from "./pages/support/SupportDashboard";
import SupportTickets from "./pages/support/SupportTickets";
import SupportUsers from "./pages/support/SupportUsers";
import SupportChats from "./pages/support/SupportChats";

// Context providers
import { AuthProvider } from "./contexts/auth_context";

const queryClient = new QueryClient();

const App = () => {
  const [isMobileView, setIsMobileView] = useState(false);
  
  // Принудительно используем мобильный интерфейс для /app маршрутов
  useEffect(() => {
    const checkIsMobile = () => {
      // Всегда используем мобильный интерфейс для /app маршрутов
      const isAppRoute = window.location.pathname.startsWith('/app');
      const isActuallyMobile = window.innerWidth < 768;
      setIsMobileView(isAppRoute || isActuallyMobile);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    // Проверяем, запускается ли приложение через Capacitor
    const isCapacitor = window.location.href.includes('capacitor://');
    if (isCapacitor) {
      setIsMobileView(true);
    }
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  // Устанавливаем тему в зависимости от маршрута
  useEffect(() => {
    const isAppRoute = window.location.pathname.startsWith('/app');
    if (isAppRoute) {
      // Светлая тема для мобильного приложения
      document.documentElement.classList.remove('dark');
    } else {
      // Темная тема для публичных страниц
      document.documentElement.classList.add('dark');
    }
  }, [window.location.pathname]);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner theme={window.location.pathname.startsWith('/app') ? "light" : "dark"} />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={isMobileView ? <Navigate to="/login/mobile" replace /> : <LandingPage />} />
              <Route path="/gyms" element={<GymsPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/contact" element={<ContactPage />} />
              
              {/* Auth routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/login/phone" element={<PhoneLoginPage />} />
              <Route path="/login/mobile" element={<MobileLoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Client app routes - protected */}
              <Route path="/app" element={<ClientLayout />}>
                <Route index element={<ClientHome />} />
                <Route path="search" element={<ClientSearch />} />
                <Route path="schedule" element={<ClientSchedule />} />
                <Route path="subscription" element={<ClientSubscription />} />
                <Route path="profile" element={<ClientProfile />} />
                <Route path="gyms/:id" element={<ClientGymDetail />} />
              </Route>
              
              {/* Admin routes - protected */}
              <Route path="/admin" element={<AdminLayout />}>
                {/* Admin specific routes */}
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="gyms" element={<AdminGyms />} />
                <Route path="classes" element={<AdminClasses />} />
                <Route path="bookings" element={<AdminBookings />} />
                <Route path="subscriptions" element={<AdminSubscriptions />} />
                <Route path="partners" element={<AdminPartners />} />
                <Route path="support" element={<AdminSupport />} />
                <Route path="reviews" element={<AdminReviews />} />
                <Route path="analytics" element={<AdminAnalytics />} />
                
                {/* Partner routes (inside admin layout) */}
                <Route path="partner">
                  <Route index element={<PartnerDashboard />} />
                  <Route path="gyms" element={<PartnerGyms />} />
                  <Route path="classes" element={<PartnerClasses />} />
                  <Route path="bookings" element={<PartnerBookings />} />
                  <Route path="reviews" element={<PartnerReviews />} />
                  <Route path="analytics" element={<PartnerAnalytics />} />
                </Route>
                
                {/* Support routes (inside admin layout) */}
                <Route path="support-portal">
                  <Route index element={<SupportDashboard />} />
                  <Route path="tickets" element={<SupportTickets />} />
                  <Route path="users" element={<SupportUsers />} />
                  <Route path="chats" element={<SupportChats />} />
                </Route>
                
                {/* Admin index redirect */}
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
              </Route>
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
