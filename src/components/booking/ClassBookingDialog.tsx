
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, User, Users } from "lucide-react";
import { useBooking } from "@/hooks/useBooking";
import { ClassWithGym } from "@/types";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface ClassBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classItem: ClassWithGym;
}

export const ClassBookingDialog: React.FC<ClassBookingDialogProps> = ({
  open,
  onOpenChange,
  classItem
}) => {
  const [notes, setNotes] = useState("");
  const { createBooking, loading } = useBooking();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await createBooking({
      class_id: classItem.id,
      date_time: classItem.start_time || new Date().toISOString(),
      booking_type: 'class_booking',
      notes: notes || undefined
    });

    if (result.success) {
      onOpenChange(false);
      setNotes("");
    }
  };

  const spotsLeft = (classItem.capacity || 0) - (classItem.booked_count || 0);
  const isFull = spotsLeft <= 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Запись на занятие
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <h3 className="font-medium text-lg">{classItem.title}</h3>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>{classItem.instructor}</span>
            </div>
            
            {classItem.start_time && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>
                  {format(new Date(classItem.start_time), "d MMMM, HH:mm", { locale: ru })}
                </span>
              </div>
            )}
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="h-4 w-4" />
              <span>
                {classItem.booked_count || 0} / {classItem.capacity || 0} мест
                {spotsLeft > 0 && (
                  <span className="text-green-600 ml-1 font-medium">
                    (осталось {spotsLeft})
                  </span>
                )}
              </span>
            </div>

            {classItem.gym && (
              <div className="text-sm text-gray-600 pt-2 border-t">
                <strong>Зал:</strong> {classItem.gym.name}
                {classItem.gym.location && (
                  <div className="text-xs mt-1">{classItem.gym.location}</div>
                )}
              </div>
            )}
          </div>

          {isFull ? (
            <div className="text-center py-6">
              <p className="text-red-600 font-medium text-lg">Мест не осталось</p>
              <p className="text-gray-500 text-sm mt-2">Попробуйте выбрать другое время или занятие</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="notes">Примечания (необязательно)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Особые пожелания или примечания..."
                  rows={3}
                  className="mt-1"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="flex-1"
                >
                  Отмена
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  {loading ? "Запись..." : "Записаться"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
