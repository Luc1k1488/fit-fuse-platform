
import { Button } from "@/components/ui/button";
import { LogOut, Smartphone } from "lucide-react";
import { getRoleDisplay } from "./AdminMenuItems";

interface AdminUserInfoProps {
  user: any;
  userRole: string;
  onLogout: () => void;
  onSwitchToApp: () => void;
  isMobileView: boolean;
}

export const AdminUserInfo: React.FC<AdminUserInfoProps> = ({
  user,
  userRole,
  onLogout,
  onSwitchToApp,
  isMobileView,
}) => {
  if (!isMobileView) {
    return (
      <div className="flex items-center gap-2">
        {/* Кнопка перехода в приложение (только для обычных пользователей) */}
        {userRole === "user" && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onSwitchToApp}
            className="text-gray-300 hover:text-white gap-2"
          >
            <Smartphone size={16} />
            <span className="hidden md:inline">Приложение</span>
          </Button>
        )}
        
        <span className="mr-2 text-sm text-gray-300 hidden md:inline">
          {user?.name} ({getRoleDisplay(userRole)})
        </span>
        <Button variant="ghost" size="icon" onClick={onLogout} className="text-gray-300 hover:text-white">
          <LogOut size={18} />
        </Button>
      </div>
    );
  }

  // Mobile version - shown in sidebar
  return (
    <div className="mt-6 pt-6 border-t border-gray-700">
      <div className="px-2 py-2 text-sm text-gray-400">
        <div className="font-medium text-white">{user?.name}</div>
        <div>{getRoleDisplay(userRole)}</div>
        <div className="text-xs">{user?.email}</div>
      </div>
      
      {userRole === "user" && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onSwitchToApp}
          className="w-full justify-start mt-2 text-gray-300 hover:text-white"
        >
          <Smartphone size={16} className="mr-2" />
          Мобильное приложение
        </Button>
      )}
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onLogout}
        className="w-full justify-start mt-1 text-gray-300 hover:text-white"
      >
        <LogOut size={16} className="mr-2" />
        Выйти
      </Button>
    </div>
  );
};
