
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
        return { label: 'Pending', color: 'bg-custom-yellow text-custom-darkGray' };
      case 'confirmed':
        return { label: 'Confirmed', color: 'bg-custom-yellow/90 text-custom-darkGray' };
      case 'preparing':
        return { label: 'Preparing', color: 'bg-custom-yellow/80 text-custom-darkGray' };
      case 'ready':
        return { label: 'Ready', color: 'bg-custom-green/90 text-white' };
      case 'completed':
        return { label: 'Completed', color: 'bg-custom-green text-white' };
      case 'cancelled':
        return { label: 'Cancelled', color: 'bg-custom-red text-white' };
      default:
        return { label: 'Processing', color: 'bg-gray-500 text-white' };
    }
  }
  
  // Legacy approach based on other order properties
  if (order.isPaid) {
    return { label: 'Paid', color: 'bg-custom-green text-white' };
  } else if (order.isCancelled) {
    return { label: 'Cancelled', color: 'bg-custom-red text-white' };
  } else if (order.isPrepared) {
    return { label: 'Ready', color: 'bg-custom-green/90 text-white' };
  } else if (order.isCompleted) {
    return { label: 'Completed', color: 'bg-custom-green text-white' };
  } else {
    return { label: 'Processing', color: 'bg-custom-yellow text-gray-900' };
  }
}
