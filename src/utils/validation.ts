
import { z } from "zod";

// Схема валидации для зала
export const gymValidationSchema = z.object({
  name: z.string().min(2, "Название должно содержать минимум 2 символа"),
  address: z.string().min(5, "Адрес должен содержать минимум 5 символов"),
  city: z.string().min(2, "Город должен содержать минимум 2 символа"),
  category: z.string().min(1, "Выберите категорию"),
  working_hours: z.string().min(5, "Укажите рабочие часы"),
  features: z.array(z.string()).min(1, "Выберите хотя бы одну особенность"),
});

// Схема валидации для занятия
export const classValidationSchema = z.object({
  title: z.string().min(2, "Название должно содержать минимум 2 символа"),
  description: z.string().optional(),
  instructor: z.string().min(2, "Имя инструктора должно содержать минимум 2 символа"),
  capacity: z.number().min(1, "Вместимость должна быть больше 0").max(100, "Максимальная вместимость 100 человек"),
  category: z.string().min(1, "Выберите категорию"),
  start_time: z.date(),
  end_time: z.date(),
  gym_id: z.string().uuid("Выберите зал"),
}).refine((data) => data.end_time > data.start_time, {
  message: "Время окончания должно быть позже времени начала",
  path: ["end_time"],
});

// Схема валидации для бронирования
export const bookingValidationSchema = z.object({
  class_id: z.string().uuid("Выберите занятие"),
  gym_id: z.string().uuid("Выберите зал"),
  date_time: z.date(),
  user_id: z.string().uuid(),
});

// Схема валидации для пользователя
export const userValidationSchema = z.object({
  name: z.string().min(2, "Имя должно содержать минимум 2 символа"),
  email: z.string().email("Неверный формат email"),
  phone: z.string().optional(),
  role: z.enum(["user", "admin", "partner", "support"]),
});

// Схема валидации для отзыва
export const reviewValidationSchema = z.object({
  rating: z.number().min(1, "Минимальная оценка 1").max(5, "Максимальная оценка 5"),
  comment: z.string().min(10, "Комментарий должен содержать минимум 10 символов"),
  gym_id: z.string().uuid("Выберите зал"),
  user_id: z.string().uuid(),
});

export type GymFormData = z.infer<typeof gymValidationSchema>;
export type ClassFormData = z.infer<typeof classValidationSchema>;
export type BookingFormData = z.infer<typeof bookingValidationSchema>;
export type UserFormData = z.infer<typeof userValidationSchema>;
export type ReviewFormData = z.infer<typeof reviewValidationSchema>;
