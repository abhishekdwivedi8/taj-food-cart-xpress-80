
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, OrderHistoryItem } from '@/types';
import { toast } from "@/components/ui/sonner";
import { useToast } from "@/components/ui/use-toast";
import { useDeviceId } from './DeviceIdContext';

// Extended types for our order system
export interface OrderWithStatus extends OrderHistoryItem {
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  restaurantId: number; // 1 or 2 for the different restaurant pages
  customerId: string; // Device ID
  chefNote?: string;
  isPrepared: boolean;
}

interface OrderSystemContextType {
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
  getPendingOrders: (restaurantId?: number) => OrderWithStatus[];
  getConfirmedOrders: () => OrderWithStatus[];
  getPreparingOrders: () => OrderWithStatus[];
  getPreparedOrders: () => OrderWithStatus[];
  getCompletedOrders: () => OrderWithStatus[];
  getCancelledOrders: () => OrderWithStatus[];
  getRestaurantOrders: (restaurantId: number) => OrderWithStatus[];
  getCustomerOrders: (deviceId: string) => OrderWithStatus[];
  getOrderById: (orderId: string) => OrderWithStatus | undefined;
  
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
  getTotalOrdersCount: () => number;
  getRestaurantSales: (restaurantId: number) => number;
}

const OrderSystemContext = createContext<OrderSystemContextType | undefined>(undefined);

// Local storage keys
const CART_STORAGE_KEY = 'restaurant_cart';
const ORDERS_STORAGE_KEY = 'restaurant_orders';

export const OrderSystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { deviceId } = useDeviceId();
  const [cartItems, setCartItems] = useState<Record<number, CartItem[]>>({ 1: [], 2: [] });
  const [orders, setOrders] = useState<OrderWithStatus[]>([]);
  const [isCartOpen, setIsCartOpenState] = useState<Record<number, boolean>>({ 1: false, 2: false });
  const [isOrderConfirmOpen, setIsOrderConfirmOpenState] = useState<Record<number, boolean>>({ 1: false, 2: false });
  const [isOrderSuccessOpen, setIsOrderSuccessOpenState] = useState<Record<number, boolean>>({ 1: false, 2: false });
  const [isPaymentOpen, setIsPaymentOpenState] = useState<Record<number, boolean>>({ 1: false, 2: false });
  const { toast: useToastFn } = useToast();

  // Load data from localStorage
  useEffect(() => {
    const loadCart = () => {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch (e) {
          console.error('Failed to parse cart data', e);
        }
      }
    };

    const loadOrders = () => {
      const savedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (savedOrders) {
        try {
          setOrders(JSON.parse(savedOrders));
        } catch (e) {
          console.error('Failed to parse orders data', e);
        }
      }
    };

    loadCart();
    loadOrders();
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  // Save orders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  // Cart management functions
  const addToCart = (restaurantId: number, item: CartItem) => {
    setCartItems((prev) => {
      const restaurantCart = prev[restaurantId] || [];
      const existingItemIndex = restaurantCart.findIndex((i) => i.id === item.id);
      
      let updatedRestaurantCart;
      if (existingItemIndex > -1) {
        updatedRestaurantCart = [...restaurantCart];
        updatedRestaurantCart[existingItemIndex].quantity += item.quantity;
        toast(`Added ${item.quantity} more ${item.nameEn} to your cart`);
      } else {
        updatedRestaurantCart = [...restaurantCart, item];
        toast(`Added ${item.nameEn} to your cart`);
      }

      return {
        ...prev,
        [restaurantId]: updatedRestaurantCart
      };
    });
  };

  const updateQuantity = (restaurantId: number, id: string, quantity: number) => {
    setCartItems((prev) => {
      const restaurantCart = prev[restaurantId] || [];
      const updatedRestaurantCart = restaurantCart
        .map((item) => item.id === id ? { ...item, quantity } : item)
        .filter((item) => item.quantity > 0);

      return {
        ...prev,
        [restaurantId]: updatedRestaurantCart
      };
    });
  };

  const removeFromCart = (restaurantId: number, id: string) => {
    setCartItems((prev) => {
      const restaurantCart = prev[restaurantId] || [];
      const updatedRestaurantCart = restaurantCart.filter((item) => item.id !== id);

      return {
        ...prev,
        [restaurantId]: updatedRestaurantCart
      };
    });
  };

  const clearCart = (restaurantId: number) => {
    setCartItems((prev) => ({
      ...prev,
      [restaurantId]: []
    }));
  };

  const getCartTotal = (restaurantId: number) => {
    const restaurantCart = cartItems[restaurantId] || [];
    return restaurantCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getCartCount = (restaurantId: number) => {
    const restaurantCart = cartItems[restaurantId] || [];
    return restaurantCart.reduce((sum, item) => sum + item.quantity, 0);
  };

  // Order management functions
  const placeOrder = (restaurantId: number) => {
    const restaurantCart = cartItems[restaurantId] || [];
    
    if (restaurantCart.length === 0) return;

    const newOrder: OrderWithStatus = {
      id: `order-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      items: [...restaurantCart],
      total: getCartTotal(restaurantId),
      date: new Date().toISOString(),
      isPaid: false,
      status: 'pending',
      restaurantId: restaurantId,
      customerId: deviceId,
      isPrepared: false
    };

    setOrders(prev => [...prev, newOrder]);
    
    // Clear cart after order is placed
    clearCart(restaurantId);
    setIsOrderConfirmOpenState(prev => ({...prev, [restaurantId]: false}));
    setIsOrderSuccessOpenState(prev => ({...prev, [restaurantId]: true}));

    // Auto close success message after 2 seconds (reduced from 3)
    setTimeout(() => {
      setIsOrderSuccessOpenState(prev => ({...prev, [restaurantId]: false}));
    }, 2000);

    return newOrder;
  };

  const confirmOrder = (orderId: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: 'confirmed' } 
        : order
    ));

    toast("Order confirmed and sent to chef!");
  };

  const cancelOrder = (orderId: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: 'cancelled' } 
        : order
    ));

    toast("Order cancelled", {
      description: "The order has been cancelled"
    });
  };

  const markOrderPreparing = (orderId: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: 'preparing' } 
        : order
    ));
  };

  const markOrderPrepared = (orderId: string, note?: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: 'ready', isPrepared: true, chefNote: note } 
        : order
    ));

    toast("Order prepared", {
      description: "The order is ready to serve"
    });
  };

  const markOrderCompleted = (orderId: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: 'completed' } 
        : order
    ));
  };

  const completePayment = (orderId: string, paymentMethod: 'online' | 'cash') => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, isPaid: true } 
        : order
    ));

    useToastFn({
      title: "Payment Successful!",
      description: `Payment received via ${paymentMethod}.`,
    });
  };

  // Order filtering functions
  const getPendingOrders = (restaurantId?: number) => {
    if (restaurantId) {
      return orders.filter(order => order.status === 'pending' && order.restaurantId === restaurantId);
    }
    return orders.filter(order => order.status === 'pending');
  };

  const getConfirmedOrders = () => {
    return orders.filter(order => order.status === 'confirmed');
  };

  const getPreparingOrders = () => {
    return orders.filter(order => order.status === 'preparing');
  };

  const getPreparedOrders = () => {
    return orders.filter(order => order.status === 'ready');
  };

  const getCompletedOrders = () => {
    return orders.filter(order => order.status === 'completed');
  };

  const getCancelledOrders = () => {
    return orders.filter(order => order.status === 'cancelled');
  };

  const getRestaurantOrders = (restaurantId: number) => {
    return orders.filter(order => order.restaurantId === restaurantId);
  };

  const getCustomerOrders = (customerId: string) => {
    return orders.filter(order => order.customerId === customerId);
  };

  const getOrderById = (orderId: string) => {
    return orders.find(order => order.id === orderId);
  };

  // UI state management
  const setIsCartOpen = (restaurantId: number, isOpen: boolean) => {
    setIsCartOpenState(prev => ({...prev, [restaurantId]: isOpen}));
  };

  const setIsOrderConfirmOpen = (restaurantId: number, isOpen: boolean) => {
    setIsOrderConfirmOpenState(prev => ({...prev, [restaurantId]: isOpen}));
  };

  const setIsOrderSuccessOpen = (restaurantId: number, isOpen: boolean) => {
    setIsOrderSuccessOpenState(prev => ({...prev, [restaurantId]: isOpen}));
  };

  const setIsPaymentOpen = (restaurantId: number, isOpen: boolean) => {
    setIsPaymentOpenState(prev => ({...prev, [restaurantId]: isOpen}));
  };

  // Sales data functions
  const getTotalSales = () => {
    return orders
      .filter(order => order.isPaid)
      .reduce((sum, order) => sum + order.total, 0);
  };

  const getTotalOrdersCount = () => {
    return orders.length;
  };

  const getRestaurantSales = (restaurantId: number) => {
    return orders
      .filter(order => order.restaurantId === restaurantId && order.isPaid)
      .reduce((sum, order) => sum + order.total, 0);
  };

  const value: OrderSystemContextType = {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartCount,
    placeOrder,
    confirmOrder,
    cancelOrder,
    markOrderPreparing,
    markOrderPrepared,
    markOrderCompleted,
    completePayment,
    orders,
    getPendingOrders,
    getConfirmedOrders,
    getPreparingOrders,
    getPreparedOrders,
    getCompletedOrders,
    getCancelledOrders,
    getRestaurantOrders,
    getCustomerOrders,
    getOrderById,
    isCartOpen,
    setIsCartOpen,
    isOrderConfirmOpen,
    setIsOrderConfirmOpen,
    isOrderSuccessOpen,
    setIsOrderSuccessOpen,
    isPaymentOpen,
    setIsPaymentOpen,
    getTotalSales,
    getTotalOrdersCount,
    getRestaurantSales
  };

  return <OrderSystemContext.Provider value={value}>{children}</OrderSystemContext.Provider>;
};

export const useOrderSystem = (): OrderSystemContextType => {
  const context = useContext(OrderSystemContext);
  if (context === undefined) {
    throw new Error('useOrderSystem must be used within an OrderSystemProvider');
  }
  return context;
};
