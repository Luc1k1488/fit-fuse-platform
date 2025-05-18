
import React, { createContext, useState, useContext, useEffect } from "react";
import { User } from "@/types";

interface AuthContextType {
  user: User | null;
  is_loading: boolean;
  is_authenticated: boolean;
  user_role: string | null;
  login: (email: string, password: string) => Promise<void>;
  login_with_phone: (phone: string, code: string) => Promise<void>;
  logout: () => void;
  check_admin_access: () => boolean;
  check_partner_access: () => boolean;
  check_support_access: () => boolean;
  check_user_access: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, set_user] = useState<User | null>(null);
  const [is_loading, set_is_loading] = useState(true);

  useEffect(() => {
    // Here we would check for existing sessions with Supabase
    // For now, just simulating a check
    const check_existing_session = async () => {
      try {
        // This would be replaced with actual Supabase auth check
        const stored_user = localStorage.getItem("fitness_user");
        if (stored_user) {
          set_user(JSON.parse(stored_user));
        }
      } catch (error) {
        console.error("Session check error:", error);
      } finally {
        set_is_loading(false);
      }
    };

    check_existing_session();
  }, []);

  const login = async (email: string, password: string) => {
    // This would connect to Supabase auth
    // For demonstration, using localStorage
    try {
      set_is_loading(true);
      
      // Simulate login delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock admin user for demo
      const admin_user: User = {
        id: "admin-123",
        email: email,
        name: "Admin User",
        role: "admin",
        created_at: new Date().toISOString(),
        profile_image: "/placeholder.svg",
      };
      
      set_user(admin_user);
      localStorage.setItem("fitness_user", JSON.stringify(admin_user));
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      set_is_loading(false);
    }
  };

  const login_with_phone = async (phone: string, code: string) => {
    // This would connect to Supabase auth with OTP
    try {
      set_is_loading(true);
      
      // Simulate login delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock client user for demo
      const client_user: User = {
        id: "client-123",
        phone: phone,
        name: "Client User",
        role: "user",
        created_at: new Date().toISOString(),
        profile_image: "/placeholder.svg",
      };
      
      set_user(client_user);
      localStorage.setItem("fitness_user", JSON.stringify(client_user));
    } catch (error) {
      console.error("Phone login error:", error);
      throw error;
    } finally {
      set_is_loading(false);
    }
  };

  const logout = () => {
    // This would connect to Supabase auth for logout
    set_user(null);
    localStorage.removeItem("fitness_user");
  };

  const check_admin_access = () => {
    return user?.role === "admin";
  };

  const check_partner_access = () => {
    return user?.role === "partner" || user?.role === "admin";
  };

  const check_support_access = () => {
    return user?.role === "support" || user?.role === "admin";
  };

  const check_user_access = () => {
    return !!user;
  };

  const value = {
    user,
    is_loading,
    is_authenticated: !!user,
    user_role: user?.role || null,
    login,
    login_with_phone,
    logout,
    check_admin_access,
    check_partner_access,
    check_support_access,
    check_user_access,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
