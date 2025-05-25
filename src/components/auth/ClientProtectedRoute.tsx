
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth_context";

interface ClientProtectedRouteProps {
  children: ReactNode;
}

const ClientProtectedRoute = ({ children }: ClientProtectedRouteProps) => {
  const { user, is_authenticated, is_loading } = useAuth();
  const location = useLocation();

  console.log("ClientProtectedRoute check:", { user, is_authenticated, is_loading });

  if (is_loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!is_authenticated) {
    // Для мобильного приложения редиректим на мобильный логин
    return <Navigate to="/login/mobile" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ClientProtectedRoute;
