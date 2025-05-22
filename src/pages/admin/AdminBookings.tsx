
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Booking, User, Gym, Class } from "@/types";
import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";
import { CheckCircle2, Clock, AlertCircle, XCircle, Search, Filter, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";

// Extended type for bookings with user, gym and class details
interface BookingWithDetails extends Booking {
  user: User;
  gym: Gym;
  class: Class;
}

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case "confirmed":
      return (
        <div className="flex items-center">
          <CheckCircle2 className="mr-1 h-4 w-4 text-green-500" />
          <span className="text-green-500">Подтверждено</span>
        </div>
      );
    case "pending":
      return (
        <div className="flex items-center">
          <Clock className="mr-1 h-4 w-4 text-yellow-500" />
          <span className="text-yellow-500">Ожидание</span>
        </div>
      );
    case "cancelled":
      return (
        <div className="flex items-center">
          <XCircle className="mr-1 h-4 w-4 text-red-500" />
          <span className="text-red-500">Отменено</span>
        </div>
      );
    default:
      return (
        <div className="flex items-center">
          <AlertCircle className="mr-1 h-4 w-4 text-gray-500" />
          <span className="text-gray-500">{status}</span>
        </div>
      );
  }
};

const AdminBookings = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState<BookingWithDetails | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<"pending" | "confirmed" | "cancelled">("confirmed");
  const itemsPerPage = 10;
  const { toast } = useToast();

  // Fetch bookings with related data
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const { data: bookingsData, error: bookingsError } = await supabase
        .from("bookings")
        .select(`
          *,
          user:user_id (*),
          gym:gym_id (*),
          class:class_id (*)
        `)
        .order('date_time', { ascending: false });

      if (bookingsError) {
        throw bookingsError;
      }

      return bookingsData as BookingWithDetails[];
    },
  });

  // Filter bookings based on search and status
  const filteredBookings = data?.filter((booking) => {
    const searchMatch = !search ? true :
      (booking.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
       booking.gym?.name?.toLowerCase().includes(search.toLowerCase()) ||
       booking.class?.title?.toLowerCase().includes(search.toLowerCase()));
    
    const statusMatch = !statusFilter ? true : booking.status === statusFilter;
    
    return searchMatch && statusMatch;
  });

  // Paginate bookings
  const paginatedBookings = filteredBookings?.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const totalPages = Math.ceil((filteredBookings?.length || 0) / itemsPerPage);

  // Handle status change
  const handleStatusChange = async () => {
    if (!selectedBooking || !newStatus) return;

    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status: newStatus })
        .eq("id", selectedBooking.id);

      if (error) throw error;

      toast({
        title: "Статус обновлен",
        description: `Бронирование успешно обновлено до статуса "${newStatus}"`,
      });

      refetch();
      setIsStatusDialogOpen(false);
    } catch (error) {
      console.error("Error updating booking status:", error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось обновить статус бронирования",
      });
    }
  };

  // Handle booking deletion
  const handleDeleteBooking = async () => {
    if (!selectedBooking) return;

    try {
      const { error } = await supabase
        .from("bookings")
        .delete()
        .eq("id", selectedBooking.id);

      if (error) throw error;

      toast({
        title: "Бронирование удалено",
        description: "Бронирование успешно удалено из системы",
      });

      refetch();
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось удалить бронирование",
      });
    }
  };

  // Format date 
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Нет даты";
    try {
      return format(parseISO(dateString), "d MMMM yyyy, HH:mm", { locale: ru });
    } catch {
      return dateString;
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Управление бронированиями</h1>
      
      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400">Всего бронирований</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.length || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400">Активные</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {data?.filter(b => b.status === "confirmed").length || 0}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400">Ожидающие</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">
              {data?.filter(b => b.status === "pending").length || 0}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400">Отмененные</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {data?.filter(b => b.status === "cancelled").length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            placeholder="Поиск по имени, залу, тренировке..." 
            value={search} 
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-4">
          <Select value={statusFilter || "all"} onValueChange={(value) => {
            setStatusFilter(value === "all" ? null : value);
            setPage(1);
          }}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Фильтр по статусу" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все статусы</SelectItem>
              <SelectItem value="pending">Ожидающие</SelectItem>
              <SelectItem value="confirmed">Подтвержденные</SelectItem>
              <SelectItem value="cancelled">Отмененные</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon" onClick={() => refetch()}>
            <RefreshCw size={18} />
          </Button>
        </div>
      </div>

      {/* Bookings Table */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="text-center p-8 bg-red-900/20 text-red-400 rounded-lg">
          <p>Ошибка при загрузке данных. Пожалуйста, попробуйте позже.</p>
        </div>
      ) : paginatedBookings?.length === 0 ? (
        <div className="text-center p-8 bg-gray-800 rounded-lg">
          <p className="text-gray-400">Бронирования не найдены</p>
        </div>
      ) : (
        <>
          <div className="rounded-md border border-gray-700 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Клиент</TableHead>
                  <TableHead>Зал / Тренировка</TableHead>
                  <TableHead>Дата и время</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedBookings?.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <div className="font-medium">{booking.user?.name || 'Неизвестный пользователь'}</div>
                      <div className="text-sm text-gray-400">{booking.user?.email}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{booking.gym?.name || 'Неизвестный зал'}</div>
                      <div className="text-sm text-gray-400">{booking.class?.title || 'Неизвестная тренировка'}</div>
                    </TableCell>
                    <TableCell>{formatDate(booking.date_time)}</TableCell>
                    <TableCell>
                      <StatusBadge status={booking.status || ""} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedBooking(booking);
                            setNewStatus(booking.status as "pending" | "confirmed" | "cancelled" || "pending");
                            setIsStatusDialogOpen(true);
                          }}
                        >
                          Статус
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setSelectedBooking(booking);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          Удалить
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setPage(p => Math.max(p - 1, 1))}
                      className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                    // Calculate page number for pagination display
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }
                    
                    // Only render if pageNum is valid
                    if (pageNum > 0 && pageNum <= totalPages) {
                      return (
                        <PaginationItem key={i}>
                          <PaginationLink
                            onClick={() => setPage(pageNum)}
                            isActive={page === pageNum}
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                    return null;
                  })}
                  
                  {totalPages > 5 && page < totalPages - 2 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                      className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}

      {/* Status Update Dialog */}
      <AlertDialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Изменить статус бронирования</AlertDialogTitle>
            <AlertDialogDescription>
              Выберите новый статус для бронирования {selectedBooking?.class?.title} 
              от {selectedBooking?.user?.name}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4">
            <Select value={newStatus} onValueChange={(value: "pending" | "confirmed" | "cancelled") => setNewStatus(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Ожидание</SelectItem>
                <SelectItem value="confirmed">Подтверждено</SelectItem>
                <SelectItem value="cancelled">Отменено</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleStatusChange}>Сохранить</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить бронирование</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить это бронирование? Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteBooking} className="bg-red-500 hover:bg-red-600">
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminBookings;
