
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/auth_context";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BookingDialog } from "@/components/bookings/BookingDialog";
import { useToast } from "@/hooks/use-toast";
import { GymHeader } from "@/components/client/gym-detail/GymHeader";
import { GymInfoSection } from "@/components/client/gym-detail/GymInfoSection";
import { GymClassesSection } from "@/components/client/gym-detail/GymClassesSection";
import { GymGallerySection } from "@/components/client/gym-detail/GymGallerySection";
import { BookingButton } from "@/components/client/gym-detail/BookingButton";
import { useGymBooking } from "@/hooks/useGymBooking";

const ClientGymDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { is_authenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("info");
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const { toast } = useToast();
  const { createBookingMutation, handleBookingSubmit } = useGymBooking();
  
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

  const onBookingSubmit = (bookingData: any) => {
    handleBookingSubmit(bookingData, id!, gymData.name);
    setShowBookingDialog(false);
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
      <GymHeader gymData={gymData} />
      <GymInfoSection gymData={gymData} />

      {/* Вкладки */}
      <Tabs defaultValue="info" value={activeTab} onValueChange={setActiveTab} className="w-full animate-on-load opacity-0 transition-all duration-500" style={{ transform: 'translateY(10px)', transitionDelay: '300ms' }}>
        <TabsList className="w-full grid grid-cols-3 mb-4 bg-gray-800">
          <TabsTrigger value="info" className="transition-all hover:text-primary">Информация</TabsTrigger>
          <TabsTrigger value="classes" className="transition-all hover:text-primary">Занятия</TabsTrigger>
          <TabsTrigger value="gallery" className="transition-all hover:text-primary">Галерея</TabsTrigger>
        </TabsList>
        
        <TabsContent value="info" className="px-4">
          <BookingButton 
            onBookVisit={handleBookVisit}
            isLoading={createBookingMutation.isPending}
          />
        </TabsContent>
        
        <TabsContent value="classes" className="px-4">
          <GymClassesSection classes={gymData.classes} />
        </TabsContent>
        
        <TabsContent value="gallery" className="px-4">
          <GymGallerySection 
            images={[gymData.mainImage, ...gymData.galleryImages]} 
            gymName={gymData.name}
          />
        </TabsContent>
      </Tabs>

      {/* Диалог бронирования */}
      <BookingDialog
        open={showBookingDialog}
        onOpenChange={setShowBookingDialog}
        onSubmit={onBookingSubmit}
      />
    </div>
  );
};

export default ClientGymDetail;
