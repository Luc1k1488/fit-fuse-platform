
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin } from "lucide-react";
import { useBooking } from "@/hooks/useBooking";
import { Gym } from "@/types";
import { DateTimePicker } from "./DateTimePicker";

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
  const [selectedDateTime, setSelectedDateTime] = useState("");
  const [notes, setNotes] = useState("");
  const { createBooking, loading } = useBooking();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDateTime) {
      return;
    }
    
    const result = await createBooking({
      gym_id: gym.id,
      date_time: selectedDateTime,
      booking_type: 'gym_visit',
      notes: notes || undefined
    });

    if (result.success) {
      onOpenChange(false);
      setSelectedDateTime("");
      setNotes("");
    }
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Бронирование зала
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium">{gym.name}</h3>
            <p className="text-sm text-gray-600">{gym.location}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label className="text-base font-medium">Выберите дату и время посещения</Label>
              <div className="mt-2">
                <DateTimePicker
                  onDateTimeSelect={setSelectedDateTime}
                  selectedDateTime={selectedDateTime}
                  minDate={tomorrow}
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
                disabled={loading || !selectedDateTime}
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
