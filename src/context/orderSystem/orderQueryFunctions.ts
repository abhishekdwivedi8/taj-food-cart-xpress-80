import { OrderSystemState } from './types';

export const getOrderById = (state: OrderSystemState, orderId: string) => {
  return state.orderHistory.find(order => order.id === orderId) || null;
};

export const getOrdersByRestaurantId = (state: OrderSystemState, restaurantId: number) => {
  return state.orderHistory.filter(order => order.restaurantId === restaurantId);
};

export const getLatestCompletedOrderId = (state: OrderSystemState): string | null => {
  // Find the most recent completed/paid order
  if (!state.orderHistory || state.orderHistory.length === 0) return null;

  // Sort orders by timestamp (most recent first) and find the first paid one
  const sortedOrders = [...state.orderHistory]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .filter(order => order.isPaid);

  return sortedOrders.length > 0 ? sortedOrders[0].id : null;
};

export const calculateTotalRevenue = (state: OrderSystemState, restaurantId: number): number => {
  return state.orderHistory
    .filter(order => order.restaurantId === restaurantId && order.isPaid)
    .reduce((sum, order) => sum + order.total, 0);
};

export const getTotalOrdersCount = (state: OrderSystemState, restaurantId: number): number => {
  return state.orderHistory.filter(order => order.restaurantId === restaurantId).length;
};

export const getAverageOrderValue = (state: OrderSystemState, restaurantId: number): number => {
  const paidOrders = state.orderHistory.filter(order => order.restaurantId === restaurantId && order.isPaid);
  if (paidOrders.length === 0) return 0;
  const totalRevenue = paidOrders.reduce((sum, order) => sum + order.total, 0);
  return totalRevenue / paidOrders.length;
};
