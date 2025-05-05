
import Cookies from 'js-cookie';

export const updateOrderHistoryCookieAfterPayment = (orderId: string) => {
  try {
    // Get existing order history cookie
    const historyJson = Cookies.get('restaurant_order_history');
    if (!historyJson) return;
    
    const history = JSON.parse(historyJson);

    if (Array.isArray(history)) {
      // Instead of removing the paid order, just mark it as paid
      // This preserves the order history for display
      const updatedHistory = history.map(order => {
        if (order.id === orderId) {
          return { ...order, isPaid: true, status: 'completed' };
        }
        return order;
      });
      
      // Update the cookie with the modified history
      Cookies.set('restaurant_order_history', JSON.stringify(updatedHistory), { expires: 7 });
    }
  } catch (error) {
    console.error('Error updating order history cookie:', error);
  }
};
