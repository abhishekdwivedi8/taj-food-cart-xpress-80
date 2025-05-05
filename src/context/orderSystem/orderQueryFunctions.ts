
import { OrderWithStatus } from './types';

export const createOrderQueryFunctions = (orders: OrderWithStatus[]) => {
  // Order filtering functions
  const getPendingOrders = (restaurantId?: number) => {
    if (restaurantId) {
      return orders.filter(order => order.status === 'pending' && order.restaurantId === restaurantId);
    }
    return orders.filter(order => order.status === 'pending');
  };

  const getConfirmedOrders = () => {
    return orders.filter(order => order.status === 'confirmed');
  };

  const getPreparingOrders = () => {
    return orders.filter(order => order.status === 'preparing');
  };

  const getPreparedOrders = () => {
    return orders.filter(order => order.status === 'ready');
  };

  const getCompletedOrders = () => {
    return orders.filter(order => order.status === 'completed');
  };

  const getCancelledOrders = () => {
    return orders.filter(order => order.status === 'cancelled');
  };

  const getRestaurantOrders = (restaurantId: number) => {
    return orders.filter(order => order.restaurantId === restaurantId);
  };

  const getCustomerOrders = (customerId: string) => {
    return orders.filter(order => order.customerId === customerId);
  };

  const getOrderById = (orderId: string) => {
    return orders.find(order => order.id === orderId);
  };

  // Sales data functions
  const getTotalSales = () => {
    return orders
      .filter(order => order.isPaid)
      .reduce((sum, order) => sum + order.total, 0);
  };

  const getTotalOrdersCount = () => {
    return orders.length;
  };

  const getRestaurantSales = (restaurantId: number) => {
    return orders
      .filter(order => order.restaurantId === restaurantId && order.isPaid)
      .reduce((sum, order) => sum + order.total, 0);
  };

  return {
    getPendingOrders,
    getConfirmedOrders,
    getPreparingOrders,
    getPreparedOrders,
    getCompletedOrders,
    getCancelledOrders,
    getRestaurantOrders,
    getCustomerOrders,
    getOrderById,
    getTotalSales,
    getTotalOrdersCount,
    getRestaurantSales
  };
};
