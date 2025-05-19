
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth_context";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";
import InstallPWA from "@/components/pwa/InstallPWA";
import {
  Home,
  Dumbbell,
  Calendar,
  BookOpen,
  User,
  CreditCard,
  MessageSquare,
  LogOut,
  X,
  ChevronLeft
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const ClientLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Определение заголовка для текущей страницы
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/app") return "Главная";
    if (path === "/app/gyms") return "Фитнес-залы";
    if (path.startsWith("/app/gyms/")) return "Информация о зале";
    if (path === "/app/classes") return "Тренировки";
    if (path === "/app/bookings") return "Мои записи";
    if (path === "/app/profile") return "Профиль";
    if (path === "/app/subscription") return "Подписка";
    if (path === "/app/support") return "Поддержка";
    return "GoodFit";
  };

  // Обработчик выхода из аккаунта
  const handleLogout = () => {
    logout();
    toast.success("Вы успешно вышли из аккаунта");
    navigate("/login");
  };

  // Определение активного пункта меню
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Скрытие/показ хедера при скролле
  useEffect(() => {
    const controlHeader = () => {
      if (window.scrollY > 100) {
        if (window.scrollY > lastScrollY) {
          setShowHeader(false);
        } else {
          setShowHeader(true);
        }
      } else {
        setShowHeader(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener('scroll', controlHeader);
    return () => {
      window.removeEventListener('scroll', controlHeader);
    };
  }, [lastScrollY]);

  // Пункты нижнего меню
  const menuItems = [
    { label: "Главная", icon: <Home size={22} />, path: "/app" },
    { label: "Залы", icon: <Dumbbell size={22} />, path: "/app/gyms" },
    { label: "Занятия", icon: <Calendar size={22} />, path: "/app/classes" },
    { label: "Записи", icon: <BookOpen size={22} />, path: "/app/bookings" },
    { label: "Профиль", icon: <User size={22} />, path: "/app/profile" },
  ];

  // Проверка, нужно ли показывать кнопку "Назад"
  const showBackButton = () => {
    return location.pathname !== "/app" && 
           !menuItems.some(item => item.path === location.pathname);
  };

  return (
    <ProtectedRoute roles={["user"]}>
      <div className="min-h-screen bg-gray-50 pb-16">
        {/* Фиксированный хедер */}
        <header 
          className={`bg-white px-4 py-3 border-b fixed top-0 left-0 right-0 z-30 transition-transform duration-300 ${
            showHeader ? 'transform-none' : '-translate-y-full'
          }`}
        >
          <div className="flex justify-between items-center">
            {showBackButton() ? (
              <button 
                onClick={() => navigate(-1)} 
                className="p-2 -ml-2 focus:outline-none"
              >
                <ChevronLeft size={24} />
              </button>
            ) : (
              <Link to="/app" className="text-xl font-bold gradient-text">
                GoodFit
              </Link>
            )}
            <h1 className="text-lg font-medium absolute left-1/2 transform -translate-x-1/2">
              {getPageTitle()}
            </h1>
            <div className="w-8">
              {/* Пустой div для выравнивания заголовка по центру */}
            </div>
          </div>
        </header>

        {/* Основной контент */}
        <main className="pt-14 pb-4">
          <div className="p-4">
            <Outlet />
          </div>
        </main>

        {/* Компонент установки PWA */}
        <InstallPWA />

        {/* Нижняя панель навигации (мобильная) */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t z-30">
          <div className="flex justify-between">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center py-2 flex-1 ${
                  isActive(item.path)
                    ? "text-primary"
                    : "text-gray-500"
                }`}
              >
                <div className="mb-1">{item.icon}</div>
                <span className="text-xs">{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Дополнительное меню с настройками, для доступа со страницы профиля */}
        <div className="hidden">
          <Link to="/app/subscription">
            <CreditCard size={18} />
            <span>Подписка</span>
          </Link>
          <Link to="/app/support">
            <MessageSquare size={18} />
            <span>Поддержка</span>
          </Link>
          <Button onClick={handleLogout}>
            <LogOut size={16} className="mr-2" />
            Выйти
          </Button>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ClientLayout;
