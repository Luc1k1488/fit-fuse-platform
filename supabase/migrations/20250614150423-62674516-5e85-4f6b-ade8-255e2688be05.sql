
-- Создаем таблицу для чатов поддержки
CREATE TABLE public.support_chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  support_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'closed')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Создаем таблицу для сообщений чата
CREATE TABLE public.support_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID REFERENCES public.support_chats(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  is_from_support BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Включаем RLS для чатов поддержки
ALTER TABLE public.support_chats ENABLE ROW LEVEL SECURITY;

-- Пользователи могут видеть только свои чаты
CREATE POLICY "Users can view their own chats" 
  ON public.support_chats 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Сотрудники поддержки могут видеть все чаты
CREATE POLICY "Support can view all chats" 
  ON public.support_chats 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'support')
    )
  );

-- Пользователи могут создавать свои чаты
CREATE POLICY "Users can create their own chats" 
  ON public.support_chats 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Сотрудники поддержки могут обновлять чаты
CREATE POLICY "Support can update chats" 
  ON public.support_chats 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'support')
    )
  );

-- Включаем RLS для сообщений
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;

-- Пользователи могут видеть сообщения своих чатов
CREATE POLICY "Users can view messages from their chats" 
  ON public.support_messages 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.support_chats 
      WHERE id = chat_id 
      AND user_id = auth.uid()
    )
  );

-- Сотрудники поддержки могут видеть все сообщения
CREATE POLICY "Support can view all messages" 
  ON public.support_messages 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'support')
    )
  );

-- Пользователи могут отправлять сообщения в свои чаты
CREATE POLICY "Users can send messages to their chats" 
  ON public.support_messages 
  FOR INSERT 
  WITH CHECK (
    auth.uid() = sender_id 
    AND EXISTS (
      SELECT 1 FROM public.support_chats 
      WHERE id = chat_id 
      AND user_id = auth.uid()
    )
  );

-- Сотрудники поддержки могут отправлять сообщения в любые чаты
CREATE POLICY "Support can send messages to any chat" 
  ON public.support_messages 
  FOR INSERT 
  WITH CHECK (
    auth.uid() = sender_id 
    AND EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'support')
    )
  );

-- Включаем realtime для обновлений в реальном времени
ALTER TABLE public.support_chats REPLICA IDENTITY FULL;
ALTER TABLE public.support_messages REPLICA IDENTITY FULL;

-- Добавляем таблицы в публикацию realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.support_chats;
ALTER PUBLICATION supabase_realtime ADD TABLE public.support_messages;
