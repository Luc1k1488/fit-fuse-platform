
import {
  Home,
  Calendar,
  BarChart,
  Settings,
  Dumbbell,
  ListChecks,
  Activity,
  Menu,
  User,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";

import { MainNav } from "@/components/main-nav";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarProvider
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/auth_context";

interface ClientLayoutProps {
  children?: React.ReactNode;
}

const navigationItems = [
  {
    title: "Главная",
    href: "/app",
    icon: Home,
    description: "Обзор вашей учетной записи"
  },
  {
    title: "Залы",
    href: "/app/gyms",
    icon: Dumbbell,
    description: "Поиск залов рядом с вами"
  },
  {
    title: "Занятия",
    href: "/app/classes",
    icon: ListChecks,
    description: "Забронируйте групповые занятия"
  },
  {
    title: "Бронирования",
    href: "/app/bookings",
    icon: Calendar,
    description: "Управление вашими бронированиями"
  },
  {
    title: "Календарь",
    href: "/app/calendar",
    icon: Calendar,
    description: "Календарь тренировок и бронирований"
  },
  {
    title: "Прогресс",
    href: "/app/progress",
    icon: Activity,
    description: "Отслеживание прогресса и активности"
  },
  {
    title: "Статистика",
    href: "/app/stats",
    icon: BarChart,
    description: "Ваша статистика"
  },
  {
    title: "Профиль",
    href: "/app/profile",
    icon: User,
    description: "Настройки профиля"
  },
  {
    title: "Настройки",
    href: "/app/settings",
    icon: Settings,
    description: "Настройки приложения"
  }
];

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    // Первичная проверка
    checkIsMobile();
    
    // Слушаем изменения размера экрана
    window.addEventListener('resize', checkIsMobile);
    
    // Проверяем, запускается ли приложение через Capacitor
    const isCapacitor = window.location.href.includes('capacitor://');
    if (isCapacitor) {
      setIsMobileView(true);
    }
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Получаем основные элементы меню для мобильного нижнего меню
  const getMobileMenuItems = () => {
    // Для мобильного меню включаем первые 4 пункта и добавляем профиль явно
    const mainItems = navigationItems.slice(0, 4);
    const profileItem = navigationItems.find(item => item.href === "/app/profile");
    if (profileItem) {
      return [...mainItems, profileItem];
    }
    return mainItems;
  };

  // Проверка активного маршрута
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <SidebarProvider>
      <div className="h-screen flex antialiased text-foreground w-full">
        <Sidebar className="md:block hidden">
          <MainNav className="flex flex-col space-y-6">
            <div className="space-y-1">
              <h2 className="text-sm font-semibold">
                {user?.name || "Фитнес-клиент"}
              </h2>
              <p className="text-xs text-muted-foreground">
                {user?.email || "example@email.com"}
              </p>
            </div>
            <SidebarContent>
              <SidebarMenu>
                {navigationItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild>
                      <Link to={item.href} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>
          </MainNav>
        </Sidebar>
        <div className={`flex-1 p-4 ${isMobileView ? "pb-24" : ""}`}>
          <Outlet />
        </div>

        {/* Нижнее навигационное меню для мобильных устройств */}
        {isMobileView && (
          <nav className="fixed bottom-0 left-0 w-full bg-background border-t border-border z-30 px-2 py-1">
            <div className="flex justify-around items-center">
              {getMobileMenuItems().map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex flex-col items-center py-2 px-3 ${
                    isActive(item.href) 
                      ? "text-primary" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="flex items-center justify-center mb-1">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <span className="text-xs">{item.title}</span>
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </SidebarProvider>
  );
};

export default ClientLayout;
