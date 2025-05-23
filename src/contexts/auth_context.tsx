
import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types";

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

  // Mock function to simulate user login with valid UUIDs
  const login = async (email: string, password: string) => {
    try {
      if (email === "admin@example.com" && password === "admin123") {
        const mockUser: User = {
          id: "550e8400-e29b-41d4-a716-446655440001",
          email: "admin@example.com",
          phone: null,
          name: "Admin User",
          role: "admin",
          created_at: new Date().toISOString(),
          profile_image: null,
          subscription_id: null,
        };

        setUser(mockUser);
        setUserRole("admin");
        return { success: true };
      } else if (email === "partner@example.com" && password === "password") {
        const mockUser: User = {
          id: "550e8400-e29b-41d4-a716-446655440002",
          email: "partner@example.com",
          phone: null,
          name: "Partner User",
          role: "partner",
          created_at: new Date().toISOString(),
          profile_image: null,
          subscription_id: null,
        };

        setUser(mockUser);
        setUserRole("partner");
        return { success: true };
      } else if (email === "support@example.com" && password === "password") {
        const mockUser: User = {
          id: "550e8400-e29b-41d4-a716-446655440003",
          email: "support@example.com",
          phone: null,
          name: "Support Agent",
          role: "support",
          created_at: new Date().toISOString(),
          profile_image: null,
          subscription_id: null,
        };

        setUser(mockUser);
        setUserRole("support");
        return { success: true };
      } else if (email === "user@example.com" && password === "password") {
        // Используем тестового пользователя из базы данных
        const mockUser: User = {
          id: "550e8400-e29b-41d4-a716-446655440000",
          email: "test@example.com",
          phone: null,
          name: "Тестовый пользователь",
          role: "user",
          created_at: new Date().toISOString(),
          profile_image: null,
          subscription_id: null,
        };

        setUser(mockUser);
        setUserRole("user");
        return { success: true };
      }

      return { success: false, error: "Неверные учетные данные" };
    } catch (error) {
      return { success: false, error: "Ошибка аутентификации" };
    }
  };

  // Mock function for phone login (sending code)
  const phoneLogin = async (phone: string) => {
    try {
      // Demo login for phone
      if (phone === "+79001234567") {
        // In a real app, this would send an SMS code
        return { success: true };
      }
      return { success: false, error: "Invalid phone number" };
    } catch (error) {
      return { success: false, error: "Phone authentication failed" };
    }
  };

  // Mock function for phone verification (using received code)
  const login_with_phone = async (phone: string, code: string) => {
    try {
      // Demo verification for phone code
      if (phone === "+79001234567" && code === "123456") {
        const mockUser: User = {
          id: "550e8400-e29b-41d4-a716-446655440004",
          email: null,
          phone: "+79001234567",
          name: "Phone User",
          role: "user",
          created_at: new Date().toISOString(),
          profile_image: null,
          subscription_id: null,
        };

        setUser(mockUser);
        setUserRole("user");
        return { success: true };
      }
      return { success: false, error: "Invalid verification code" };
    } catch (error) {
      return { success: false, error: "Phone verification failed" };
    }
  };

  // Mock function for user registration
  const register = async (email: string, password: string, name: string) => {
    try {
      // Here we would normally call supabase.auth.signUp
      const mockUser: User = {
        id: "550e8400-e29b-41d4-a716-446655440005",
        email: email,
        phone: null,
        name: name,
        role: "user",
        created_at: new Date().toISOString(),
        profile_image: null,
        subscription_id: null,
      };
      
      setUser(mockUser);
      setUserRole("user");
      return { success: true };
    } catch (error) {
      return { success: false, error: "Registration failed" };
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setUserRole(null);
  };

  // Check for existing session on mount
  useEffect(() => {
    // Mock auto-login for demonstration
    // In production, this would check supabase session
    const checkSession = async () => {
      try {
        // Simulating session check - In production use supabase.auth.getSession()
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Session check error:", error);
        setLoading(false);
      }
    };

    checkSession();
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
