
-- Создаем bucket для изображений залов
INSERT INTO storage.buckets (id, name, public)
VALUES ('gym-images', 'gym-images', true);

-- Политика для просмотра изображений (публичная)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'gym-images' );

-- Политика для загрузки изображений (только аутентифицированные пользователи)
CREATE POLICY "Authenticated users can upload gym images"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'gym-images' AND auth.role() = 'authenticated' );

-- Политика для удаления изображений (только аутентифицированные пользователи)
CREATE POLICY "Authenticated users can delete gym images"
ON storage.objects FOR DELETE
USING ( bucket_id = 'gym-images' AND auth.role() = 'authenticated' );
