
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth_context";
import { useState, useEffect } from "react";
import { AdminNavbar } from "@/components/admin/layout/AdminNavbar";
import { AdminSidebar } from "@/components/admin/layout/AdminSidebar";

interface AdminLayoutProps {
  children?: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, logout, user_role } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileView, setIsMobileView] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const handleSwitchToApp = () => {
    navigate("/app");
  };

  // Определение мобильного представления
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobileView(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };
    
    // Первичная проверка
    checkIsMobile();
    
    // Слушаем изменения размера экрана
    window.addEventListener('resize', checkIsMobile);
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Верхняя навигационная панель */}
      <AdminNavbar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isMobileView={isMobileView}
        user={user}
        userRole={user_role}
        onLogout={handleLogout}
        onSwitchToApp={handleSwitchToApp}
      />

      {/* Боковая панель - адаптивная для мобильных устройств */}
      <AdminSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isMobileView={isMobileView}
        userRole={user_role}
        user={user}
        onLogout={handleLogout}
        onSwitchToApp={handleSwitchToApp}
      />

      {/* Основное содержимое с отступами */}
      <div className={`${sidebarOpen ? "lg:ml-64" : ""} p-4 pt-20 min-h-screen`}>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
