
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
  <Route key="partner" path="/partner/*" element={
    <AdminProtectedRoute allowedRoles={["partner", "admin"]}>
      <AdminLayout>
        <Route path="dashboard" element={<PartnerDashboard />} />
        <Route path="gyms" element={<PartnerGyms />} />
        <Route path="classes" element={<PartnerClasses />} />
        <Route path="bookings" element={<PartnerBookings />} />
        <Route path="reviews" element={<PartnerReviews />} />
        <Route path="analytics" element={<PartnerAnalytics />} />
      </AdminLayout>
    </AdminProtectedRoute>
  } />
];
