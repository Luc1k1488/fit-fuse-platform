
import { Link, useLocation } from "react-router-dom";
import { X } from "lucide-react";
import { getMenuItems } from "./AdminMenuItems";
import { AdminUserInfo } from "./AdminUserInfo";

interface AdminSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  isMobileView: boolean;
  userRole: string;
  user: any;
  onLogout: () => void;
  onSwitchToApp: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
  isMobileView,
  userRole,
  user,
  onLogout,
  onSwitchToApp,
}) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const menuItems = getMenuItems(userRole);

  return (
    <aside
      className={`fixed top-0 left-0 z-20 w-64 h-full pt-16 bg-gray-800 border-r border-gray-700 transition-transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 ${isMobileView ? "w-full md:w-64" : ""}`}
    >
      <div className="px-3 py-4 overflow-y-auto">
        {isMobileView && (
          <div className="flex justify-between items-center mb-4 px-2">
            <span className="text-lg font-semibold">Меню</span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-md hover:bg-gray-700"
            >
              <X className="text-gray-300" size={20} />
            </button>
          </div>
        )}
        
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                onClick={() => isMobileView && setSidebarOpen(false)}
                className={`flex items-center p-2 text-base font-normal rounded-lg transition-colors ${
                  isActive(item.path)
                    ? "bg-primary text-white"
                    : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                <span className="w-6 h-6 flex items-center justify-center">
                  {item.icon}
                </span>
                <span className="ml-3">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Информация о пользователе в сайдбаре на мобильных */}
        {isMobileView && (
          <AdminUserInfo
            user={user}
            userRole={userRole}
            onLogout={onLogout}
            onSwitchToApp={onSwitchToApp}
            isMobileView={true}
          />
        )}
      </div>
    </aside>
  );
};
