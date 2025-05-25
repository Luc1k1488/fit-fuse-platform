
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth_context";
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
  X,
  Smartphone
} from "lucide-react";
import { useState, useEffect } from "react";

const AdminLayout = () => {
  const { user, logout, user_role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebar_open, set_sidebar_open] = useState(true);
  const [isMobileView, setIsMobileView] = useState(false);

  const handle_logout = () => {
    logout();
    navigate("/admin/login");
  };

  const handle_switch_to_app = () => {
    navigate("/app");
  };
  
  const is_active = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  // Определение мобильного представления
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobileView(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        set_sidebar_open(false);
      }
    };
    
    // Первичная проверка
    checkIsMobile();
    
    // Слушаем изменения размера экрана
    window.addEventListener('resize', checkIsMobile);
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

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

  const get_role_display = () => {
    switch (user_role) {
      case "admin": return "Администратор";
      case "partner": return "Партнер";
      case "support": return "Поддержка";
      default: return "Пользователь";
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Верхняя навигационная панель */}
      <nav className="bg-gray-800 border-b border-gray-700 fixed w-full z-30">
        <div className="px-3 py-3 lg:px-5 lg:pl-3 flex justify-between items-center">
          <div className="flex items-center">
            <button
              onClick={() => set_sidebar_open(!sidebar_open)}
              aria-expanded={sidebar_open}
              className="p-2 rounded-md focus:outline-none"
            >
              {sidebar_open && isMobileView ? <X className="text-gray-300" /> : <Menu className="text-gray-300" />}
            </button>
            <div className="flex items-center ml-3 lg:ml-0">
              <span className="text-xl font-semibold text-white">GoodFit Admin</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Кнопка перехода в приложение (только для обычных пользователей) */}
            {user_role === "user" && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handle_switch_to_app}
                className="text-gray-300 hover:text-white gap-2"
              >
                <Smartphone size={16} />
                <span className="hidden md:inline">Приложение</span>
              </Button>
            )}
            
            <span className="mr-2 text-sm text-gray-300 hidden md:inline">
              {user?.name} ({get_role_display()})
            </span>
            <Button variant="ghost" size="icon" onClick={handle_logout} className="text-gray-300 hover:text-white">
              <LogOut size={18} />
            </Button>
          </div>
        </div>
      </nav>

      {/* Боковая панель - адаптивная для мобильных устройств */}
      <aside
        className={`fixed top-0 left-0 z-20 w-64 h-full pt-16 bg-gray-800 border-r border-gray-700 transition-transform ${
          sidebar_open ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 ${isMobileView ? "w-full md:w-64" : ""}`}
      >
        <div className="px-3 py-4 overflow-y-auto">
          {isMobileView && (
            <div className="flex justify-between items-center mb-4 px-2">
              <span className="text-lg font-semibold">Меню</span>
              <button
                onClick={() => set_sidebar_open(false)}
                className="p-1 rounded-md hover:bg-gray-700"
              >
                <X className="text-gray-300" size={20} />
              </button>
            </div>
          )}
          
          <ul className="space-y-2">
            {get_menu_items().map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => isMobileView && set_sidebar_open(false)}
                  className={`flex items-center p-2 text-base font-normal rounded-lg transition-colors ${
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

          {/* Информация о пользователе в сайдбаре на мобильных */}
          {isMobileView && (
            <div className="mt-6 pt-6 border-t border-gray-700">
              <div className="px-2 py-2 text-sm text-gray-400">
                <div className="font-medium text-white">{user?.name}</div>
                <div>{get_role_display()}</div>
                <div className="text-xs">{user?.email}</div>
              </div>
              
              {user_role === "user" && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handle_switch_to_app}
                  className="w-full justify-start mt-2 text-gray-300 hover:text-white"
                >
                  <Smartphone size={16} className="mr-2" />
                  Мобильное приложение
                </Button>
              )}
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handle_logout}
                className="w-full justify-start mt-1 text-gray-300 hover:text-white"
              >
                <LogOut size={16} className="mr-2" />
                Выйти
              </Button>
            </div>
          )}
        </div>
      </aside>

      {/* Основное содержимое с отступами */}
      <div className={`${sidebar_open ? "lg:ml-64" : ""} p-4 pt-20 min-h-screen`}>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
