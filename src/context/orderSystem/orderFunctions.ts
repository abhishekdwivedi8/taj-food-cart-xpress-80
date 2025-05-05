
import { toast } from "@/components/ui/sonner";
import { CartItem, OrderHistoryItem } from '@/types';
import { OrderWithStatus } from './types';

export const createOrderFunctions = (
  deviceId: string,
  orders: OrderWithStatus[],
  setOrders: React.Dispatch<React.SetStateAction<OrderWithStatus[]>>,
  orderHistory: OrderHistoryItem[],
  setOrderHistory: React.Dispatch<React.SetStateAction<OrderHistoryItem[]>>,
  cartItems: Record<number, CartItem[]>,
  clearCart: (restaurantId: number) => void,
  getCartTotal: (restaurantId: number) => number,
  setIsOrderConfirmOpen: (restaurantId: number, isOpen: boolean) => void,
  setIsOrderSuccessOpen: (restaurantId: number, isOpen: boolean) => void
) => {
  // Order management functions
  const placeOrder = (restaurantId: number) => {
    const restaurantCart = cartItems[restaurantId] || [];
    
    if (restaurantCart.length === 0) return;

    const newOrder: OrderWithStatus = {
      id: `order-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      items: [...restaurantCart],
      total: getCartTotal(restaurantId),
      date: new Date().toISOString(),
      isPaid: false,
      status: 'pending',
      restaurantId: restaurantId,
      customerId: deviceId,
      isPrepared: false
    };

    setOrders(prev => [...prev, newOrder]);
    
    // Add to order history for the current user
    const historyItem: OrderHistoryItem = {
      id: newOrder.id,
      items: [...restaurantCart],
      total: getCartTotal(restaurantId),
      date: new Date().toISOString(),
      isPaid: false
    };
    
    setOrderHistory(prev => [...prev, historyItem]);
    
    // Clear cart after order is placed
    clearCart(restaurantId);
    setIsOrderConfirmOpen(restaurantId, false);
    setIsOrderSuccessOpen(restaurantId, true);

    // Auto close success message after 2 seconds (reduced from 3)
    setTimeout(() => {
      setIsOrderSuccessOpen(restaurantId, false);
    }, 2000);

    return newOrder;
  };

  const confirmOrder = (orderId: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: 'confirmed' } 
        : order
    ));

    toast("Order confirmed and sent to chef!");
  };

  const cancelOrder = (orderId: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: 'cancelled' } 
        : order
    ));

    // Update the order history item as well
    setOrderHistory(prev => prev.map(historyItem =>
      historyItem.id === orderId
        ? { ...historyItem, isCancelled: true }
        : historyItem
    ));

    toast("Order cancelled", {
      description: "The order has been cancelled"
    });
  };

  const markOrderPreparing = (orderId: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: 'preparing' } 
        : order
    ));
  };

  const markOrderPrepared = (orderId: string, note?: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: 'ready', isPrepared: true, chefNote: note } 
        : order
    ));

    // Update the order history item as well
    setOrderHistory(prev => prev.map(historyItem =>
      historyItem.id === orderId
        ? { ...historyItem, isPrepared: true }
        : historyItem
    ));

    toast("Order prepared", {
      description: "The order is ready to serve"
    });
  };

  const markOrderCompleted = (orderId: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: 'completed' } 
        : order
    ));

    // Update the order history item as well
    setOrderHistory(prev => prev.map(historyItem =>
      historyItem.id === orderId
        ? { ...historyItem, isCompleted: true }
        : historyItem
    ));
  };

  const completePayment = (orderId: string, paymentMethod: 'online' | 'cash') => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, isPaid: true } 
        : order
    ));

    // Update the order history item as well
    setOrderHistory(prev => prev.map(historyItem =>
      historyItem.id === orderId
        ? { ...historyItem, isPaid: true }
        : historyItem
    ));

    toast({
      description: `Payment received via ${paymentMethod}.`
    });
  };

  return {
    placeOrder,
    confirmOrder,
    cancelOrder,
    markOrderPreparing,
    markOrderPrepared,
    markOrderCompleted,
    completePayment
  };
};
