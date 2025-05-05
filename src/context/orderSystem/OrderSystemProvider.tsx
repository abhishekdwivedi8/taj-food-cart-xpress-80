
import React, { createContext, useContext, useEffect } from 'react';
import { useDeviceId } from '../DeviceIdContext';
import { CartItem, OrderHistoryItem } from '@/types';
import { OrderWithStatus, OrderSystemContextType, CART_STORAGE_KEY, ORDERS_STORAGE_KEY, ORDER_HISTORY_STORAGE_KEY } from './types';
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

  // Create cart functions
  const cartFunctions = createCartFunctions(cartItems, setCartItems);

  // Create UI state functions
  const uiStateFunctions = createUIStateFunctions(
    setIsCartOpenState,
    setIsOrderConfirmOpenState,
    setIsOrderSuccessOpenState,
    setIsPaymentOpenState
  );

  // Create order functions
  const orderFunctions = createOrderFunctions(
    deviceId,
    orders,
    setOrders,
    orderHistory,
    setOrderHistory,
    cartItems,
    cartFunctions.clearCart,
    cartFunctions.getCartTotal,
    uiStateFunctions.setIsOrderConfirmOpen,
    uiStateFunctions.setIsOrderSuccessOpen
  );

  // Create order query functions
  const orderQueryFunctions = createOrderQueryFunctions(orders);

  // Combine all functions and state into the context value
  const value: OrderSystemContextType = {
    // Cart state and functions
    cartItems,
    ...cartFunctions,
    
    // Order state and functions
    orders,
    orderHistory,
    ...orderFunctions,
    
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
