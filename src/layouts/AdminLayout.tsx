
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

  // Menu items based on user role
  const get_menu_items = () => {
    // Admin has access to everything
    if (user_role === "admin") {
      return [
        { label: "Dashboard", icon: <Home size={18} />, path: "/admin/dashboard" },
        { label: "Users", icon: <Users size={18} />, path: "/admin/users" },
        { label: "Gyms", icon: <Dumbbell size={18} />, path: "/admin/gyms" },
        { label: "Classes", icon: <Calendar size={18} />, path: "/admin/classes" },
        { label: "Bookings", icon: <BookOpen size={18} />, path: "/admin/bookings" },
        { label: "Subscriptions", icon: <CreditCard size={18} />, path: "/admin/subscriptions" },
        { label: "Partners", icon: <HeartHandshake size={18} />, path: "/admin/partners" },
        { label: "Support", icon: <MessageSquare size={18} />, path: "/admin/support" },
        { label: "Reviews", icon: <Star size={18} />, path: "/admin/reviews" },
        { label: "Analytics", icon: <BarChart3 size={18} />, path: "/admin/analytics" },
      ];
    }
    
    // Partner menu items
    if (user_role === "partner") {
      return [
        { label: "Dashboard", icon: <Home size={18} />, path: "/admin/partner" },
        { label: "My Gyms", icon: <Dumbbell size={18} />, path: "/admin/partner/gyms" },
        { label: "Classes", icon: <Calendar size={18} />, path: "/admin/partner/classes" },
        { label: "Bookings", icon: <BookOpen size={18} />, path: "/admin/partner/bookings" },
        { label: "Reviews", icon: <Star size={18} />, path: "/admin/partner/reviews" },
        { label: "Analytics", icon: <BarChart3 size={18} />, path: "/admin/partner/analytics" },
      ];
    }
    
    // Support menu items
    if (user_role === "support") {
      return [
        { label: "Dashboard", icon: <Home size={18} />, path: "/admin/support-portal" },
        { label: "Tickets", icon: <MessageSquare size={18} />, path: "/admin/support-portal/tickets" },
        { label: "Users", icon: <Users size={18} />, path: "/admin/support-portal/users" },
        { label: "Chats", icon: <MessageSquare size={18} />, path: "/admin/support-portal/chats" },
      ];
    }
    
    return [];
  };

  return (
    <ProtectedRoute roles={["admin", "partner", "support"]}>
      <div className="min-h-screen bg-gray-50">
        {/* Top Navigation Bar */}
        <nav className="bg-white border-b border-gray-200 fixed w-full z-30">
          <div className="px-3 py-3 lg:px-5 lg:pl-3 flex justify-between items-center">
            <div className="flex items-center">
              <button
                onClick={() => set_sidebar_open(!sidebar_open)}
                aria-expanded={sidebar_open}
                className="p-2 rounded-md lg:hidden focus:outline-none"
              >
                <Menu className="text-gray-600" />
              </button>
              <div className="flex items-center ml-3 lg:ml-0">
                <span className="text-xl font-semibold text-gray-800">Fitness Admin</span>
                {!sidebar_open && (
                  <button
                    onClick={() => set_sidebar_open(true)}
                    className="p-2 ml-3 focus:outline-none lg:hidden"
                  >
                    <Menu className="text-gray-600" />
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex items-center">
              <span className="mr-2 text-sm text-gray-600">
                {user?.name} ({user_role})
              </span>
              <Button variant="ghost" size="icon" onClick={handle_logout}>
                <LogOut size={18} />
              </Button>
            </div>
          </div>
        </nav>

        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 z-20 w-64 h-full pt-16 bg-white border-r border-gray-200 transition-transform ${
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
        </aside>

        {/* Main Content */}
        <div className={`${sidebar_open ? "lg:ml-64" : ""} p-4 pt-20 min-h-screen`}>
          <Outlet />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdminLayout;
