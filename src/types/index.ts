
// Common types for the fitness platform
// All fields use snake_case as required

export type User = {
  id: string;
  email?: string | null;
  phone?: string | null;
  name?: string | null;
  role: "user" | "admin" | "partner" | "support";
  created_at: string | null;
  profile_image?: string | null;
  subscription_id?: string | null;
};

export type Gym = {
  id: string;
  name: string | null;
  location: string | null;
  owner_id: string | null;
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
  assigned_support_id?: string | null;
  resolved_at?: string | null;
};

export type ChatMessage = {
  id: string;
  ticket_id: string | null;
  sender_id: string | null;
  message: string | null;
  sent_at: string | null;
};
