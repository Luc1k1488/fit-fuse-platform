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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { Booking, Gym, GymClass } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { 
  Search, 
  MoreVertical, 
  Calendar, 
  MapPin, 
  User, 
  Filter,
  Clock
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";

interface BookingWithDetails extends Booking {
  gym?: Gym;
  class?: GymClass;
  user?: {
    id: string;
    name: string | null;
    email: string | null;
  };
}

const AdminBookings = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  
  const fetchBookings = async () => {
    let query = supabase
      .from("bookings")
      .select(`
        *,
        gym:gym_id (
          id,
          name,
          location,
          city
        ),
        class:class_id (
          id,
          title,
          instructor,
          start_time,
          end_time
        ),
        user:user_id (
          id,
          name,
          email
        )
      `)
      .order("date_time", { ascending: false });

    if (statusFilter) {
      query = query.eq("status", statusFilter);
    }

    if (searchQuery) {
      query = query.or(`id.ilike.%${searchQuery}%,user_id.ilike.%${searchQuery}%`);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return data as unknown as BookingWithDetails[];
  };

  const { 
    data: bookings, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ["bookings", searchQuery, statusFilter],
    queryFn: fetchBookings,
  });

  const bookingStatuses = ["booked", "completed", "cancelled"];

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    refetch();
  };

  const handleStatusFilter = (status: string | null) => {
    setStatusFilter(status);
    refetch();
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Не указано";
    try {
      return format(parseISO(dateString), "d MMM yyyy, HH:mm", { locale: ru });
    } catch (error) {
      return "Некорректная дата";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Управление бронированиями</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Список бронирований</CardTitle>
          <CardDescription>Управление бронированиями пользователей</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-2 top-3 h-4 w-4 text-gray-500" />
                <Input 
                  placeholder="Поиск по ID брони или ID пользователя..." 
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
                    {statusFilter ? `Статус: ${statusFilter}` : "Все статусы"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleStatusFilter(null)}>
                    Все статусы
                  </DropdownMenuItem>
                  {bookingStatuses.map((status) => (
                    <DropdownMenuItem 
                      key={status} 
                      onClick={() => handleStatusFilter(status)}
                    >
                      {status}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Пользователь</TableHead>
                  <TableHead>Зал/Занятие</TableHead>
                  <TableHead>Дата и время</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings && bookings.length > 0 ? (
                  bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        {booking.user ? (
                          <div className="flex items-center gap-2">
                            <User size={16} className="text-gray-500" />
                            <div>
                              <p className="font-medium">{booking.user.name || "Не указано"}</p>
                              <p className="text-xs text-gray-500">{booking.user.email || "Не указано"}</p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-500">Пользователь не найден</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div>
                          {booking.gym ? (
                            <div className="flex items-center gap-2">
                              <MapPin size={16} className="text-gray-500" />
                              <p className="font-medium">{booking.gym.name}</p>
                            </div>
                          ) : booking.class ? (
                            <div className="flex flex-col">
                              <p className="font-medium">{booking.class.title}</p>
                              <p className="text-xs text-gray-500">
                                {booking.class.instructor}
                              </p>
                            </div>
                          ) : (
                            <span className="text-gray-500">Информация отсутствует</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar size={14} className="text-gray-500" />
                          <span>{formatDate(booking.date_time)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {booking.status === "booked" ? (
                          <Badge className="bg-green-100 text-green-800">
                            Забронировано
                          </Badge>
                        ) : booking.status === "completed" ? (
                          <Badge className="bg-blue-100 text-blue-800">
                            Завершено
                          </Badge>
                        ) : booking.status === "cancelled" ? (
                          <Badge className="bg-red-100 text-red-800">
                            Отменено
                          </Badge>
                        ) : (
                          <Badge>{booking.status}</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Просмотр деталей</DropdownMenuItem>
                            <DropdownMenuItem>Редактировать</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-500">
                              Отменить бронирование
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10">
                      Бронирования не найдены
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBookings;
