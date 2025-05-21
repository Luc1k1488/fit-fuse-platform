
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Repeat, Calendar as CalendarIcon } from "lucide-react";

interface RecurringBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
}

// Пример доступных классов
const availableClasses = [
  { id: "1", title: "Утренняя йога", time: "8:00 - 9:00", instructor: "Елена Смирнова", spots: 5 },
  { id: "2", title: "Пилатес", time: "11:00 - 12:00", instructor: "Ольга Петрова", spots: 8 },
  { id: "3", title: "HIIT Тренировка", time: "18:30 - 19:15", instructor: "Дмитрий Кузнецов", spots: 3 },
  { id: "4", title: "Силовая тренировка", time: "20:00 - 21:00", instructor: "Алексей Иванов", spots: 10 },
];

export const RecurringBookingDialog: React.FC<RecurringBookingDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
}) => {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [frequency, setFrequency] = useState("weekly");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  
  const handleDayToggle = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day) 
        : [...prev, day]
    );
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const recurringData = {
      startDate,
      endDate,
      classId: selectedClass,
      frequency,
      days: selectedDays,
    };
    
    onSubmit(recurringData);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-gray-900 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Repeat className="mr-2 h-4 w-4" />
            Повторяющаяся тренировка
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Выбор тренировки */}
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
          
          {/* Настройка повторения */}
          <div className="grid gap-2">
            <label className="text-sm font-medium">Повторять</label>
            <RadioGroup 
              value={frequency} 
              onValueChange={setFrequency}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="weekly" id="weekly" />
                <Label htmlFor="weekly">Еженедельно</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="biweekly" id="biweekly" />
                <Label htmlFor="biweekly">Раз в 2 недели</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="monthly" id="monthly" />
                <Label htmlFor="monthly">Ежемесячно</Label>
              </div>
            </RadioGroup>
          </div>
          
          {/* Выбор дней недели */}
          {frequency === "weekly" || frequency === "biweekly" ? (
            <div className="grid gap-2">
              <label className="text-sm font-medium">Дни недели</label>
              <div className="flex flex-wrap gap-2">
                {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((day, index) => (
                  <Button
                    key={day}
                    type="button"
                    variant={selectedDays.includes(day) ? "default" : "outline"}
                    className="w-10 h-10 p-0 rounded-full"
                    onClick={() => handleDayToggle(day)}
                  >
                    {day}
                  </Button>
                ))}
              </div>
            </div>
          ) : null}
          
          {/* Период повторения */}
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Начало</label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <Input
                    type="text"
                    readOnly
                    value={startDate ? startDate.toLocaleDateString() : ""}
                    className="pl-10 bg-gray-800 border-gray-700"
                    onClick={() => document.getElementById("start-date-trigger")?.click()}
                  />
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        id="start-date-trigger" 
                        className="hidden" 
                        variant="ghost"
                        type="button"
                      >
                        Open
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-900 border-gray-800 text-white">
                      <DialogHeader>
                        <DialogTitle>Выбрать дату начала</DialogTitle>
                      </DialogHeader>
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={(date) => {
                          setStartDate(date);
                          document.getElementById("dialog-close-btn")?.click();
                        }}
                        className="mx-auto bg-gray-800 rounded-md"
                        classNames={{
                          day_today: "bg-primary/20 text-primary",
                          day_selected: "bg-primary text-white hover:bg-primary hover:text-white",
                        }}
                      />
                      <DialogClose asChild>
                        <Button 
                          id="dialog-close-btn" 
                          className="hidden" 
                          type="button"
                        >
                          Close
                        </Button>
                      </DialogClose>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Окончание</label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <Input
                    type="text"
                    readOnly
                    value={endDate ? endDate.toLocaleDateString() : "Нет"}
                    className="pl-10 bg-gray-800 border-gray-700"
                    onClick={() => document.getElementById("end-date-trigger")?.click()}
                  />
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        id="end-date-trigger" 
                        className="hidden"
                        variant="ghost"
                        type="button"
                      >
                        Open
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-900 border-gray-800 text-white">
                      <DialogHeader>
                        <DialogTitle>Выбрать дату окончания</DialogTitle>
                      </DialogHeader>
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={(date) => {
                          setEndDate(date);
                          document.getElementById("end-dialog-close-btn")?.click();
                        }}
                        className="mx-auto bg-gray-800 rounded-md"
                        classNames={{
                          day_today: "bg-primary/20 text-primary",
                          day_selected: "bg-primary text-white hover:bg-primary hover:text-white",
                        }}
                      />
                      <DialogClose asChild>
                        <Button 
                          id="end-dialog-close-btn" 
                          className="hidden" 
                          type="button"
                        >
                          Close
                        </Button>
                      </DialogClose>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="no-end" onCheckedChange={() => setEndDate(undefined)} checked={!endDate} />
              <Label htmlFor="no-end">Бессрочно</Label>
            </div>
          </div>
          
          {/* Дополнительные опции */}
          <div className="flex items-center space-x-2">
            <Checkbox id="notifications" />
            <Label htmlFor="notifications">Получать напоминания</Label>
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
              disabled={!startDate || !selectedClass || (frequency !== "monthly" && selectedDays.length === 0)}
            >
              Сохранить
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
