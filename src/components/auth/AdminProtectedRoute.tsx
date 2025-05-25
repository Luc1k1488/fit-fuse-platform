
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth_context";

interface AdminProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

const AdminProtectedRoute = ({ children, allowedRoles = ["admin"] }: AdminProtectedRouteProps) => {
  const { user, is_authenticated, is_loading } = useAuth();
  const location = useLocation();

  console.log("AdminProtectedRoute check:", { user, is_authenticated, is_loading, allowedRoles });

  if (is_loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="text-gray-300">Проверка доступа...</p>
        </div>
      </div>
    );
  }

  if (!is_authenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (user && !allowedRoles.includes(user.role)) {
    // Редиректим на соответствующую роли страницу
    if (user.role === "user") {
      return <Navigate to="/app" replace />;
    } else {
      return <Navigate to="/admin/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
