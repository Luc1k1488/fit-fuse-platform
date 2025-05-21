import {
  Home,
  Calendar,
  BarChart,
  Settings,
  Dumbbell,
  ListChecks,
  Activity,
} from "lucide-react";
import { useState } from "react";
import { Outlet } from "react-router-dom";

import { MainNav } from "@/components/main-nav";
import { Sidebar, SidebarNavItem } from "@/components/ui/sidebar";
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
    title: "Настройки",
    href: "/app/settings",
    icon: Settings,
    description: "Настройки профиля"
  }
];

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="h-screen flex antialiased text-foreground">
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
          <div className="flex flex-col space-y-2">
            {navigationItems.map((item) => (
              <SidebarNavItem
                key={item.href}
                title={item.title}
                href={item.href}
                icon={item.icon}
                description={item.description}
              />
            ))}
          </div>
        </MainNav>
      </Sidebar>
      <div className="flex-1 p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default ClientLayout;
