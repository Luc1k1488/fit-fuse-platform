
-- Создаем таблицу для истории изменений ролей пользователей
CREATE TABLE public.user_role_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  old_role TEXT,
  new_role TEXT NOT NULL,
  changed_by UUID NOT NULL,
  changed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reason TEXT
);

-- Включаем RLS для таблицы истории ролей
ALTER TABLE public.user_role_history ENABLE ROW LEVEL SECURITY;

-- Политика: только администраторы могут просматривать историю ролей
CREATE POLICY "Only admins can view role history" 
  ON public.user_role_history 
  FOR SELECT 
  USING (is_admin());

-- Политика: только администраторы могут добавлять записи в историю
CREATE POLICY "Only admins can insert role history" 
  ON public.user_role_history 
  FOR INSERT 
  WITH CHECK (is_admin());

-- Создаем функцию-триггер для автоматического логирования изменений ролей
CREATE OR REPLACE FUNCTION public.log_role_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Записываем изменение роли в историю
  IF OLD.role IS DISTINCT FROM NEW.role THEN
    INSERT INTO public.user_role_history (
      user_id,
      old_role,
      new_role,
      changed_by,
      reason
    ) VALUES (
      NEW.id,
      OLD.role,
      NEW.role,
      auth.uid(),
      'Role changed by admin'
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Создаем триггер для автоматического логирования изменений ролей
CREATE TRIGGER role_change_logger
  AFTER UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.log_role_change();
