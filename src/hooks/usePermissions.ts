
import { useAuth } from "@/contexts/auth_context";

export const usePermissions = () => {
  const { user } = useAuth();

  const hasRole = (role: string | string[]) => {
    if (!user) return false;
    
    const userRole = user.user_metadata?.role || 'user';
    
    if (Array.isArray(role)) {
      return role.includes(userRole);
    }
    
    return userRole === role;
  };

  const isAdmin = () => hasRole('admin');
  const isPartner = () => hasRole(['admin', 'partner']);
  const isSupport = () => hasRole(['admin', 'support']);
  const isUser = () => hasRole('user');

  const canManageUsers = () => isAdmin();
  const canManageGyms = () => hasRole(['admin', 'partner']);
  const canManageBookings = () => hasRole(['admin', 'partner', 'support']);
  const canViewAnalytics = () => hasRole(['admin', 'partner']);
  const canManageSupport = () => hasRole(['admin', 'support']);

  return {
    hasRole,
    isAdmin,
    isPartner,
    isSupport,
    isUser,
    canManageUsers,
    canManageGyms,
    canManageBookings,
    canViewAnalytics,
    canManageSupport,
    userRole: user?.user_metadata?.role || 'user'
  };
};
