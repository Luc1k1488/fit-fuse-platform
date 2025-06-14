
import { useAuth } from "@/contexts/auth_context";
import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminSidebar } from "./layout/AdminSidebar";
import AdminNavbar from "./layout/AdminNavbar";
import UserRoleNotification from "./users/UserRoleNotification";
import UserBlockingNotification from "./users/UserBlockingNotification";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const role = user?.user_metadata?.role;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  // Detect mobile view
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 1024);
    };

    checkMobileView();
    window.addEventListener('resize', checkMobileView);

    return () => window.removeEventListener('resize', checkMobileView);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleSwitchToApp = () => {
    navigate("/");
  };

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
        <AdminSidebar 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          isMobileView={isMobileView}
          userRole={role || 'user'}
          user={user}
          onLogout={handleLogout}
          onSwitchToApp={handleSwitchToApp}
        />
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
