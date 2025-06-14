
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
