
import { ReactNode, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth_context";

interface AdminProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

const AdminProtectedRoute = ({ children, allowedRoles = ["admin", "partner", "support"] }: AdminProtectedRouteProps) => {
  const { user, is_loading } = useAuth();
  const navigate = useNavigate();

  // Проверка роли пользователя
  const checkUserRole = () => {
    if (!user) return false;
    
    const userRole = user.user_metadata?.role || "user";
    return allowedRoles.includes(userRole);
  };

  useEffect(() => {
    if (!is_loading && !user) {
      // Если пользователь не авторизован, перенаправляем на страницу входа для админа
      navigate("/admin/login");
    } else if (!is_loading && user && !checkUserRole()) {
      // Если пользователь авторизован, но не имеет нужной роли
      navigate("/");
    }
  }, [user, is_loading, navigate]);

  // Показываем экран загрузки, пока проверяем авторизацию
  if (is_loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Если пользователь авторизован и имеет нужную роль, показываем контент
  return user && checkUserRole() ? <>{children}</> : null;
};

export default AdminProtectedRoute;
