
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
      // For order history, always save to cookies
      // This ensures cookie persistence until payment is made
      if (key === 'restaurant_order_history') {
        // Set cookie with expiry of 7 days
        if (Array.isArray(storedValue) && storedValue.length > 0) {
          Cookies.set(key, JSON.stringify(storedValue), { expires: 7 });
        } else {
          // Clear the cookie if there are no orders
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
