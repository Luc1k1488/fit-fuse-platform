
import { useAuth } from "@/contexts/auth_context";
import { Navigate } from "react-router-dom";
import { AdminSidebar } from "./layout/AdminSidebar";
import AdminNavbar from "./layout/AdminNavbar";
import UserRoleNotification from "./users/UserRoleNotification";
import UserBlockingNotification from "./users/UserBlockingNotification";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user } = useAuth();
  const role = user?.user_metadata?.role;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role !== 'admin' && role !== 'support') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
      
      {/* Глобальные компоненты уведомлений */}
      <UserRoleNotification />
      <UserBlockingNotification />
    </div>
  );
};

export default AdminLayout;
