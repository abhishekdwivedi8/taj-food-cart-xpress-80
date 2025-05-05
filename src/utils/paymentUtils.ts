
import Cookies from 'js-cookie';
import { toast } from '@/components/ui/sonner';

export const updateOrderHistoryCookieAfterPayment = (orderId: string) => {
  const orderHistoryCookie = Cookies.get('restaurant_order_history');
  if (orderHistoryCookie) {
    try {
      const parsedOrders = JSON.parse(orderHistoryCookie);
      
      // Mark the specific order as paid
      const updatedOrders = parsedOrders.map((order: any) => 
        order.id === orderId ? { ...order, isPaid: true } : order
      );
      
      // Remove all orders after payment (for a fresh start)
      Cookies.remove('restaurant_order_history');
      
      // Show a toast notification
      toast.success('Payment successful! Your order history has been cleared.', {
        duration: 3000,
      });
      
      console.log('Order history cookies cleared after successful payment');
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
