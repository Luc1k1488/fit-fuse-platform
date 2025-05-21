
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DarkCard } from "@/components/ui/dark-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, User, Search, Dumbbell, MapPin, Heart } from "lucide-react";

// Тестовые данные для занятий
const mock_classes = [
  {
    id: "class-1",
    title: "Силовая тренировка",
    type: "Силовые",
    gymName: "Фитнес Элит",
    gymLocation: "Центр",
    instructor: "Алексей Иванов",
    date: "2023-06-15",
    time: "10:00 - 11:00",
    duration: "60 мин",
    spots: 5,
    totalSpots: 15,
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Z3ltJTIwd29ya291dHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: "class-2",
    title: "Йога для начинающих",
    type: "Йога",
    gymName: "Йога Студия Зен",
    gymLocation: "Запад",
    instructor: "Елена Смирнова",
    date: "2023-06-15",
    time: "12:00 - 13:00",
    duration: "60 мин",
    spots: 8,
    totalSpots: 20,
    image: "https://images.unsplash.com/photo-1599447292180-45fd84092ef4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8eW9nYSUyMGNsYXNzfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: "class-3",
    title: "HIIT Интервальная",
    type: "HIIT",
    gymName: "Пауэр Хаус",
    gymLocation: "Садовое кольцо",
    instructor: "Дмитрий Кузнецов",
    date: "2023-06-15",
    time: "18:30 - 19:15",
    duration: "45 мин",
    spots: 3,
    totalSpots: 12,
    image: "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGhpaXQlMjBmaXRuZXNzfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: "class-4",
    title: "Пилатес",
    type: "Пилатес",
    gymName: "Фитнес Элит",
    gymLocation: "Центр",
    instructor: "Ольга Петрова",
    date: "2023-06-16",
    time: "11:00 - 12:00",
    duration: "60 мин",
    spots: 10,
    totalSpots: 15,
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGlsYXRlc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: "class-5",
    title: "Кроссфит",
    type: "Кроссфит",
    gymName: "КроссФит Джанкшн",
    gymLocation: "Восток",
    instructor: "Максим Сидоров",
    date: "2023-06-16",
    time: "19:00 - 20:00",
    duration: "60 мин",
    spots: 2,
    totalSpots: 10,
    image: "https://images.unsplash.com/photo-1533681904393-9ab6eee7e408?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y3Jvc3NmaXR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"
  }
];

const class_types = ["Все", "Силовые", "Йога", "HIIT", "Пилатес", "Кроссфит", "Кардио"];
const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

const ClientClasses = () => {
  const [classes, setClasses] = useState(mock_classes);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("Все");
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [favoriteClasses, setFavoriteClasses] = useState<string[]>([]);
  
  // Получить дату для выбранного дня
  const getDateForDay = (dayIndex: number) => {
    const today = new Date();
    const diff = dayIndex - today.getDay();
    const date = new Date();
    date.setDate(today.getDate() + diff);
    return date.toISOString().split('T')[0];
  };
  
  // Форматирование даты для отображения
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  };
  
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
    filterClasses();
  };
  
  // Функция фильтрации
  const filterClasses = () => {
    let filtered = [...mock_classes];
    
    // Фильтр по поиску
    if (searchQuery) {
      filtered = filtered.filter(cls => 
        cls.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cls.gymName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cls.instructor.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Фильтр по типу
    if (selectedType !== "Все") {
      filtered = filtered.filter(cls => cls.type === selectedType);
    }
    
    // Фильтр по дню
    const targetDate = getDateForDay(selectedDay);
    filtered = filtered.filter(cls => cls.date === targetDate);
    
    setClasses(filtered);
  };
  
  // Применяем фильтры при изменении
  useEffect(() => {
    filterClasses();
  }, [selectedType, selectedDay]);
  
  return (
    <div className="pb-16">
      <h1 className="text-2xl font-bold mb-4 animate-fade-in">Найти и забронировать тренировки</h1>
      
      {/* Поиск */}
      <div className="bg-gray-900 p-4 rounded-xl shadow-lg border border-gray-800 mb-6 animate-fade-in animation-delay-200">
        <form onSubmit={handleSearch} className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Поиск занятий, тренеров, залов..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg border-gray-700 bg-gray-800 text-white"
            />
            <Button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 transition-all hover:scale-105">
              Поиск
            </Button>
          </div>
        </form>
        
        {/* Выбор дня */}
        <div className="mb-4 animate-fade-in animation-delay-300">
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => (
              <Button
                key={day}
                variant={selectedDay === index ? "default" : "outline"}
                className={`p-1 h-auto flex flex-col items-center transition-all ${
                  selectedDay === index ? "bg-primary" : "bg-gray-800 border-gray-700 hover:bg-gray-700"
                }`}
                onClick={() => setSelectedDay(index)}
              >
                <span className="text-xs">{day}</span>
                <span className="mt-1 text-sm font-bold">
                  {new Date().getDate() + index - new Date().getDay()}
                </span>
              </Button>
            ))}
          </div>
        </div>
        
        {/* Типы занятий */}
        <Tabs defaultValue="Все" value={selectedType} className="w-full animate-fade-in animation-delay-400">
          <TabsList className="w-full overflow-x-auto flex pb-1 bg-gray-800">
            {class_types.map((type) => (
              <TabsTrigger
                key={type}
                value={type}
                onClick={() => setSelectedType(type)}
                className="whitespace-nowrap transition-all hover:scale-105"
              >
                {type}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      
      {/* Список занятий */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-white animate-fade-in">
          Расписание на {formatDate(getDateForDay(selectedDay))}
        </h2>
        
        {classes.length > 0 ? (
          <div className="space-y-4">
            {classes.map((classItem, idx) => (
              <DarkCard 
                key={classItem.id} 
                className="overflow-hidden animate-fade-in" 
                style={{ animationDelay: `${idx * 100}ms` }}
                hoverEffect="raise"
              >
                <div className="flex flex-row">
                  <div className="w-1/3 h-28 overflow-hidden group">
                    <img 
                      src={classItem.image} 
                      alt={classItem.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-3 w-2/3 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-white">{classItem.title}</h3>
                        <span className="text-xs bg-gray-800 text-gray-300 rounded-full px-2 py-1">
                          {classItem.type}
                        </span>
                      </div>
                      <div className="flex items-center mt-1 text-xs text-gray-400">
                        <User className="h-3 w-3 mr-1" />
                        {classItem.instructor}
                      </div>
                      <div className="flex flex-wrap mt-1 gap-2">
                        <div className="flex items-center text-xs text-gray-400">
                          <Clock className="h-3 w-3 mr-1" />
                          {classItem.time}
                        </div>
                        <div className="flex items-center text-xs text-gray-400">
                          <Dumbbell className="h-3 w-3 mr-1" />
                          {classItem.duration}
                        </div>
                      </div>
                      <div className="flex items-center mt-1 text-xs text-gray-400">
                        <MapPin className="h-3 w-3 mr-1" />
                        {classItem.gymName}, {classItem.gymLocation}
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-400">
                        Осталось мест: <span className={classItem.spots < 3 ? 'text-red-400 font-medium' : ''}>{classItem.spots}/{classItem.totalSpots}</span>
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleFavorite(classItem.id)} 
                          className="p-1.5 rounded-full hover:bg-gray-800 transition-colors"
                        >
                          <Heart 
                            className={`h-4 w-4 ${favoriteClasses.includes(classItem.id) ? 'text-red-500 fill-red-500' : 'text-gray-400'} transition-colors`} 
                          />
                        </button>
                        <Button size="sm" className="text-xs py-0 h-7 transition-all hover:scale-105">
                          Записаться
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </DarkCard>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-900 rounded-xl border border-gray-800 animate-fade-in">
            <Calendar className="h-12 w-12 mx-auto text-gray-500" />
            <p className="mt-2 text-gray-400">Нет занятий по выбранным критериям</p>
            <Button 
              onClick={() => {
                setSearchQuery("");
                setSelectedType("Все");
              }} 
              className="mt-4 transition-all hover:scale-105"
            >
              Сбросить фильтры
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientClasses;
