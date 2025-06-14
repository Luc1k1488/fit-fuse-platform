
import { Route } from "react-router-dom";
import AdminProtectedRoute from "@/components/auth/AdminProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";
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

export const AdminRoutes = () => (
  <Route path="/admin/*" element={
    <AdminProtectedRoute>
      <AdminLayout>
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
      </AdminLayout>
    </AdminProtectedRoute>
  } />
);
