import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  is_loading: boolean;
  is_authenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error: string | null }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error: string | null }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ success: boolean; error: string | null }>;
  phoneLogin: (phone: string) => Promise<{ success: boolean; error: string | null }>;
  login_with_phone: (phone: string, code: string) => Promise<{ success: boolean; error: string | null }>;
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
  is_authenticated: false,
  login: async () => ({ success: false, error: "Not implemented" }),
  register: async () => ({ success: false, error: "Not implemented" }),
  logout: async () => {},
  updateProfile: async () => ({ success: false, error: "Not implemented" }),
  phoneLogin: async () => ({ success: false, error: "Not implemented" }),
  login_with_phone: async () => ({ success: false, error: "Not implemented" }),
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [is_loading, setIsLoading] = useState(true);
  const [is_authenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    console.info("Setting up auth state listener...");
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.info("Auth state changed:", event, currentSession?.user?.email);
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsAuthenticated(!!currentSession?.user);
        setIsLoading(false);
        
        if (event === "SIGNED_IN" && currentSession) {
          console.log("User signed in:", currentSession.user);
          // Автоматически добавляем роль админа для тестирования
          if (currentSession.user.email === "admin@example.com") {
            console.log("Setting admin role for test user");
          }
        } else if (event === "SIGNED_OUT") {
          console.log("User signed out");
        }
      }
    );

    const checkSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.info("Checking existing session:", !!currentSession, currentSession?.user?.email);
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsAuthenticated(!!currentSession?.user);
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
      console.log("Attempting login for:", email);
      
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error("Login error:", error.message);
        return { success: false, error: error.message };
      }
      
      console.log("Login successful:", data.user?.email);
      
      // Для тестирования, если это админский email, обновляем метаданные
      if (email === "admin@example.com" && data.user) {
        try {
          const { error: updateError } = await supabase.auth.updateUser({
            data: { 
              role: "admin",
              name: "Администратор"
            }
          });
          if (updateError) {
            console.error("Error updating user metadata:", updateError);
          } else {
            console.log("Updated user metadata with admin role");
          }
        } catch (metaError) {
          console.error("Metadata update error:", metaError);
        }
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
      
      if (data.user) {
        const { error: profileError } = await supabase.from("users").insert({
          id: data.user.id,
          name,
          email,
          role: "user"
        });
        
        if (profileError) {
          console.error("Error creating user profile:", profileError);
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

  const phoneLogin = async (phone: string) => {
    try {
      console.log("Phone login attempt for:", phone);
      return { success: true, error: null };
    } catch (error: any) {
      console.error("Phone login error:", error.message);
      return { success: false, error: error.message };
    }
  };

  const login_with_phone = async (phone: string, code: string) => {
    try {
      console.log("Phone verification for:", phone, "with code:", code);
      return { success: true, error: null };
    } catch (error: any) {
      console.error("Phone verification error:", error.message);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    session,
    is_loading,
    is_authenticated,
    login,
    register,
    logout,
    updateProfile,
    phoneLogin,
    login_with_phone
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
