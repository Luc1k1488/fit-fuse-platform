
export interface User {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  is_blocked?: boolean;
  created_at?: string;
}

export interface Gym {
  id: string;
  name: string;
  location: string;
  address: string;
  city: string;
  category: string;
  working_hours: string;
  features: string[];
  partner_id?: string;
  main_image?: string;
  images: string[];
  rating: number;
  review_count: number;
  created_at: string;
  description?: string;
  phone?: string;
}

export interface Partner {
  id: string;
  name: string;
  company_name: string;
  email: string;
  phone?: string;
  status: 'pending' | 'approved' | 'rejected';
  gym_count: number;
  created_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  gym_id?: string;
  class_id?: string;
  date_time: string;
  status: 'booked' | 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  plan_name: string;
  status: 'active' | 'cancelled' | 'expired';
  start_date: string;
  end_date: string;
  price: number;
  created_at: string;
}

export interface Class {
  id: string;
  gym_id?: string;
  title?: string;
  description?: string;
  instructor?: string;
  start_time?: string;
  end_time?: string;
  capacity?: number;
  booked_count?: number;
  category?: string;
  created_at?: string;
}

export interface ClassWithGym extends Class {
  gym?: Gym;
}

export interface Review {
  id: string;
  user_id?: string;
  gym_id?: string;
  rating?: number;
  comment?: string;
  created_at?: string;
}

export interface SupportTicket {
  id: string;
  user_id?: string;
  subject?: string;
  message?: string;
  status?: string;
  created_at?: string;
}

export interface UserStats {
  id: string;
  user_id?: string;
  total_bookings?: number;
  completed_workouts?: number;
  current_streak_days?: number;
  best_streak_days?: number;
  total_hours_trained?: number;
  favorite_gym_id?: string;
  last_workout_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration_days: number;
  features?: string[];
  is_active?: boolean;
  created_at?: string;
}

export interface GymClass extends Class {
  gym?: {
    id: string;
    name: string;
    location?: string;
  };
}
