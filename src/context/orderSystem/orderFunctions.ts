
import { v4 as uuidv4 } from 'uuid';
import { menuItems } from "../../data/menuItems";
import { CartItem, OrderWithStatus } from "../../types";
import { getCookieValue } from "./useLocalStorage";

// Create order functions factory
export const createOrderFunctions = (state: { 
  deviceId: string, 
  carts: Record<number, CartItem[]>, 
  orders: OrderWithStatus[], 
  orderHistory: OrderWithStatus[] 
}) => {
  
  // Create order from cart
  const createOrderFromCart = (restaurantId: number) => {
    const cartItems = state.carts[restaurantId] || [];
    
    const orderTotal = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    
    const newOrder: OrderWithStatus = {
      id: `order-${uuidv4()}`,
      items: [...cartItems],
      total: orderTotal,
      date: new Date().toISOString(),
      isPaid: false,
      status: "pending",
      customerId: state.deviceId,
      restaurantId,
      isPrepared: false
    };
    
    return newOrder;
  };
  
  // Add order to orders
  const addOrder = (order: OrderWithStatus): OrderWithStatus[] => {
    return [...state.orders, order];
  };
  
  // Confirm an order
  const confirmOrder = (orderId: string): OrderWithStatus[] => {
    return state.orders.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          status: "confirmed" as "pending" | "confirmed" | "preparing" | "ready" | "completed" | "cancelled"
        };
      }
      return order;
    });
  };
  
  // Cancel an order
  const cancelOrder = (orderId: string): OrderWithStatus[] => {
    return state.orders.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          status: "cancelled" as "pending" | "confirmed" | "preparing" | "ready" | "completed" | "cancelled",
          isCancelled: true
        };
      }
      return order;
    });
  };
  
  // Start preparing an order
  const startPreparingOrder = (orderId: string): OrderWithStatus[] => {
    return state.orders.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          status: "preparing" as "pending" | "confirmed" | "preparing" | "ready" | "completed" | "cancelled",
          isPrepared: true
        };
      }
      return order;
    });
  };
  
  // Mark order as ready
  const markOrderAsReady = (orderId: string): OrderWithStatus[] => {
    return state.orders.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          status: "ready" as "pending" | "confirmed" | "preparing" | "ready" | "completed" | "cancelled"
        };
      }
      return order;
    });
  };
  
  // Complete an order
  const completeOrder = (orderId: string): OrderWithStatus[] => {
    return state.orders.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          status: "completed" as "pending" | "confirmed" | "preparing" | "ready" | "completed" | "cancelled",
          isCompleted: true
        };
      }
      return order;
    });
  };
  
  // Complete payment for an order
  const completePayment = (orderId: string, paymentMethod: 'online' | 'cash'): OrderWithStatus[] => {
    return state.orders.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          isPaid: true
        };
      }
      return order;
    });
  };
  
  return {
    createOrderFromCart,
    addOrder,
    confirmOrder,
    cancelOrder,
    startPreparingOrder,
    markOrderAsReady,
    completeOrder,
    completePayment
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
        status: "confirmed" as "pending" | "confirmed" | "preparing" | "ready" | "completed" | "cancelled"
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
        status: "preparing" as "pending" | "confirmed" | "preparing" | "ready" | "completed" | "cancelled",
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
        status: "ready" as "pending" | "confirmed" | "preparing" | "ready" | "completed" | "cancelled"
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
        status: "completed" as "pending" | "confirmed" | "preparing" | "ready" | "completed" | "cancelled",
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
        status: "cancelled" as "pending" | "confirmed" | "preparing" | "ready" | "completed" | "cancelled",
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
    status: "pending"
  };
};
