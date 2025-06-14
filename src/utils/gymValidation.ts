
import { z } from "zod";

const gymSchema = z.object({
  name: z.string().min(1, "Название обязательно"),
  location: z.string().min(1, "Район обязателен"),
  address: z.string().min(1, "Адрес обязателен"),
  city: z.string().min(1, "Город обязателен"),
  category: z.string().min(1, "Категория обязательна"),
  working_hours: z.string().min(1, "Часы работы обязательны"),
  features: z.array(z.string()),
  partner_id: z.string().optional(),
  main_image: z.string().optional(),
  images: z.array(z.string()),
});

export const validateGymData = (data: any) => {
  return gymSchema.safeParse(data);
};
