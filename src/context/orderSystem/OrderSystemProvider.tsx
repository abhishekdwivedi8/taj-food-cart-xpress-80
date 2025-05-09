
import React, { createContext, useContext, useEffect } from 'react';
import { useDeviceId } from '../DeviceIdContext';
import { CartItem, OrderHistoryItem, OrderWithStatus } from '@/types';
import { CART_STORAGE_KEY, ORDERS_STORAGE_KEY, ORDER_HISTORY_STORAGE_KEY, OrderSystemContextType } from './types';
import { createCartFunctions } from './cartFunctions';
import { createOrderFunctions } from './orderFunctions';
import { createOrderQueryFunctions } from './orderQueryFunctions';
import { createUIStateFunctions } from './uiStateFunctions';
import { useLocalStorage } from './useLocalStorage';
import { ensureOrderHistoryPersistence } from '@/utils/paymentUtils';

const OrderSystemContext = createContext<OrderSystemContextType | undefined>(undefined);

export const OrderSystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { deviceId } = useDeviceId();
  
  // Use our custom hook for localStorage with cookie fallback for order history
  const [cartItems, setCartItems] = useLocalStorage<Record<number, CartItem[]>>(CART_STORAGE_KEY, { 1: [], 2: [] });
  const [orders, setOrders] = useLocalStorage<OrderWithStatus[]>(ORDERS_STORAGE_KEY, []);
  const [orderHistory, setOrderHistory] = useLocalStorage<OrderHistoryItem[]>(ORDER_HISTORY_STORAGE_KEY, []);
  
  const [isCartOpen, setIsCartOpenState] = useLocalStorage<Record<number, boolean>>('cart_open_state', { 1: false, 2: false });
  const [isOrderConfirmOpen, setIsOrderConfirmOpenState] = useLocalStorage<Record<number, boolean>>('order_confirm_state', { 1: false, 2: false });
  const [isOrderSuccessOpen, setIsOrderSuccessOpenState] = useLocalStorage<Record<number, boolean>>('order_success_state', { 1: false, 2: false });
  const [isPaymentOpen, setIsPaymentOpenState] = useLocalStorage<Record<number, boolean>>('payment_open_state', { 1: false, 2: false });

  // Ensure order history persistence on mount
  useEffect(() => {
    ensureOrderHistoryPersistence();
  }, []);

  // Create state object for cart functions
  const cartState = {
    carts: cartItems,
    deviceId
  };

  // Create cart functions
  const cartFunctions = createCartFunctions(cartState);
  const { getCartTotal, getCartCount } = cartFunctions;

  // Create UI state functions
  const uiStateFunctions = createUIStateFunctions(
    setIsCartOpenState,
    setIsOrderConfirmOpenState,
    setIsOrderSuccessOpenState,
    setIsPaymentOpenState
  );

  // Create state object for order functions
  const orderState = {
    deviceId,
    carts: cartItems,
    orders,
    orderHistory: orderHistory as OrderWithStatus[]
  };

  // Create order functions
  const orderFunctions = createOrderFunctions(orderState);

  // Create order query functions
  const orderQueryFunctions = createOrderQueryFunctions(orders);

  // Create adapter functions to match the expected interface
  const addToCart = (restaurantId: number, item: CartItem) => {
    const updatedCart = cartFunctions.addItemToCart(restaurantId, item as any);
    setCartItems({...cartItems, [restaurantId]: updatedCart});
  };

  const removeFromCart = (restaurantId: number, id: string) => {
    const updatedCart = cartFunctions.removeItemFromCart(restaurantId, id);
    setCartItems({...cartItems, [restaurantId]: updatedCart});
  };

  const updateQuantity = (restaurantId: number, id: string, quantity: number) => {
    const currentCart = cartItems[restaurantId] || [];
    const updatedCart = currentCart.map(item =>
      item.id === id ? { ...item, quantity } : item
    ).filter(item => item.quantity > 0);
    
    setCartItems({...cartItems, [restaurantId]: updatedCart});
  };

  const clearCartWrapped = (restaurantId: number) => {
    setCartItems({...cartItems, [restaurantId]: []});
  };

  const placeOrder = (restaurantId: number) => {
    try {
      // Create order from current cart
      const newOrder = orderFunctions.createOrderFromCart(restaurantId);
      
      // Add to order history
      const updatedOrders = orderFunctions.addOrder(newOrder);
      setOrders(updatedOrders as any);
      
      // Clear cart
      clearCartWrapped(restaurantId);
      
      // Update UI state
      uiStateFunctions.setIsOrderConfirmOpen(restaurantId, false);
      uiStateFunctions.setIsOrderSuccessOpen(restaurantId, true);
    } catch (error) {
      console.error(error);
      // Could add toast notification here
    }
  };

  const confirmOrder = (orderId: string) => {
    const updated = orderFunctions.confirmOrder(orderId);
    setOrders(updated as any);
  };
  
  const cancelOrder = (orderId: string) => {
    const updated = orderFunctions.cancelOrder(orderId);
    setOrders(updated as any);
  };
  
  const markOrderPreparing = (orderId: string) => {
    const updated = orderFunctions.startPreparingOrder(orderId);
    setOrders(updated as any);
  };
  
  const markOrderPrepared = (orderId: string, note?: string) => {
    const updated = orderFunctions.markOrderAsReady(orderId);
    setOrders(updated as any);
  };
  
  const markOrderCompleted = (orderId: string) => {
    const updated = orderFunctions.completeOrder(orderId);
    setOrders(updated as any);
  };

  const completePayment = (orderId: string, paymentMethod: 'online' | 'cash' = 'cash') => {
    const updated = orderFunctions.completePayment(orderId, paymentMethod);
    setOrders(updated as any);
  };

  // Combine all functions and state into the context value
  const value: OrderSystemContextType = {
    // Cart state and functions
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart: clearCartWrapped,
    getCartTotal: (restaurantId: number) => getCartTotal(restaurantId),
    getCartCount: (restaurantId: number) => getCartCount(restaurantId),
    
    // Order state 
    orders,
    orderHistory,
    
    // Order functions
    placeOrder,
    confirmOrder,
    cancelOrder,
    markOrderPreparing,
    markOrderPrepared,
    markOrderCompleted,
    completePayment,
    
    // Order queries
    ...orderQueryFunctions,
    
    // UI state
    isCartOpen,
    isOrderConfirmOpen,
    isOrderSuccessOpen,
    isPaymentOpen,
    ...uiStateFunctions,
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
