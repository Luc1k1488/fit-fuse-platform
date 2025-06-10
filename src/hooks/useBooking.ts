
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth_context";

export interface BookingData {
  gym_id?: string;
  class_id?: string;
  date_time: string;
  booking_type: 'gym_visit' | 'class_booking';
  notes?: string;
}

export const useBooking = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const createBooking = async (bookingData: BookingData) => {
    if (!user) {
      toast.error("Необходимо авторизоваться для бронирования");
      return { success: false, error: "Not authenticated" };
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          gym_id: bookingData.gym_id || null,
          class_id: bookingData.class_id || null,
          date_time: bookingData.date_time,
          booking_type: bookingData.booking_type,
          notes: bookingData.notes,
          status: 'booked'
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Бронирование создано успешно!");
      return { success: true, data };
    } catch (error: any) {
      console.error('Error creating booking:', error);
      toast.error("Ошибка создания бронирования");
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId: string) => {
    if (!user) {
      toast.error("Необходимо авторизоваться");
      return { success: false, error: "Not authenticated" };
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ 
          status: 'cancelled',
          cancelled_at: new Date().toISOString()
        })
        .eq('id', bookingId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success("Бронирование отменено");
      return { success: true };
    } catch (error: any) {
      console.error('Error cancelling booking:', error);
      toast.error("Ошибка отмены бронирования");
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const fetchUserBookings = async () => {
    if (!user) return { success: false, error: "Not authenticated" };

    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          gym:gym_id (
            id,
            name,
            location,
            city,
            main_image
          ),
          class:class_id (
            id,
            title,
            instructor,
            start_time,
            end_time
          )
        `)
        .eq('user_id', user.id)
        .order('date_time', { ascending: true });

      if (error) throw error;

      return { success: true, data };
    } catch (error: any) {
      console.error('Error fetching bookings:', error);
      return { success: false, error: error.message };
    }
  };

  return {
    createBooking,
    cancelBooking,
    fetchUserBookings,
    loading
  };
};
