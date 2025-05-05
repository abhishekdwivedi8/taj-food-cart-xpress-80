
export interface CartItem {
  id: string;
  nameEn: string;
  nameHi: string;
  price: number;
  quantity: number;
  image: string;
}

export interface MenuItem extends CartItem {
  description: string;
  category: string;
  isVeg?: boolean;
  isSpicy?: boolean;
  isPopular?: boolean;
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
  status?: string; // Added status field to track order status
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
}
