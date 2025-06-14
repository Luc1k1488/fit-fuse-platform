
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth_context";
import { LogOut } from "lucide-react";
import AdminUserInfo from "./AdminUserInfo";
import NotificationCenter from "../notifications/NotificationCenter";

const AdminNavbar = () => {
  const { signOut } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-semibold text-gray-900">Панель администратора</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <NotificationCenter />
        <AdminUserInfo />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => signOut()}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Выйти
        </Button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
