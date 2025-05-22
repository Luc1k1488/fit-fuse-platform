
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
import { Class, Gym } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { 
  Search, 
  MoreVertical, 
  CalendarPlus, 
  CalendarClock, 
  Users, 
  Filter, 
  Dumbbell,
  Clock
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";

const AdminClasses = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  
  // Загрузка тренировок с информацией о залах
  const fetchClassesWithGyms = async () => {
    let query = supabase
      .from("classes")
      .select(`
        *,
        gyms:gym_id (
          id,
          name,
          location,
          city,
          main_image
        )
      `);
    
    if (categoryFilter) {
      query = query.eq("category", categoryFilter);
    }
    
    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,instructor.ilike.%${searchQuery}%`);
    }
    
    const { data, error } = await query.order("start_time", { ascending: true });
    
    if (error) {
      throw new Error(error.message);
    }
    
    return data as (Class & { gyms: Gym })[];
  };

  const { 
    data: classes, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ["classes", searchQuery, categoryFilter],
    queryFn: fetchClassesWithGyms,
  });

  const categories = ["Йога", "Силовая", "Кардио", "Танцы", "Бокс", "Пилатес", "Растяжка"];

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    refetch();
  };

  const handleCategoryFilter = (category: string | null) => {
    setCategoryFilter(category);
    refetch();
  };
  
  // Форматирование даты и времени
  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "Не указано";
    try {
      return format(parseISO(dateString), "d MMM yyyy, HH:mm", { locale: ru });
    } catch (error) {
      return "Некорректная дата";
    }
  };
  
  // Расчет продолжительности занятия
  const calculateDuration = (start: string | null, end: string | null) => {
    if (!start || !end) return "Н/Д";
    
    try {
      const startDate = parseISO(start);
      const endDate = parseISO(end);
      const diffMinutes = Math.round((endDate.getTime() - startDate.getTime()) / 60000);
      
      return `${diffMinutes} мин`;
    } catch (error) {
      return "Н/Д";
    }
  };

  // Расчет заполненности группы в процентах
  const calculateOccupancy = (booked: number | null, capacity: number | null) => {
    if (booked === null || capacity === null || capacity === 0) return 0;
    return Math.round((booked / capacity) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Управление тренировками</h1>
        <Button className="gap-2">
          <CalendarPlus size={16} />
          Добавить тренировку
        </Button>
      </div>

      {/* Фильтры и поиск */}
      <Card>
        <CardHeader>
          <CardTitle>Список тренировок</CardTitle>
          <CardDescription>Управление расписанием тренировок на платформе</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-2 top-3 h-4 w-4 text-gray-500" />
                <Input 
                  placeholder="Поиск по названию, описанию или тренеру..." 
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
                    {categoryFilter ? `Тип: ${categoryFilter}` : "Все типы"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleCategoryFilter(null)}>
                    Все типы
                  </DropdownMenuItem>
                  {categories.map((category) => (
                    <DropdownMenuItem 
                      key={category} 
                      onClick={() => handleCategoryFilter(category)}
                    >
                      {category}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-10">
              <p>Загрузка тренировок...</p>
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
                    <TableHead>Тренировка</TableHead>
                    <TableHead>Расписание</TableHead>
                    <TableHead>Зал</TableHead>
                    <TableHead>Тренер</TableHead>
                    <TableHead>Занятость</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classes && classes.length > 0 ? (
                    classes.map((classItem) => (
                      <TableRow key={classItem.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{classItem.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline">{classItem.category}</Badge>
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Clock size={12} />
                                {calculateDuration(classItem.start_time, classItem.end_time)}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <CalendarClock size={14} className="text-gray-500" />
                            <span>{formatDateTime(classItem.start_time)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {classItem.gyms ? (
                            <div className="flex items-center gap-2">
                              {classItem.gyms.main_image && (
                                <div className="h-8 w-8 rounded overflow-hidden flex-shrink-0">
                                  <img 
                                    src={classItem.gyms.main_image} 
                                    alt={classItem.gyms.name || ""} 
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                              )}
                              <div>
                                <p className="font-medium">{classItem.gyms.name}</p>
                                <p className="text-xs text-gray-500">
                                  {classItem.gyms.city}, {classItem.gyms.location}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-500">Зал не указан</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                              <Dumbbell size={14} className="text-gray-600" />
                            </div>
                            <span>{classItem.instructor || "Не указан"}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1">
                              <Users size={14} className="text-gray-500" />
                              <span>
                                {classItem.booked_count || 0} / {classItem.capacity || 0}
                              </span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-1.5">
                              <div 
                                className={`h-1.5 rounded-full ${
                                  calculateOccupancy(classItem.booked_count, classItem.capacity) > 80
                                    ? "bg-red-500"
                                    : calculateOccupancy(classItem.booked_count, classItem.capacity) > 50
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                                }`}
                                style={{
                                  width: `${calculateOccupancy(classItem.booked_count, classItem.capacity)}%`,
                                }}
                              ></div>
                            </div>
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
                              <DropdownMenuItem>Просмотр деталей</DropdownMenuItem>
                              <DropdownMenuItem>Редактировать</DropdownMenuItem>
                              <DropdownMenuItem>Список записей</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-500">
                                Отменить тренировку
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10">
                        Тренировок не найдено
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

export default AdminClasses;
