
import { useState, useEffect } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Search, MoreVertical, UserPlus, Filter, RefreshCw } from "lucide-react";

const AdminUsers = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);

  const fetchUsers = async () => {
    let query = supabase.from("users").select("*");
    
    if (roleFilter) {
      query = query.eq("role", roleFilter);
    }
    
    if (searchQuery) {
      query = query.or(`name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`);
    }
    
    const { data, error } = await query.order("created_at", { ascending: false });
    
    if (error) {
      throw new Error(error.message);
    }
    
    return data as User[];
  };

  const { 
    data: users, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ["users", searchQuery, roleFilter],
    queryFn: fetchUsers,
  });

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    refetch();
  };

  const handleRoleFilter = (role: string | null) => {
    setRoleFilter(role);
    refetch();
  };

  const handleRefresh = () => {
    refetch();
    toast({
      title: "Обновлено",
      description: "Список пользователей обновлен",
    });
  };

  // Расчет статистики пользователей
  const userStats = {
    total: users?.length || 0,
    admin: users?.filter(user => user.role === "admin").length || 0,
    partner: users?.filter(user => user.role === "partner").length || 0,
    support: users?.filter(user => user.role === "support").length || 0,
    regularUsers: users?.filter(user => user.role === "user").length || 0,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Управление пользователями</h1>
        <Button className="gap-2">
          <UserPlus size={16} />
          Добавить пользователя
        </Button>
      </div>

      {/* Статистика пользователей */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Всего пользователей</p>
              <p className="text-3xl font-bold">{userStats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Администраторы</p>
              <p className="text-3xl font-bold">{userStats.admin}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Партнеры</p>
              <p className="text-3xl font-bold">{userStats.partner}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Поддержка</p>
              <p className="text-3xl font-bold">{userStats.support}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Клиенты</p>
              <p className="text-3xl font-bold">{userStats.regularUsers}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Фильтры и поиск */}
      <Card>
        <CardHeader>
          <CardTitle>Список пользователей</CardTitle>
          <CardDescription>Управление пользователями платформы</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-2 top-3 h-4 w-4 text-gray-500" />
                <Input 
                  placeholder="Поиск по имени или email..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </form>
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-1">
                    <Filter size={16} />
                    {roleFilter ? `Роль: ${roleFilter}` : "Все роли"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleRoleFilter(null)}>
                    Все роли
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleRoleFilter("user")}>
                    Клиенты
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleRoleFilter("admin")}>
                    Администраторы
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleRoleFilter("partner")}>
                    Партнеры
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleRoleFilter("support")}>
                    Поддержка
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button onClick={handleRefresh} variant="ghost" size="icon">
                <RefreshCw size={16} />
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-10">
              <p>Загрузка пользователей...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-10">
              <p className="text-red-500">Ошибка загрузки данных</p>
              <p className="text-sm text-gray-500">{(error as Error).message}</p>
              <Button onClick={() => refetch()} className="mt-2">
                Попробовать снова
              </Button>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Пользователь</TableHead>
                    <TableHead>Контакты</TableHead>
                    <TableHead>Роль</TableHead>
                    <TableHead>Дата регистрации</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users && users.length > 0 ? (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-mono text-xs w-[80px] truncate">
                          {user.id.substring(0, 8)}...
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                              {user.profile_image ? (
                                <img 
                                  src={user.profile_image} 
                                  alt={user.name} 
                                  className="h-8 w-8 rounded-full object-cover"
                                />
                              ) : (
                                <span className="text-sm font-medium">
                                  {user.name ? user.name[0].toUpperCase() : "U"}
                                </span>
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{user.name || "Без имени"}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">{user.email || "Нет email"}</p>
                            <p className="text-xs text-gray-500">{user.phone || "Нет телефона"}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            user.role === "admin" ? "default" : 
                            user.role === "partner" ? "secondary" :
                            user.role === "support" ? "outline" : 
                            "secondary"
                          }>
                            {user.role === "admin" ? "Администратор" : 
                             user.role === "partner" ? "Партнер" :
                             user.role === "support" ? "Поддержка" : 
                             "Пользователь"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(user.created_at).toLocaleDateString("ru-RU")}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Просмотр профиля</DropdownMenuItem>
                              <DropdownMenuItem>Редактировать</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-500">
                                Удалить пользователя
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10">
                        Пользователей не найдено
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;
