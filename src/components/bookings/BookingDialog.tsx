
import React, { useState } from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date?: Date;
  onSubmit: (data: any) => void;
}

// Пример доступных классов
const availableClasses = [
  { id: "1", title: "Утренняя йога", time: "8:00 - 9:00", instructor: "Елена Смирнова", spots: 5 },
  { id: "2", title: "Пилатес", time: "11:00 - 12:00", instructor: "Ольга Петрова", spots: 8 },
  { id: "3", title: "HIIT Тренировка", time: "18:30 - 19:15", instructor: "Дмитрий Кузнецов", spots: 3 },
  { id: "4", title: "Силовая тренировка", time: "20:00 - 21:00", instructor: "Алексей Иванов", spots: 10 },
];

// Пример доступных залов
const availableGyms = [
  { id: "1", name: "Фитнес Элит", location: "Центр" },
  { id: "2", name: "Йога Студия Зен", location: "Запад" },
  { id: "3", name: "Пауэр Хаус", location: "Садовое кольцо" },
  { id: "4", name: "КроссФит Джанкшн", location: "Восток" },
];

export const BookingDialog: React.FC<BookingDialogProps> = ({
  open,
  onOpenChange,
  date = new Date(),
  onSubmit,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(date);
  const [selectedTab, setSelectedTab] = useState("classes");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedGym, setSelectedGym] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const bookingData = {
      date: selectedDate,
      classId: selectedClass,
      gymId: selectedGym,
      time: selectedTime,
      // Другие данные бронирования
    };
    
    onSubmit(bookingData);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-gray-900 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>Забронировать тренировку</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Выбор даты */}
            <div className="grid gap-2">
              <label className="text-sm font-medium">Дата</label>
              <div className="bg-gray-800 border border-gray-700 rounded-md p-2">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="mx-auto bg-gray-800"
                  classNames={{
                    day_today: "bg-primary/20 text-primary",
                    day_selected: "bg-primary text-white hover:bg-primary hover:text-white",
                  }}
                />
              </div>
              {selectedDate && (
                <p className="text-sm text-gray-400">
                  Выбрано: {format(selectedDate, "d MMMM, EEEE", { locale: ru })}
                </p>
              )}
            </div>
            
            {/* Вкладки: выбор класса или зала */}
            <Tabs 
              defaultValue="classes" 
              value={selectedTab} 
              onValueChange={setSelectedTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="classes">По тренировкам</TabsTrigger>
                <TabsTrigger value="gyms">По залам</TabsTrigger>
              </TabsList>
              
              <TabsContent value="classes" className="mt-4 space-y-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Тренировка</label>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger className="bg-gray-800 border-gray-700">
                      <SelectValue placeholder="Выберите тренировку" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {availableClasses.map(cls => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.title} ({cls.time}, {cls.instructor})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {selectedClass && (
                  <div className="bg-gray-800 p-3 rounded-md border border-gray-700">
                    <h3 className="font-medium">
                      {availableClasses.find(cls => cls.id === selectedClass)?.title}
                    </h3>
                    <p className="text-sm text-gray-400">
                      Инструктор: {availableClasses.find(cls => cls.id === selectedClass)?.instructor}
                    </p>
                    <p className="text-sm text-gray-400">
                      Время: {availableClasses.find(cls => cls.id === selectedClass)?.time}
                    </p>
                    <p className="text-sm text-gray-400">
                      Доступно мест: {availableClasses.find(cls => cls.id === selectedClass)?.spots}
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="gyms" className="mt-4 space-y-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Зал</label>
                  <Select value={selectedGym} onValueChange={setSelectedGym}>
                    <SelectTrigger className="bg-gray-800 border-gray-700">
                      <SelectValue placeholder="Выберите зал" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {availableGyms.map(gym => (
                        <SelectItem key={gym.id} value={gym.id}>
                          {gym.name} ({gym.location})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {selectedGym && (
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Время</label>
                    <Select value={selectedTime} onValueChange={setSelectedTime}>
                      <SelectTrigger className="bg-gray-800 border-gray-700">
                        <SelectValue placeholder="Выберите время" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="08:00">08:00 - 09:00</SelectItem>
                        <SelectItem value="09:00">09:00 - 10:00</SelectItem>
                        <SelectItem value="10:00">10:00 - 11:00</SelectItem>
                        <SelectItem value="11:00">11:00 - 12:00</SelectItem>
                        <SelectItem value="17:00">17:00 - 18:00</SelectItem>
                        <SelectItem value="18:00">18:00 - 19:00</SelectItem>
                        <SelectItem value="19:00">19:00 - 20:00</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </TabsContent>
            </Tabs>
            
            {/* В будущем можно добавить дополнительные поля, такие как комментарии */}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)} 
              type="button"
            >
              Отмена
            </Button>
            <Button 
              type="submit" 
              disabled={
                !selectedDate || 
                (selectedTab === "classes" && !selectedClass) || 
                (selectedTab === "gyms" && (!selectedGym || !selectedTime))
              }
            >
              Забронировать
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
