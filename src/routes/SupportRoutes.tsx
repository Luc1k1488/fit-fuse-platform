
import { Route } from "react-router-dom";
import AdminProtectedRoute from "@/components/auth/AdminProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";
import SupportDashboard from "@/pages/support/SupportDashboard";
import SupportChats from "@/pages/support/SupportChats";
import SupportTickets from "@/pages/support/SupportTickets";
import SupportUsers from "@/pages/support/SupportUsers";

export const supportRoutes = [
  <Route key="support-dashboard" path="/support/dashboard" element={
    <AdminProtectedRoute allowedRoles={["support", "admin"]}>
      <AdminLayout>
        <SupportDashboard />
      </AdminLayout>
    </AdminProtectedRoute>
  } />,
  <Route key="support-chats" path="/support/chats" element={
    <AdminProtectedRoute allowedRoles={["support", "admin"]}>
      <AdminLayout>
        <SupportChats />
      </AdminLayout>
    </AdminProtectedRoute>
  } />,
  <Route key="support-tickets" path="/support/tickets" element={
    <AdminProtectedRoute allowedRoles={["support", "admin"]}>
      <AdminLayout>
        <SupportTickets />
      </AdminLayout>
    </AdminProtectedRoute>
  } />,
  <Route key="support-users" path="/support/users" element={
    <AdminProtectedRoute allowedRoles={["support", "admin"]}>
      <AdminLayout>
        <SupportUsers />
      </AdminLayout>
    </AdminProtectedRoute>
  } />
];
