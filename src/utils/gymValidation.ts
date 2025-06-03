
import { z } from "zod";

export const gymValidationSchema = z.object({
  name: z.string()
    .min(2, "Название должно содержать минимум 2 символа")
    .max(100, "Название не должно превышать 100 символов"),
  
  location: z.string()
    .min(2, "Район должен содержать минимум 2 символа")
    .max(50, "Район не должен превышать 50 символов"),
  
  address: z.string()
    .min(5, "Адрес должен содержать минимум 5 символов")
    .max(200, "Адрес не должен превышать 200 символов"),
  
  city: z.string()
    .min(2, "Город должен содержать минимум 2 символа")
    .max(50, "Город не должен превышать 50 символов"),
  
  category: z.string()
    .min(1, "Категория обязательна для заполнения"),
  
  working_hours: z.string()
    .min(1, "Часы работы обязательны для заполнения")
    .max(100, "Часы работы не должны превышать 100 символов"),
  
  features: z.array(z.string())
    .min(1, "Добавьте хотя бы одну особенность")
    .max(20, "Максимум 20 особенностей"),
  
  partner_id: z.string()
    .min(1, "Выберите партнера"),
  
  main_image: z.string()
    .url("Некорректный URL изображения")
    .optional()
    .or(z.literal("")),
  
  images: z.array(z.string().url("Некорректный URL изображения"))
    .max(10, "Максимум 10 дополнительных изображений")
    .optional()
});

export type GymValidationData = z.infer<typeof gymValidationSchema>;

export const validateGymData = (data: unknown) => {
  return gymValidationSchema.safeParse(data);
};
