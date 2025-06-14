
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

export const adminRoutes = [
  <Route key="admin-dashboard" path="/admin/dashboard" element={
    <AdminProtectedRoute>
      <AdminLayout>
        <AdminDashboard />
      </AdminLayout>
    </AdminProt

}ectedRoute>
  } />,
  <Route key="admin-users" path="/admin/users" element={
    <AdminProtectedRoute>
      <AdminLayout>
        <AdminUsers />
      </AdminLayout>
    </AdminProtectedRoute>
  } />,
  <Route key="admin-gyms" path="/admin/gyms" element={
    <AdminProtectedRoute>
      <AdminLayout>
        <AdminGyms />
      </AdminLayout>
    </AdminProtectedRoute>
  } />,
  <Route key="admin-bookings" path="/admin/bookings" element={
    <AdminProtectedRoute>
      <AdminLayout>
        <AdminBookings />
      </AdminLayout>
    </AdminProtectedRoute>
  } />,
  <Route key="admin-classes" path="/admin/classes" element={
    <AdminProtectedRoute>
      <AdminLayout>
        <AdminClasses />
      </AdminLayout>
    </AdminProtectedRoute>
  } />,
  <Route key="admin-reviews" path="/admin/reviews" element={
    <AdminProtectedRoute>
      <AdminLayout>
        <AdminReviews />
      </AdminLayout>
    </AdminProtectedRoute>
  } />,
  <Route key="admin-analytics" path="/admin/analytics" element={
    <AdminProtectedRoute>
      <AdminLayout>
        <AdminAnalytics />
      </AdminLayout>
    </AdminProtectedRoute>
  } />,
  <Route key="admin-partners" path="/admin/partners" element={
    <AdminProtectedRoute>
      <AdminLayout>
        <AdminPartners />
      </AdminLayout>
    </AdminProtectedRoute>
  } />,
  <Route key="admin-subscriptions" path="/admin/subscriptions" element={
    <AdminProtectedRoute>
      <AdminLayout>
        <AdminSubscriptions />
      </AdminLayout>
    </AdminProtectedRoute>
  } />,
  <Route key="admin-support" path="/admin/support" element={
    <AdminProtectedRoute>
      <AdminLayout>
        <AdminSupport />
      </AdminLayout>
    </AdminProtectedRoute>
  } />
];
