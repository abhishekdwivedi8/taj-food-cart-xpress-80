
import { CartItem, OrderHistoryItem } from '@/types';

// Extended types for our order system
export interface OrderWithStatus extends OrderHistoryItem {
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
}

export interface Order {
  id: string;
  customerId: string;
  restaurantId: number;
  date: string;
  items: OrderItem[];
  total: number;
  isPaid: boolean;
}

export interface OrderItem {
  id: string;
  nameEn: string;
  nameJa?: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface State {
  deviceId: string;
  carts: Record<number, CartItem[]>;
  orders: OrderWithStatus[];
  orderHistory: OrderHistoryItem[];
}

export interface OrderSystemContextType {
  // Cart functions (per restaurant)
  cartItems: Record<number, CartItem[]>;
  addToCart: (restaurantId: number, item: CartItem) => void;
  updateQuantity: (restaurantId: number, id: string, quantity: number) => void;
  removeFromCart: (restaurantId: number, id: string) => void;
  clearCart: (restaurantId: number) => void;
  getCartTotal: (restaurantId: number) => number;
  getCartCount: (restaurantId: number) => number;
  
  // Order management
  placeOrder: (restaurantId: number) => void;
  confirmOrder: (orderId: string) => void;
  cancelOrder: (orderId: string) => void;
  markOrderPreparing: (orderId: string) => void;
  markOrderPrepared: (orderId: string, note?: string) => void;
  markOrderCompleted: (orderId: string) => void;
  completePayment: (orderId: string, paymentMethod: 'online' | 'cash') => void;
  
  // Order data
  orders: OrderWithStatus[];
  orderHistory: OrderHistoryItem[];
  getPendingOrders: (restaurantId?: number) => OrderWithStatus[];
  getConfirmedOrders: () => OrderWithStatus[];
  getPreparingOrders: () => OrderWithStatus[];
  getPreparedOrders: () => OrderWithStatus[];
  getCompletedOrders: () => OrderWithStatus[];
  getCancelledOrders: () => OrderWithStatus[];
  getRestaurantOrders: (restaurantId: number) => OrderWithStatus[];
  getCustomerOrders: (deviceId: string) => OrderWithStatus[];
  getOrderById: (orderId: string) => OrderWithStatus | null;
  getLatestCompletedOrderId: () => string | null;
  
  // Cart UI state
  isCartOpen: Record<number, boolean>;
  setIsCartOpen: (restaurantId: number, isOpen: boolean) => void;
  isOrderConfirmOpen: Record<number, boolean>;
  setIsOrderConfirmOpen: (restaurantId: number, isOpen: boolean) => void;
  isOrderSuccessOpen: Record<number, boolean>;
  setIsOrderSuccessOpen: (restaurantId: number, isOpen: boolean) => void;
  isPaymentOpen: Record<number, boolean>;
  setIsPaymentOpen: (restaurantId: number, isOpen: boolean) => void;

  // Sales data
  getTotalSales: () => number;
  getTotalOrdersCount: (restaurantId: number) => number;
  getRestaurantSales: (restaurantId: number) => number;
}

// Local storage keys
export const CART_STORAGE_KEY = 'restaurant_cart';
export const ORDERS_STORAGE_KEY = 'restaurant_orders';
export const ORDER_HISTORY_STORAGE_KEY = 'restaurant_order_history';
