
import { ReactNode } from "react";
import { usePermissions } from "@/hooks/usePermissions";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: string | string[];
  fallback?: ReactNode;
}

const RoleGuard = ({ children, allowedRoles, fallback = null }: RoleGuardProps) => {
  const { hasRole } = usePermissions();

  if (!hasRole(allowedRoles)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default RoleGuard;
