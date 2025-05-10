
import { OrderSystemProvider } from "./OrderSystemProvider";
import { useOrderSystem as useOrderSystemBase } from "./useOrderSystem";
import { OrderWithStatus } from "./types";

// Extend the type to include the new function
type ExtendedUseOrderSystem = ReturnType<typeof useOrderSystemBase> & {
  getLatestCompletedOrderId: () => string | null;
};

// Create an enhanced hook to provide the additional functionality
const useOrderSystem = (): ExtendedUseOrderSystem => {
  const orderSystem = useOrderSystemBase();
  
  const getLatestCompletedOrderId = (): string | null => {
    const { orderHistory } = orderSystem;
    
    if (!orderHistory || orderHistory.length === 0) return null;
    
    // Sort orders by timestamp (most recent first) and find the first paid one
    const sortedOrders = [...orderHistory]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .filter(order => order.isPaid);
      
    return sortedOrders.length > 0 ? sortedOrders[0].id : null;
  };
  
  return {
    ...orderSystem,
    getLatestCompletedOrderId
  };
};

export { OrderSystemProvider, useOrderSystem, type OrderWithStatus };
