
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth_context";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";
import {
  Home,
  Dumbbell,
  Calendar,
  BookOpen,
  User,
  CreditCard,
  MessageSquare,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";

const ClientLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobile_menu_open, set_mobile_menu_open] = useState(false);

  const handle_logout = () => {
    logout();
    navigate("/login");
  };

  const is_active = (path: string) => {
    return location.pathname === path;
  };

  const menu_items = [
    { label: "Главная", icon: <Home size={18} />, path: "/app" },
    { label: "Залы", icon: <Dumbbell size={18} />, path: "/app/gyms" },
    { label: "Тренировки", icon: <Calendar size={18} />, path: "/app/classes" },
    { label: "Мои записи", icon: <BookOpen size={18} />, path: "/app/bookings" },
    { label: "Подписка", icon: <CreditCard size={18} />, path: "/app/subscription" },
    { label: "Поддержка", icon: <MessageSquare size={18} />, path: "/app/support" },
    { label: "Профиль", icon: <User size={18} />, path: "/app/profile" },
  ];

  return (
    <ProtectedRoute roles={["user"]}>
      <div className="min-h-screen bg-gray-50">
        {/* Мобильная шапка */}
        <header className="bg-white p-4 border-b lg:hidden sticky top-0 z-30">
          <div className="flex justify-between items-center">
            <Link to="/app" className="text-xl font-bold text-primary">GoodFit</Link>
            <button
              onClick={() => set_mobile_menu_open(!mobile_menu_open)}
              className="p-2 focus:outline-none"
            >
              {mobile_menu_open ? <X /> : <Menu />}
            </button>
          </div>
          
          {/* Мобильное меню */}
          {mobile_menu_open && (
            <nav className="mt-4">
              <ul className="space-y-3">
                {menu_items.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={() => set_mobile_menu_open(false)}
                      className={`flex items-center p-2 rounded-lg ${
                        is_active(item.path)
                          ? "bg-primary text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {item.icon}
                      <span className="ml-3">{item.label}</span>
                    </Link>
                  </li>
                ))}
                <li>
                  <button
                    onClick={handle_logout}
                    className="w-full flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    <LogOut size={18} />
                    <span className="ml-3">Выйти</span>
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </header>

        {/* Desktop Layout */}
        <div className="flex h-screen">
          {/* Боковое меню - скрыто на мобильных */}
          <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 h-screen fixed">
            <div className="p-4 border-b border-gray-200">
              <Link to="/app" className="text-xl font-bold text-primary">GoodFit</Link>
            </div>
            
            <div className="px-3 py-4 overflow-y-auto h-[calc(100vh-132px)]">
              <ul className="space-y-2">
                {menu_items.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center p-2 text-base font-normal rounded-lg ${
                        is_active(item.path)
                          ? "bg-primary text-white"
                          : "text-gray-700 hover:bg-gray-100"
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
            </div>
            
            <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                  {user?.profile_image && (
                    <img 
                      src={user.profile_image} 
                      alt={user.name || "Пользователь"} 
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">{user?.name || "Пользователь"}</p>
                  <p className="text-xs text-gray-500">{user?.email || user?.phone}</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={handle_logout}
              >
                <LogOut size={16} className="mr-2" />
                Выйти
              </Button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:ml-64 w-full">
            <div className="p-4 min-h-[calc(100vh-8rem)]">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ClientLayout;
