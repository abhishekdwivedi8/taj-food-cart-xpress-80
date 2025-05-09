
import Cookies from 'js-cookie';
import { OrderWithStatus } from '@/context/orderSystem';

// Save order history to both localStorage and cookies for better persistence
export const saveOrderHistoryMultiple = (orderHistory: OrderWithStatus[]): void => {
  try {
    // Save to localStorage
    localStorage.setItem('restaurant_order_history', JSON.stringify(orderHistory));
    
    // Also save to cookies with a longer expiration (30 days)
    Cookies.set('restaurant_order_history', JSON.stringify(orderHistory), { expires: 30 });
    
    console.log('Order history saved successfully to multiple storage methods');
  } catch (error) {
    console.error('Failed to save order history:', error);
  }
};

// Get order history with fallback mechanisms and ensure type safety
export const getOrderHistoryFromMultipleSources = (): OrderWithStatus[] => {
  try {
    // Try to get from localStorage first
    const localStorageData = localStorage.getItem('restaurant_order_history');
    if (localStorageData) {
      const parsedData = JSON.parse(localStorageData);
      // Ensure each item has the required status property
      return parsedData.map((item: any) => ({
        ...item,
        status: item.status || "pending" // Default status if not present
      }));
    }
    
    // Fall back to cookies if localStorage is empty
    const cookieData = Cookies.get('restaurant_order_history');
    if (cookieData) {
      const parsedData = JSON.parse(cookieData);
      // Ensure each item has the required status property
      return parsedData.map((item: any) => ({
        ...item,
        status: item.status || "pending" // Default status if not present
      }));
    }
    
    // If both are empty, return an empty array
    return [];
  } catch (error) {
    console.error('Error retrieving order history:', error);
    return [];
  }
};

// Clear order history from all storage mechanisms
export const clearOrderHistory = (): void => {
  try {
    localStorage.removeItem('restaurant_order_history');
    Cookies.remove('restaurant_order_history');
    console.log('Order history cleared from all storage');
  } catch (error) {
    console.error('Error clearing order history:', error);
  }
};

// Update a specific order in history
export const updateOrderInHistory = (
  orderHistory: OrderWithStatus[],
  orderId: string, 
  updates: Partial<OrderWithStatus>
): OrderWithStatus[] => {
  const updatedHistory = orderHistory.map(order => {
    if (order.id === orderId) {
      return { ...order, ...updates };
    }
    return order;
  });
  
  // Save the updated history
  saveOrderHistoryMultiple(updatedHistory);
  
  return updatedHistory;
};

// Check if there are any unpaid orders in the history
export const hasUnpaidOrders = (orderHistory: OrderWithStatus[]): boolean => {
  return orderHistory.some(order => !order.isPaid);
};

// Ensure order history persistence across sessions
export const ensureOrderHistoryPersistence = (): void => {
  try {
    // Check if we have history in localStorage
    const localStorageData = localStorage.getItem('restaurant_order_history');
    
    // Check if we have history in cookies
    const cookieData = Cookies.get('restaurant_order_history');
    
    // If we have data in localStorage but not cookies, save to cookies
    if (localStorageData && !cookieData) {
      Cookies.set('restaurant_order_history', localStorageData, { expires: 30 });
    }
    
    // If we have data in cookies but not localStorage, save to localStorage
    if (cookieData && !localStorageData) {
      localStorage.setItem('restaurant_order_history', cookieData);
    }
    
    // If both are empty, set empty arrays in both
    if (!localStorageData && !cookieData) {
      const emptyArray = JSON.stringify([]);
      localStorage.setItem('restaurant_order_history', emptyArray);
      Cookies.set('restaurant_order_history', emptyArray, { expires: 30 });
    }
  } catch (error) {
    console.error('Error ensuring order history persistence:', error);
  }
};
