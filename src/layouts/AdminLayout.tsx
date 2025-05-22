
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth_context";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import {
  LogOut,
  User,
  Home,
  Users,
  Dumbbell,
  Calendar,
  BookOpen,
  CreditCard,
  HeartHandshake,
  MessageSquare,
  Star,
  BarChart3,
  Settings,
  Menu,
} from "lucide-react";
import { useState } from "react";

const AdminLayout = () => {
  const { user, logout, user_role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebar_open, set_sidebar_open] = useState(true);

  const handle_logout = () => {
    logout();
    navigate("/admin/login");
  };
  
  const is_active = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  // Элементы меню в зависимости от роли пользователя
  const get_menu_items = () => {
    // Администратор имеет доступ ко всему
    if (user_role === "admin") {
      return [
        { label: "Панель управления", icon: <Home size={18} />, path: "/admin/dashboard" },
        { label: "Пользователи", icon: <Users size={18} />, path: "/admin/users" },
        { label: "Фитнес-залы", icon: <Dumbbell size={18} />, path: "/admin/gyms" },
        { label: "Тренировки", icon: <Calendar size={18} />, path: "/admin/classes" },
        { label: "Бронирования", icon: <BookOpen size={18} />, path: "/admin/bookings" },
        { label: "Абонементы", icon: <CreditCard size={18} />, path: "/admin/subscriptions" },
        { label: "Партнеры", icon: <HeartHandshake size={18} />, path: "/admin/partners" },
        { label: "Поддержка", icon: <MessageSquare size={18} />, path: "/admin/support" },
        { label: "Отзывы", icon: <Star size={18} />, path: "/admin/reviews" },
        { label: "Аналитика", icon: <BarChart3 size={18} />, path: "/admin/analytics" },
      ];
    }
    
    // Пункты меню для партнера
    if (user_role === "partner") {
      return [
        { label: "Панель управления", icon: <Home size={18} />, path: "/admin/partner" },
        { label: "Мои залы", icon: <Dumbbell size={18} />, path: "/admin/partner/gyms" },
        { label: "Тренировки", icon: <Calendar size={18} />, path: "/admin/partner/classes" },
        { label: "Бронирования", icon: <BookOpen size={18} />, path: "/admin/partner/bookings" },
        { label: "Отзывы", icon: <Star size={18} />, path: "/admin/partner/reviews" },
        { label: "Аналитика", icon: <BarChart3 size={18} />, path: "/admin/partner/analytics" },
      ];
    }
    
    // Пункты меню для службы поддержки
    if (user_role === "support") {
      return [
        { label: "Панель управления", icon: <Home size={18} />, path: "/admin/support-portal" },
        { label: "Обращения", icon: <MessageSquare size={18} />, path: "/admin/support-portal/tickets" },
        { label: "Пользователи", icon: <Users size={18} />, path: "/admin/support-portal/users" },
        { label: "Чаты", icon: <MessageSquare size={18} />, path: "/admin/support-portal/chats" },
      ];
    }
    
    return [];
  };

  return (
    <ProtectedRoute roles={["admin", "partner", "support"]}>
      <div className="min-h-screen bg-gray-900 text-gray-100">
        {/* Верхняя навигационная панель */}
        <nav className="bg-gray-800 border-b border-gray-700 fixed w-full z-30">
          <div className="px-3 py-3 lg:px-5 lg:pl-3 flex justify-between items-center">
            <div className="flex items-center">
              <button
                onClick={() => set_sidebar_open(!sidebar_open)}
                aria-expanded={sidebar_open}
                className="p-2 rounded-md lg:hidden focus:outline-none"
              >
                <Menu className="text-gray-300" />
              </button>
              <div className="flex items-center ml-3 lg:ml-0">
                <span className="text-xl font-semibold text-white">GoodFit Управление</span>
                {!sidebar_open && (
                  <button
                    onClick={() => set_sidebar_open(true)}
                    className="p-2 ml-3 focus:outline-none lg:hidden"
                  >
                    <Menu className="text-gray-300" />
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex items-center">
              <span className="mr-2 text-sm text-gray-300">
                {user?.name} ({user_role === "admin" ? "Администратор" : user_role === "partner" ? "Партнер" : "Поддержка"})
              </span>
              <Button variant="ghost" size="icon" onClick={handle_logout} className="text-gray-300 hover:text-white">
                <LogOut size={18} />
              </Button>
            </div>
          </div>
        </nav>

        {/* Боковая панель */}
        <aside
          className={`fixed top-0 left-0 z-20 w-64 h-full pt-16 bg-gray-800 border-r border-gray-700 transition-transform ${
            sidebar_open ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0`}
        >
          <div className="px-3 py-4 overflow-y-auto">
            <ul className="space-y-2">
              {get_menu_items().map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center p-2 text-base font-normal rounded-lg ${
                      is_active(item.path)
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
          </div>
        </aside>

        {/* Основное содержимое */}
        <div className={`${sidebar_open ? "lg:ml-64" : ""} p-4 pt-20 min-h-screen`}>
          <Outlet />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdminLayout;
