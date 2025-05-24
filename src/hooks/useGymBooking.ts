
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
      gymName?: string;
    }) => {
      if (!user?.id) {
        throw new Error("Необходимо войти в систему");
      }

      // Generate a consistent UUID for the gym based on the gymId
      const generateGymUUID = (gymId: string): string => {
        // Create a simple hash function to generate consistent UUIDs
        let hash = 0;
        for (let i = 0; i < gymId.length; i++) {
          const char = gymId.charCodeAt(i);
          hash = ((hash << 5) - hash) + char;
          hash = hash & hash; // Convert to 32bit integer
        }
        
        // Convert to a UUID-like format
        const hashStr = Math.abs(hash).toString(16);
        const paddedHash = hashStr.padStart(8, '0');
        return `${paddedHash.substring(0, 8)}-${paddedHash.substring(0, 4)}-4${paddedHash.substring(1, 4)}-8${paddedHash.substring(1, 4)}-${paddedHash}${paddedHash}`.substring(0, 36);
      };

      const gymUUID = generateGymUUID(bookingData.gymId);

      // First, ensure the gym exists in the database
      const { data: existingGym } = await supabase
        .from("gyms")
        .select("id")
        .eq("id", gymUUID)
        .single();

      if (!existingGym) {
        // Create the gym if it doesn't exist
        const { error: gymError } = await supabase
          .from("gyms")
          .insert({
            id: gymUUID,
            name: bookingData.gymName || "Спортзал",
            location: "Центр",
            city: "Москва",
            address: "ул. Тверская, 18, Москва",
            category: "fitness"
          });

        if (gymError) {
          console.error("Error creating gym:", gymError);
          throw gymError;
        }
      }

      console.log("Creating booking with data:", {
        user_id: user.id,
        gym_id: gymUUID,
        date_time: bookingData.date.toISOString(),
        status: "booked"
      });

      const { error } = await supabase
        .from("bookings")
        .insert({
          user_id: user.id,
          gym_id: gymUUID,
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
    handleBookingSubmit: (bookingData: any, gymId: string, gymName?: string) => {
      createBookingMutation.mutate({
        date: bookingData.date,
        gymId,
        gymName,
      });
    }
  };
};
