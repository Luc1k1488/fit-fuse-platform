
import { useState, useEffect } from "react";
import { ClassSearchForm } from "@/components/client/classes/ClassSearchForm";
import { DaySelector } from "@/components/client/classes/DaySelector";
import { ClassTypeTabs } from "@/components/client/classes/ClassTypeTabs";
import { ClassList } from "@/components/client/classes/ClassList";
import { 
  class_types, 
  mock_classes, 
  getDateForDay 
} from "@/components/client/classes/classConstants";

const ClientClasses = () => {
  const [classes, setClasses] = useState(mock_classes);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("Все");
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [favoriteClasses, setFavoriteClasses] = useState<string[]>([]);
  
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
  
  // Функция для сброса фильтров
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedType("Все");
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
      <ClassList 
        classes={classes}
        selectedDay={selectedDay}
        favoriteClasses={favoriteClasses}
        toggleFavorite={toggleFavorite}
        resetFilters={resetFilters}
      />
    </div>
  );
};

export default ClientClasses;
