import Cookies from 'js-cookie';
import { toast } from '@/components/ui/sonner';
import { getOrderStatusDetails } from './orderStatusUtils';

export const updateOrderHistoryCookieAfterPayment = (orderId: string) => {
  const orderHistoryCookie = Cookies.get('restaurant_order_history');
  if (orderHistoryCookie) {
    try {
      const parsedOrders = JSON.parse(orderHistoryCookie);
      
      // Mark the specific order as paid
      const updatedOrders = parsedOrders.map((order: any) => 
        order.id === orderId ? { ...order, isPaid: true } : order
      );
      
      // Only remove the paid order, keep others
      const remainingOrders = updatedOrders.filter((order: any) => !order.isPaid);
      
      if (remainingOrders.length > 0) {
        // Save the remaining unpaid orders
        Cookies.set('restaurant_order_history', JSON.stringify(remainingOrders), { expires: 7 });
        console.log('Paid order removed from history, unpaid orders retained');
      } else {
        // If all orders are paid, clear the cookie
        Cookies.remove('restaurant_order_history');
        console.log('All orders paid, order history cookies cleared');
      }
      
      // Show a toast notification
      toast.success('Payment successful! Paid order removed from history.', {
        duration: 3000,
      });
    } catch (error) {
      console.error("Error updating order history cookie:", error);
    }
  }
};

// Helper function to check order status
export const getOrderStatusDetails = (order: any) => {
  if (order.isPaid) {
    return {
      status: 'completed',
      color: 'bg-green-100 text-green-700',
      label: 'Paid & Completed'
    };
  } else if (order.isPrepared) {
    return {
      status: 'prepared',
      color: 'bg-blue-100 text-blue-700',
      label: 'Food Prepared'
    };
  } else {
    return {
      status: 'processing',
      color: 'bg-yellow-100 text-yellow-700',
      label: 'Processing'
    };
  }
};
