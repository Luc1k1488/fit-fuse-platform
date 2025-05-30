
import {
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
} from "lucide-react";

export interface MenuItem {
  label: string;
  icon: React.ReactElement;
  path: string;
}

export const getMenuItems = (userRole: string): MenuItem[] => {
  // Администратор имеет доступ ко всему
  if (userRole === "admin") {
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
  if (userRole === "partner") {
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
  if (userRole === "support") {
    return [
      { label: "Панель управления", icon: <Home size={18} />, path: "/admin/support-portal" },
      { label: "Обращения", icon: <MessageSquare size={18} />, path: "/admin/support-portal/tickets" },
      { label: "Пользователи", icon: <Users size={18} />, path: "/admin/support-portal/users" },
      { label: "Чаты", icon: <MessageSquare size={18} />, path: "/admin/support-portal/chats" },
    ];
  }
  
  return [];
};

export const getRoleDisplay = (userRole: string): string => {
  switch (userRole) {
    case "admin": return "Администратор";
    case "partner": return "Партнер";
    case "support": return "Поддержка";
    default: return "Пользователь";
  }
};
