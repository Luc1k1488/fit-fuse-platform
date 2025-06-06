
import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  is_loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error: string | null }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error: string | null }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ success: boolean; error: string | null }>;
}

interface Profile {
  name: string;
  phone?: string;
  profile_image?: string;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  is_loading: true,
  login: async () => ({ success: false, error: "Not implemented" }),
  register: async () => ({ success: false, error: "Not implemented" }),
  logout: async () => {},
  updateProfile: async () => ({ success: false, error: "Not implemented" })
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [is_loading, setIsLoading] = useState(true);

  useEffect(() => {
    console.info("Setting up auth state listener...");
    
    // Устанавливаем слушатель событий авторизации СНАЧАЛА
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.info("Auth state changed:", event, {
          _type: typeof currentSession,
          value: typeof currentSession === 'undefined' ? "undefined" : "defined"
        });
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsLoading(false);
        
        if (event === "SIGNED_IN" && currentSession) {
          console.log("User signed in:", currentSession.user);
          // Отложенная загрузка дополнительных данных пользователя
          setTimeout(() => {
            // Можно здесь загружать дополнительные данные о пользователе
          }, 0);
        } else if (event === "SIGNED_OUT") {
          console.log("User signed out");
        }
      }
    );

    // ЗАТЕМ проверяем существующую сессию
    const checkSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.info("Checking existing session:", !!currentSession);
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error("Login error:", error.message);
        return { success: false, error: error.message };
      }
      
      return { success: true, error: null };
    } catch (error: any) {
      console.error("Login exception:", error.message);
      return { success: false, error: error.message };
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: "user"
          },
          emailRedirectTo: `${window.location.origin}/login`
        }
      });
      
      if (error) {
        console.error("Registration error:", error.message);
        return { success: false, error: error.message };
      }
      
      // Создаем запись в пользовательской таблице
      if (data.user) {
        const { error: profileError } = await supabase.from("users").insert({
          id: data.user.id,
          name,
          email,
          role: "user"
        });
        
        if (profileError) {
          console.error("Error creating user profile:", profileError);
          // Возвращаем успех, так как учетная запись все равно создана
          return { success: true, error: "Аккаунт создан, но профиль не настроен" };
        }
      }
      
      return { success: true, error: null };
    } catch (error: any) {
      console.error("Registration exception:", error.message);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      if (!user) {
        return { success: false, error: "Пользователь не авторизован" };
      }
      
      const { error } = await supabase
        .from("users")
        .update(updates)
        .eq("id", user.id);
      
      if (error) {
        console.error("Profile update error:", error);
        return { success: false, error: error.message };
      }
      
      return { success: true, error: null };
    } catch (error: any) {
      console.error("Profile update exception:", error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    session,
    is_loading,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
