import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Star, Clock, Calendar, Check } from "lucide-react";

const ClientGymDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("info");
  
  // Данные по залу (в реальном приложении будут загружаться по ID)
  const gymData = {
    id: id,
    name: id === "gym-1" ? "Фитнес Элит" : id === "gym-2" ? "Пауэр Хаус" : "Спортзал",
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

  return (
    <div className="pb-16">
      {/* Основное изображение */}
      <div className="relative mb-4">
        <div className="h-52 overflow-hidden">
          <img src={gymData.mainImage} alt={gymData.name} className="w-full h-full object-cover" />
        </div>
        <div className="absolute top-2 left-2">
          <Button variant="outline" size="sm" className="bg-white" asChild>
            <Link to="/app/gyms">Назад</Link>
          </Button>
        </div>
        <div className="absolute bottom-0 transform translate-y-1/2 left-4 bg-white p-2 shadow rounded-lg">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
            <span className="font-bold">{gymData.rating}</span>
            <span className="text-sm text-gray-500">({gymData.reviewCount} отзывов)</span>
          </div>
        </div>
      </div>

      {/* Название и адрес */}
      <div className="px-4 mb-6">
        <h1 className="text-2xl font-bold mb-1">{gymData.name}</h1>
        <div className="flex items-center text-gray-600">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{gymData.address}</span>
        </div>
        <div className="flex items-center text-gray-600 mt-1">
          <Clock className="h-4 w-4 mr-1" />
          <span>{gymData.workingHours}</span>
        </div>
      </div>

      {/* Вкладки */}
      <Tabs defaultValue="info" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-3 mb-4">
          <TabsTrigger value="info">Информация</TabsTrigger>
          <TabsTrigger value="classes">Занятия</TabsTrigger>
          <TabsTrigger value="gallery">Галерея</TabsTrigger>
        </TabsList>
        
        {/* Вкладка с информацией */}
        <TabsContent value="info" className="px-4">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">О зале</h3>
              <p className="text-gray-700">{gymData.description}</p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Удобства и услуги</h3>
              <div className="grid grid-cols-2 gap-2">
                {gymData.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Контакты</h3>
              <p className="text-gray-700">{gymData.phone}</p>
            </div>
            
            <Button className="w-full">Забронировать посещение</Button>
          </div>
        </TabsContent>
        
        {/* Вкладка с занятиями */}
        <TabsContent value="classes" className="px-4">
          <div className="space-y-4">
            <h3 className="font-medium mb-2">Расписание занятий</h3>
            
            {gymData.classes.map((classItem) => (
              <Card key={classItem.id} className="mb-3">
                <CardContent className="p-4">
                  <h4 className="font-medium">{classItem.name}</h4>
                  <div className="flex items-center text-gray-600 mt-1">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="text-sm">{classItem.time}</span>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-sm text-gray-600">Тренер: {classItem.trainer}</span>
                    <Button size="sm">Записаться</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* Вкладка с галереей */}
        <TabsContent value="gallery" className="px-4">
          <div className="grid grid-cols-2 gap-2">
            {[gymData.mainImage, ...gymData.galleryImages].map((image, index) => (
              <div key={index} className="h-40 overflow-hidden rounded-lg">
                <img src={image} alt={`Фото ${index + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientGymDetail;
