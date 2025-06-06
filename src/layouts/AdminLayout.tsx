
import { ReactNode, useState } from "react";
import { NavLink, useLocation, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth_context";
import { useToast } from "@/hooks/use-toast";
import { 
  ChevronLeft,
  ChevronRight, 
  Home, 
  Users, 
  Dumbbell, 
  BookOpen,
  Calendar,
  Building,
  CreditCard,
  Star,
  Ticket,
  BarChart,
  UserCog,
  Menu,
  Settings,
  LogOut,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Вы вышли из системы",
        description: "До свидания!",
      });
      navigate("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось выйти из системы",
      });
    }
  };

  // Выбор меню пунктов в зависимости от роли
  let menuItems = [
    { title: "Панель управления", path: "/admin/dashboard", icon: Home },
    { title: "Пользователи", path: "/admin/users", icon: Users },
    { title: "Фитнес-залы", path: "/admin/gyms", icon: Dumbbell },
    { title: "Бронирования", path: "/admin/bookings", icon: BookOpen },
    { title: "Расписание", path: "/admin/classes", icon: Calendar },
    { title: "Партнеры", path: "/admin/partners", icon: Building },
    { title: "Абонементы", path: "/admin/subscriptions", icon: CreditCard },
    { title: "Отзывы", path: "/admin/reviews", icon: Star },
    { title: "Поддержка", path: "/admin/support", icon: Ticket },
    { title: "Аналитика", path: "/admin/analytics", icon: BarChart }
  ];
  
  // Для партнеров ограничиваем доступный набор меню
  const isPartner = user?.user_metadata?.role === 'partner';
  if (isPartner) {
    menuItems = [
      { title: "Панель партнера", path: "/admin/partner", icon: Home },
      { title: "Мои залы", path: "/admin/partner/gyms", icon: Dumbbell },
      { title: "Расписание", path: "/admin/partner/classes", icon: Calendar },
      { title: "Бронирования", path: "/admin/partner/bookings", icon: BookOpen },
      { title: "Отзывы", path: "/admin/partner/reviews", icon: Star },
      { title: "Аналитика", path: "/admin/partner/analytics", icon: BarChart }
    ];
  }

  // Для службы поддержки
  const isSupport = user?.user_metadata?.role === 'support';
  if (isSupport) {
    menuItems = [
      { title: "Панель поддержки", path: "/admin/support-portal", icon: Home },
      { title: "Обращения", path: "/admin/support-portal/tickets", icon: Ticket },
      { title: "Пользователи", path: "/admin/support-portal/users", icon: Users },
      { title: "Чаты", path: "/admin/support-portal/chats", icon: BookOpen }
    ];
  }

  const userName = user?.user_metadata?.name || user?.email?.split("@")[0] || "Администратор";
  const userRole = user?.user_metadata?.role === 'admin' ? 'Администратор' :
                   user?.user_metadata?.role === 'partner' ? 'Партнер' : 
                   user?.user_metadata?.role === 'support' ? 'Служба поддержки' : 'Пользователь';
  
  const userInitial = userName.charAt(0).toUpperCase();

  const Sidebar = (
    <aside 
      className={`h-screen bg-gray-900 border-r border-gray-800 flex flex-col ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      } transition-all duration-300 fixed left-0 top-0 z-30`}
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-gray-800">
        {!sidebarCollapsed && (
          <span className="font-bold text-lg text-white mr-2">GoodFit</span>
        )}
        <Button
          variant="ghost" 
          size="sm" 
          className="ml-auto text-gray-400 hover:text-white"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        >
          {sidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </div>

      {/* User Info */}
      <div className={`p-4 border-b border-gray-800 ${sidebarCollapsed ? 'flex justify-center' : ''}`}>
        <div className={`flex items-center ${sidebarCollapsed ? 'flex-col' : 'gap-3'}`}>
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary text-white">{userInitial}</AvatarFallback>
          </Avatar>
          {!sidebarCollapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white">{userName}</span>
              <span className="text-xs text-gray-400">{userRole}</span>
            </div>
          )}
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === '/admin/dashboard' || item.path === '/admin/partner' || item.path === '/admin/support-portal'}
                className={({ isActive }) => `
                  flex items-center gap-3 p-2 rounded-md
                  ${isActive ? 'bg-primary text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}
                  ${sidebarCollapsed ? 'justify-center' : ''}
                `}
              >
                <item.icon size={20} />
                {!sidebarCollapsed && <span>{item.title}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800 space-y-2">
        {!sidebarCollapsed && (
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white w-full p-2 rounded-md hover:bg-gray-800">
            <ChevronLeft size={20} />
            <span>На сайт</span>
          </Link>
        )}
        
        <Button
          variant="ghost"
          className={`text-gray-400 hover:text-white hover:bg-gray-800 w-full ${sidebarCollapsed ? 'justify-center p-2' : ''}`}
          onClick={handleLogout}
        >
          <LogOut size={20} />
          {!sidebarCollapsed && <span className="ml-2">Выйти</span>}
        </Button>
      </div>
    </aside>
  );

  return (
    <div className="flex bg-gray-100 dark:bg-gray-950">
      {/* Sidebar for desktop */}
      <div className="hidden md:block">
        {Sidebar}
      </div>
      
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-20 bg-gray-900 border-b border-gray-800 p-4 flex justify-between items-center">
        <span className="font-bold text-lg text-white">GoodFit</span>
        
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="text-gray-400">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] p-0 bg-gray-900 border-r border-gray-800">
            {/* Close button */}
            <div className="p-4 flex justify-between items-center border-b border-gray-800">
              <span className="font-bold text-lg text-white">GoodFit</span>
              <Button variant="ghost" size="sm" className="text-gray-400" onClick={() => setMenuOpen(false)}>
                <X />
              </Button>
            </div>
            
            {/* User Info */}
            <div className="p-4 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary text-white">{userInitial}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-white">{userName}</span>
                  <span className="text-xs text-gray-400">{userRole}</span>
                </div>
              </div>
            </div>
            
            {/* Menu Items */}
            <nav className="py-4">
              <ul className="space-y-1 px-2">
                {menuItems.map((item) => (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      end={item.path === '/admin/dashboard' || item.path === '/admin/partner' || item.path === '/admin/support-portal'}
                      onClick={() => setMenuOpen(false)}
                      className={({ isActive }) => `
                        flex items-center gap-3 p-3 rounded-md
                        ${isActive ? 'bg-primary text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}
                      `}
                    >
                      <item.icon size={20} />
                      <span>{item.title}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
            
            {/* Footer */}
            <div className="p-4 border-t border-gray-800 space-y-2">
              <Link 
                to="/"
                onClick={() => setMenuOpen(false)} 
                className="flex items-center gap-2 text-gray-400 hover:text-white w-full p-2 rounded-md hover:bg-gray-800"
              >
                <ChevronLeft size={20} />
                <span>На сайт</span>
              </Link>
              
              <Button
                variant="ghost"
                className="text-gray-400 hover:text-white hover:bg-gray-800 w-full justify-start"
                onClick={handleLogout}
              >
                <LogOut size={20} />
                <span className="ml-2">Выйти</span>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${
        sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'
      } ${
        location.pathname.startsWith('/admin') ? 'pt-16 md:pt-0' : ''
      }`}>
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
