
export interface User {
  id: string;
  email?: string;
  name?: string;
  phone?: string;
  profile_image?: string;
  role: "user" | "admin" | "partner" | "support";
  created_at: string;
  subscription_id?: string;
  is_blocked?: boolean;
  blocked_at?: string | null;
  blocked_reason?: string | null;
}

export interface Gym {
  id: string;
  name: string;
  description?: string;
  location: string;
  address: string;
  city: string;
  phone?: string;
  working_hours?: string;
  category: string;
  features?: string[];
  main_image?: string;
  images?: string[];
  rating: number;
  review_count: number;
  owner_id?: string;
  partner_id?: string;
  created_at: string;
}

export interface GymClass {
  id: string;
  title: string;
  description?: string;
  instructor: string;
  start_time: string;
  end_time: string;
  capacity: number;
  booked_count: number;
  category: string;
  gym_id: string;
  created_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  gym_id?: string;
  class_id?: string;
  date_time: string;
  status: "booked" | "completed" | "cancelled";
  created_at: string;
}

export interface Review {
  id: string;
  user_id: string;
  gym_id: string;
  rating: number;
  comment?: string;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_id?: string;
  plan_name?: string;
  status: "active" | "inactive" | "cancelled" | "expired";
  start_date?: string;
  end_date?: string;
  price?: number;
  subscription_type?: string;
  created_at: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration_days: number;
  features?: string[];
  is_active: boolean;
  created_at: string;
}

export interface Partner {
  id: string;
  user_id?: string;
  name: string;
  email: string;
  company_name?: string;
  phone?: string;
  status: "pending" | "approved" | "rejected";
  gym_count: number;
  created_at: string;
  updated_at: string;
}

export interface SupportTicket {
  id: string;
  user_id: string;
  subject?: string;
  message?: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  assigned_support_id?: string;
  created_at: string;
  resolved_at?: string;
}

export interface PromoCode {
  id: string;
  code: string;
  discount_percentage?: number;
  discount_amount?: number;
  valid_from?: string;
  valid_until?: string;
  max_uses?: number;
  current_uses: number;
  active: boolean;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  ticket_id: string;
  sender_id: string;
  message?: string;
  sent_at: string;
}

export interface UserStats {
  id: string;
  user_id: string;
  total_bookings: number;
  completed_workouts: number;
  total_hours_trained: number;
  current_streak_days: number;
  best_streak_days: number;
  last_workout_date?: string;
  favorite_gym_id?: string;
  created_at: string;
  updated_at: string;
}

export interface GiftSubscription {
  id: string;
  giver_user_id: string;
  receiver_user_id?: string;
  receiver_email?: string;
  subscription_id?: string;
  gift_code?: string;
  message?: string;
  is_activated: boolean;
  activated_at?: string;
  expires_at?: string;
  created_at: string;
}

export interface PromoCodeUsage {
  id: string;
  promo_code_id: string;
  user_id: string;
  subscription_id?: string;
  used_at: string;
}
