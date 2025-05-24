
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth_context";
import { useToast } from "@/hooks/use-toast";

export const useGymBooking = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createBookingMutation = useMutation({
    mutationFn: async (bookingData: {
      date: Date;
      gymId: string;
    }) => {
      if (!user?.id) {
        throw new Error("Необходимо войти в систему");
      }

      const gymUuid = crypto.randomUUID();
      
      console.log("Creating booking with data:", {
        user_id: user.id,
        gym_id: gymUuid,
        date_time: bookingData.date.toISOString(),
        status: "booked"
      });

      const { error } = await supabase
        .from("bookings")
        .insert({
          user_id: user.id,
          gym_id: gymUuid,
          date_time: bookingData.date.toISOString(),
          status: "booked"
        });

      if (error) {
        console.error("Booking creation error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Бронирование создано!",
        description: "Ваше посещение успешно забронировано. Проверьте раздел 'Расписание'.",
      });
      queryClient.invalidateQueries({ queryKey: ["user-bookings"] });
    },
    onError: (error) => {
      console.error("Error creating booking:", error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось создать бронирование. Попробуйте снова.",
      });
    },
  });

  return {
    createBookingMutation,
    handleBookingSubmit: (bookingData: any, gymId: string) => {
      createBookingMutation.mutate({
        date: bookingData.date,
        gymId,
      });
    }
  };
};
