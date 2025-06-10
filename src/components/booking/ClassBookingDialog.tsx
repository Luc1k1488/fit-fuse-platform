
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
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <h3 className="font-medium">{classItem.title}</h3>
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
                  <span className="text-green-600 ml-1">
                    (осталось {spotsLeft})
                  </span>
                )}
              </span>
            </div>
          </div>

          {isFull ? (
            <div className="text-center py-4">
              <p className="text-red-600 font-medium">Мест не осталось</p>
              <p className="text-gray-500 text-sm">Попробуйте выбрать другое время</p>
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
                  className="flex-1"
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
