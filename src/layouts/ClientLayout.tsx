
import { ReactNode, useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Home, Dumbbell, Calendar, User, Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface ClientLayoutProps {
  children: ReactNode;
}

const ClientLayout = ({ children }: ClientLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Закрываем боковое меню при переходе по ссылке
  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  const navItems = [
    { name: "Главная", href: "/app", icon: Home },
    { name: "Поиск", href: "/app/search", icon: Search },
    { name: "Расписание", href: "/app/schedule", icon: Calendar },
    { name: "Профиль", href: "/app/profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Mobile Header */}
      <div className="sm:hidden fixed top-0 left-0 right-0 z-10 bg-slate-900/80 backdrop-blur-md border-b border-slate-700 px-4 py-3 flex justify-between items-center">
        <Link to="/app" className="font-bold text-white text-lg">GoodFit</Link>
        
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="px-2 text-white">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] bg-slate-900 border-slate-700 p-0">
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-slate-700 flex justify-between items-center">
                <span className="font-bold text-white">Меню</span>
                <Button variant="ghost" size="sm" className="px-2 text-white" onClick={() => setSidebarOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-1">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.href}
                      to={item.href}
                      end={item.href === "/app"}
                      className={({ isActive }) => `flex items-center gap-2 p-3 rounded-lg transition-colors ${
                        isActive 
                          ? 'bg-purple-600 text-white' 
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </NavLink>
                  ))}
                </div>

                <div className="mt-8 space-y-1">
                  <div className="text-xs uppercase text-slate-500 font-semibold px-3 mb-2">
                    Быстрые разделы
                  </div>
                  {[
                    { name: "Залы", href: "/app/gyms", icon: Dumbbell },
                    { name: "Занятия", href: "/app/classes", icon: Calendar },
                    { name: "Бронирования", href: "/app/bookings", icon: Calendar },
                    { name: "Абонемент", href: "/app/subscription", icon: Dumbbell },
                    { name: "Прогресс", href: "/app/progress", icon: Calendar },
                    { name: "Поддержка", href: "/app/support", icon: Dumbbell },
                  ].map((item) => (
                    <NavLink
                      key={item.href}
                      to={item.href}
                      className={({ isActive }) => `flex items-center gap-2 p-3 rounded-lg transition-colors ${
                        isActive 
                          ? 'bg-purple-600 text-white' 
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </NavLink>
                  ))}
                </div>
              </ScrollArea>
              
              <div className="p-4 border-t border-slate-700">
                <Button variant="outline" size="sm" className="w-full text-slate-300 border-slate-600 hover:bg-slate-800">
                  Выйти из приложения
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content */}
      <div className="pt-14 pb-16 sm:pt-0 sm:pb-0 sm:pl-0">
        {children}
      </div>

      {/* Mobile Footer Navigation */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-10 bg-slate-900/90 backdrop-blur-md border-t border-slate-700 px-2 py-1">
        <div className="flex justify-between">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === "/app"}
              className={({ isActive }) => `flex flex-col items-center justify-center p-2 ${
                isActive ? 'text-purple-500' : 'text-slate-400 hover:text-white'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs mt-1">{item.name}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClientLayout;
