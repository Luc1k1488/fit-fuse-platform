
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, MapPin } from "lucide-react";
import { useBooking } from "@/hooks/useBooking";
import { Gym } from "@/types";

interface GymBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gym: Gym;
}

export const GymBookingDialog: React.FC<GymBookingDialogProps> = ({
  open,
  onOpenChange,
  gym
}) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [notes, setNotes] = useState("");
  const { createBooking, loading } = useBooking();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime) {
      return;
    }

    const dateTime = `${selectedDate}T${selectedTime}:00`;
    
    const result = await createBooking({
      gym_id: gym.id,
      date_time: dateTime,
      booking_type: 'gym_visit',
      notes: notes || undefined
    });

    if (result.success) {
      onOpenChange(false);
      setSelectedDate("");
      setSelectedTime("");
      setNotes("");
    }
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Бронирование зала
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <h3 className="font-medium">{gym.name}</h3>
            <p className="text-sm text-gray-600">{gym.location}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="date">Дата посещения</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={minDate}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="time">Время посещения</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="time"
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  min="06:00"
                  max="23:00"
                  className="pl-10"
                  required
                />
              </div>
            </div>

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
                disabled={loading || !selectedDate || !selectedTime}
                className="flex-1"
              >
                {loading ? "Бронирование..." : "Забронировать"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
