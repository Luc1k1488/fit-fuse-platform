
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth_context";
import { ClassSearchForm } from "@/components/client/classes/ClassSearchForm";
import { DaySelector } from "@/components/client/classes/DaySelector";
import { ClassTypeTabs } from "@/components/client/classes/ClassTypeTabs";
import { BookingDialog } from "@/components/bookings/BookingDialog";
import { useToast } from "@/hooks/use-toast";
import { Class, Gym } from "@/types";
import { format, addDays, startOfDay } from "date-fns";
import { ru } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, MapPin, User, Star } from "lucide-react";

const class_types = ["Все", "Фитнес", "Йога", "КроссФит", "Пилатес", "Бокс"];

// Extended type for classes with gym details
interface ClassWithGym extends Class {
  gym?: Gym;
}

const ClientClasses = () => {
  const { user, is_authenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("Все");
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [favoriteClasses, setFavoriteClasses] = useState<string[]>([]);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassWithGym | null>(null);

  // Получаем дату для выбранного дня
  const getDateForDay = (dayIndex: number) => {
    const today = startOfDay(new Date());
    const currentDay = today.getDay();
    const daysUntilTarget = (dayIndex - currentDay + 7) % 7;
    return addDays(today, daysUntilTarget);
  };

  // Получаем занятия из базы данных
  const { data: classes, isLoading, error } = useQuery({
    queryKey: ["classes", searchQuery, selectedType, selectedDay],
    queryFn: async () => {
      console.log("Fetching classes with filters:", { searchQuery, selectedType, selectedDay });
      
      let query = supabase
        .from("classes")
        .select(`
          *,
          gym:gym_id (*)
        `)
        .order("start_time", { ascending: true });

      // Фильтр по категории
      if (selectedType !== "Все") {
        query = query.eq("category", selectedType);
      }

      // Фильтр по поиску
      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,instructor.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching classes:", error);
        throw error;
      }

      console.log("Classes loaded:", data);
      return (data as ClassWithGym[]) || [];
    },
  });

  // Мутация для создания бронирования
  const createBookingMutation = useMutation({
    mutationFn: async (bookingData: {
      classId: string;
      gymId: string;
      date: Date;
    }) => {
      if (!user?.id) {
        throw new Error("Необходимо войти в систему");
      }

      const { error } = await supabase
        .from("bookings")
        .insert({
          user_id: user.id,
          class_id: bookingData.classId,
          gym_id: bookingData.gymId,
          date_time: bookingData.date.toISOString(),
          status: "confirmed"
        });

      if (error) {
        console.error("Booking creation error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Бронирование создано",
        description: "Ваше занятие успешно забронировано",
      });
      setBookingDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["user-bookings"] });
    },
    onError: (error) => {
      console.error("Error creating booking:", error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось создать бронирование",
      });
    },
  });

  const toggleFavorite = (classId: string) => {
    setFavoriteClasses(prev => 
      prev.includes(classId) 
        ? prev.filter(id => id !== classId) 
        : [...prev, classId]
    );
  };

  // Функция поиска
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Поиск выполняется автоматически через React Query
  };

  // Функция для сброса фильтров
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedType("Все");
  };

  const handleBookClass = (classItem: ClassWithGym) => {
    if (!is_authenticated) {
      toast({
        variant: "destructive",
        title: "Необходимо войти в систему",
        description: "Для бронирования занятий необходимо войти в систему",
      });
      return;
    }
    setSelectedClass(classItem);
    setBookingDialogOpen(true);
  };

  const handleBookingSubmit = (data: any) => {
    if (!selectedClass || !selectedClass.gym) return;

    const selectedDate = getDateForDay(selectedDay);
    
    createBookingMutation.mutate({
      classId: selectedClass.id,
      gymId: selectedClass.gym.id,
      date: selectedDate,
    });
  };

  if (isLoading) {
    return (
      <div className="pb-16">
        <h1 className="text-2xl font-bold mb-4">Найти и забронировать тренировки</h1>
        <div className="text-center py-12">
          <p className="text-gray-400">Загрузка занятий...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pb-16">
        <h1 className="text-2xl font-bold mb-4">Найти и забронировать тренировки</h1>
        <div className="text-center py-12 bg-red-900/20 text-red-400 rounded-lg">
          <p>Ошибка при загрузке занятий</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-16">
      <h1 className="text-2xl font-bold mb-4 animate-fade-in">Найти и забронировать тренировки</h1>
      
      {/* Панель поиска и фильтров */}
      <div className="bg-gray-900 p-4 rounded-xl shadow-lg border border-gray-800 mb-6 animate-fade-in animation-delay-200">
        <ClassSearchForm 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
        />
        
        <DaySelector 
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
        />
        
        <ClassTypeTabs 
          classTypes={class_types}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
        />
      </div>
      
      {/* Список занятий */}
      {classes && classes.length > 0 ? (
        <div className="space-y-4">
          <div className="text-sm text-gray-400 mb-4">
            Найдено занятий: {classes.length}
          </div>
          <div className="grid grid-cols-1 gap-4">
            {classes.map((classItem, idx) => (
              <Card key={classItem.id} className="overflow-hidden bg-gray-900 border-gray-800 animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{classItem.title}</h3>
                      <div className="flex items-center text-sm text-gray-400 mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {classItem.gym?.name}, {classItem.gym?.location}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFavorite(classItem.id)}
                      className={`${favoriteClasses.includes(classItem.id) ? 'text-red-500' : 'text-gray-400'} hover:text-red-500`}
                    >
                      <Star className={`h-4 w-4 ${favoriteClasses.includes(classItem.id) ? 'fill-current' : ''}`} />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center text-sm text-gray-400">
                      <User className="h-4 w-4 mr-1" />
                      {classItem.instructor || "Инструктор не указан"}
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <Clock className="h-4 w-4 mr-1" />
                      {classItem.start_time ? 
                        format(new Date(classItem.start_time), "HH:mm", { locale: ru }) + " - " +
                        format(new Date(classItem.end_time || classItem.start_time), "HH:mm", { locale: ru })
                        : "Время не указано"
                      }
                    </div>
                  </div>

                  {classItem.description && (
                    <p className="text-sm text-gray-400 mb-4">{classItem.description}</p>
                  )}

                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-400">
                      Свободно мест: {(classItem.capacity || 0) - (classItem.booked_count || 0)}
                    </div>
                    <Button 
                      onClick={() => handleBookClass(classItem)}
                      disabled={createBookingMutation.isPending || !classItem.gym}
                      className="bg-primary hover:bg-primary/90"
                    >
                      {createBookingMutation.isPending ? "Бронирование..." : "Забронировать"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-900 rounded-xl border border-gray-800">
          <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-400 mb-4">Занятия не найдены по вашим критериям.</p>
          <p className="text-sm text-gray-500 mb-6">Попробуйте изменить фильтры поиска.</p>
          <Button onClick={resetFilters}>
            Сбросить фильтры
          </Button>
        </div>
      )}

      <BookingDialog
        open={bookingDialogOpen}
        onOpenChange={setBookingDialogOpen}
        date={getDateForDay(selectedDay)}
        onSubmit={handleBookingSubmit}
      />
    </div>
  );
};

export default ClientClasses;
