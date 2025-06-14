
-- Добавляем поля для блокировки пользователей в таблицу users
ALTER TABLE public.users 
ADD COLUMN is_blocked BOOLEAN DEFAULT FALSE,
ADD COLUMN blocked_at TIMESTAMP WITH TIME ZONE NULL,
ADD COLUMN blocked_reason TEXT NULL;
