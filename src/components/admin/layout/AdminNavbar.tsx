
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { AdminUserInfo } from "./AdminUserInfo";

interface AdminNavbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  isMobileView: boolean;
  user: any;
  userRole: string;
  onLogout: () => void;
  onSwitchToApp: () => void;
}

export const AdminNavbar: React.FC<AdminNavbarProps> = ({
  sidebarOpen,
  setSidebarOpen,
  isMobileView,
  user,
  userRole,
  onLogout,
  onSwitchToApp,
}) => {
  return (
    <nav className="bg-gray-800 border-b border-gray-700 fixed w-full z-30">
      <div className="px-3 py-3 lg:px-5 lg:pl-3 flex justify-between items-center">
        <div className="flex items-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-expanded={sidebarOpen}
            className="p-2 rounded-md focus:outline-none"
          >
            {sidebarOpen && isMobileView ? <X className="text-gray-300" /> : <Menu className="text-gray-300" />}
          </button>
          <div className="flex items-center ml-3 lg:ml-0">
            <span className="text-xl font-semibold text-white">GoodFit Admin</span>
          </div>
        </div>
        
        <AdminUserInfo
          user={user}
          userRole={userRole}
          onLogout={onLogout}
          onSwitchToApp={onSwitchToApp}
          isMobileView={false}
        />
      </div>
    </nav>
  );
};
