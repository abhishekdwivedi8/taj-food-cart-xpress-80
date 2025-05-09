
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, OrderHistoryItem } from '@/types';
import { toast } from "@/components/ui/sonner";
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from 'uuid';

interface FoodCartContextType {
  cartItems: CartItem[];
  orderHistory: OrderHistoryItem[];
  addToCart: (item: CartItem) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  placeOrder: () => void;
  completePayment: () => void;
  cartTotal: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  isOrderConfirmOpen: boolean;
  setIsOrderConfirmOpen: (isOpen: boolean) => void;
  isPaymentOpen: boolean;
  setIsPaymentOpen: (isOpen: boolean) => void;
  isSuccessOpen: boolean;
  setIsSuccessOpen: (isOpen: boolean) => void;
  currentOrderId: string | null;
}

const FoodCartContext = createContext<FoodCartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'taj_food_cart';
const ORDER_HISTORY_KEY = 'taj_order_history';

export const FoodCartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orderHistory, setOrderHistory] = useState<OrderHistoryItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrderConfirmOpen, setIsOrderConfirmOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const { toast: useToastFn } = useToast();

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart data', e);
      }
    }

    const savedOrderHistory = localStorage.getItem(ORDER_HISTORY_KEY);
    if (savedOrderHistory) {
      try {
        setOrderHistory(JSON.parse(savedOrderHistory));
      } catch (e) {
        console.error('Failed to parse order history data', e);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  // Save order history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(ORDER_HISTORY_KEY, JSON.stringify(orderHistory));
  }, [orderHistory]);

  const addToCart = (item: CartItem) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((i) => i.id === item.id);
      
      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += item.quantity;
        toast(`Added ${item.quantity} more ${item.nameEn} to your cart`);
        return updatedItems;
      } else {
        toast(`Added ${item.nameEn} to your cart`);
        return [...prevItems, item];
      }
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCartItems((prevItems) => 
      prevItems.map((item) => 
        item.id === id ? { ...item, quantity } : item
      ).filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const placeOrder = () => {
    if (cartItems.length === 0) return;

    // Generate a unique device ID if not available
    const deviceId = localStorage.getItem('device_id') || uuidv4();
    if (!localStorage.getItem('device_id')) {
      localStorage.setItem('device_id', deviceId);
    }

    const newOrder: OrderHistoryItem = {
      id: `order-${Date.now()}`,
      items: [...cartItems],
      total: cartTotal,
      date: new Date().toISOString(),
      isPaid: false,
      restaurantId: 1, // Default to restaurant 1 since we're on that page
      customerId: deviceId // Use the device ID as customer ID
    };

    setCurrentOrderId(newOrder.id);
    setOrderHistory((prev) => [...prev, newOrder]);

    // Simulate sending order to backend
    console.log('Order placed:', newOrder);
    
    // Clear cart after order is placed
    clearCart();
    setIsOrderConfirmOpen(false);
    setIsSuccessOpen(true);

    // Auto close success message after 3 seconds
    setTimeout(() => {
      setIsSuccessOpen(false);
    }, 3000);
  };

  const completePayment = () => {
    if (!currentOrderId) return;
    
    setOrderHistory((prev) => 
      prev.map((order) => 
        order.id === currentOrderId ? { ...order, isPaid: true } : order
      )
    );

    setCurrentOrderId(null);
    setIsPaymentOpen(false);
    setIsSuccessOpen(true);

    // Show success message
    useToastFn({
      title: "Payment Successful!",
      description: "Your payment has been processed successfully.",
    });

    // Clear order history
    setTimeout(() => {
      setOrderHistory([]);
      localStorage.removeItem(ORDER_HISTORY_KEY);
      setIsSuccessOpen(false);
    }, 5000);
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const value = {
    cartItems,
    orderHistory,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    placeOrder,
    completePayment,
    cartTotal,
    cartCount,
    isCartOpen,
    setIsCartOpen,
    isOrderConfirmOpen,
    setIsOrderConfirmOpen,
    isPaymentOpen,
    setIsPaymentOpen,
    isSuccessOpen,
    setIsSuccessOpen,
    currentOrderId
  };

  return <FoodCartContext.Provider value={value}>{children}</FoodCartContext.Provider>;
};

export const useCart = (): FoodCartContextType => {
  const context = useContext(FoodCartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a FoodCartProvider');
  }
  return context;
};
