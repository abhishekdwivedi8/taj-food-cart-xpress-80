
export interface CartItem {
  id: string;
  nameEn: string;
  nameHi?: string;
  nameJa?: string;
  price: number;
  quantity: number;
  image?: string;
  imageUrl?: string;
}

export interface MenuItem {
  id: string;
  nameEn: string;
  nameHi?: string;
  nameJa?: string;
  description: string;
  price: number;
  image?: string;
  imageUrl?: string;
  category: string;
  isVeg?: boolean;
  isSpicy?: boolean;
  isPopular?: boolean;
  quantity?: number;
  restaurantId?: number;
}

export interface OrderHistoryItem {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
  isPaid: boolean;
  isCancelled?: boolean;
  isCompleted?: boolean;
  isPrepared?: boolean;
  chefNote?: string;
  status?: "pending" | "confirmed" | "preparing" | "ready" | "completed" | "cancelled";
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
}

// For weather-based recommendations
export interface WeatherData {
  temperature: number;
  condition: string; // sunny, rainy, cloudy, etc.
  humidity: number;
  icon: string;
}

export interface FoodRecommendation {
  type: 'starter' | 'main' | 'dessert';
  items: MenuItem[];
  reason: string;
}

// Helper type for immutable state
export type DeepReadonly<T> = {
  readonly [K in keyof T]: DeepReadonly<T[K]>
};

// Export types needed by context files
export type Order = OrderHistoryItem;
export type OrderWithStatus = OrderHistoryItem & { status: "pending" | "confirmed" | "preparing" | "ready" | "completed" | "cancelled" };
