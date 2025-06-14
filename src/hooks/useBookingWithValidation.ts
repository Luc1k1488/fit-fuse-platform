
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth_context";
import { checkBookingConflict, checkSubscriptionLimits, updateUserStats } from "@/utils/business";

export interface BookingData {
  gym_id?: string;
  class_id?: string;
  date_time: string;
  notes?: string;
}

export const useBookingWithValidation = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const createBooking = async (bookingData: BookingData) => {
    if (!user) {
      toast.error("Необходимо авторизоваться для бронирования");
      return { success: false, error: "Not authenticated" };
    }

    setLoading(true);
    
    try {
      // Получаем тип подписки пользователя
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('subscription_type')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      const subscriptionType = subscription?.subscription_type || 'basic';

      // Проверяем лимиты подписки
      const limitsCheck = await checkSubscriptionLimits(
        user.id, 
        subscriptionType as "regular" | "premium" | "basic"
      );

      if (!limitsCheck.canBook) {
        toast.error(limitsCheck.message || "Достигнут лимит бронирований");
        return { success: false, error: limitsCheck.message };
      }

      // Проверяем конфликты времени для занятий
      if (bookingData.class_id) {
        const hasConflict = await checkBookingConflict(
          bookingData.class_id,
          new Date(bookingData.date_time)
        );

        if (hasConflict) {
          toast.error("На это время уже есть бронирование или нет свободных мест");
          return { success: false, error: "Booking conflict" };
        }
      }

      // Создаем бронирование
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          gym_id: bookingData.gym_id || null,
          class_id: bookingData.class_id || null,
          date_time: bookingData.date_time,
          status: 'booked'
        })
        .select()
        .single();

      if (error) throw error;

      // Обновляем статистику пользователя
      await updateUserStats(user.id, "booking_created");

      toast.success("Бронирование создано успешно!");
      return { success: true, data };
    } catch (error: any) {
      console.error('Error creating booking:', error);
      toast.error("Ошибка создания бронирования: " + error.message);
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
          status: 'cancelled'
        })
        .eq('id', bookingId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Обновляем статистику
      await updateUserStats(user.id, "booking_cancelled");

      toast.success("Бронирование отменено");
      return { success: true };
    } catch (error: any) {
      console.error('Error cancelling booking:', error);
      toast.error("Ошибка отмены бронирования: " + error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    createBooking,
    cancelBooking,
    loading
  };
};
