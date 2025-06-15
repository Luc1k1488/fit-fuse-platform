
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
  console.log("AdminProtectedRoute - Allowed roles:", allowedRoles);

  // Проверка роли пользователя
  const checkUserRole = () => {
    if (!user) {
      console.log("No user found for role check");
      return false;
    }
    
    // Проверяем роль из метаданных пользователя
    const userRole = user.user_metadata?.role || "user";
    console.log("Checking user role:", userRole, "against allowed roles:", allowedRoles);
    const hasRole = allowedRoles.includes(userRole);
    console.log("User has required role:", hasRole);
    return hasRole;
  };

  // Показываем экран загрузки, пока проверяем авторизацию
  if (is_loading) {
    console.log("Still loading auth state...");
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-gray-600">Проверка доступа...</p>
        </div>
      </div>
    );
  }

  // Если пользователь не авторизован, перенаправляем на страницу входа
  if (!is_authenticated) {
    console.log("User not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // Если пользователь авторизован, но не имеет нужной роли
  if (!checkUserRole()) {
    console.log("User doesn't have required role, current role:", user?.user_metadata?.role);
    const userRole = user?.user_metadata?.role || "user";
    
    console.log("Redirecting based on user role:", userRole);
    
    // Перенаправляем на соответствующую роли страницу
    if (userRole === "user") {
      return <Navigate to="/app" replace />;
    } else if (userRole === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (userRole === "partner") {
      return <Navigate to="/partner/dashboard" replace />;
    } else if (userRole === "support") {
      return <Navigate to="/support/dashboard" replace />;
    }
    
    // Если роль неизвестна, перенаправляем на главную
    return <Navigate to="/" replace />;
  }

  console.log("Access granted, rendering children");
  // Если пользователь авторизован и имеет нужную роль, показываем контент
  return <>{children}</>;
};

export default AdminProtectedRoute;
