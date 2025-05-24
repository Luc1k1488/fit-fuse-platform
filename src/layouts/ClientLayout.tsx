
import {
  Home,
  Search,
  Calendar,
  CreditCard,
  User,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth_context";

interface ClientLayoutProps {
  children?: React.ReactNode;
}

const navigationItems = [
  {
    title: "Главная",
    href: "/app",
    icon: Home,
    description: "Главная страница с залами"
  },
  {
    title: "Поиск",
    href: "/app/search",
    icon: Search,
    description: "Поиск залов"
  },
  {
    title: "Расписание",
    href: "/app/schedule",
    icon: Calendar,
    description: "Расписание и бронирования"
  },
  {
    title: "Абонемент",
    href: "/app/subscription",
    icon: CreditCard,
    description: "Управление абонементами"
  },
  {
    title: "Профиль",
    href: "/app/profile",
    icon: User,
    description: "Профиль и настройки"
  }
];

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  // Проверка активного маршрута
  const isActive = (path: string) => {
    if (path === "/app") {
      return location.pathname === "/app";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col w-full max-w-full overflow-hidden">
      {/* Основной контент */}
      <div className="flex-1 overflow-y-auto pb-20 px-0">
        <div className="w-full max-w-full">
          <Outlet />
        </div>
      </div>

      {/* Нижнее навигационное меню - фиксированное */}
      <nav className="fixed bottom-0 left-0 right-0 w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-50 px-0 py-2 safe-area-pb">
        <div className="flex justify-around items-center w-full max-w-full">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`flex flex-col items-center py-1 px-1 min-w-0 flex-1 ${
                isActive(item.href) 
                  ? "text-primary" 
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
            >
              <span className="flex items-center justify-center mb-1">
                <item.icon className="h-5 w-5" />
              </span>
              <span className="text-xs truncate w-full text-center">{item.title}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default ClientLayout;
