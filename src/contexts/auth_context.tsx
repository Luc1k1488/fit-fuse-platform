
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
      async (event, currentSession) => {
        console.info("Auth state changed:", event, currentSession?.user?.email);
        
        try {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          setIsAuthenticated(!!currentSession?.user);
          setIsLoading(false);
          
          if (event === "SIGNED_IN" && currentSession?.user) {
            console.log("User signed in:", currentSession.user.email);
            
            // Проверяем роль пользователя в базе данных
            try {
              const { data: userData, error } = await supabase
                .from("users")
                .select("role")
                .eq("id", currentSession.user.id)
                .maybeSingle();
              
              if (error) {
                console.error("Error fetching user role:", error);
              } else if (userData) {
                console.log("User role from database:", userData.role);
                
                // Обновляем метаданные пользователя с ролью из базы
                try {
                  const { error: updateError } = await supabase.auth.updateUser({
                    data: { 
                      role: userData.role,
                      name: currentSession.user.user_metadata?.name || currentSession.user.email?.split('@')[0]
                    }
                  });
                  
                  if (updateError) {
                    console.error("Error updating user metadata:", updateError);
                  } else {
                    console.log("Updated user metadata with role:", userData.role);
                  }
                } catch (metaError) {
                  console.error("Error in metadata update:", metaError);
                }
              } else {
                // Пользователь не найден в таблице users, создаем запись
                console.log("User not found in users table, creating...");
                try {
                  const { error: insertError } = await supabase
                    .from("users")
                    .insert({
                      id: currentSession.user.id,
                      email: currentSession.user.email,
                      name: currentSession.user.user_metadata?.name || currentSession.user.email?.split('@')[0],
                      role: "user" // По умолчанию обычный пользователь
                    });
                  
                  if (insertError) {
                    console.error("Error creating user record:", insertError);
                  } else {
                    console.log("Created user record with role: user");
                  }
                } catch (insertError) {
                  console.error("Error in user creation:", insertError);
                }
              }
            } catch (error) {
              console.error("Error in user role check:", error);
            }
          } else if (event === "SIGNED_OUT") {
            console.log("User signed out");
          }
        } catch (error) {
          console.error("Error in auth state change handler:", error);
          setIsLoading(false);
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
        try {
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
        } catch (profileError) {
          console.error("Error in profile creation:", profileError);
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
