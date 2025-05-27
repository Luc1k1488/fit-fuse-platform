// Common types for the fitness platform
// All fields use snake_case as required

export type User = {
  id: string;
  email: string | null;
  phone: string | null;
  name: string | null;
  role: "user" | "admin" | "partner" | "support";
  created_at: string | null;
  profile_image: string | null;
  subscription_id: string | null;
  is_blocked?: boolean | null;
  blocked_at?: string | null;
  blocked_reason?: string | null;
};

export type Partner = {
  id: string;
  user_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  company_name: string | null;
  status: "active" | "inactive" | "pending";
  gym_count: number | null;
  created_at: string;
  updated_at: string;
};

export type Gym = {
  id: string;
  name: string | null;
  location: string | null;
  owner_id: string | null;
  partner_id: string | null; // Новое поле для связи с партнером
  main_image: string | null;
  working_hours: string | null;
  review_count: number | null;
  rating: number | null;
  category: string | null;
  features: string[] | null;
  city: string | null;
  address: string | null;
  images: string[] | null;
};

export type Class = {
  id: string;
  gym_id: string | null;
  title: string | null;
  description: string | null;
  instructor: string | null;
  start_time: string | null;
  end_time: string | null;
  category: string | null;
  capacity: number | null;
  booked_count: number | null;
};

export type Booking = {
  id: string;
  user_id: string | null;
  class_id: string | null;
  gym_id: string | null;
  status: "pending" | "confirmed" | "cancelled";
  date_time: string | null;
  created_at: string | null;
};

export type Subscription = {
  id: string;
  user_id: string | null;
  status: "active" | "inactive" | "pending" | "expired";
  start_date: string | null;
  end_date: string | null;
  plan_name: string | null;
  price: number | null;
  subscription_type: "regular" | "gift" | "promo";
  plan_id: string | null;
  is_frozen?: boolean | null;
  frozen_at?: string | null;
  frozen_until?: string | null;
  freeze_reason?: string | null;
};

export type SubscriptionPlan = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration_days: number;
  features: string[] | null;
  is_active: boolean | null;
  created_at: string | null;
};

export type PromoCode = {
  id: string;
  code: string;
  discount_percentage: number | null;
  discount_amount: number | null;
  max_uses: number | null;
  current_uses: number | null;
  valid_from: string | null;
  valid_until: string | null;
  active: boolean | null;
  created_at: string;
};

export type GiftSubscription = {
  id: string;
  giver_user_id: string | null;
  receiver_email: string | null;
  receiver_user_id: string | null;
  subscription_id: string | null;
  gift_code: string | null;
  message: string | null;
  is_activated: boolean | null;
  activated_at: string | null;
  created_at: string | null;
  expires_at: string | null;
};

export type UserStats = {
  id: string;
  user_id: string | null;
  total_bookings: number | null;
  completed_workouts: number | null;
  favorite_gym_id: string | null;
  total_hours_trained: number | null;
  current_streak_days: number | null;
  best_streak_days: number | null;
  last_workout_date: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type Review = {
  id: string;
  user_id: string | null;
  gym_id: string | null;
  rating: number | null;
  comment: string | null;
  created_at: string | null;
};

export type SupportTicket = {
  id: string;
  user_id: string | null;
  created_at: string | null;
  status: "open" | "in_progress" | "resolved" | "closed";
  subject: string | null;
  message: string | null;
  assigned_support_id: string | null;
  resolved_at: string | null;
};

export type ChatMessage = {
  id: string;
  ticket_id: string | null;
  sender_id: string | null;
  message: string | null;
  sent_at: string | null;
};
