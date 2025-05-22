
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

  // Show loading state
  if (is_loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!is_authenticated) {
    // Redirect to admin login if trying to access admin routes
    if (location.pathname.startsWith("/admin")) {
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
    
    // Redirect to regular login for client app routes
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If roles are specified, check if the user has the required role
  if (roles.length > 0 && user && !roles.includes(user.role)) {
    // Redirect based on user role
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
