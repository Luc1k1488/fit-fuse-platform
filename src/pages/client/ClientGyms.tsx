
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Search, Star, Map, MapPin, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Тестовые данные для залов
const mock_gyms = [
  {
    id: "gym-1",
    name: "Фитнес Элит",
    location: "Центр",
    city: "Москва",
    address: "ул. Тверская, 18, Москва",
    main_image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Z3ltfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
    rating: 4.9,
    review_count: 120,
    features: ["Бассейн", "Сауна", "Парковка"],
    category: "Премиум"
  },
  {
    id: "gym-2",
    name: "Пауэр Хаус",
    location: "Садовое кольцо",
    city: "Москва",
    address: "ул. Садовая, 32, Москва",
    main_image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGd5bXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    rating: 4.7,
    review_count: 95,
    features: ["Круглосуточно", "Групповые занятия"],
    category: "Фитнес"
  },
  {
    id: "gym-3",
    name: "Йога Студия Зен",
    location: "Запад",
    city: "Москва",
    address: "Кутузовский пр-т, 45, Москва",
    main_image: "https://images.unsplash.com/photo-1588286840104-8957b019727f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8eW9nYSUyMHN0dWRpb3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    rating: 4.8,
    review_count: 78,
    features: ["Медитация", "Горячая йога"],
    category: "Йога"
  },
  {
    id: "gym-4",
    name: "КроссФит Джанкшн",
    location: "Восток",
    city: "Москва",
    address: "ул. Первомайская, 24, Москва",
    main_image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Z3ltfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
    rating: 4.6,
    review_count: 64,
    features: ["CrossFit", "Персональные тренировки"],
    category: "КроссФит"
  }
];

const cities = ["Москва", "Санкт-Петербург", "Казань", "Новосибирск", "Екатеринбург"];
const categories = ["Все", "Премиум", "Фитнес", "Йога", "КроссФит", "Бокс", "Велоспорт"];

const ClientGyms = () => {
  const [gyms, setGyms] = useState(mock_gyms);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("Москва");
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [minRating, setMinRating] = useState([4.0]);
  const [viewMode, setViewMode] = useState("grid");

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Фильтрация по поисковому запросу
    const filteredGyms = mock_gyms.filter(gym => 
      gym.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gym.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setGyms(filteredGyms);
  };

  const handleFilter = () => {
    let filtered = [...mock_gyms];
    
    // Фильтр по городу
    if (selectedCity) {
      filtered = filtered.filter(gym => gym.city === selectedCity);
    }
    
    // Фильтр по категории
    if (selectedCategory && selectedCategory !== "Все") {
      filtered = filtered.filter(gym => gym.category === selectedCategory);
    }
    
    // Фильтр по рейтингу
    filtered = filtered.filter(gym => gym.rating >= minRating[0]);
    
    setGyms(filtered);
  };

  // Применяем фильтры при их изменении
  useEffect(() => {
    handleFilter();
  }, [selectedCity, selectedCategory, minRating]);

  return (
    <div className="pb-16">
      {/* Заголовок страницы */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Найти залы и студии</h1>
        <p className="text-gray-600">
          Выберите спортзал или студию для тренировки
        </p>
      </div>

      {/* Поиск и фильтры */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <form onSubmit={handleSearch} className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Поиск залов, студий, локаций..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg border-gray-200"
            />
            <Button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2">
              Поиск
            </Button>
          </div>
        </form>
        
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            {/* Выбор города */}
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <MapPin className="mr-2 h-4 w-4" />
                    {selectedCity || "Выберите город"}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {cities.map((city) => (
                    <DropdownMenuItem
                      key={city}
                      onClick={() => setSelectedCity(city)}
                      className="flex items-center justify-between"
                    >
                      {city}
                      {city === selectedCity && <Check className="h-4 w-4 ml-2" />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {/* Категории */}
          <Tabs defaultValue="Все" value={selectedCategory} className="w-full">
            <TabsList className="w-full overflow-x-auto flex pb-1 mb-2">
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  onClick={() => setSelectedCategory(category)}
                  className="whitespace-nowrap"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Результаты */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {gyms.map((gym) => (
          <Card key={gym.id} className="overflow-hidden">
            <div className="relative h-40">
              <img 
                src={gym.main_image} 
                alt={gym.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 bg-white/90 rounded-full px-2 py-1 flex items-center">
                <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 mr-1" />
                <span className="text-xs font-medium">{gym.rating}</span>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-medium text-lg">{gym.name}</h3>
              <div className="flex items-center mt-1 text-sm text-gray-500">
                <MapPin className="h-3 w-3 mr-1" />
                {gym.location}, {gym.city}
              </div>
              <div className="mt-2 text-sm text-gray-700">
                <p>{gym.review_count} отзывов</p>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {gym.features.map((feature, index) => (
                  <span 
                    key={index} 
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between items-center">
              <Button asChild>
                <Link to={`/app/gyms/${gym.id}`}>Подробнее</Link>
              </Button>
              <Button variant="outline" size="sm">
                Расписание
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {gyms.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Не найдено залов по вашим критериям.</p>
          <Button onClick={() => {
            setSearchQuery("");
            setSelectedCity("Москва");
            setSelectedCategory("Все");
            setMinRating([4.0]);
          }}>Сбросить фильтры</Button>
        </div>
      )}
    </div>
  );
};

export default ClientGyms;
