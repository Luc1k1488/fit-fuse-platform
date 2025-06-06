
export interface Gym {
  id: string;
  name: string | null;
  location: string | null;
  address: string | null;
  city: string | null;
  category: string | null;
  working_hours: string | null;
  features: string[] | null;
  partner_id: string | null;
  main_image: string | null;
  images: string[] | null;
  rating: number | null;
  review_count: number | null;
  created_at: string;
  description: string | null;
  phone: string | null;
  owner_id?: string | null;
}

export interface Partner {
  id: string;
  name: string;
  email: string;
  company_name: string | null;
  phone: string | null;
  status: string;
  gym_count: number | null;
  user_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  role: string | null;
  profile_image: string | null;
  subscription_id: string | null;
  created_at: string;
}

export interface Class {
  id: string;
  title: string | null;
  description: string | null;
  instructor: string | null;
  category: string | null;
  start_time: string | null;
  end_time: string | null;
  capacity: number | null;
  booked_count: number | null;
  gym_id: string | null;
  created_at: string;
}

export interface ClassWithGym extends Class {
  gym: Gym;
}

export interface Booking {
  id: string;
  user_id: string | null;
  gym_id: string | null;
  class_id: string | null;
  date_time: string | null;
  status: string | null;
  created_at: string;
}

export interface BookingWithDetails extends Booking {
  gym: Gym;
  class: Class;
  user?: User;
}

export interface UserStats {
  id: string;
  user_id: string | null;
  total_bookings: number | null;
  completed_workouts: number | null;
  current_streak_days: number | null;
  best_streak_days: number | null;
  total_hours_trained: number | null;
  last_workout_date: string | null;
  favorite_gym_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  user_id: string | null;
  gym_id: string | null;
  rating: number | null;
  comment: string | null;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string | null;
  plan_id: string | null;
  plan_name: string | null;
  start_date: string | null;
  end_date: string | null;
  status: string | null;
  price: number | null;
  subscription_type: string | null;
  created_at: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration_days: number;
  features: string[] | null;
  is_active: boolean | null;
  created_at: string;
}
