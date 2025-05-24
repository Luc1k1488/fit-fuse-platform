
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth_context";

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: string[];
}

const ProtectedRoute = ({ children, roles = [] }: ProtectedRouteProps) => {
  const { user, is_authenticated, is_loading } = useAuth();
  const location = useLocation();

  // Показываем загрузку только если идет проверка аутентификации
  if (is_loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="text-gray-600">Проверка доступа...</p>
        </div>
      </div>
    );
  }

  // Если не аутентифицирован, редиректим на логин
  if (!is_authenticated) {
    // Для админских роутов - на админский логин
    if (location.pathname.startsWith("/admin")) {
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
    
    // Для клиентских роутов - на обычный логин
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Если указаны роли и пользователь не имеет нужной роли
  if (roles.length > 0 && user && !roles.includes(user.role)) {
    // Редиректим на соответствующую роли страницу
    if (user.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user.role === "partner") {
      return <Navigate to="/admin/partner" replace />;
    } else if (user.role === "support") {
      return <Navigate to="/admin/support-portal" replace />;
    } else {
      return <Navigate to="/app" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
