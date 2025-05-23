
import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types";
import type { Session } from "@supabase/supabase-js";

// Define the shape of the auth context
type AuthContextType = {
  user: User | null;
  user_role: "user" | "admin" | "partner" | "support" | null;
  loading: boolean;
  is_authenticated: boolean;
  is_loading: boolean;
  login: (email: string, password: string) => Promise<{
    success: boolean;
    error?: string;
  }>;
  phoneLogin: (phone: string) => Promise<{
    success: boolean;
    error?: string;
  }>;
  login_with_phone: (phone: string, code: string) => Promise<{
    success: boolean;
    error?: string;
  }>;  
  register: (email: string, password: string, name: string) => Promise<{
    success: boolean;
    error?: string;
  }>;
  logout: () => void;
};

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [user_role, setUserRole] = useState<"user" | "admin" | "partner" | "support" | null>(null);
  const [loading, setLoading] = useState(true);

  // Real Supabase login function
  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Fetch user profile from our users table
        const { data: userProfile, error: profileError } = await supabase
          .from("users")
          .select("*")
          .eq("id", data.user.id)
          .single();

        if (profileError) {
          console.error("Error fetching user profile:", profileError);
          return { success: false, error: "Ошибка загрузки профиля пользователя" };
        }

        setUser(userProfile);
        setUserRole(userProfile.role as "user" | "admin" | "partner" | "support");
        return { success: true };
      }

      return { success: false, error: "Ошибка аутентификации" };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Ошибка аутентификации" };
    }
  };

  // Phone login (sending code)
  const phoneLogin = async (phone: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: "Ошибка отправки SMS" };
    }
  };

  // Phone verification (using received code)
  const login_with_phone = async (phone: string, code: string) => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token: code,
        type: 'sms'
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Fetch user profile from our users table
        const { data: userProfile, error: profileError } = await supabase
          .from("users")
          .select("*")
          .eq("id", data.user.id)
          .single();

        if (profileError) {
          console.error("Error fetching user profile:", profileError);
          return { success: false, error: "Ошибка загрузки профиля пользователя" };
        }

        setUser(userProfile);
        setUserRole(userProfile.role as "user" | "admin" | "partner" | "support");
        return { success: true };
      }

      return { success: false, error: "Ошибка верификации" };
    } catch (error) {
      return { success: false, error: "Ошибка верификации кода" };
    }
  };

  // User registration
  const register = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        return { success: true };
      }

      return { success: false, error: "Ошибка регистрации" };
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, error: "Ошибка регистрации" };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setUserRole(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Check for existing session on mount and listen to auth changes
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session: Session | null) => {
        console.log("Auth state changed:", event, session);
        
        if (session?.user) {
          // Fetch user profile from our users table
          const { data: userProfile, error: profileError } = await supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (profileError) {
            console.error("Error fetching user profile:", profileError);
            setUser(null);
            setUserRole(null);
          } else {
            setUser(userProfile);
            setUserRole(userProfile.role as "user" | "admin" | "partner" | "support");
          }
        } else {
          setUser(null);
          setUserRole(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      // The onAuthStateChange will handle setting the user
      if (!session) {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Context value
  const value = {
    user,
    user_role,
    loading,
    is_loading: loading,
    is_authenticated: !!user,
    login,
    phoneLogin,
    login_with_phone,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
