
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/auth_context";

// Import components
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";

// Auth pages
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";
import PhoneLoginPage from "@/pages/auth/PhoneLoginPage";
import MobileLoginPage from "@/pages/auth/MobileLoginPage";
import AdminLoginPage from "@/pages/auth/AdminLoginPage";

// Public pages
import LandingPage from "@/pages/public/LandingPage";
import PricingPage from "@/pages/public/PricingPage";
import ContactPage from "@/pages/public/ContactPage";
import FaqPage from "@/pages/public/FaqPage";
import GymsPage from "@/pages/public/GymsPage";

// Client pages
import ClientDashboard from "@/pages/client/ClientDashboard";
import ClientHome from "@/pages/client/ClientHome";
import ClientGyms from "@/pages/client/ClientGyms";
import ClientGymDetail from "@/pages/client/ClientGymDetail";
import ClientClasses from "@/pages/client/ClientClasses";
import ClientBookings from "@/pages/client/ClientBookings";
import ClientProfile from "@/pages/client/ClientProfile";
import ClientProfileNew from "@/pages/client/ClientProfileNew";
import ClientCalendar from "@/pages/client/ClientCalendar";
import ClientProgress from "@/pages/client/ClientProgress";
import ClientSchedule from "@/pages/client/ClientSchedule";
import ClientSearch from "@/pages/client/ClientSearch";
import ClientSubscription from "@/pages/client/ClientSubscription";
import ClientSubscriptionNew from "@/pages/client/ClientSubscriptionNew";
import ClientSubscriptionManagement from "@/pages/client/ClientSubscriptionManagement";
import ClientSupport from "@/pages/client/ClientSupport";

// Admin pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminGyms from "@/pages/admin/AdminGyms";
import AdminBookings from "@/pages/admin/AdminBookings";
import AdminClasses from "@/pages/admin/AdminClasses";
import AdminReviews from "@/pages/admin/AdminReviews";
import AdminAnalytics from "@/pages/admin/AdminAnalytics";
import AdminPartners from "@/pages/admin/AdminPartners";
import AdminSubscriptions from "@/pages/admin/AdminSubscriptions";
import AdminSupport from "@/pages/admin/AdminSupport";

// Partner pages
import PartnerDashboard from "@/pages/partner/PartnerDashboard";
import PartnerGyms from "@/pages/partner/PartnerGyms";
import PartnerClasses from "@/pages/partner/PartnerClasses";
import PartnerBookings from "@/pages/partner/PartnerBookings";
import PartnerReviews from "@/pages/partner/PartnerReviews";
import PartnerAnalytics from "@/pages/partner/PartnerAnalytics";

// Support pages
import SupportDashboard from "@/pages/support/SupportDashboard";
import SupportChats from "@/pages/support/SupportChats";
import SupportTickets from "@/pages/support/SupportTickets";
import SupportUsers from "@/pages/support/SupportUsers";

// Layouts
import AdminLayout from "@/layouts/AdminLayout";
import ClientLayout from "@/layouts/ClientLayout";

// Protected Routes
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AdminProtectedRoute from "@/components/auth/AdminProtectedRoute";
import ClientProtectedRoute from "@/components/auth/ClientProtectedRoute";

import "./App.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/gyms" element={<GymsPage />} />

            {/* Auth routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/phone-login" element={<PhoneLoginPage />} />
            <Route path="/mobile-login" element={<MobileLoginPage />} />
            <Route path="/admin-login" element={<AdminLoginPage />} />

            {/* Client routes */}
            <Route path="/app/*" element={
              <ClientProtectedRoute>
                <ClientLayout>
                  <Routes>
                    <Route index element={<ClientDashboard />} />
                    <Route path="home" element={<ClientHome />} />
                    <Route path="gyms" element={<ClientGyms />} />
                    <Route path="gyms/:id" element={<ClientGymDetail />} />
                    <Route path="classes" element={<ClientClasses />} />
                    <Route path="bookings" element={<ClientBookings />} />
                    <Route path="profile" element={<ClientProfile />} />
                    <Route path="profile-new" element={<ClientProfileNew />} />
                    <Route path="calendar" element={<ClientCalendar />} />
                    <Route path="progress" element={<ClientProgress />} />
                    <Route path="schedule" element={<ClientSchedule />} />
                    <Route path="search" element={<ClientSearch />} />
                    <Route path="subscription" element={<ClientSubscription />} />
                    <Route path="subscription-new" element={<ClientSubscriptionNew />} />
                    <Route path="subscription-management" element={<ClientSubscriptionManagement />} />
                    <Route path="support" element={<ClientSupport />} />
                  </Routes>
                </ClientLayout>
              </ClientProtectedRoute>
            } />

            {/* Admin routes */}
            <Route path="/admin/*" element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <Routes>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="gyms" element={<AdminGyms />} />
                    <Route path="bookings" element={<AdminBookings />} />
                    <Route path="classes" element={<AdminClasses />} />
                    <Route path="reviews" element={<AdminReviews />} />
                    <Route path="analytics" element={<AdminAnalytics />} />
                    <Route path="partners" element={<AdminPartners />} />
                    <Route path="subscriptions" element={<AdminSubscriptions />} />
                    <Route path="support" element={<AdminSupport />} />
                  </Routes>
                </AdminLayout>
              </AdminProtectedRoute>
            } />

            {/* Partner routes */}
            <Route path="/partner/*" element={
              <AdminProtectedRoute allowedRoles={["partner", "admin"]}>
                <AdminLayout>
                  <Routes>
                    <Route path="dashboard" element={<PartnerDashboard />} />
                    <Route path="gyms" element={<PartnerGyms />} />
                    <Route path="classes" element={<PartnerClasses />} />
                    <Route path="bookings" element={<PartnerBookings />} />
                    <Route path="reviews" element={<PartnerReviews />} />
                    <Route path="analytics" element={<PartnerAnalytics />} />
                  </Routes>
                </AdminLayout>
              </AdminProtectedRoute>
            } />

            {/* Support routes */}
            <Route path="/support/*" element={
              <AdminProtectedRoute allowedRoles={["support", "admin"]}>
                <AdminLayout>
                  <Routes>
                    <Route path="dashboard" element={<SupportDashboard />} />
                    <Route path="chats" element={<SupportChats />} />
                    <Route path="tickets" element={<SupportTickets />} />
                    <Route path="users" element={<SupportUsers />} />
                  </Routes>
                </AdminLayout>
              </AdminProtectedRoute>
            } />

            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
