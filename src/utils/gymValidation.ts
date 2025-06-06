
import { z } from 'zod';

export const gymValidationSchema = z.object({
  name: z.string()
    .min(2, 'Название должно содержать минимум 2 символа')
    .max(100, 'Название не должно превышать 100 символов'),
  location: z.string()
    .min(2, 'Район должен содержать минимум 2 символа')
    .max(100, 'Район не должен превышать 100 символов'),
  address: z.string()
    .min(5, 'Адрес должен содержать минимум 5 символов')
    .max(200, 'Адрес не должен превышать 200 символов'),
  city: z.string()
    .min(2, 'Город должен содержать минимум 2 символа')
    .max(100, 'Город не должен превышать 100 символов'),
  category: z.string()
    .min(1, 'Необходимо выбрать категорию'),
  working_hours: z.string()
    .min(3, 'Часы работы должны быть указаны')
    .max(100, 'Часы работы не должны превышать 100 символов'),
  features: z.array(z.string()).optional(),
  partner_id: z.string().optional(),
  main_image: z.string().optional(),
  images: z.array(z.string()).optional(),
});

export const validateGymData = (data: unknown) => {
  return gymValidationSchema.safeParse(data);
};
