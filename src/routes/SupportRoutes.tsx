
import { Route } from "react-router-dom";
import AdminProtectedRoute from "@/components/auth/AdminProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";
import SupportDashboard from "@/pages/support/SupportDashboard";
import SupportChats from "@/pages/support/SupportChats";
import SupportTickets from "@/pages/support/SupportTickets";
import SupportUsers from "@/pages/support/SupportUsers";

export const supportRoutes = [
  <Route key="support" path="/support/*" element={
    <AdminProtectedRoute allowedRoles={["support", "admin"]}>
      <AdminLayout>
        <Route path="dashboard" element={<SupportDashboard />} />
        <Route path="chats" element={<SupportChats />} />
        <Route path="tickets" element={<SupportTickets />} />
        <Route path="users" element={<SupportUsers />} />
      </AdminLayout>
    </AdminProtectedRoute>
  } />
];
