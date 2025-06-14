
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useErrorHandler } from "@/hooks/useErrorHandler";

interface TimeSlot {
  time: string;
  available: boolean;
}

export const useAvailableSlots = (gymId?: string, date?: Date) => {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const { handleError } = useErrorHandler();

  useEffect(() => {
    if (!gymId || !date) {
      setSlots([]);
      return;
    }

    const fetchAvailableSlots = async () => {
      setLoading(true);
      try {
        // Получаем все бронирования на выбранную дату для данного зала
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const { data: bookings, error } = await supabase
          .from('bookings')
          .select('date_time')
          .eq('gym_id', gymId)
          .eq('status', 'booked')
          .gte('date_time', startOfDay.toISOString())
          .lte('date_time', endOfDay.toISOString());

        if (error) throw error;

        // Генерируем слоты и отмечаем занятые
        const bookedTimes = new Set(
          (bookings || []).map(booking => {
            const time = new Date(booking.date_time);
            return `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`;
          })
        );

        const generatedSlots: TimeSlot[] = [];
        for (let hour = 6; hour < 23; hour++) {
          for (let minute = 0; minute < 60; minute += 30) {
            const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            generatedSlots.push({
              time,
              available: !bookedTimes.has(time)
            });
          }
        }

        setSlots(generatedSlots);
      } catch (error) {
        handleError(error as Error);
        setSlots([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableSlots();
  }, [gymId, date, handleError]);

  return { slots, loading };
};
