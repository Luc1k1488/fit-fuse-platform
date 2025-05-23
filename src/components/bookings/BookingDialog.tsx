
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
import { Calendar } from "@/components/ui/calendar";

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date?: Date;
  onSubmit: (data: any) => void;
}

export const BookingDialog: React.FC<BookingDialogProps> = ({
  open,
  onOpenChange,
  date = new Date(),
  onSubmit,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(date);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const bookingData = {
      date: selectedDate,
    };
    
    onSubmit(bookingData);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-gray-900 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>Подтвердить бронирование</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Выбор даты */}
            <div className="grid gap-2">
              <label className="text-sm font-medium">Дата занятия</label>
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
              disabled={!selectedDate}
            >
              Подтвердить бронирование
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
