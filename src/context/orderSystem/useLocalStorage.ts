
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // For order history, use cookies instead of localStorage
      if (key === 'restaurant_order_history') {
        const cookieValue = Cookies.get(key);
        return cookieValue ? JSON.parse(cookieValue) : initialValue;
      }
      
      // For other data, use localStorage as before
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading storage key "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      // For order history, save to cookies
      if (key === 'restaurant_order_history') {
        // Set cookie with expiry of 7 days for unpaid orders
        const unpaidOrders = Array.isArray(storedValue) 
          ? storedValue.filter((order: any) => !order.isPaid)
          : [];
          
        // Only store unpaid orders in cookies
        if (unpaidOrders.length > 0) {
          Cookies.set(key, JSON.stringify(unpaidOrders), { expires: 7 });
        } else {
          // Clear the cookie if there are no unpaid orders
          Cookies.remove(key);
        }
      }
      
      // Always update localStorage for all data
      localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error setting storage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
