
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth_context";

interface AdminProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

const AdminProtectedRoute = ({ children, allowedRoles = ["admin", "partner", "support"] }: AdminProtectedRouteProps) => {
  const { user, is_loading, is_authenticated } = useAuth();

  console.log("AdminProtectedRoute - User:", user?.email || 'no user');
  console.log("AdminProtectedRoute - Loading:", is_loading);
  console.log("AdminProtectedRoute - Authenticated:", is_authenticated);
  console.log("AdminProtectedRoute - User role from metadata:", user?.user_metadata?.role);

  // Проверка роли пользователя
  const checkUserRole = () => {
    if (!user) return false;
    
    // Проверяем роль из метаданных пользователя
    const userRole = user.user_metadata?.role || "user";
    console.log("Checking user role:", userRole, "Allowed roles:", allowedRoles);
    return allowedRoles.includes(userRole);
  };

  // Показываем экран загрузки, пока проверяем авторизацию
  if (is_loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-gray-600">Проверка доступа...</p>
        </div>
      </div>
    );
  }

  // Если пользователь не авторизован, перенаправляем на страницу входа для админа
  if (!is_authenticated) {
    console.log("User not authenticated, redirecting to admin login");
    return <Navigate to="/admin/login" replace />;
  }

  // Если пользователь авторизован, но не имеет нужной роли
  if (!checkUserRole()) {
    console.log("User doesn't have required role, redirecting to main page");
    return <Navigate to="/" replace />;
  }

  console.log("Access granted, rendering children");
  // Если пользователь авторизован и имеет нужную роль, показываем контент
  return <>{children}</>;
};

export default AdminProtectedRoute;
