
import Cookies from 'js-cookie';

export const updateOrderHistoryCookieAfterPayment = (orderId: string) => {
  const orderHistoryCookie = Cookies.get('restaurant_order_history');
  if (orderHistoryCookie) {
    try {
      const parsedOrders = JSON.parse(orderHistoryCookie);
      // Filter out the paid order
      const remainingUnpaidOrders = parsedOrders.filter(
        (order: any) => order.id !== orderId
      );
      
      // Update cookie with remaining unpaid orders or remove it if empty
      if (remainingUnpaidOrders.length > 0) {
        Cookies.set('restaurant_order_history', JSON.stringify(remainingUnpaidOrders), { expires: 7 });
      } else {
        Cookies.remove('restaurant_order_history');
      }
    } catch (error) {
      console.error("Error updating order history cookie:", error);
    }
  }
};
