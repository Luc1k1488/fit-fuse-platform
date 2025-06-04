
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useBookingManagement = () => {
  const [loading, setLoading] = useState(false);

  const cancelBooking = async (bookingId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);

      if (error) throw error;

      toast.success("Бронирование отменено");
      return true;
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error("Ошибка отмены бронирования");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const rescheduleBooking = async (bookingId: string, newDateTime: Date) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ date_time: newDateTime.toISOString() })
        .eq('id', bookingId);

      if (error) throw error;

      toast.success("Бронирование перенесено");
      return true;
    } catch (error) {
      console.error('Error rescheduling booking:', error);
      toast.error("Ошибка переноса бронирования");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const checkAvailability = async (gymId: string, dateTime: Date) => {
    try {
      // Простая проверка - количество бронирований на это время
      const { data, error } = await supabase
        .from('bookings')
        .select('id')
        .eq('gym_id', gymId)
        .eq('date_time', dateTime.toISOString())
        .eq('status', 'booked');

      if (error) throw error;

      // Предполагаем максимум 10 человек на занятие
      const maxCapacity = 10;
      const currentBookings = data?.length || 0;

      return {
        available: currentBookings < maxCapacity,
        spotsLeft: maxCapacity - currentBookings
      };
    } catch (error) {
      console.error('Error checking availability:', error);
      return { available: false, spotsLeft: 0 };
    }
  };

  return {
    cancelBooking,
    rescheduleBooking,
    checkAvailability,
    loading
  };
};
