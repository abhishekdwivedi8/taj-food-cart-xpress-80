
import { OrderWithStatus } from './types';

// Create query functions factory
export const createOrderQueryFunctions = (orders: OrderWithStatus[]) => {
  const getOrderById = (orderId: string) => {
    return orders.find(order => order.id === orderId) || null;
  };

  const getOrdersByRestaurantId = (restaurantId: number) => {
    return orders.filter(order => order.restaurantId === restaurantId);
  };

  const getLatestCompletedOrderId = (): string | null => {
    // Find the most recent completed/paid order
    if (!orders || orders.length === 0) return null;

    // Sort orders by timestamp (most recent first) and find the first paid one
    const sortedOrders = [...orders]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .filter(order => order.isPaid);

    return sortedOrders.length > 0 ? sortedOrders[0].id : null;
  };

  const calculateTotalRevenue = (restaurantId: number): number => {
    return orders
      .filter(order => order.restaurantId === restaurantId && order.isPaid)
      .reduce((sum, order) => sum + order.total, 0);
  };

  const getTotalOrdersCount = (restaurantId: number): number => {
    return orders.filter(order => order.restaurantId === restaurantId).length;
  };

  const getAverageOrderValue = (restaurantId: number): number => {
    const paidOrders = orders.filter(order => order.restaurantId === restaurantId && order.isPaid);
    if (paidOrders.length === 0) return 0;
    const totalRevenue = paidOrders.reduce((sum, order) => sum + order.total, 0);
    return totalRevenue / paidOrders.length;
  };

  const getPendingOrders = (restaurantId?: number) => {
    const pendingOrders = orders.filter(order => order.status === "pending");
    return restaurantId 
      ? pendingOrders.filter(order => order.restaurantId === restaurantId)
      : pendingOrders;
  };

  const getConfirmedOrders = () => {
    return orders.filter(order => order.status === "confirmed");
  };

  const getPreparingOrders = () => {
    return orders.filter(order => order.status === "preparing");
  };

  const getPreparedOrders = () => {
    return orders.filter(order => order.status === "ready");
  };

  const getCompletedOrders = () => {
    return orders.filter(order => order.status === "completed");
  };

  const getCancelledOrders = () => {
    return orders.filter(order => order.status === "cancelled");
  };

  const getRestaurantOrders = (restaurantId: number) => {
    return orders.filter(order => order.restaurantId === restaurantId);
  };

  const getCustomerOrders = (deviceId: string) => {
    return orders.filter(order => order.customerId === deviceId);
  };

  const getTotalSales = () => {
    return orders
      .filter(order => order.isPaid)
      .reduce((sum, order) => sum + order.total, 0);
  };

  const getTotalOrdersCountAll = () => {
    return orders.length;
  };
  
  // Adding the missing getRestaurantSales function
  const getRestaurantSales = (restaurantId: number): number => {
    return orders
      .filter(order => order.restaurantId === restaurantId && order.isPaid)
      .reduce((sum, order) => sum + order.total, 0);
  };

  return {
    getOrderById,
    getOrdersByRestaurantId,
    getLatestCompletedOrderId,
    calculateTotalRevenue,
    getTotalOrdersCount,
    getAverageOrderValue,
    getPendingOrders,
    getConfirmedOrders,
    getPreparingOrders,
    getPreparedOrders,
    getCompletedOrders,
    getCancelledOrders,
    getRestaurantOrders,
    getCustomerOrders,
    getTotalSales,
    getTotalOrdersCountAll,
    getRestaurantSales
  };
};

// Standalone functions for direct use
export const getOrderById = (state: { orderHistory: OrderWithStatus[] }, orderId: string) => {
  return state.orderHistory.find(order => order.id === orderId) || null;
};

export const getOrdersByRestaurantId = (state: { orderHistory: OrderWithStatus[] }, restaurantId: number) => {
  return state.orderHistory.filter(order => order.restaurantId === restaurantId);
};

export const getLatestCompletedOrderId = (state: { orderHistory: OrderWithStatus[] }): string | null => {
  // Find the most recent completed/paid order
  if (!state.orderHistory || state.orderHistory.length === 0) return null;

  // Sort orders by timestamp (most recent first) and find the first paid one
  const sortedOrders = [...state.orderHistory]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .filter(order => order.isPaid);

  return sortedOrders.length > 0 ? sortedOrders[0].id : null;
};

export const calculateTotalRevenue = (state: { orderHistory: OrderWithStatus[] }, restaurantId: number): number => {
  return state.orderHistory
    .filter(order => order.restaurantId === restaurantId && order.isPaid)
    .reduce((sum, order) => sum + order.total, 0);
};

export const getTotalOrdersCount = (state: { orderHistory: OrderWithStatus[] }, restaurantId: number): number => {
  return state.orderHistory.filter(order => order.restaurantId === restaurantId).length;
};

export const getAverageOrderValue = (state: { orderHistory: OrderWithStatus[] }, restaurantId: number): number => {
  const paidOrders = state.orderHistory.filter(order => order.restaurantId === restaurantId && order.isPaid);
  if (paidOrders.length === 0) return 0;
  const totalRevenue = paidOrders.reduce((sum, order) => sum + order.total, 0);
  return totalRevenue / paidOrders.length;
};

// Adding standalone getRestaurantSales function
export const getRestaurantSales = (state: { orderHistory: OrderWithStatus[] }, restaurantId: number): number => {
  return state.orderHistory
    .filter(order => order.restaurantId === restaurantId && order.isPaid)
    .reduce((sum, order) => sum + order.total, 0);
};
