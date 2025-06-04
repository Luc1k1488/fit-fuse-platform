
import { z } from 'zod';

export const gymValidationSchema = z.object({
  name: z.string()
    .min(2, 'Название должно содержать минимум 2 символа')
    .max(100, 'Название не должно превышать 100 символов'),
  location: z.string()
    .min(5, 'Адрес должен содержать минимум 5 символов')
    .max(200, 'Адрес не должен превышать 200 символов'),
  description: z.string()
    .max(1000, 'Описание не должно превышать 1000 символов')
    .optional(),
  capacity: z.number()
    .min(1, 'Вместимость должна быть больше 0')
    .max(10000, 'Вместимость не может превышать 10000'),
  equipment: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional(),
  contact_phone: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Некорректный номер телефона')
    .optional(),
  contact_email: z.string()
    .email('Некорректный email')
    .optional(),
  opening_hours: z.record(z.string()).optional(),
  price_per_hour: z.number()
    .min(0, 'Цена не может быть отрицательной')
    .max(100000, 'Цена слишком высокая')
    .optional()
});

export const reviewValidationSchema = z.object({
  rating: z.number()
    .min(1, 'Рейтинг должен быть от 1 до 5')
    .max(5, 'Рейтинг должен быть от 1 до 5'),
  comment: z.string()
    .min(10, 'Комментарий должен содержать минимум 10 символов')
    .max(1000, 'Комментарий не должен превышать 1000 символов')
});

export const bookingValidationSchema = z.object({
  gym_id: z.string().uuid('Некорректный ID зала'),
  user_id: z.string().uuid('Некорректный ID пользователя'),
  date: z.string().refine(
    (date) => !isNaN(Date.parse(date)),
    'Некорректная дата'
  ),
  start_time: z.string().regex(
    /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
    'Некорректное время начала'
  ),
  end_time: z.string().regex(
    /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
    'Некорректное время окончания'
  ),
  total_price: z.number()
    .min(0, 'Цена не может быть отрицательной')
    .max(1000000, 'Цена слишком высокая')
});

export const validateGymData = (data: unknown) => {
  return gymValidationSchema.parse(data);
};

export const validateReviewData = (data: unknown) => {
  return reviewValidationSchema.parse(data);
};

export const validateBookingData = (data: unknown) => {
  return bookingValidationSchema.parse(data);
};
