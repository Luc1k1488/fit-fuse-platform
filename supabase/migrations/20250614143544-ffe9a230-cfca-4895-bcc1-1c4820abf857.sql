
-- Удаляем существующие политики если они есть
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can create their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can update their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can delete their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Anyone can view reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can create their own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can update their own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can delete their own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Anyone can view gyms" ON public.gyms;
DROP POLICY IF EXISTS "Anyone can view classes" ON public.classes;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can view their own stats" ON public.user_stats;
DROP POLICY IF EXISTS "Users can update their own stats" ON public.user_stats;
DROP POLICY IF EXISTS "System can insert user stats" ON public.user_stats;
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can create their own subscriptions" ON public.subscriptions;

-- Добавляем foreign key constraints если их еще нет
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_bookings_user_id') THEN
    ALTER TABLE public.bookings ADD CONSTRAINT fk_bookings_user_id FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_bookings_gym_id') THEN
    ALTER TABLE public.bookings ADD CONSTRAINT fk_bookings_gym_id FOREIGN KEY (gym_id) REFERENCES public.gyms(id) ON DELETE CASCADE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_bookings_class_id') THEN
    ALTER TABLE public.bookings ADD CONSTRAINT fk_bookings_class_id FOREIGN KEY (class_id) REFERENCES public.classes(id) ON DELETE CASCADE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_reviews_user_id') THEN
    ALTER TABLE public.reviews ADD CONSTRAINT fk_reviews_user_id FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_reviews_gym_id') THEN
    ALTER TABLE public.reviews ADD CONSTRAINT fk_reviews_gym_id FOREIGN KEY (gym_id) REFERENCES public.gyms(id) ON DELETE CASCADE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_classes_gym_id') THEN
    ALTER TABLE public.classes ADD CONSTRAINT fk_classes_gym_id FOREIGN KEY (gym_id) REFERENCES public.gyms(id) ON DELETE CASCADE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_user_stats_user_id') THEN
    ALTER TABLE public.user_stats ADD CONSTRAINT fk_user_stats_user_id FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_subscriptions_user_id') THEN
    ALTER TABLE public.subscriptions ADD CONSTRAINT fk_subscriptions_user_id FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Включаем RLS на всех таблицах
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gyms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Создаем функцию для получения текущего пользователя
CREATE OR REPLACE FUNCTION public.current_user_id()
RETURNS UUID
LANGUAGE SQL
STABLE
AS $$
  SELECT auth.uid();
$$;

-- Создаем новые RLS политики
CREATE POLICY "Users can view their own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can view their own bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
  ON public.bookings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookings"
  ON public.bookings FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view reviews"
  ON public.reviews FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Users can create their own reviews"
  ON public.reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
  ON public.reviews FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
  ON public.reviews FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view gyms"
  ON public.gyms FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Anyone can view classes"
  ON public.classes FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Users can view their own stats"
  ON public.user_stats FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats"
  ON public.user_stats FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert user stats"
  ON public.user_stats FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own subscriptions"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own subscriptions"
  ON public.subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Функция для автоматического создания пользователя в public.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    'user'
  );
  RETURN new;
END;
$$;

-- Триггер для создания пользователя при регистрации
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Добавляем индексы для производительности
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_gym_id ON public.bookings(gym_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date_time ON public.bookings(date_time);
CREATE INDEX IF NOT EXISTS idx_reviews_gym_id ON public.reviews(gym_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_classes_gym_id ON public.classes(gym_id);
CREATE INDEX IF NOT EXISTS idx_gyms_city ON public.gyms(city);
CREATE INDEX IF NOT EXISTS idx_gyms_category ON public.gyms(category);

-- Обновляем триггер для автоматического обновления user_stats
CREATE OR REPLACE FUNCTION public.update_user_stats_trigger()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_TABLE_NAME = 'bookings' AND TG_OP = 'INSERT' THEN
    INSERT INTO public.user_stats (user_id, total_bookings, updated_at)
    VALUES (NEW.user_id, 1, now())
    ON CONFLICT (user_id) 
    DO UPDATE SET 
      total_bookings = user_stats.total_bookings + 1,
      updated_at = now();
  END IF;
  
  IF TG_TABLE_NAME = 'bookings' AND TG_OP = 'DELETE' THEN
    UPDATE public.user_stats 
    SET total_bookings = GREATEST(0, total_bookings - 1),
        updated_at = now()
    WHERE user_id = OLD.user_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Создаем триггеры для обновления статистики
DROP TRIGGER IF EXISTS trigger_update_user_stats_on_booking ON public.bookings;
CREATE TRIGGER trigger_update_user_stats_on_booking
  AFTER INSERT OR DELETE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_user_stats_trigger();

-- Создаем триггер для обновления рейтинга зала при добавлении отзыва
CREATE OR REPLACE FUNCTION public.update_gym_rating_trigger()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  avg_rating NUMERIC;
  review_count INTEGER;
BEGIN
  SELECT 
    COALESCE(AVG(rating), 0),
    COUNT(*)
  INTO avg_rating, review_count
  FROM public.reviews 
  WHERE gym_id = COALESCE(NEW.gym_id, OLD.gym_id);
  
  UPDATE public.gyms 
  SET 
    rating = ROUND(avg_rating, 1),
    review_count = review_count
  WHERE id = COALESCE(NEW.gym_id, OLD.gym_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS trigger_update_gym_rating ON public.reviews;
CREATE TRIGGER trigger_update_gym_rating
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_gym_rating_trigger();
