
import { Route } from "react-router-dom";
import AdminProtectedRoute from "@/components/auth/AdminProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";
import PartnerDashboard from "@/pages/partner/PartnerDashboard";
import PartnerGyms from "@/pages/partner/PartnerGyms";
import PartnerClasses from "@/pages/partner/PartnerClasses";
import PartnerBookings from "@/pages/partner/PartnerBookings";
import PartnerReviews from "@/pages/partner/PartnerReviews";
import PartnerAnalytics from "@/pages/partner/PartnerAnalytics";

export const partnerRoutes = [
  <Route key="partner-dashboard" path="/partner/dashboard" element={
    <AdminProtectedRoute allowedRoles={["partner", "admin"]}>
      <AdminLayout>
        <PartnerDashboard />
      </AdminLayout>
    </AdminProtectedRoute>
  } />,
  <Route key="partner-gyms" path="/partner/gyms" element={
    <AdminProtectedRoute allowedRoles={["partner", "admin"]}>
      <AdminLayout>
        <PartnerGyms />
      </AdminLayout>
    </AdminProtectedRoute>
  } />,
  <Route key="partner-classes" path="/partner/classes" element={
    <AdminProtectedRoute allowedRoles={["partner", "admin"]}>
      <AdminLayout>
        <PartnerClasses />
      </AdminLayout>
    </AdminProtectedRoute>
  } />,
  <Route key="partner-bookings" path="/partner/bookings" element={
    <AdminProtectedRoute allowedRoles={["partner", "admin"]}>
      <AdminLayout>
        <PartnerBookings />
      </AdminLayout>
    </AdminProtectedRoute>
  } />,
  <Route key="partner-reviews" path="/partner/reviews" element={
    <AdminProtectedRoute allowedRoles={["partner", "admin"]}>
      <AdminLayout>
        <PartnerReviews />
      </AdminLayout>
    </AdminProtectedRoute>
  } />,
  <Route key="partner-analytics" path="/partner/analytics" element={
    <AdminProtectedRoute allowedRoles={["partner", "admin"]}>
      <AdminLayout>
        <PartnerAnalytics />
      </AdminLayout>
    </AdminProtectedRoute>
  } />
];
