import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth_context";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DarkCard } from "@/components/ui/dark-card";
import { BookingDialog } from "@/components/bookings/BookingDialog";
import { MapPin, Star, Clock, Calendar, Check, Heart, Share, ChevronLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ClientGymDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user, is_authenticated } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("info");
  const [isFavorite, setIsFavorite] = useState(false);
  const [showShareTooltip, setShowShareTooltip] = useState(false);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const { toast } = useToast();
  
  // Данные по залу (в реальном приложении будут загружаться по ID)
  const gymData = {
    id: id,
    name: id === "gym-1" ? "Фитнес Элит" : id === "gym-2" ? "Пауэр Хаус" : id === "crossfit-1" ? "CrossFit Arena" : "Спортзал",
    location: "Центр",
    city: "Москва",
    address: "ул. Тверская, 18, Москва",
    phone: "+7 (999) 123-45-67",
    description: "Современный фитнес-центр с новейшим оборудованием и широким спектром групповых программ. Профессиональные тренеры помогут достичь ваших целей.",
    workingHours: "Пн-Пт: 6:00 - 23:00, Сб-Вс: 8:00 - 22:00",
    mainImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Z3ltfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
    galleryImages: [
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Z3ltfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
      "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGd5bXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    ],
    rating: 4.9,
    reviewCount: 120,
    features: ["Бассейн", "Сауна", "Парковка", "Групповые тренировки", "Персональный тренер", "Детская комната"],
    classes: [
      { id: "class1", name: "Силовая тренировка", time: "Пн, Ср, Пт: 10:00 - 11:00", trainer: "Алексей И." },
      { id: "class2", name: "Йога", time: "Вт, Чт: 18:00 - 19:30", trainer: "Елена С." },
      { id: "class3", name: "Кроссфит", time: "Пн, Пт: 19:00 - 20:00", trainer: "Дмитрий К." },
    ],
  };

  // Мутация для создания бронирования
  const createBookingMutation = useMutation({
    mutationFn: async (bookingData: {
      date: Date;
      gymId: string;
    }) => {
      if (!user?.id) {
        throw new Error("Необходимо войти в систему");
      }

      // Создаем UUID для gym_id, так как в базе ожидается UUID, а не строка
      const gymUuid = crypto.randomUUID();
      
      console.log("Creating booking with data:", {
        user_id: user.id,
        gym_id: gymUuid,
        date_time: bookingData.date.toISOString(),
        status: "confirmed"
      });

      const { error } = await supabase
        .from("bookings")
        .insert({
          user_id: user.id,
          gym_id: gymUuid, // Используем сгенерированный UUID
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
        title: "Бронирование создано!",
        description: "Ваше посещение успешно забронировано. Проверьте раздел 'Расписание'.",
      });
      setShowBookingDialog(false);
      // Обновляем кэш расписания
      queryClient.invalidateQueries({ queryKey: ["user-bookings"] });
    },
    onError: (error) => {
      console.error("Error creating booking:", error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось создать бронирование. Попробуйте снова.",
      });
    },
  });

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowShareTooltip(true);
    setTimeout(() => setShowShareTooltip(false), 2000);
  };

  const handleBookingSubmit = (bookingData: any) => {
    if (!is_authenticated) {
      toast({
        variant: "destructive",
        title: "Необходимо войти в систему",
        description: "Для бронирования необходимо войти в систему",
      });
      return;
    }

    createBookingMutation.mutate({
      date: bookingData.date,
      gymId: id!,
    });
  };

  const handleBookVisit = () => {
    if (!is_authenticated) {
      toast({
        variant: "destructive",
        title: "Необходимо войти в систему",
        description: "Для бронирования необходимо войти в систему",
      });
      return;
    }
    setShowBookingDialog(true);
  };

  // Эффект для красивого появления контента при загрузке
  useEffect(() => {
    const elements = document.querySelectorAll('.animate-on-load');
    elements.forEach((el, i) => {
      setTimeout(() => {
        (el as HTMLElement).style.opacity = '1';
        (el as HTMLElement).style.transform = 'translateY(0)';
      }, i * 100);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 pb-16">
      {/* Основное изображение */}
      <div className="relative mb-4">
        <div className="h-52 overflow-hidden">
          <img 
            src={gymData.mainImage} 
            alt={gymData.name} 
            className="w-full h-full object-cover animate-fade-in" 
          />
        </div>
        <div className="absolute top-2 left-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 transition-all hover:scale-105" 
            asChild
          >
            <Link to="/app/gyms" className="flex items-center">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Назад
            </Link>
          </Button>
        </div>
        <div className="absolute bottom-0 transform translate-y-1/2 left-4 bg-white p-2 shadow rounded-lg animate-fade-in">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
            <span className="font-bold">{gymData.rating}</span>
            <span className="text-sm text-gray-500">({gymData.reviewCount} отзывов)</span>
          </div>
        </div>
        <div className="absolute top-2 right-2 flex gap-2">
          <button 
            onClick={toggleFavorite}
            className="p-2 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-all"
          >
            <Heart className={`h-5 w-5 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-white'} transition-colors`} />
          </button>
          <div className="relative">
            <button 
              onClick={handleShare}
              className="p-2 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-all"
            >
              <Share className="h-5 w-5 text-white" />
            </button>
            {showShareTooltip && (
              <div className="absolute top-full right-0 mt-2 bg-gray-900 text-white text-xs px-2 py-1 rounded animate-fade-in">
                Ссылка скопирована
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Название и адрес */}
      <div className="px-4 mb-6">
        <h1 className="text-2xl font-bold mb-1 text-white animate-on-load opacity-0 transition-all duration-500" style={{ transform: 'translateY(10px)' }}>{gymData.name}</h1>
        <div className="flex items-center text-gray-400 animate-on-load opacity-0 transition-all duration-500" style={{ transform: 'translateY(10px)', transitionDelay: '100ms' }}>
          <MapPin className="h-4 w-4 mr-1" />
          <span>{gymData.address}</span>
        </div>
        <div className="flex items-center text-gray-400 mt-1 animate-on-load opacity-0 transition-all duration-500" style={{ transform: 'translateY(10px)', transitionDelay: '200ms' }}>
          <Clock className="h-4 w-4 mr-1" />
          <span>{gymData.workingHours}</span>
        </div>
      </div>

      {/* Вкладки */}
      <Tabs defaultValue="info" value={activeTab} onValueChange={setActiveTab} className="w-full animate-on-load opacity-0 transition-all duration-500" style={{ transform: 'translateY(10px)', transitionDelay: '300ms' }}>
        <TabsList className="w-full grid grid-cols-3 mb-4 bg-gray-800">
          <TabsTrigger value="info" className="transition-all hover:text-primary">Информация</TabsTrigger>
          <TabsTrigger value="classes" className="transition-all hover:text-primary">Занятия</TabsTrigger>
          <TabsTrigger value="gallery" className="transition-all hover:text-primary">Галерея</TabsTrigger>
        </TabsList>
        
        {/* Вкладка с информацией */}
        <TabsContent value="info" className="px-4">
          <div className="space-y-4">
            <div className="animate-on-load opacity-0 transition-all duration-500" style={{ transform: 'translateY(10px)', transitionDelay: '400ms' }}>
              <h3 className="font-medium mb-2 text-white">О зале</h3>
              <p className="text-gray-400">{gymData.description}</p>
            </div>
            
            <div className="animate-on-load opacity-0 transition-all duration-500" style={{ transform: 'translateY(10px)', transitionDelay: '500ms' }}>
              <h3 className="font-medium mb-2 text-white">Удобства и услуги</h3>
              <div className="grid grid-cols-2 gap-2">
                {gymData.features.map((feature, index) => (
                  <div key={index} className="flex items-center group">
                    <Check className="h-4 w-4 text-primary mr-2 group-hover:scale-110 transition-transform" />
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="animate-on-load opacity-0 transition-all duration-500" style={{ transform: 'translateY(10px)', transitionDelay: '600ms' }}>
              <h3 className="font-medium mb-2 text-white">Контакты</h3>
              <p className="text-gray-400">{gymData.phone}</p>
            </div>
            
            <Button 
              onClick={handleBookVisit}
              disabled={createBookingMutation.isPending}
              className="w-full transition-all hover:scale-105 animate-on-load opacity-0 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700" 
              style={{ transform: 'translateY(10px)', transitionDelay: '700ms' }}
            >
              {createBookingMutation.isPending ? "Бронирование..." : "Забронировать посещение"}
            </Button>
          </div>
        </TabsContent>
        
        {/* Вкладка с занятиями */}
        <TabsContent value="classes" className="px-4">
          <div className="space-y-4">
            <h3 className="font-medium mb-2 text-white">Расписание занятий</h3>
            
            {gymData.classes.map((classItem, idx) => (
              <DarkCard 
                key={classItem.id} 
                className="mb-3 animate-on-load opacity-0 transition-all duration-500 hover-scale" 
                style={{ transform: 'translateY(10px)', transitionDelay: `${400 + idx * 100}ms` }}
                hoverEffect="raise"
              >
                <div className="p-4">
                  <h4 className="font-medium text-white">{classItem.name}</h4>
                  <div className="flex items-center text-gray-400 mt-1">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="text-sm">{classItem.time}</span>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-sm text-gray-400">Тренер: {classItem.trainer}</span>
                    <Button size="sm" className="transition-all hover:scale-105 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700">Записаться</Button>
                  </div>
                </div>
              </DarkCard>
            ))}
          </div>
        </TabsContent>
        
        {/* Вкладка с галереей */}
        <TabsContent value="gallery" className="px-4">
          <div className="grid grid-cols-2 gap-2">
            {[gymData.mainImage, ...gymData.galleryImages].map((image, index) => (
              <div 
                key={index} 
                className="h-40 overflow-hidden rounded-lg animate-on-load opacity-0 transition-all duration-500 group" 
                style={{ transform: 'translateY(10px)', transitionDelay: `${400 + index * 100}ms` }}
              >
                <img 
                  src={image} 
                  alt={`Фото ${index + 1}`} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                />
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Диалог бронирования */}
      <BookingDialog
        open={showBookingDialog}
        onOpenChange={setShowBookingDialog}
        onSubmit={handleBookingSubmit}
      />
    </div>
  );
};

export default ClientGymDetail;
