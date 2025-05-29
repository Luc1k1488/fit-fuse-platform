
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/auth_context";
import AdminProtectedRoute from "@/components/auth/AdminProtectedRoute";
import ClientProtectedRoute from "@/components/auth/ClientProtectedRoute";
import AdminLayout from "@/layouts/AdminLayout";
import ClientLayout from "@/layouts/ClientLayout";

// Auth pages
import MobileLoginPage from "@/pages/auth/MobileLoginPage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";

// Admin pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminGyms from "@/pages/admin/AdminGyms";
import AdminBookings from "@/pages/admin/AdminBookings";
import AdminClasses from "@/pages/admin/AdminClasses";
import AdminPartners from "@/pages/admin/AdminPartners";
import AdminSubscriptions from "@/pages/admin/AdminSubscriptions";
import AdminReviews from "@/pages/admin/AdminReviews";
import AdminSupport from "@/pages/admin/AdminSupport";
import AdminAnalytics from "@/pages/admin/AdminAnalytics";
import AdminLoginPage from "@/pages/auth/AdminLoginPage";

// Client pages
import ClientHome from "@/pages/client/ClientHome";
import ClientGyms from "@/pages/client/ClientGyms";
import ClientClasses from "@/pages/client/ClientClasses";
import ClientBookings from "@/pages/client/ClientBookings";
import ClientProfile from "@/pages/client/ClientProfile";
import ClientSearch from "@/pages/client/ClientSearch";
import ClientSubscription from "@/pages/client/ClientSubscription";
import ClientDashboard from "@/pages/client/ClientDashboard";
import ClientCalendar from "@/pages/client/ClientCalendar";
import ClientProgress from "@/pages/client/ClientProgress";
import ClientSchedule from "@/pages/client/ClientSchedule";
import ClientSupport from "@/pages/client/ClientSupport";
import ClientGymDetail from "@/pages/client/ClientGymDetail";

// Public pages
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              
              {/* Mobile auth routes */}
              <Route path="/login/mobile" element={<MobileLoginPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Admin auth */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              
              {/* Admin routes */}
              <Route path="/admin/*" element={
                <AdminProtectedRoute allowedRoles={["admin", "support"]}>
                  <AdminLayout>
                    <Routes>
                      <Route path="dashboard" element={<AdminDashboard />} />
                      <Route path="users" element={<AdminUsers />} />
                      <Route path="gyms" element={<AdminGyms />} />
                      <Route path="bookings" element={<AdminBookings />} />
                      <Route path="classes" element={<AdminClasses />} />
                      <Route path="partners" element={<AdminPartners />} />
                      <Route path="subscriptions" element={<AdminSubscriptions />} />
                      <Route path="reviews" element={<AdminReviews />} />
                      <Route path="support" element={<AdminSupport />} />
                      <Route path="analytics" element={<AdminAnalytics />} />
                      <Route path="" element={<Navigate to="/admin/dashboard" replace />} />
                    </Routes>
                  </AdminLayout>
                </AdminProtectedRoute>
              } />
              
              {/* Client routes */}
              <Route path="/app/*" element={
                <ClientProtectedRoute>
                  <ClientLayout>
                    <Routes>
                      <Route path="" element={<ClientHome />} />
                      <Route path="search" element={<ClientSearch />} />
                      <Route path="schedule" element={<ClientSchedule />} />
                      <Route path="subscription" element={<ClientSubscription />} />
                      <Route path="profile" element={<ClientProfile />} />
                      <Route path="gyms" element={<ClientGyms />} />
                      <Route path="gyms/:id" element={<ClientGymDetail />} />
                      <Route path="classes" element={<ClientClasses />} />
                      <Route path="bookings" element={<ClientBookings />} />
                      <Route path="calendar" element={<ClientCalendar />} />
                      <Route path="progress" element={<ClientProgress />} />
                      <Route path="support" element={<ClientSupport />} />
                      <Route path="dashboard" element={<ClientDashboard />} />
                    </Routes>
                  </ClientLayout>
                </ClientProtectedRoute>
              } />
              
              {/* Fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
