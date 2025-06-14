
import { Users } from "lucide-react";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AdminUsersHeader = () => {
  return (
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Users className="h-5 w-5" />
        Управление пользователями
      </CardTitle>
      <CardDescription>
        Управляйте ролями и статусом пользователей
      </CardDescription>
    </CardHeader>
  );
};

export default AdminUsersHeader;
