
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth_context";

interface ClientProtectedRouteProps {
  children: ReactNode;
}

const ClientProtectedRoute = ({ children }: ClientProtectedRouteProps) => {
  const { is_authenticated, is_loading } = useAuth();

  // Показываем экран загрузки, пока проверяем авторизацию
  if (is_loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // Если пользователь не авторизован, перенаправляем на страницу входа
  if (!is_authenticated) {
    return <Navigate to="/login" replace />;
  }

  // Если пользователь авторизован, показываем контент
  return <>{children}</>;
};

export default ClientProtectedRoute;
