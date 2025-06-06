
import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth_context";

interface ClientProtectedRouteProps {
  children: ReactNode;
}

const ClientProtectedRoute = ({ children }: ClientProtectedRouteProps) => {
  const { user, is_loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!is_loading && !user) {
      // Если пользователь не авторизован, перенаправляем на страницу входа
      navigate("/login");
    }
  }, [user, is_loading, navigate]);

  // Показываем экран загрузки, пока проверяем авторизацию
  if (is_loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // Если пользователь авторизован, показываем контент
  return user ? <>{children}</> : null;
};

export default ClientProtectedRoute;
