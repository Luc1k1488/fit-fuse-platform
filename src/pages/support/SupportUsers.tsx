
import { useState } from "react";
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
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  NavigationMenu, 
  NavigationMenuItem, 
  NavigationMenuLink, 
  NavigationMenuList, 
  navigationMenuTriggerStyle 
} from "@/components/ui/navigation-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { User, SupportTicket } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Search, MoreVertical, MessageSquare, Calendar, AlertTriangle } from "lucide-react";
import { format, parseISO, isAfter, subDays } from "date-fns";
import { ru } from "date-fns/locale";

// Extended type for support tickets from Supabase
interface SupabaseSupportTicket {
  id: string;
  user_id: string | null;
  created_at: string | null;
  status: string | null;  // This comes as string from Supabase
  subject: string | null;
  message: string | null;
  assigned_support_id: string | null;
  resolved_at: string | null;
}

// Extended type for user with tickets
interface UserWithTickets extends User {
  tickets: SupportTicket[];
  ticketCount: number;
  openTickets: number;
  recentActivity: boolean;
}

const SupportUsers = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Загрузка пользователей с их обращениями в поддержку
  const fetchUsersWithTickets = async () => {
    // Запрос пользователей
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (usersError) throw new Error(usersError.message);
    
    // Запрос обращений в поддержку
    const { data: ticketsData, error: ticketsError } = await supabase
      .from("support_tickets")
      .select("*");
    
    if (ticketsError) throw new Error(ticketsError.message);
    
    // Convert raw Supabase ticket data to SupportTicket type
    const tickets = (ticketsData as SupabaseSupportTicket[]).map(ticket => {
      // Ensure the status is one of the allowed values
      const validStatus: SupportTicket['status'] = 
        ticket.status === "open" ? "open" : 
        ticket.status === "in_progress" ? "in_progress" : 
        ticket.status === "resolved" ? "resolved" : 
        ticket.status === "closed" ? "closed" : "open";  // Default to "open" if invalid
        
      return {
        ...ticket,
        status: validStatus
      } as SupportTicket;
    });
    
    // Группировка обращений по ID пользователя
    const ticketsByUser = tickets.reduce((acc: Record<string, SupportTicket[]>, ticket) => {
      if (ticket.user_id) {
        if (!acc[ticket.user_id]) {
          acc[ticket.user_id] = [];
        }
        acc[ticket.user_id].push(ticket);
      }
      return acc;
    }, {});
    
    // Объединение данных о пользователях и их обращениях
    const usersWithTicketsData = users.map((user) => ({
      ...user,
      tickets: ticketsByUser[user.id] || [],
      ticketCount: ticketsByUser[user.id]?.length || 0,
      openTickets: ticketsByUser[user.id]?.filter(t => t.status === "open" || t.status === "in_progress").length || 0,
      recentActivity: ticketsByUser[user.id]?.some(t => 
        t.created_at && isAfter(parseISO(t.created_at), subDays(new Date(), 7))
      ) || false
    }));
    
    // Фильтрация по поисковому запросу
    if (searchQuery) {
      return usersWithTicketsData.filter(user => 
        (user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase())) || 
        (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (user.phone && user.phone.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    return usersWithTicketsData;
  };

  const { 
    data: usersData, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ["supportUsers", searchQuery],
    queryFn: fetchUsersWithTickets,
  });

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    refetch();
  };

  // Форматирование даты
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Н/Д";
    try {
      return format(parseISO(dateString), "d MMM yyyy", { locale: ru });
    } catch (error) {
      return "Некорректная дата";
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Пользователи</h1>
        <p className="text-gray-500 mt-1">Управление пользователями в службе поддержки</p>
      </div>

      {/* Навигация */}
      <NavigationMenu className="mb-6">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink className={navigationMenuTriggerStyle() + " bg-primary text-primary-foreground"}>
              Все пользователи
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Активные обращения
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Недавняя активность
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {/* Основной контент */}
      <Tabs defaultValue="all" className="space-y-6">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all">Все пользователи</TabsTrigger>
            <TabsTrigger value="with-tickets">С обращениями</TabsTrigger>
            <TabsTrigger value="new">Новые</TabsTrigger>
          </TabsList>
          
          <form onSubmit={handleSearch} className="relative max-w-xs">
            <Search className="absolute left-2 top-3 h-4 w-4 text-gray-500" />
            <Input 
              placeholder="Поиск пользователей..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </form>
        </div>
        
        <TabsContent value="all" className="mt-0">
          <Card>
            <CardContent className="p-0">
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Пользователь</TableHead>
                      <TableHead>Контактные данные</TableHead>
                      <TableHead>Обращения</TableHead>
                      <TableHead>Активность</TableHead>
                      <TableHead>Регистрация</TableHead>
                      <TableHead className="text-right">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usersData && usersData.length > 0 ? (
                      usersData.map((user: UserWithTickets) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center">
                                {user.profile_image ? (
                                  <img 
                                    src={user.profile_image} 
                                    alt={user.name || ""}
                                    className="h-full w-full object-cover rounded-full"
                                  />
                                ) : (
                                  <span className="text-sm font-medium">
                                    {user.name ? user.name[0].toUpperCase() : "U"}
                                  </span>
                                )}
                              </div>
                              <div>
                                <p className="font-medium">{user.name || "Без имени"}</p>
                                <p className="text-xs text-gray-500">ID: {user.id.substring(0, 8)}...</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              {user.email && <p className="text-sm">{user.email}</p>}
                              {user.phone && <p className="text-xs text-gray-500">{user.phone}</p>}
                              {!user.email && !user.phone && <p className="text-sm text-gray-500">Нет контактов</p>}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <div className="flex items-center gap-1">
                                <MessageSquare size={14} className="text-gray-500" />
                                <span>Всего: {user.ticketCount}</span>
                              </div>
                              {user.openTickets > 0 && (
                                <div className="flex items-center gap-1 text-amber-500">
                                  <AlertTriangle size={14} />
                                  <span>Открыто: {user.openTickets}</span>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {user.recentActivity ? (
                              <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                                Активен
                              </span>
                            ) : (
                              <span className="text-gray-500 text-sm">Нет активности</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Calendar size={14} className="text-gray-500" />
                              <span>{formatDate(user.created_at)}</span>
                            </div>
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
                                <DropdownMenuItem>История обращений</DropdownMenuItem>
                                <DropdownMenuItem>Создать обращение</DropdownMenuItem>
                                <DropdownMenuItem>Отправить сообщение</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-10">
                          {searchQuery ? "Пользователи не найдены" : "Нет данных о пользователях"}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="with-tickets" className="mt-0">
          <Card>
            <CardContent className="p-6 min-h-[300px] flex items-center justify-center text-center">
              <div>
                <p>Показывать пользователей с активными обращениями</p>
                <Button className="mt-2">Загрузить</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="new" className="mt-0">
          <Card>
            <CardContent className="p-6 min-h-[300px] flex items-center justify-center text-center">
              <div>
                <p>Показывать новых пользователей (зарегистрированных за последние 7 дней)</p>
                <Button className="mt-2">Загрузить</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SupportUsers;
