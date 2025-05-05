
export interface MenuItem {
  id: string;
  nameEn: string;
  nameHi: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isVeg: boolean;
  isSpicy?: boolean;
  isPopular?: boolean;
}

export interface CartItem {
  id: string;
  nameEn: string;
  nameHi: string;
  price: number;
  quantity: number;
  image: string;
}

export interface OrderHistoryItem {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
  isPaid: boolean;
}
