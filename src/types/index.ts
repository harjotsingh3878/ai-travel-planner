// TypeScript types for the application

export interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  created_at: string;
}

export interface Trip {
  id: string;
  user_id: string;
  destination: string;
  travel_days: number;
  budget: number;
  travel_style: 'budget' | 'moderate' | 'luxury';
  interests: string[];
  itinerary: DayItinerary[];
  total_estimated_cost: number;
  created_at: string;
  updated_at: string;
}

export interface DayItinerary {
  day: number;
  title: string;
  activities: Activity[];
  estimated_cost: number;
  tips: string[];
}

export interface Activity {
  time: string;
  name: string;
  description: string;
  location: string;
  cost: number;
  duration: string;
}

export interface TripInput {
  destination: string;
  travel_days: number;
  budget: number;
  travel_style: 'budget' | 'moderate' | 'luxury';
  interests: string[];
}

export interface DashboardStats {
  total_trips: number;
  total_budget: number;
  total_estimated_cost: number;
  trips_by_destination: { destination: string; count: number }[];
  trips_by_style: { style: string; count: number }[];
  trips_timeline: { month: string; count: number; budget: number }[];
}
