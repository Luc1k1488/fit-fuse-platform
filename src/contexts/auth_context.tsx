
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

// Helper function to validate role
const validateRole = (role: string | null | undefined): "user" | "admin" | "partner" | "support" => {
  if (role === "admin" || role === "partner" || role === "support") {
    return role;
  }
  return "user"; // Default fallback
};

// Auth provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [user_role, setUserRole] = useState<"user" | "admin" | "partner" | "support" | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch or create user profile
  const fetchOrCreateUserProfile = async (authUser: any) => {
    try {
      console.log("Fetching user profile for:", authUser.id);
      
      // First try to get existing user
      let { data: userProfile, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("id", authUser.id)
        .single();

      // If user doesn't exist, create them
      if (profileError && profileError.code === 'PGRST116') {
        console.log("User not found, creating new user profile");
        
        const { data: newUser, error: createError } = await supabase
          .from("users")
          .insert({
            id: authUser.id,
            email: authUser.email,
            name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Пользователь',
            role: 'user'
          })
          .select()
          .single();

        if (createError) {
          console.error("Error creating user profile:", createError);
          return null;
        }
        
        userProfile = newUser;
      } else if (profileError) {
        console.error("Error fetching user profile:", profileError);
        return null;
      }

      return userProfile;
    } catch (error) {
      console.error("Error in fetchOrCreateUserProfile:", error);
      return null;
    }
  };

  // Real Supabase login function
  const login = async (email: string, password: string) => {
    try {
      console.log("Attempting login for:", email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error);
        return { success: false, error: error.message };
      }

      if (data.user) {
        console.log("Auth login successful, fetching profile...");
        
        const userProfile = await fetchOrCreateUserProfile(data.user);
        
        if (!userProfile) {
          return { success: false, error: "Ошибка загрузки профиля пользователя" };
        }

        const userWithValidatedRole: User = {
          ...userProfile,
          role: validateRole(userProfile.role)
        };

        setUser(userWithValidatedRole);
        setUserRole(validateRole(userProfile.role));
        console.log("Login successful, user role:", userProfile.role);
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
        const userProfile = await fetchOrCreateUserProfile(data.user);
        
        if (!userProfile) {
          return { success: false, error: "Ошибка загрузки профиля пользователя" };
        }

        const userWithValidatedRole: User = {
          ...userProfile,
          role: validateRole(userProfile.role)
        };

        setUser(userWithValidatedRole);
        setUserRole(validateRole(userProfile.role));
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
      console.log("Attempting registration for:", email);
      
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
        console.error("Registration error:", error);
        return { success: false, error: error.message };
      }

      if (data.user) {
        console.log("Registration successful");
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
    console.log("Setting up auth state listener...");
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session: Session | null) => {
        console.log("Auth state changed:", event, session?.user?.id);
        
        if (session?.user) {
          const userProfile = await fetchOrCreateUserProfile(session.user);
          
          if (userProfile) {
            const userWithValidatedRole: User = {
              ...userProfile,
              role: validateRole(userProfile.role)
            };

            setUser(userWithValidatedRole);
            setUserRole(validateRole(userProfile.role));
            console.log("User authenticated with role:", userProfile.role);
          } else {
            setUser(null);
            setUserRole(null);
          }
        } else {
          console.log("No user session");
          setUser(null);
          setUserRole(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Checking existing session:", !!session);
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
