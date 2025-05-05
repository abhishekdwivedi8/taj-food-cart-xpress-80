
import { OrderWithStatus } from "@/context/orderSystem";
import { OrderHistoryItem } from "@/types";

type StatusDetails = {
  label: string;
  color: string;
};

export function getOrderStatusDetails(order: OrderWithStatus | OrderHistoryItem): StatusDetails {
  // If it's a complete OrderWithStatus object or OrderHistoryItem with status field
  if ('status' in order && order.status) {
    switch (order.status) {
      case 'pending':
        return { label: 'Pending', color: 'bg-blue-500 hover:bg-blue-600' };
      case 'confirmed':
        return { label: 'Confirmed', color: 'bg-purple-500 hover:bg-purple-600' };
      case 'preparing':
        return { label: 'Preparing', color: 'bg-amber-500 hover:bg-amber-600' };
      case 'ready':
        return { label: 'Ready', color: 'bg-emerald-500 hover:bg-emerald-600' };
      case 'completed':
        return { label: 'Completed', color: 'bg-green-500 hover:bg-green-600' };
      case 'cancelled':
        return { label: 'Cancelled', color: 'bg-red-500 hover:bg-red-600' };
      default:
        return { label: 'Processing', color: 'bg-gray-500 hover:bg-gray-600' };
    }
  }
  
  // Legacy approach based on other order properties
  if (order.isPaid) {
    return { label: 'Paid', color: 'bg-green-500 hover:bg-green-600' };
  } else if (order.isCancelled) {
    return { label: 'Cancelled', color: 'bg-red-500 hover:bg-red-600' };
  } else if (order.isPrepared) {
    return { label: 'Ready', color: 'bg-emerald-500 hover:bg-emerald-600' };
  } else if (order.isCompleted) {
    return { label: 'Completed', color: 'bg-green-500 hover:bg-green-600' };
  } else {
    return { label: 'Processing', color: 'bg-blue-500 hover:bg-blue-600' };
  }
}
