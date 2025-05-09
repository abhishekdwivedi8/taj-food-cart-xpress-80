
import { v4 as uuidv4 } from 'uuid';
import { menuItems } from "../../data/menuItems";
import { DeepReadonly, CartItem, OrderWithStatus } from "../../types";
import { getCookieOrLocalStorage } from "./useLocalStorage";

// Create a new order from cart items
export const createOrder = (
  restaurantId: number,
  cartItems: CartItem[],
  customerId: string,
  chefNote?: string
): OrderWithStatus => {
  const orderTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return {
    id: `order-${uuidv4()}`,
    items: [...cartItems],
    total: orderTotal,
    date: new Date().toISOString(),
    isPaid: false,
    restaurantId,
    customerId,
    chefNote,
    isPrepared: false,
    status: "pending",
  };
};

// Save orders to localStorage
export const saveOrders = (orders: OrderWithStatus[]): void => {
  localStorage.setItem('restaurant_orders', JSON.stringify(orders));
};

// Get orders from localStorage
export const getOrders = (): OrderWithStatus[] => {
  const ordersString = localStorage.getItem('restaurant_orders');
  if (!ordersString) return [];
  
  try {
    return JSON.parse(ordersString) as OrderWithStatus[];
  } catch (e) {
    console.error('Error parsing orders from localStorage', e);
    return [];
  }
};

// Save order history to localStorage
export const saveOrderHistory = (orderHistory: OrderWithStatus[]): void => {
  try {
    localStorage.setItem('restaurant_order_history', JSON.stringify(orderHistory));
  } catch (error) {
    console.error('Error saving order history:', error);
  }
}

// Get order history from localStorage
export const getOrderHistory = (): OrderWithStatus[] => {
  try {
    const orderHistoryString = localStorage.getItem('restaurant_order_history') || 
                             getCookieValue('restaurant_order_history');
    if (!orderHistoryString) return [];
    return JSON.parse(orderHistoryString) as OrderWithStatus[];
  } catch (error) {
    console.error('Error getting order history:', error);
    return [];
  }
}

// Helper function similar to getCookieOrLocalStorage but simplified for our needs
function getCookieValue(key: string): string | null {
  if (typeof document === 'undefined') return null;
  const name = key + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(';');
  
  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i].trim();
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return null;
}

// Add order to order history
export const addToOrderHistory = (order: OrderWithStatus): OrderWithStatus[] => {
  const orderHistory = getOrderHistory();
  const updatedHistory = [...orderHistory, order];
  saveOrderHistory(updatedHistory);
  return updatedHistory;
}

// Confirm an order
export const confirmOrder = (orders: OrderWithStatus[], orderId: string): OrderWithStatus[] => {
  const updatedOrders = orders.map(order => {
    if (order.id === orderId) {
      return {
        ...order,
        status: "confirmed"
      };
    }
    return order;
  });

  saveOrders(updatedOrders);
  return updatedOrders;
};

// Mark order as preparing
export const prepareOrder = (orders: OrderWithStatus[], orderId: string): OrderWithStatus[] => {
  const updatedOrders = orders.map(order => {
    if (order.id === orderId) {
      return {
        ...order,
        status: "preparing",
        isPrepared: true
      };
    }
    return order;
  });

  saveOrders(updatedOrders);
  return updatedOrders;
};

// Mark order as ready
export const readyOrder = (orders: OrderWithStatus[], orderId: string): OrderWithStatus[] => {
  const updatedOrders = orders.map(order => {
    if (order.id === orderId) {
      return {
        ...order,
        status: "ready"
      };
    }
    return order;
  });

  saveOrders(updatedOrders);
  return updatedOrders;
};

// Complete an order
export const completeOrder = (orders: OrderWithStatus[], orderId: string): OrderWithStatus[] => {
  const updatedOrders = orders.map(order => {
    if (order.id === orderId) {
      return {
        ...order,
        status: "completed",
        isCompleted: true
      };
    }
    return order;
  });

  saveOrders(updatedOrders);
  return updatedOrders;
};

// Cancel an order
export const cancelOrder = (orders: OrderWithStatus[], orderId: string): OrderWithStatus[] => {
  const updatedOrders = orders.map(order => {
    if (order.id === orderId) {
      return {
        ...order,
        status: "cancelled",
        isCancelled: true
      };
    }
    return order;
  });

  saveOrders(updatedOrders);
  return updatedOrders;
};

// Complete payment for an order
export const completePayment = (orders: OrderWithStatus[], orderId: string): OrderWithStatus[] => {
  const updatedOrders = orders.map(order => {
    if (order.id === orderId) {
      return {
        ...order,
        isPaid: true
      };
    }
    return order;
  });

  saveOrders(updatedOrders);
  return updatedOrders;
};
