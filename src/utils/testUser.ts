
import { supabase } from "@/integrations/supabase/client";

export const createTestUser = async () => {
  try {
    // Check if test user already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("id", "550e8400-e29b-41d4-a716-446655440000")
      .single();

    if (existingUser) {
      console.log("Test user already exists");
      return;
    }

    // Create test user if it doesn't exist
    const { error } = await supabase
      .from("users")
      .insert({
        id: "550e8400-e29b-41d4-a716-446655440000",
        email: "test@example.com",
        name: "Тестовый пользователь",
        role: "user",
        phone: null,
        profile_image: null,
        subscription_id: null,
      });

    if (error) {
      console.error("Error creating test user:", error);
    } else {
      console.log("Test user created successfully");
    }
  } catch (error) {
    console.error("Error in createTestUser:", error);
  }
};
