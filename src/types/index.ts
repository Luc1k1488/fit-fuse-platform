
// Common types for the fitness platform
// All fields use snake_case as required

export type User = {
  id: string;
  email?: string;
  phone?: string;
  name?: string;
  role: "user" | "admin" | "partner" | "support";
  created_at: string;
  profile_image?: string;
  subscription_id?: string;
};

export type Gym = {
  id: string;
  name: string;
  location: string;
  owner_id: string;
  main_image: string;
  working_hours: string;
  review_count: number;
  rating: number;
  category: string;
  features: string[];
  city: string;
  address: string;
  images: string[];
};

export type Class = {
  id: string;
  gym_id: string;
  title: string;
  description: string;
  instructor: string;
  start_time: string;
  end_time: string;
  category: string;
  capacity: number;
  booked_count: number;
};

export type Booking = {
  id: string;
  user_id: string;
  class_id: string;
  gym_id: string;
  status: "pending" | "confirmed" | "cancelled";
  date_time: string;
  created_at: string;
};

export type Subscription = {
  id: string;
  user_id: string;
  status: "active" | "inactive" | "pending" | "expired";
  start_date: string;
  end_date: string;
  plan_name: string;
  price: number;
};

export type Review = {
  id: string;
  user_id: string;
  gym_id: string;
  rating: number;
  comment: string;
  created_at: string;
};

export type SupportTicket = {
  id: string;
  user_id: string;
  created_at: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  subject: string;
  message: string;
  assigned_support_id?: string;
  resolved_at?: string;
};

export type ChatMessage = {
  id: string;
  ticket_id: string;
  sender_id: string;
  message: string;
  sent_at: string;
};
