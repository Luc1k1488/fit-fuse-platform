
import { supabase } from "@/integrations/supabase/client";

export const createTestUser = async () => {
  try {
    // Создаем тестового пользователя, если его еще нет
    const { error } = await supabase
      .from("users")
      .upsert({
        id: "550e8400-e29b-41d4-a716-446655440000",
        email: "test@example.com",
        name: "Тестовый пользователь",
        role: "user"
      }, {
        onConflict: "id"
      });

    if (error) {
      console.error("Ошибка создания тестового пользователя:", error);
    } else {
      console.log("Тестовый пользователь создан или уже существует");
    }
  } catch (error) {
    console.error("Ошибка:", error);
  }
};
